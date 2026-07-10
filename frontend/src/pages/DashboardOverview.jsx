import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Truck, Activity, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, MapPin, Sparkles, Navigation, Package } from 'lucide-react';
import LiveFleetMap from '../components/LiveFleetMap';

const DashboardOverview = () => {
    const [kpis, setKpis] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleProfit, setVehicleProfit] = useState([]);
    const [recentTrips, setRecentTrips] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // FIXED BUG 2: Removed the nonexistent /documents/expiring API call so it stops throwing 500 errors!
                const [kpisRes, vehiclesRes, profitRes, tripsRes, stockRes] = await Promise.all([
                    api.get('/finances/kpis'),
                    api.get('/vehicles'),
                    api.get('/finances/vehicle-profit'),
                    api.get('/trips'),
                    api.get('/inventory/low-stock')
                ]);

                setKpis(kpisRes.data);
                setVehicles(vehiclesRes.data);
                setVehicleProfit(profitRes.data);
                setLowStockItems(stockRes.data);

                const sortedTrips = tripsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
                setRecentTrips(sortedTrips);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#121212]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8621C]"></div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const today = new Date();
    const alerts = [];
    vehicles.forEach(v => {
        const checkExpiry = (dateString, type) => {
            if (!dateString) return;
            const expiry = new Date(dateString);
            const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) alerts.push({ vehicle: v.vehicleNumber, type, status: 'Expired', days: Math.abs(diffDays), color: 'text-red-500', bg: 'bg-red-500/10' });
            else if (diffDays <= 15) alerts.push({ vehicle: v.vehicleNumber, type, status: 'Urgent', days: diffDays, color: 'text-red-400', bg: 'bg-red-500/10' });
            else if (diffDays <= 30) alerts.push({ vehicle: v.vehicleNumber, type, status: 'Warning', days: diffDays, color: 'text-yellow-500', bg: 'bg-yellow-500/10' });
        };
        checkExpiry(v.insuranceExpiry, 'Insurance');
        checkExpiry(v.permitExpiry, 'National Permit');
        checkExpiry(v.fcExpiry, 'Fitness Cert (FC)');
        checkExpiry(v.taxExpiry, 'Road Tax');
        checkExpiry(v.pollutionExpiry, 'Pollution Cert');
    });

    const activeVehicles = vehicles.filter(v => v.status === 'In-Trip').length;
    const idleVehicles = vehicles.length - activeVehicles;

    return (
        <div className="p-8 w-full mx-auto space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stripe-card p-5 border-t-4 border-t-[#D8621C]">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Today's Income</div>
                    <div className="text-2xl font-semibold text-white mb-1">{formatCurrency(kpis?.todayIncome)}</div>
                    <div className="flex items-center text-xs text-[#10B981]">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>+12% vs yesterday</span>
                    </div>
                </div>

                <div className="stripe-card p-5 border-t-4 border-t-[#EF4444]">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Today's Expense</div>
                    <div className="text-2xl font-semibold text-white mb-1">{formatCurrency(kpis?.todayExpense)}</div>
                    <div className="flex items-center text-xs text-[#EF4444]">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>High fuel cost</span>
                    </div>
                </div>

                <div className="stripe-card p-5 border-t-4 border-t-[#10B981]">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Today's Profit</div>
                    <div className="text-2xl font-semibold text-[#10B981] mb-1">{formatCurrency(kpis?.todayProfit)}</div>
                    <div className="flex items-center text-xs text-gray-400">
                        <span>Net margin</span>
                    </div>
                </div>

                <div className="stripe-card p-5 border-t-4 border-t-blue-500 relative overflow-hidden">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Vehicles</div>
                    <div className="text-2xl font-semibold text-white mb-1">{activeVehicles} / {vehicles.length}</div>
                    <div className="flex items-center text-xs text-yellow-500">
                        <span>{idleVehicles} idle today</span>
                    </div>
                    <Truck className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    {/* FIXED BUG 1: Safe Map Embed (Replaced buggy Leaflet) */}
                    <div className="stripe-card p-0 h-[400px] flex flex-col overflow-hidden relative border border-[#2A2A2A] z-0">
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-[#1C1C1C] to-transparent z-[1000] pointer-events-none flex justify-between items-start">
                            <h2 className="text-white font-bold drop-shadow-md flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                                Live Fleet Tracking
                            </h2>
                            <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                                LIVE
                            </span>
                        </div>
                        {/* Live Vehicle Tracking Map powered by Leaflet */}
                        <div className="absolute inset-0 z-0">
                            <LiveFleetMap />
                        </div>
                    </div>

                    <div className="stripe-card p-0 overflow-hidden">
                        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center">
                            <h2 className="text-white font-semibold flex items-center">
                                <Navigation className="w-4 h-4 mr-2 text-[#D8621C]" /> Recent Trips
                            </h2>
                            <button className="text-xs font-semibold text-[#D8621C] hover:text-white transition-colors">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 bg-[#151515] uppercase border-b border-[#2A2A2A]">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Vehicle</th>
                                        <th className="px-5 py-4 font-semibold">Route</th>
                                        <th className="px-5 py-4 font-semibold">Expected</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTrips.map((trip) => (
                                        <tr key={trip.id} className="border-b border-[#2A2A2A] hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="text-white font-medium">{trip.vehicle?.vehicleNumber}</div>
                                                <div className="text-xs text-gray-400 font-medium">{trip.driver?.username}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wide">
                                                    📞 {trip.driver?.mobile || 'No Number'}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center text-gray-300">
                                                    <span>{trip.source}</span>
                                                    <ArrowUpRight className="w-3 h-3 mx-2 text-gray-500" />
                                                    <span>{trip.destination}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-white font-medium">{formatCurrency(trip.tripCharges)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trip.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#D8621C]/10 text-[#D8621C]'
                                                    }`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="stripe-card p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm flex items-center">
                            Vehicle-wise Profit <span className="ml-2 text-xs text-gray-500 font-normal">(This Month)</span>
                        </h2>
                        <div className="space-y-4">
                            {vehicleProfit.slice(0, 5).map((vp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-300 font-medium">{vp.vehicleNumber}</span>
                                        <span className="text-[#10B981] font-semibold">{formatCurrency(vp.profit)}</span>
                                    </div>
                                    <div className="w-full bg-[#2A2A2A] rounded-full h-1.5">
                                        <div
                                            className="bg-[#D8621C] h-1.5 rounded-full"
                                            style={{ width: `${Math.min(100, (Math.max(vp.profit, 0) / 50000) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stripe-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between bg-[#151515]">
                            <h2 className="text-white font-semibold text-sm flex items-center">
                                Document Alerts
                            </h2>
                            {alerts.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {alerts.length}
                                </span>
                            )}
                        </div>
                        <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {alerts.length === 0 ? (
                                <div className="text-gray-500 text-sm text-center py-4">No urgent alerts</div>
                            ) : (
                                alerts.slice(0, 5).map((alert, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl border border-white/5 flex items-start ${alert.bg}`}>
                                        <AlertCircle className={`w-4 h-4 mt-0.5 mr-3 shrink-0 ${alert.color}`} />
                                        <div>
                                            <div className="text-sm font-medium text-white">{alert.vehicle}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {alert.type} {alert.status === 'Expired' ? 'expired' : 'expiring in'} <span className={alert.color}>{alert.days} days {alert.status === 'Expired' && 'ago'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="stripe-card p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm flex items-center">
                            <Package className="w-4 h-4 mr-2 text-orange-500" />
                            Low Stock Alerts
                        </h2>
                        {lowStockItems.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/5">
                                All inventory levels are healthy!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lowStockItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <div className="text-white text-sm font-medium">{item.itemName}</div>
                                            <div className="text-xs text-gray-500">Min: {item.reorderLevel}</div>
                                        </div>
                                        <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-xs font-bold border border-red-500/20">
                                            {item.stockQuantity} Left
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;

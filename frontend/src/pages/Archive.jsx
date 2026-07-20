import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Archive as ArchiveIcon, RotateCcw, AlertCircle, Search } from 'lucide-react';
import SecurityPinModal from '../components/SecurityPinModal';

const Archive = () => {
    const [activeTab, setActiveTab] = useState('customers');
    const [archivedCustomers, setArchivedCustomers] = useState([]);
    const [archivedVehicles, setArchivedVehicles] = useState([]);
    const [archivedTrips, setArchivedTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Security Modal State
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [pendingRestore, setPendingRestore] = useState(null); // { type: 'customer' | 'vehicle', id: number }

    useEffect(() => {
        fetchArchivedData();
    }, [activeTab]);

    const fetchArchivedData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'customers') {
                const res = await api.get('/customers/archived');
                setArchivedCustomers(res.data);
            } else if (activeTab === 'vehicles') {
                const res = await api.get('/vehicles/archived');
                setArchivedVehicles(res.data);
            } else if (activeTab === 'trips') {
                const res = await api.get('/trips/archived');
                setArchivedTrips(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch archived data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreClick = (type, id) => {
        setPendingRestore({ type, id });
        setIsSecurityModalOpen(true);
    };

    const confirmRestore = async () => {
        if (!pendingRestore) return;
        try {
            if (pendingRestore.type === 'customer') {
                await api.post(`/customers/${pendingRestore.id}/restore`);
                setArchivedCustomers(archivedCustomers.filter(c => c.id !== pendingRestore.id));
            } else if (pendingRestore.type === 'vehicle') {
                await api.post(`/vehicles/${pendingRestore.id}/restore`);
                setArchivedVehicles(archivedVehicles.filter(v => v.id !== pendingRestore.id));
            } else if (pendingRestore.type === 'trip') {
                await api.post(`/trips/${pendingRestore.id}/restore`);
                setArchivedTrips(archivedTrips.filter(t => t.id !== pendingRestore.id));
            }
        } catch (error) {
            console.error("Failed to restore", error);
            alert("Failed to restore item");
        } finally {
            setIsSecurityModalOpen(false);
            setPendingRestore(null);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-3">
                        <ArchiveIcon className="w-8 h-8 text-[#D8621C]" />
                        Archive & Trash
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium">View and restore soft-deleted records.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
                <button 
                    onClick={() => setActiveTab('customers')}
                    className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'customers' ? 'text-[#D8621C] border-[#D8621C]' : 'text-slate-500 dark:text-gray-500 border-transparent hover:text-slate-600 dark:text-gray-300'}`}
                >
                    Archived Customers
                </button>
                <button 
                    onClick={() => setActiveTab('vehicles')}
                    className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'vehicles' ? 'text-[#D8621C] border-[#D8621C]' : 'text-slate-500 dark:text-gray-500 border-transparent hover:text-slate-600 dark:text-gray-300'}`}
                >
                    Archived Vehicles
                </button>
                <button 
                    onClick={() => setActiveTab('trips')}
                    className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'trips' ? 'text-[#D8621C] border-[#D8621C]' : 'text-slate-500 dark:text-gray-500 border-transparent hover:text-slate-600 dark:text-gray-300'}`}
                >
                    Archived Trips
                </button>
            </div>

            {/* Content List */}
            <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden shadow-xl">
                {isLoading ? (
                    <div className="p-10 flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#D8621C] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-[#2A2A2A] bg-slate-100 dark:bg-[#151515]">
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">ID</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Name / Number</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Type / Contact</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Deleted At</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'customers' ? (
                                archivedCustomers.length > 0 ? archivedCustomers.map(customer => (
                                    <tr key={customer.id} className="border-b border-slate-200 dark:border-[#2A2A2A] hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">#{customer.id}</td>
                                        <td className="p-4 font-bold text-slate-600 dark:text-gray-300 uppercase">{customer.name}</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-400">{customer.mobile}</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">{new Date(customer.updatedAt).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleRestoreClick('customer', customer.id)}
                                                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-slate-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-gray-500">No archived customers found.</td></tr>
                                )
                            ) : activeTab === 'vehicles' ? (
                                archivedVehicles.length > 0 ? archivedVehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="border-b border-slate-200 dark:border-[#2A2A2A] hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">#{vehicle.id}</td>
                                        <td className="p-4 font-bold text-slate-600 dark:text-gray-300 uppercase">{vehicle.vehicleNumber}</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-400">{vehicle.type}</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">{new Date(vehicle.updatedAt).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleRestoreClick('vehicle', vehicle.id)}
                                                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-slate-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-gray-500">No archived vehicles found.</td></tr>
                                )
                            ) : (
                                archivedTrips.length > 0 ? archivedTrips.map(trip => (
                                    <tr key={trip.id} className="border-b border-slate-200 dark:border-[#2A2A2A] hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">#{trip.id}</td>
                                        <td className="p-4 font-bold text-slate-600 dark:text-gray-300">{trip.source} to {trip.destination}</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-400">{trip.customer?.name} ({trip.vehicle?.vehicleNumber})</td>
                                        <td className="p-4 font-medium text-slate-500 dark:text-gray-500">{new Date(trip.updatedAt).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleRestoreClick('trip', trip.id)}
                                                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-slate-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-gray-500">No archived trips found.</td></tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <SecurityPinModal 
                isOpen={isSecurityModalOpen}
                onClose={() => { setIsSecurityModalOpen(false); setPendingRestore(null); }}
                actionName="Restoring Record"
                onSuccess={confirmRestore}
            />
        </div>
    );
};

export default Archive;

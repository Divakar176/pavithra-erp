import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Truck, Search, Filter, Plus, AlertCircle, Info, Navigation, Users, Calendar, Trash2, X, Car, Bike, Tractor, Pencil, Lock, Wrench } from 'lucide-react';
import SecurityPinModal from '../components/SecurityPinModal';
import SecureVault from '../components/SecureVault';

const Vehicles = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loans, setLoans] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All Vehicles');

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [pendingSecurityAction, setPendingSecurityAction] = useState(null);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [selectedVehicleForLoan, setSelectedVehicleForLoan] = useState(null);
    const [selectedVehicleForVault, setSelectedVehicleForVault] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        vehicleNumber: '', type: 'Tipper Lorry', status: 'Active', billingType: 'PER_TRIP', containerSize: '', maxLoadTons: '', purchasePrice: '', monthlyContractAmount: '',
        insuranceExpiry: '', fcExpiry: '', taxExpiry: '', permitExpiry: '', statePermitExpiry: '', pollutionExpiry: ''
    });
    const [newLoan, setNewLoan] = useState({
        bankName: '', loanAmount: '', emiAmount: '', emiDate: '', tenureMonths: '', startDate: new Date().toISOString().split('T')[0], status: 'Active'
    });

    const fetchData = async () => {
        try {
            const vehRes = await api.get('/vehicles');
            setVehicles(vehRes.data || []);
        } catch (error) {
            console.error("Error fetching vehicles", error);
        }

        try {
            const tripRes = await api.get('/trips');
            if (Array.isArray(tripRes.data)) {
                setTrips(tripRes.data.filter(t => t.status === 'IN_PROGRESS' || t.status === 'PENDING'));
            }
        } catch (error) {
            console.warn("Could not fetch trips for vehicles page", error);
        }

        try {
            const loanRes = await api.get('/loans');
            setLoans(loanRes.data || []);
        } catch (error) {
            console.warn("Could not fetch loans", error);
        }

        try {
            const driverRes = await api.get('/users/drivers');
            setDrivers(driverRes.data || []);
        } catch (error) {
            console.warn("Could not fetch drivers", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'Cars': return <Car className="w-5 h-5 text-orange-400" />;
            case 'Bikes':
            case 'Bike': return <Bike className="w-5 h-5 text-orange-400" />;
            case 'JCB':
            case 'Harvesting Machine':
            case 'Tractor': return <Tractor className="w-5 h-5 text-orange-400" />;
            default: return <Truck className="w-5 h-5 text-orange-400" />;
        }
    };

    const getBackgroundImage = (type) => {
        switch (type) {
            case 'Cars': return 'cars.png';
            case 'Bikes':
            case 'Bike': return 'bikes.png';
            case 'JCB': return 'jcb.png';
            case 'Harvesting Machine': return 'harvester.png';
            case 'Tractor': return 'tractor.png';
            case 'Tipper Lorry': return 'tipper.png';
            case 'Container Lorry': return 'container.png';
            case 'Open Type Lorry': return 'open_lorry.png';
            default: return 'lorry.png';
        }
    };

    const filterTypes = ['All Vehicles', 'Tipper Lorry', 'Container Lorry', 'Open Type Lorry', 'JCB', 'Harvesting Machine', 'Tractor', 'Cars', 'Bike'];

    const filteredVehicles = filter === 'All Vehicles'
        ? vehicles
        : vehicles.filter(v => v.type === filter);

    const handleDelete = (id) => {
        setPendingSecurityAction({ action: 'delete', data: id });
        setIsSecurityModalOpen(true);
    };

    const handleOpenVault = (vehicle) => {
        setPendingSecurityAction({ action: 'vault', data: vehicle });
        setIsSecurityModalOpen(true);
    };

    const confirmDeleteVehicle = async (id) => {
        try {
            await api.delete(`/vehicles/${id}`);
            setVehicles(vehicles.filter(v => v.id !== id));
        } catch (error) {
            console.error("Failed to delete vehicle", error);
            alert("Failed to delete vehicle");
        }
    };

    const resetNewVehicle = () => {
        setNewVehicle({
            vehicleNumber: '', type: 'Tipper Lorry', status: 'Active', billingType: 'PER_TRIP', containerSize: '', maxLoadTons: '', purchasePrice: '', monthlyContractAmount: '',
            insuranceExpiry: '', fcExpiry: '', taxExpiry: '', permitExpiry: '', statePermitExpiry: '', pollutionExpiry: ''
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...newVehicle };
            if (payload.maxLoadTons === '') payload.maxLoadTons = null;
            if (payload.purchasePrice === '') payload.purchasePrice = null;
            if (payload.monthlyContractAmount === '') payload.monthlyContractAmount = null;
            if (payload.insuranceExpiry === '') payload.insuranceExpiry = null;
            if (payload.fcExpiry === '') payload.fcExpiry = null;
            if (payload.taxExpiry === '') payload.taxExpiry = null;
            if (payload.permitExpiry === '') payload.permitExpiry = null;
            if (payload.statePermitExpiry === '') payload.statePermitExpiry = null;
            if (payload.pollutionExpiry === '') payload.pollutionExpiry = null;
            if (payload.containerSize === '') payload.containerSize = null;

            await api.post('/vehicles', payload);
            setIsAddModalOpen(false);
            resetNewVehicle();
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Failed to add vehicle", error);
            const msg = error.response?.data?.message || error.response?.data?.error || "Failed to add vehicle. The vehicle number might already exist.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditVehicleSubmit = (e) => {
        e.preventDefault();
        setPendingSecurityAction({ action: 'edit', data: null });
        setIsSecurityModalOpen(true);
    };

    const confirmEditVehicle = async () => {
        setIsSubmitting(true);
        try {
            const payload = { ...newVehicle };
            if (payload.maxLoadTons === '') payload.maxLoadTons = null;
            if (payload.purchasePrice === '') payload.purchasePrice = null;
            if (payload.monthlyContractAmount === '') payload.monthlyContractAmount = null;
            if (payload.insuranceExpiry === '') payload.insuranceExpiry = null;
            if (payload.fcExpiry === '') payload.fcExpiry = null;
            if (payload.taxExpiry === '') payload.taxExpiry = null;
            if (payload.permitExpiry === '') payload.permitExpiry = null;
            if (payload.statePermitExpiry === '') payload.statePermitExpiry = null;
            if (payload.pollutionExpiry === '') payload.pollutionExpiry = null;
            if (payload.containerSize === '') payload.containerSize = null;

            await api.put(`/vehicles/${editingVehicle.id}`, payload);
            setIsEditVehicleModalOpen(false);
            resetNewVehicle();
            fetchData();
        } catch (error) {
            console.error("Failed to update vehicle", error);
            const msg = error.response?.data?.message || error.response?.data?.error || "Failed to update vehicle";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (vehicle) => {
        setEditingVehicle(vehicle);
        setNewVehicle({ ...vehicle });
        setIsEditVehicleModalOpen(true);
    };

    const handleAddLoan = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/loans', {
                ...newLoan,
                vehicle: { id: selectedVehicleForLoan.id }
            });
            setIsLoanModalOpen(false);
            setNewLoan({ bankName: '', loanAmount: '', emiAmount: '', emiDate: '', tenureMonths: '', startDate: new Date().toISOString().split('T')[0], status: 'Active' });
            fetchData();
        } catch (error) {
            console.error("Failed to add loan", error);
            alert("Failed to add loan");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8621C]"></div>
            </div>
        );
    }

    const activeCount = vehicles.filter(v => v.status === 'Active' || v.status === 'In-Trip').length;
    const onTripCount = vehicles.filter(v => v.status === 'In-Trip').length;

    return (
        <div className="p-4 md:p-8 w-full mx-auto space-y-6 relative">

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Vehicles Fleet</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">Manage your trucks, earthmovers, and compliance documents</p>
                </div>
                
                <div className="flex flex-wrap lg:flex-nowrap gap-2 py-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-2">
                    {filterTypes.map(type => {
                        const count = type === 'All Vehicles' 
                            ? vehicles.length 
                            : vehicles.filter(v => v.type === type).length;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${filter === type
                                        ? 'bg-[#D8621C] text-slate-900 dark:text-white shadow-lg shadow-orange-500/20 font-bold scale-[1.02]'
                                        : 'bg-white dark:bg-[#1C1C1C] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:hover:bg-[#2A2A2A] hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <span>{type}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                                    filter === type 
                                        ? 'bg-black/20 dark:bg-white/20 text-slate-900 dark:text-white' 
                                        : 'bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center w-full lg:w-auto px-4 py-3 lg:py-2 bg-[#10B981] text-slate-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[#059669] transition-colors shadow-lg shadow-green-500/20 shrink-0"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                </button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVehicles.map(vehicle => {
                    const activeTrip = trips.find(t => t.vehicle?.id === vehicle.id);
                    const vehicleLoans = loans.filter(l => l.vehicle?.id === vehicle.id && l.status === 'Active');
                    const isJcb = vehicle.type === 'JCB';

                    return (
                        <div key={vehicle.id} className={`stripe-card p-5 relative overflow-hidden group transition-all duration-300 ${isJcb ? 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/5' : ''}`}>
                            <div
                                className="absolute inset-0 z-0 opacity-90 transition-opacity duration-500 group-hover:scale-105 transform"
                                style={{
                                    backgroundImage: `url('/vehicles/${getBackgroundImage(vehicle.type)}?v=${Date.now()}')`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            />
                            <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-white/80 to-white/30 dark:from-[#151515] dark:via-[#151515]/80 dark:to-[#151515]/30"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isJcb ? 'bg-amber-500/20 border border-amber-500/40 text-amber-500 dark:text-amber-400' : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-600 dark:text-gray-300'}`}>
                                            {vehicle.type}
                                        </span>
                                        {vehicle.billingType === 'MONTHLY' && (
                                            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                MONTHLY
                                            </span>
                                        )}
                                        {vehicle.billingType === 'HOURLY' && (
                                            <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                HOURLY / BHR
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openEditModal(vehicle)}
                                            className="text-slate-500 dark:text-gray-500 hover:text-[#D8621C] transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit Vehicle"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vehicle.id)}
                                            className="text-slate-500 dark:text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Vehicle"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <span className={`w-2 h-2 rounded-full ${vehicle.status === 'In-Trip' ? 'bg-[#D8621C]' :
                                                vehicle.status === 'Active' ? 'bg-[#10B981]' : 'bg-red-500'
                                            }`}></span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-inner ${isJcb ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-black/30 border border-white/5'}`}>
                                        {getVehicleIcon(vehicle.type)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{vehicle.vehicleNumber}</h3>
                                        {isJcb && <p className="text-[11px] text-amber-500 font-semibold tracking-wide uppercase">Backhoe Loader / Heavy Machinery</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {vehicle.containerSize && (
                                        <div className="flex justify-between text-sm border-b border-slate-200 dark:border-[#2A2A2A] pb-2">
                                            <span className="text-slate-500 dark:text-gray-500">Container Size</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{vehicle.containerSize}</span>
                                        </div>
                                    )}
                                    {vehicle.maxLoadTons && (
                                        <div className="flex justify-between text-sm border-b border-slate-200 dark:border-[#2A2A2A] pb-2">
                                            <span className="text-slate-500 dark:text-gray-500">Max Load</span>
                                            <span className="text-slate-900 dark:text-white font-medium">{vehicle.maxLoadTons} Tons</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm border-b border-slate-200 dark:border-[#2A2A2A] pb-2">
                                        <span className="text-slate-500 dark:text-gray-500">{isJcb ? 'Work Shifts this month' : 'Trips this month'}</span>
                                        <span className="text-slate-900 dark:text-white font-medium">0</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-1">
                                        <span className="text-slate-500 dark:text-gray-500">Driver (Current)</span>
                                        <span className="text-slate-900 dark:text-white font-medium">
                                            {activeTrip ? `${activeTrip.driver?.username}` : 'Unassigned'}
                                        </span>
                                    </div>

                                    {/* Compliance Info */}
                                    <div className="pt-3 border-t border-slate-200 dark:border-[#2A2A2A] mt-3">
                                        <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Compliance Status</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['insuranceExpiry', 'fcExpiry', 'taxExpiry', 'permitExpiry', 'statePermitExpiry', 'pollutionExpiry'].map(doc => {
                                                if (!vehicle[doc]) return null;
                                                const daysLeft = Math.ceil((new Date(vehicle[doc]) - new Date()) / (1000 * 60 * 60 * 24));
                                                let badgeColor = 'bg-gray-500/10 text-slate-500 dark:text-gray-400 border-gray-500/20';
                                                if (daysLeft < 0) badgeColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                                                else if (daysLeft <= 30) badgeColor = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                                                else badgeColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

                                                const docName = doc.replace('Expiry', '').replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
                                                return (
                                                    <span key={doc} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                                                        {docName} {daysLeft < 0 ? 'EXP' : `${daysLeft}d`}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Loan Info */}
                                    <div className="pt-3 border-t border-slate-200 dark:border-[#2A2A2A] mt-3">
                                        {vehicleLoans.length > 0 ? (
                                            vehicleLoans.map(loan => (
                                                <div key={loan.id} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-sm mb-2">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-orange-400 font-bold">{loan.bankName} Loan</span>
                                                        <span className="text-orange-400 text-xs">EMI: {loan.emiDate}th</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-600 dark:text-gray-300 text-xs">
                                                        <span>₹{loan.emiAmount}/mo</span>
                                                        <span>{loan.tenureMonths} Months</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : null}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate('/dashboard/trips', { state: { openAddTrip: true, vehicleId: vehicle.id } })}
                                                className="flex-1 py-2 bg-[#D8621C]/10 text-[#D8621C] hover:bg-[#D8621C] hover:text-slate-900 dark:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Navigation className="w-3.5 h-3.5" /> Start Trip
                                            </button>
                                            <button
                                                onClick={() => handleOpenVault(vehicle)}
                                                className="flex-1 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Lock className="w-3.5 h-3.5" /> Vault
                                            </button>
                                            <button
                                                onClick={() => { setSelectedVehicleForLoan(vehicle); setIsLoanModalOpen(true); }}
                                                className="flex-1 py-2 border border-dashed border-slate-200 dark:border-[#2A2A2A] text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:border-white/20 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                + Bank Loan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredVehicles.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-gray-500">
                        No vehicles found in this category.
                    </div>
                )}
            </div>

            {/* Add Vehicle Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl h-max max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-100 dark:bg-[#151515]">
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Add New Vehicle</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. TN 38 AB 1234"
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newVehicle.vehicleNumber}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Type</label>
                                    <select
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newVehicle.type}
                                        onChange={(e) => {
                                            const selectedType = e.target.value;
                                            const defaultBilling = (selectedType === 'JCB' || selectedType === 'Harvesting Machine' || selectedType === 'Tractor') ? 'HOURLY' : newVehicle.billingType;
                                            setNewVehicle({ ...newVehicle, type: selectedType, billingType: defaultBilling });
                                        }}
                                    >
                                        <option>Tipper Lorry</option>
                                        <option>Container Lorry</option>
                                        <option>Open Type Lorry</option>
                                        <option>JCB</option>
                                        <option>Harvesting Machine</option>
                                        <option>Tractor</option>
                                        <option>Cars</option>
                                        <option>Bike</option>
                                    </select>
                                </div>
                                {newVehicle.type !== 'Open Type Lorry' && (
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            {newVehicle.type === 'Bike' ? 'Bike Purpose' : 'Billing Type'}
                                        </label>
                                        <select 
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.billingType}
                                            onChange={(e) => setNewVehicle({...newVehicle, billingType: e.target.value})}
                                        >
                                            {newVehicle.type === 'Bike' ? (
                                                <>
                                                    <option value="OFFICE_USE">Office Use</option>
                                                    <option value="OWN_USE">Own Use</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="PER_TRIP">Per Trip / Standard</option>
                                                    <option value="HOURLY">Hourly / Farming Work</option>
                                                    <option value="MONTHLY">Monthly Contract</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {newVehicle.type === 'Container Lorry' && (
                                <>
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Container Size (e.g. 20ft)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.containerSize}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, containerSize: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Max Load (Tons)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.maxLoadTons}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, maxLoadTons: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Purchase Price / Investment (₹) <span className="text-gray-600 lowercase tracking-normal">(Optional)</span></label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1500000"
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newVehicle.purchasePrice}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, purchasePrice: e.target.value })}
                                />
                            </div>

                            {newVehicle.billingType === 'MONTHLY' && (
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Monthly Contract Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 88000"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newVehicle.monthlyContractAmount || ''}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, monthlyContractAmount: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assign Driver (Optional)</label>
                                <select
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newVehicle.assignedDriver?.id || ''}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, assignedDriver: e.target.value ? { id: e.target.value } : null })}
                                >
                                    <option value="">-- No Driver --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.username}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 pb-2 border-b border-slate-200 dark:border-[#2A2A2A]">
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm">Compliance Documents Expiry</h3>
                                <p className="text-xs text-slate-500 dark:text-gray-500">Set expiry dates to receive dashboard alerts</p>

                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Insurance</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.insuranceExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fitness Cert (FC)</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.fcExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, fcExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Road Tax</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.taxExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, taxExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">National Permit</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.permitExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, permitExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">State Permit</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.statePermitExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, statePermitExpiry: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Pollution</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.pollutionExpiry} onChange={(e) => setNewVehicle({ ...newVehicle, pollutionExpiry: e.target.value })} />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#D8621C] text-slate-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[#c25617] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Loan Modal */}
            {isLoanModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-100 dark:bg-[#151515]">
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Add Loan for {selectedVehicleForLoan?.vehicleNumber}</h2>
                            <button onClick={() => setIsLoanModalOpen(false)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddLoan} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Bank / Financer Name</label>
                                <input
                                    type="text" required placeholder="e.g. HDFC Bank"
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newLoan.bankName} onChange={(e) => setNewLoan({ ...newLoan, bankName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Loan Amount</label>
                                    <input
                                        type="number" required placeholder="₹"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newLoan.loanAmount} onChange={(e) => setNewLoan({ ...newLoan, loanAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tenure (Months)</label>
                                    <input
                                        type="number" required placeholder="e.g. 48"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newLoan.tenureMonths} onChange={(e) => setNewLoan({ ...newLoan, tenureMonths: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Monthly EMI (₹)</label>
                                    <input
                                        type="number" required placeholder="₹"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newLoan.emiAmount} onChange={(e) => setNewLoan({ ...newLoan, emiAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">EMI Due Date (1-31)</label>
                                    <input
                                        type="number" required min="1" max="31" placeholder="e.g. 5"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newLoan.emiDate} onChange={(e) => setNewLoan({ ...newLoan, emiDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Loan Start Date</label>
                                <input
                                    type="date" required
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newLoan.startDate} onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLoanModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#10B981] text-slate-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[#059669] transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Loan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Vehicle Modal */}
            {isEditVehicleModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl h-max max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-100 dark:bg-[#151515]">
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Edit Vehicle</h2>
                            <button onClick={() => { setIsEditVehicleModalOpen(false); resetNewVehicle(); }} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditVehicleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. TN 38 AB 1234"
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newVehicle.vehicleNumber}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Vehicle Type</label>
                                    <select
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newVehicle.type}
                                        onChange={(e) => {
                                            const selectedType = e.target.value;
                                            const defaultBilling = (selectedType === 'JCB' || selectedType === 'Harvesting Machine' || selectedType === 'Tractor') ? 'HOURLY' : newVehicle.billingType;
                                            setNewVehicle({ ...newVehicle, type: selectedType, billingType: defaultBilling });
                                        }}
                                    >
                                        <option>Tipper Lorry</option>
                                        <option>Container Lorry</option>
                                        <option>Open Type Lorry</option>
                                        <option>JCB</option>
                                        <option>Harvesting Machine</option>
                                        <option>Tractor</option>
                                        <option>Cars</option>
                                        <option>Bike</option>
                                    </select>
                                </div>
                                {newVehicle.type !== 'Open Type Lorry' && (
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            {newVehicle.type === 'Bike' ? 'Bike Purpose' : 'Billing Type'}
                                        </label>
                                        <select 
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.billingType}
                                            onChange={(e) => setNewVehicle({...newVehicle, billingType: e.target.value})}
                                        >
                                            {newVehicle.type === 'Bike' ? (
                                                <>
                                                    <option value="OFFICE_USE">Office Use</option>
                                                    <option value="OWN_USE">Own Use</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="PER_TRIP">Per Trip / Standard</option>
                                                    <option value="HOURLY">Hourly / Farming Work</option>
                                                    <option value="MONTHLY">Monthly Contract</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {newVehicle.type === 'Container Lorry' && (
                                <>
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Container Size (e.g. 20ft)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.containerSize}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, containerSize: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Max Load (Tons)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                            value={newVehicle.maxLoadTons}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, maxLoadTons: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Purchase Price / Investment (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1500000"
                                    className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                    value={newVehicle.purchasePrice}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, purchasePrice: e.target.value })}
                                />
                            </div>

                            {newVehicle.billingType === 'MONTHLY' && (
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Monthly Contract Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 88000"
                                        className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                        value={newVehicle.monthlyContractAmount || ''}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, monthlyContractAmount: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="pt-4 pb-2 border-b border-slate-200 dark:border-[#2A2A2A]">
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm">Compliance Documents Expiry</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Insurance</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.insuranceExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fitness Cert (FC)</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.fcExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, fcExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Road Tax</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.taxExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, taxExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">National Permit</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.permitExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, permitExpiry: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">State Permit</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.statePermitExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, statePermitExpiry: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Pollution</label>
                                    <input type="date" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]" value={newVehicle.pollutionExpiry || ''} onChange={(e) => setNewVehicle({ ...newVehicle, pollutionExpiry: e.target.value })} />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#1C1C1C] pb-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditVehicleModalOpen(false); resetNewVehicle(); }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#D8621C] text-slate-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[#c25617] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Update Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Secure Vault Modal */}
            <SecureVault
                isOpen={isVaultOpen}
                onClose={() => { setIsVaultOpen(false); setSelectedVehicleForVault(null); }}
                vehicle={selectedVehicleForVault}
            />

            {/* Security PIN Modal */}
            <SecurityPinModal
                isOpen={isSecurityModalOpen}
                onClose={() => { setIsSecurityModalOpen(false); setPendingSecurityAction(null); }}
                actionName={pendingSecurityAction?.action === 'delete' ? 'Delete Vehicle' : pendingSecurityAction?.action === 'edit' ? 'Edit Vehicle' : 'Open Secure Vault'}
                onSuccess={() => {
                    setIsSecurityModalOpen(false);
                    if (pendingSecurityAction?.action === 'delete') {
                        confirmDeleteVehicle(pendingSecurityAction.data);
                    } else if (pendingSecurityAction?.action === 'edit') {
                        confirmEditVehicle();
                    } else if (pendingSecurityAction?.action === 'vault') {
                        setSelectedVehicleForVault(pendingSecurityAction.data);
                        setIsVaultOpen(true);
                    }
                    setPendingSecurityAction(null);
                }}
            />
        </div>
    );
};

export default Vehicles;

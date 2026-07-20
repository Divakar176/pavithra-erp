import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Wrench, Plus, Search, Filter, AlertCircle, FileText, CheckCircle2, Sparkles } from 'lucide-react';

const Maintenance = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [error, setError] = useState('');
    const [filterVehicle, setFilterVehicle] = useState('All');
    const [isScanningBill, setIsScanningBill] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        vehicleId: '',
        date: new Date().toISOString().split('T')[0],
        serviceType: 'General Service',
        vendorDetails: '',
        sparePartsCost: '',
        labourCost: '',
        totalCost: '',
        billUrl: ''
    });

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/maintenance'),
                api.get('/vehicles')
            ]);
            setLogs(logsRes.data.reverse()); // latest first
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-calculate total cost
    useEffect(() => {
        const spare = parseFloat(formData.sparePartsCost) || 0;
        const labour = parseFloat(formData.labourCost) || 0;
        if (spare > 0 || labour > 0) {
            setFormData(prev => ({ ...prev, totalCost: (spare + labour).toString() }));
        }
    }, [formData.sparePartsCost, formData.labourCost]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.vehicleId) {
            setError('Please select a vehicle');
            return;
        }
        try {
            if (isEditMode) {
                await api.put(`/maintenance/${editId}`, formData);
            } else {
                await api.post('/maintenance', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) {
            setError(isEditMode ? 'Failed to update maintenance log' : 'Failed to save maintenance log');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            vehicleId: '', date: new Date().toISOString().split('T')[0], serviceType: 'General Service', 
            vendorDetails: '', sparePartsCost: '', labourCost: '', totalCost: '', billUrl: ''
        });
        setIsEditMode(false);
        setEditId(null);
    };

    const handleEdit = (log) => {
        setFormData({
            vehicleId: log.vehicleId || '',
            date: log.date ? new Date(log.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            serviceType: log.serviceType || 'General Service',
            vendorDetails: log.vendorDetails || '',
            sparePartsCost: log.sparePartsCost || '',
            labourCost: log.labourCost || '',
            totalCost: log.totalCost || '',
            billUrl: log.billUrl || ''
        });
        setIsEditMode(true);
        setEditId(log.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;
        try {
            await api.delete(`/maintenance/${id}`);
            fetchData();
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete record.");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanningBill(true);
        const fileData = new FormData();
        fileData.append('file', file);

        try {
            const response = await api.post('/ai/ocr/extract', fileData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = response.data;
            
            setFormData(prev => ({
                ...prev,
                vendorDetails: data.vendorName || prev.vendorDetails,
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : prev.date,
                totalCost: data.amount ? data.amount.toString() : prev.totalCost
            }));
            
            alert(`✅ AI extracted data from Service Bill successfully!`);
        } catch (error) {
            console.error("AI extraction failed", error);
            alert("Failed to extract data from bill. Please enter manually.");
        } finally {
            setIsScanningBill(false);
            e.target.value = null;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const filteredLogs = filterVehicle === 'All' ? logs : logs.filter(l => l.vehicleId.toString() === filterVehicle);

    const getServiceTypeColor = (type) => {
        switch(type) {
            case 'Oil Change': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Tyre Change': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'Engine Repair': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'FC Renewal':
            case 'Insurance': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            default: return 'text-green-400 bg-green-400/10 border-green-400/20';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8621C]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Maintenance & Compliance</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">Track vehicle health, servicing, and legal renewals</p>
                </div>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center px-4 py-2 bg-[#D8621C] text-slate-900 dark:text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-[#c25617] transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Log Service
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stripe-card p-6">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Maintenance Spend</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(logs.reduce((sum, log) => sum + (log.totalCost || 0), 0))}
                    </div>
                </div>
                <div className="stripe-card p-6">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Services This Month</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {logs.filter(l => new Date(l.date).getMonth() === new Date().getMonth()).length}
                    </div>
                </div>
                <div className="stripe-card p-6">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Most Frequent Issue</div>
                    <div className="text-xl font-bold text-[#D8621C] mt-2">
                        {logs.length > 0 ? Object.entries(logs.reduce((acc, log) => { acc[log.serviceType] = (acc[log.serviceType] || 0) + 1; return acc; }, {})).sort((a,b) => b[1]-a[1])[0][0] : 'None'}
                    </div>
                </div>
            </div>

            <div className="stripe-card p-0 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#1A1A1A] flex items-center justify-between">
                    <div className="relative w-64 group">
                        <Filter className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-gray-400" />
                        <select 
                            value={filterVehicle}
                            onChange={(e) => setFilterVehicle(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-sm text-slate-600 dark:text-gray-300 focus:outline-none focus:border-[#D8621C] transition-all appearance-none"
                        >
                            <option value="All">All Vehicles</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Date</th>
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Vehicle</th>
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Service Type</th>
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Vendor</th>
                                <th className="p-5 text-right border-b border-slate-200 dark:border-[#2A2A2A]">Total Cost</th>
                                <th className="p-5 text-center border-b border-slate-200 dark:border-[#2A2A2A]">Bill</th>
                                <th className="p-5 text-center border-b border-slate-200 dark:border-[#2A2A2A]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A] bg-slate-50 dark:bg-[#121212]">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-gray-500 font-medium">
                                        No maintenance records found.
                                    </td>
                                </tr>
                            ) : filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:bg-[#1A1A1A] transition-colors">
                                    <td className="p-5 text-sm text-slate-600 dark:text-gray-300">
                                        {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-5">
                                        <span className="font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] px-3 py-1 rounded-lg border border-[#333]">
                                            {log.vehicleNumber}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getServiceTypeColor(log.serviceType)}`}>
                                            {log.serviceType}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-slate-500 dark:text-gray-400">
                                        {log.vendorDetails || '-'}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="font-bold text-[#D8621C]">{formatCurrency(log.totalCost)}</div>
                                        {(log.sparePartsCost > 0 || log.labourCost > 0) && (
                                            <div className="text-[10px] text-slate-500 dark:text-gray-500 mt-1">
                                                S: {log.sparePartsCost || 0} | L: {log.labourCost || 0}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 text-center">
                                        {log.billUrl ? (
                                            <a href={log.billUrl} target="_blank" rel="noreferrer" className="inline-flex p-2 bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] text-blue-400 rounded-lg transition-colors">
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleEdit(log)}
                                                className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white p-1 rounded hover:bg-white/10 transition-colors"
                                                title="Edit Record"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(log.id)}
                                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors"
                                                title="Delete Record"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Maintenance Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
                    <div className="stripe-card w-full max-w-lg overflow-hidden border border-slate-200 dark:border-[#2A2A2A] shadow-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#1A1A1A]">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{isEditMode ? 'Edit Maintenance Service' : 'Log Maintenance Service'}</h3>
                            <div className="flex items-center gap-3">
                                <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-bold flex items-center transition-all ${isScanningBill ? 'bg-indigo-500/50 text-slate-900 dark:text-white cursor-not-allowed' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30'}`}>
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    {isScanningBill ? 'Scanning...' : 'Auto-fill with AI'}
                                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} disabled={isScanningBill} />
                                </label>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] p-1.5 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-50 dark:bg-[#121212]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start text-red-500 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Vehicle *</label>
                                    <select 
                                        required
                                        value={formData.vehicleId}
                                        onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all"
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Date *</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Service Type *</label>
                                    <select 
                                        required
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all"
                                    >
                                        <option value="General Service">General Service</option>
                                        <option value="Oil Change">Oil Change</option>
                                        <option value="Tyre Change">Tyre Change</option>
                                        <option value="Engine Repair">Engine Repair</option>
                                        <option value="Body Work">Body Work</option>
                                        <option value="Insurance">Insurance Renewal</option>
                                        <option value="FC Renewal">FC Renewal</option>
                                        <option value="Tax Renewal">Road Tax</option>
                                        <option value="Permit Renewal">National Permit</option>
                                        <option value="Pollution Cert">Pollution Cert</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Vendor / Mechanic Details</label>
                                    <input 
                                        type="text" 
                                        value={formData.vendorDetails}
                                        onChange={(e) => setFormData({...formData, vendorDetails: e.target.value})}
                                        placeholder="e.g. Ramesh Garage"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] space-y-4">
                                {!['Insurance', 'FC Renewal', 'Tax Renewal', 'Permit Renewal', 'Pollution Cert'].includes(formData.serviceType) && (
                                    <>
                                        <h4 className="text-slate-600 dark:text-gray-300 font-bold text-sm">Cost Breakdown</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 mb-1">Spare Parts (₹)</label>
                                                <input 
                                                    type="number" 
                                                    value={formData.sparePartsCost}
                                                    onChange={(e) => setFormData({...formData, sparePartsCost: e.target.value})}
                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 mb-1">Labour (₹)</label>
                                                <input 
                                                    type="number" 
                                                    value={formData.labourCost}
                                                    onChange={(e) => setFormData({...formData, labourCost: e.target.value})}
                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-[#D8621C] mb-2">Total Cost (₹) *</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.totalCost}
                                        onChange={(e) => setFormData({...formData, totalCost: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-[#D8621C]/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] text-lg font-bold"
                                    />
                                </div>
                            </div>

                            {/* Bill / Document Image Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Upload Bill Image (Optional)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-[#2A2A2A] border-dashed rounded-xl hover:border-orange-500/50 transition-colors group relative">
                                    {formData.billUrl ? (
                                        <div className="text-center">
                                            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                                            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Image attached</p>
                                            <button type="button" onClick={() => setFormData({...formData, billUrl: ''})} className="mt-2 text-xs text-red-500 hover:text-red-400 font-medium">Remove Image</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <FileText className="mx-auto h-8 w-8 text-slate-500 dark:text-gray-500 group-hover:text-orange-400 transition-colors" />
                                            <div className="flex justify-center text-sm text-slate-500 dark:text-gray-400">
                                                <label className="relative cursor-pointer rounded-md font-medium text-orange-500 hover:text-orange-400 focus-within:outline-none">
                                                    <span>Upload a file</span>
                                                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                                                        if(e.target.files[0]) {
                                                            setFormData({...formData, billUrl: e.target.files[0].name})
                                                        }
                                                    }} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 px-4 bg-[#D8621C] hover:bg-[#c25617] text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md shadow-[#D8621C]/20">
                                    {isEditMode ? 'Update Record' : 'Save Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;

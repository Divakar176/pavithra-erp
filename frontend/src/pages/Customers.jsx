import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Plus, Search, MoreHorizontal, X, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import SecurityPinModal from '../components/SecurityPinModal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [pendingSecurityAction, setPendingSecurityAction] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    // Payment State
    const [paymentAmount, setPaymentAmount] = useState('');
    const [chargeAmount, setChargeAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Bank Transfer');
    const [referenceNotes, setReferenceNotes] = useState('');

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data.reverse());
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/customers', {
                name,
                mobile,
                email,
                gstNumber,
                address
            });
            setIsModalOpen(false);
            resetForm();
            fetchCustomers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add customer. Ensure mobile or GST is unique.');
        }
    };

    const handleEditCustomer = async (e) => {
        e.preventDefault();
        setPendingSecurityAction({ action: 'edit', data: null });
        setIsSecurityModalOpen(true);
    };

    const confirmEditCustomer = async () => {
        setError('');
        try {
            await api.put(`/customers/${editingCustomer.id}`, {
                name,
                mobile,
                email,
                gstNumber,
                address
            });
            setIsEditModalOpen(false);
            resetForm();
            fetchCustomers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update customer.');
        }
    };

    const handleDeleteCustomer = async (id) => {
        setPendingSecurityAction({ action: 'delete', data: id });
        setIsSecurityModalOpen(true);
    };

    const confirmDeleteCustomer = async (id) => {
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (err) {
            console.error("Failed to delete customer", err);
            alert("Failed to delete customer");
        }
    };

    const resetForm = () => {
        setName('');
        setMobile('');
        setEmail('');
        setGstNumber('');
        setAddress('');
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setName(customer.name);
        setMobile(customer.mobile);
        setEmail(customer.email || '');
        setGstNumber(customer.gstNumber || '');
        setAddress(customer.address || '');
        setIsEditModalOpen(true);
    };

    const handleReceivePayment = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedCustomer) return;

        try {
            await api.post(`/customers/${selectedCustomer.id}/payments`, {
                amount: parseFloat(paymentAmount),
                paymentMode,
                referenceNotes,
                paymentDate: new Date().toISOString().split('T')[0]
            });
            setIsPaymentModalOpen(false);
            setPaymentAmount('');
            setPaymentMode('Bank Transfer');
            setReferenceNotes('');
            fetchCustomers();
            alert(`Payment of ₹${paymentAmount} recorded successfully!`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record payment.');
        }
    };

    const handleAddCharge = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedCustomer) return;

        try {
            // Sending negative amount acts as a charge instead of payment
            await api.post(`/customers/${selectedCustomer.id}/payments`, {
                amount: -Math.abs(parseFloat(chargeAmount)),
                paymentMode: 'Manual Charge',
                referenceNotes: referenceNotes || 'Manual Monthly/Adjustment Charge',
                paymentDate: new Date().toISOString().split('T')[0]
            });
            setIsChargeModalOpen(false);
            setChargeAmount('');
            setReferenceNotes('');
            fetchCustomers();
            alert(`Charge of ₹${chargeAmount} added successfully!`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add charge.');
        }
    };

    return (
        <div className="p-8 w-full mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Customers</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">Manage client contracts and details</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-[#D8621C] text-slate-900 dark:text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-[#c25617] transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Add Customer
                </button>
            </div>

            <div className="stripe-card p-0 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] bg-[#1A1A1A] flex items-center">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-gray-400 group-focus-within:text-[#D8621C] transition-colors" />
                        <input type="text" placeholder="Search customers..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-sm text-slate-600 dark:text-gray-300 focus:outline-none focus:border-[#D8621C] transition-all placeholder-gray-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1A1A1A] text-slate-500 dark:text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Customer Name</th>
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">Contact</th>
                                <th className="p-5 border-b border-slate-200 dark:border-[#2A2A2A]">GST Number</th>
                                <th className="p-5 text-right border-b border-slate-200 dark:border-[#2A2A2A]">Balance</th>
                                <th className="p-5 text-right border-b border-slate-200 dark:border-[#2A2A2A]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A] bg-slate-50 dark:bg-[#121212]">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-gray-500 font-medium">
                                        No customers found. Add your first client.
                                    </td>
                                </tr>
                            ) : customers.map(c => {
                                const balance = c.outstandingBalance || 0;
                                const isHighBalance = balance > 100000;
                                const displayGst = (c.gstNumber && !c.gstNumber.startsWith('TEMP-')) ? c.gstNumber : 'N/A';
                                
                                return (
                                <tr key={c.id} className="hover:bg-[#1A1A1A] transition-colors group align-middle">
                                    <td className="p-5 align-middle">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-[#2A2A2A] text-[#D8621C] flex items-center justify-center mr-4 border border-[#D8621C]/20 group-hover:scale-105 transition-transform font-black">
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm capitalize">{c.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-500 mt-0.5 font-bold font-mono">ID: #{c.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 align-middle">
                                        <div className="text-sm font-bold text-slate-600 dark:text-gray-300">{c.mobile}</div>
                                        <div className="text-xs text-slate-500 dark:text-gray-400 font-bold mt-0.5">{c.email || 'N/A'}</div>
                                    </td>
                                    <td className="p-5 text-sm text-slate-600 dark:text-gray-300 font-bold align-middle">{displayGst}</td>
                                    <td className="p-5 text-right align-middle">
                                        <div className={`font-bold ${isHighBalance ? 'text-red-500' : 'text-[#10B981]'}`}>
                                            ₹{balance.toLocaleString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right align-middle">
                                        <button 
                                            onClick={() => { setSelectedCustomer(c); setIsPaymentModalOpen(true); }}
                                            className="px-4 py-2 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] text-xs font-bold rounded-lg transition-colors mr-2 border border-[#10B981]/20"
                                        >
                                            Receive Payment
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedCustomer(c); setIsChargeModalOpen(true); }}
                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors mr-2 border border-red-500/20"
                                        >
                                            Add Charge
                                        </button>
                                        <button 
                                            onClick={() => openEditModal(c)}
                                            className="p-2 text-slate-500 dark:text-gray-400 hover:text-[#D8621C] hover:bg-[#D8621C]/10 rounded-lg transition-colors mr-1"
                                            title="Edit Customer"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCustomer(c.id)}
                                            className="p-2 text-slate-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Customer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="stripe-card w-full max-w-md overflow-hidden border border-slate-200 dark:border-[#2A2A2A] shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-[#2A2A2A] bg-[#1A1A1A]">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Customer</h3>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] p-1.5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="p-6 space-y-5 bg-slate-50 dark:bg-[#121212]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start text-red-500 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Company / Customer Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Ramco Cements"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Mobile</label>
                                    <input 
                                        type="tel" 
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">GST Number</label>
                                    <input 
                                        type="text" 
                                        value={gstNumber}
                                        onChange={(e) => setGstNumber(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Billing Address</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Optional"
                                    rows="2"
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600 resize-none"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 py-3 px-4 bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 px-4 bg-[#D8621C] hover:bg-[#c25617] text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md shadow-[#D8621C]/20">
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Receive Payment Modal */}
            {isPaymentModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="stripe-card w-full max-w-md overflow-hidden border border-slate-200 dark:border-[#2A2A2A] shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-[#2A2A2A] bg-[#1A1A1A]">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Receive Payment</h3>
                                <p className="text-sm text-[#10B981] font-medium mt-1">from {selectedCustomer.name}</p>
                            </div>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] p-1.5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleReceivePayment} className="p-6 space-y-5 bg-slate-50 dark:bg-[#121212]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start text-red-500 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            
                            <div className="bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] p-4 rounded-xl mb-6">
                                <div className="text-sm text-slate-500 dark:text-gray-400 font-medium">Current Outstanding Balance</div>
                                <div className={`text-2xl font-black mt-1 ${selectedCustomer.outstandingBalance > 100000 ? 'text-red-500' : 'text-[#10B981]'}`}>
                                    ₹{(selectedCustomer.outstandingBalance || 0).toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Amount Received (₹)</label>
                                <input 
                                    type="number" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="e.g. 50000"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-all font-medium text-lg placeholder-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Payment Mode</label>
                                <select 
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-all font-medium"
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="UPI">UPI / GPay / PhonePe</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Reference Notes</label>
                                <input 
                                    type="text" 
                                    value={referenceNotes}
                                    onChange={(e) => setReferenceNotes(e.target.value)}
                                    placeholder="e.g. UTR Number, Cheque Number"
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-all font-medium placeholder-gray-600"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 px-4 bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={!paymentAmount} className="flex-1 py-3 px-4 bg-[#10B981] hover:bg-[#059669] text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md shadow-[#10B981]/20 disabled:opacity-50">
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Add Charge Modal */}
            {isChargeModalOpen && selectedCustomer && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl w-full max-w-md border border-slate-200 dark:border-[#2A2A2A] shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-[#1A1A1A]">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add Manual Charge</h3>
                                <p className="text-xs text-red-500 font-bold mt-1">Increases balance owed by customer</p>
                            </div>
                            <button onClick={() => setIsChargeModalOpen(false)} className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] p-1.5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCharge} className="p-6 space-y-5 bg-slate-50 dark:bg-[#121212]">
                            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl">{error}</div>}
                            
                            <div className="p-4 bg-[#1A1A1A] rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                <div className="text-xs text-slate-500 dark:text-gray-500 font-bold mb-1">CUSTOMER</div>
                                <div className="text-sm text-slate-900 dark:text-white font-bold">{selectedCustomer.name}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Charge Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="e.g. 88000"
                                        value={chargeAmount}
                                        onChange={(e) => setChargeAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Description / Notes</label>
                                <textarea
                                    className="w-full bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors min-h-[100px]"
                                    placeholder="e.g. Monthly Contract Bill for July"
                                    value={referenceNotes}
                                    onChange={(e) => setReferenceNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsChargeModalOpen(false)} className="flex-1 py-3 px-4 bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={!chargeAmount} className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/20 disabled:opacity-50">
                                    Add Charge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Edit Customer Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="stripe-card w-full max-w-md overflow-hidden border border-slate-200 dark:border-[#2A2A2A] shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-[#2A2A2A] bg-[#1A1A1A]">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Customer</h3>
                            <button onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:text-white bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] p-1.5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditCustomer} className="p-6 space-y-5 bg-slate-50 dark:bg-[#121212]">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start text-red-500 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Company / Customer Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Ramco Cements"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Mobile</label>
                                    <input 
                                        type="tel" 
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">GST Number</label>
                                    <input 
                                        type="text" 
                                        value={gstNumber}
                                        onChange={(e) => setGstNumber(e.target.value)}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-gray-400 mb-2">Billing Address</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Optional"
                                    rows="2"
                                    className="w-full px-4 py-3 bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#D8621C] transition-all font-medium placeholder-gray-600 resize-none"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="flex-1 py-3 px-4 bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] hover:bg-slate-200 dark:bg-[#2A2A2A] text-slate-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 px-4 bg-[#D8621C] hover:bg-[#c25617] text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-md shadow-[#D8621C]/20">
                                    Update Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <SecurityPinModal 
                isOpen={isSecurityModalOpen}
                onClose={() => { setIsSecurityModalOpen(false); setPendingSecurityAction(null); }}
                actionName={pendingSecurityAction?.action === 'delete' ? 'Deleting Customer' : 'Updating Customer'}
                onSuccess={() => {
                    setIsSecurityModalOpen(false);
                    if (pendingSecurityAction?.action === 'delete') {
                        confirmDeleteCustomer(pendingSecurityAction.data);
                    } else if (pendingSecurityAction?.action === 'edit') {
                        confirmEditCustomer();
                    }
                    setPendingSecurityAction(null);
                }}
            />
        </div>
    );
};

export default Customers;

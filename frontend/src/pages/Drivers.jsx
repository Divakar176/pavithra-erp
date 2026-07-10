import { useState, useEffect } from 'react';
import api from '../api/axios';
import { generatePayslip } from '../utils/pdfGenerator';
import { Users, Calendar as CalendarIcon, IndianRupee, Save, Plus, X, Search, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Directory');
    
    // Attendance State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceDraft, setAttendanceDraft] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', mobile: '', email: '' });

    // Add State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({ username: '', mobile: '', email: '' });

    // Payment State
    const [selectedDriverForPayment, setSelectedDriverForPayment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        expenseType: 'Driver Advance',
        amount: '',
        paymentMode: 'Cash',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [driversRes, salaryRes] = await Promise.all([
                api.get('/users/drivers'),
                api.get('/finances/driver-salaries')
            ]);
            setDrivers(driversRes.data);
            setSalaries(salaryRes.data);
            
            // Initialize draft
            const draft = {};
            driversRes.data.forEach(d => draft[d.id] = { status: 'PRESENT', remarks: '' });
            setAttendanceDraft(draft);
            
            fetchAttendanceForDate(selectedDate);
        } catch (error) {
            console.error("Error fetching driver data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceForDate = async (date) => {
        try {
            const res = await api.get(`/attendance?startDate=${date}&endDate=${date}`);
            setAttendance(res.data);
            
            // Update draft with existing records
            setAttendanceDraft(prev => {
                const newDraft = { ...prev };
                res.data.forEach(att => {
                    newDraft[att.driver.id] = { status: att.status, remarks: att.remarks || '' };
                });
                return newDraft;
            });
        } catch (error) {
            console.error("Error fetching attendance", error);
        }
    };

    const submitPayment = async () => {
        const amount = parseFloat(paymentForm.amount);
        const currentBalance = selectedDriverForPayment.netPayable;
        
        // Validation check for overpayment
        if (amount > currentBalance && paymentForm.expenseType === 'Driver Salary') {
            const overAmount = amount - currentBalance;
            const proceed = window.confirm(`Warning: The driver's pending salary is only ₹${currentBalance}, but you are trying to pay ₹${amount}.\n\nThis is an overpayment of ₹${overAmount}.\n\nDo you want to proceed and record this extra amount as an advance?`);
            if (!proceed) return;
        } else if (amount > currentBalance) {
            const newBalance = currentBalance - amount;
            const proceed = window.confirm(`Warning: The driver's current balance is ₹${currentBalance}. Giving an advance of ₹${amount} will result in a negative balance of ₹${newBalance} (they will owe you money).\n\nDo you want to proceed?`);
            if (!proceed) return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...paymentForm,
                amount: parseFloat(paymentForm.amount),
                driver: { id: selectedDriverForPayment.driverId },
                description: `Settlement for ${selectedDriverForPayment.driverName}`
            };
            await api.post('/expenses', payload);
            alert('Payment recorded successfully!');
            setSelectedDriverForPayment(null);
            setPaymentForm({
                expenseType: 'Driver Advance',
                amount: '',
                paymentMode: 'Cash',
                date: new Date().toISOString().split('T')[0]
            });
            // Refresh data
            fetchData();
        } catch (error) {
            console.error("Error saving payment", error);
            if (error.response && error.response.data) {
                console.error("Backend error details:", error.response.data);
                alert(`Failed to save payment: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Failed to save payment");
            }
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            fetchAttendanceForDate(selectedDate);
        }
    }, [selectedDate]);

    const handleEditClick = (driver) => {
        setEditingDriver(driver);
        setEditForm({ username: driver.username, mobile: driver.mobile || '', email: driver.email || '' });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/drivers/${editingDriver.id}`, editForm);
            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error updating driver", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to update driver details: ${errorMsg}`);
        }
    };

    const handleAddDriver = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/drivers', addForm);
            setIsAddModalOpen(false);
            setAddForm({ username: '', mobile: '', email: '' });
            fetchData();
        } catch (error) {
            console.error("Error adding driver", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to add driver: ${errorMsg}`);
        }
    };

    const handleSaveAttendance = async () => {
        setIsSaving(true);
        const payload = Object.entries(attendanceDraft).map(([driverId, data]) => {
            return {
                driverId: parseInt(driverId),
                date: selectedDate,
                status: data.status,
                remarks: data.remarks
            };
        });

        try {
            await api.post('/attendance/batch', payload);
            alert('Attendance saved successfully!');
            fetchAttendanceForDate(selectedDate);
        } catch (error) {
            console.error("Error saving attendance", error);
            alert("Failed to save attendance");
        } finally {
            setIsSaving(false);
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
        <div className="p-8 w-full mx-auto space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Driver Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage staff directory, daily attendance, and salary settlements</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D8621C] text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Driver</span>
                </button>
            </div>

            <div className="flex border-b border-[#2A2A2A] overflow-x-auto custom-scrollbar">
                {['Directory', 'Attendance', 'Salary & Advances'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                            activeTab === tab ? 'border-[#D8621C] text-[#D8621C]' : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab === 'Directory' && <Users className="w-4 h-4" />}
                        {tab === 'Attendance' && <CalendarIcon className="w-4 h-4" />}
                        {tab === 'Salary & Advances' && <IndianRupee className="w-4 h-4" />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* DIRECTORY TAB */}
            {activeTab === 'Directory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {drivers.map(driver => (
                        <div key={driver.id} className="stripe-card p-5 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D8621C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center text-[#D8621C] text-xl font-bold uppercase">
                                        {driver.username.charAt(0)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEditClick(driver)}
                                            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                                            title="Edit Driver"
                                        >
                                            ✏️
                                        </button>
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{driver.username}</h3>
                                <div className="text-sm text-gray-400 space-y-1 mb-4">
                                    <p>📱 {driver.mobile}</p>
                                    <p>✉️ {driver.email}</p>
                                </div>
                                <div className="pt-3 border-t border-[#2A2A2A] text-xs font-medium text-gray-500 flex justify-between">
                                    <span>Role: {driver.role}</span>
                                    <span>ID: #{driver.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {drivers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No drivers found.
                        </div>
                    )}
                </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'Attendance' && (
                <div className="stripe-card p-0 overflow-hidden">
                    <div className="p-5 border-b border-[#2A2A2A] bg-[#1A1A1A] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date:</label>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#D8621C] transition-all"
                            />
                        </div>
                        <button 
                            onClick={handleSaveAttendance}
                            disabled={isSaving}
                            className="flex items-center px-6 py-2.5 bg-[#D8621C] hover:bg-[#c25617] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#151515] text-xs uppercase text-gray-500 border-b border-[#2A2A2A]">
                                <tr>
                                    <th className="p-5 font-bold">Driver Name</th>
                                    <th className="p-5 font-bold text-center">Status</th>
                                    <th className="p-5 font-bold">Remarks (Optional)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] bg-[#1C1C1C]">
                                {drivers.map(driver => (
                                    <tr key={driver.id} className="hover:bg-[#222] transition-colors">
                                        <td className="p-5">
                                            <div className="font-bold text-white">{driver.username}</div>
                                            <div className="text-xs text-gray-500">{driver.mobile}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-2">
                                                {['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_TRIP'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setAttendanceDraft(prev => ({...prev, [driver.id]: {...prev[driver.id], status}}))}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                            attendanceDraft[driver.id]?.status === status
                                                            ? (status === 'PRESENT' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                                                               status === 'ABSENT' ? 'bg-red-500/20 border-red-500 text-red-400' :
                                                               status === 'HALF_DAY' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                                                               'bg-blue-500/20 border-blue-500 text-blue-400')
                                                            : 'bg-transparent border-[#2A2A2A] text-gray-500 hover:border-gray-500'
                                                        }`}
                                                    >
                                                        {status.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <input 
                                                type="text"
                                                placeholder="Add remark..."
                                                value={attendanceDraft[driver.id]?.remarks || ''}
                                                onChange={(e) => setAttendanceDraft(prev => ({...prev, [driver.id]: {...prev[driver.id], remarks: e.target.value}}))}
                                                className="w-full px-3 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#D8621C]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {drivers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-gray-500 font-medium">No drivers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SALARY & ADVANCES TAB */}
            {activeTab === 'Salary & Advances' && (
                <div className="grid grid-cols-1 gap-6">
                    {salaries.map(sal => (
                        <div key={sal.driverId} className="stripe-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center text-[#D8621C] text-2xl font-bold uppercase">
                                    {sal.driverName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{sal.driverName}</h3>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Driver</div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-8">
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Trip Salary</div>
                                    <div className="text-2xl font-bold text-white">₹{sal.totalTripSalary}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Advances</div>
                                    <div className="text-2xl font-bold text-red-400">₹{sal.totalAdvances}</div>
                                </div>
                                <div className="p-3 bg-[#D8621C]/10 border border-[#D8621C]/20 rounded-xl min-w-[150px]">
                                    <div className="text-[10px] text-[#D8621C] font-bold uppercase tracking-wider mb-1">Net Payable</div>
                                    <div className={`text-2xl font-bold ${sal.netPayable < 0 ? 'text-red-500' : 'text-[#D8621C]'}`}>
                                        ₹{sal.netPayable}
                                    </div>
                                    {sal.netPayable < 0 && <div className="text-[10px] text-red-500 mt-1">Negative Balance</div>}
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedDriverForPayment(sal)}
                                    className="px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D8621C] text-[#D8621C] rounded-xl font-bold transition-all text-sm flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Payment
                                </button>
                                
                                <button 
                                    onClick={() => generatePayslip(sal)}
                                    className="px-4 py-3 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-xl transition-colors flex items-center gap-2 border border-[#333]"
                                    title="Download Payslip PDF"
                                >
                                    <FileText className="w-4 h-4 text-blue-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {salaries.length === 0 && (
                        <div className="stripe-card p-8 text-center text-gray-500">
                            No salary data available.
                        </div>
                    )}
                </div>
            )}

            {/* PAYMENT MODAL */}
            {selectedDriverForPayment && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#1A1A1A]">
                            <h3 className="font-bold text-white">Add Payment: {selectedDriverForPayment.driverName}</h3>
                            <button onClick={() => setSelectedDriverForPayment(null)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Type</label>
                                <select 
                                    value={paymentForm.expenseType}
                                    onChange={(e) => setPaymentForm({...paymentForm, expenseType: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl text-white focus:border-[#D8621C] outline-none"
                                >
                                    <option value="Driver Advance">Driver Advance</option>
                                    <option value="Driver Salary">Salary Settlement</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl text-white focus:border-[#D8621C] outline-none font-bold text-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Mode</label>
                                <select 
                                    value={paymentForm.paymentMode}
                                    onChange={(e) => setPaymentForm({...paymentForm, paymentMode: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl text-white focus:border-[#D8621C] outline-none"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                                <input 
                                    type="date" 
                                    value={paymentForm.date}
                                    onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <button 
                                onClick={submitPayment}
                                disabled={!paymentForm.amount || isSaving}
                                className="w-full py-4 mt-2 bg-[#D8621C] hover:bg-[#c25617] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Driver Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-md border border-[#333] shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-[#333]">
                            <h3 className="text-xl font-bold text-white">Edit Driver Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.mobile}
                                    onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white font-medium">Cancel</button>
                                <button type="submit" className="bg-[#D8621C] hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-lg">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Driver Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-md border border-[#333] shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-[#333]">
                            <h3 className="text-xl font-bold text-white">Add New Driver</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddDriver} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={addForm.username}
                                    onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={addForm.mobile}
                                    onChange={(e) => setAddForm({...addForm, mobile: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                                    className="w-full bg-[#222] border border-[#333] rounded-xl p-3 text-white focus:border-[#D8621C] outline-none"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white font-medium">Cancel</button>
                                <button type="submit" className="bg-[#D8621C] hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-lg">Add Driver</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;

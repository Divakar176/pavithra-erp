import { useState, useEffect } from 'react';
import api from '../api/axios';
import { IndianRupee, Search, Filter, Download, ArrowDownRight, Fuel, Wrench, FileText, Calendar, Truck } from 'lucide-react';

const ExpenseLedger = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    
    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newExpense, setNewExpense] = useState({
        expenseType: 'Maintenance',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vehicleId: '',
        paidTo: '',
        paymentMode: 'Cash',
        description: ''
    });

    const fetchData = async () => {
        try {
            const [expRes, vehRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            // Show newest first
            setExpenses((expRes.data || []).sort((a,b) => new Date(b.date) - new Date(a.date))); 
            setVehicles(vehRes.data || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                expenseType: newExpense.expenseType,
                amount: parseFloat(newExpense.amount),
                date: newExpense.date,
                vehicle: newExpense.vehicleId ? { id: newExpense.vehicleId } : null,
                paidTo: newExpense.paidTo,
                paymentMode: newExpense.paymentMode,
                description: newExpense.description
            };
            
            await api.post('/expenses', payload);
            setIsAddModalOpen(false);
            setNewExpense({
                expenseType: 'Maintenance',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                vehicleId: '',
                paidTo: '',
                paymentMode: 'Cash',
                description: ''
            });
            fetchData();
        } catch (error) {
            console.error("Failed to add expense", error);
            alert("Failed to add expense. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const matchesType = filterType === 'All' || exp.expenseType === filterType;
        const searchStr = (exp.trip?.id || '') + ' ' + (exp.expenseType || '') + ' ' + (exp.paidTo || '');
        const matchesSearch = searchStr.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Group by month
    const groupedExpenses = filteredExpenses.reduce((groups, exp) => {
        const date = new Date(exp.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) {
            groups[monthYear] = {
                expenses: [],
                total: 0
            };
        }
        groups[monthYear].expenses.push(exp);
        groups[monthYear].total += exp.amount;
        return groups;
    }, {});

    const getExpenseIcon = (type) => {
        switch(type) {
            case 'Fuel': return <Fuel className="w-5 h-5 text-orange-500" />;
            case 'Maintenance': 
            case 'Repair': return <Wrench className="w-5 h-5 text-blue-500" />;
            default: return <FileText className="w-5 h-5 text-slate-500 dark:text-gray-500" />;
        }
    };

    return (
        <div className="p-8 animate-fade-in w-full mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Expense Ledger</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">Detailed history of all company expenses</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center shadow-sm"
                    >
                        + Add Expense
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center shadow-sm">
                        <Download className="w-4 h-4 mr-2 text-slate-500 dark:text-gray-500" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px] max-w-md group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by Vendor, Trip ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-gray-500 shadow-sm" 
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm"
                        >
                            <option value="All">All Categories</option>
                            <option value="Fuel">Fuel</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Repair">Repair</option>
                            <option value="Driver Salary">Driver Salary</option>
                            <option value="Toll">Toll</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Loan EMI">Loan EMI</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 dark:text-gray-500 font-medium">Loading ledger...</div>
                ) : Object.keys(groupedExpenses).length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-gray-500 font-medium">No expenses found matching your criteria.</div>
                ) : (
                    Object.entries(groupedExpenses).map(([monthYear, data], idx) => (
                        <div key={monthYear} className={idx !== 0 ? 'border-t-4 border-gray-100' : ''}>
                            <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-black text-gray-800 text-sm tracking-wide uppercase">{monthYear}</h3>
                                <span className="font-bold text-slate-500 dark:text-gray-500 text-sm">{data.expenses.length} entries</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-slate-500 dark:text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                            <th className="p-4 pl-6 w-1/6">Date</th>
                                            <th className="p-4 w-1/4">Category & Vendor</th>
                                            <th className="p-4 w-1/4">Links</th>
                                            <th className="p-4 w-1/4">Payment Mode</th>
                                            <th className="p-4 pr-6 text-right w-1/6">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.expenses.map(expense => (
                                            <tr key={expense.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center text-gray-700 font-bold text-sm">
                                                        <Calendar className="w-4 h-4 mr-2 text-slate-500 dark:text-gray-400" />
                                                        {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mr-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                            {getExpenseIcon(expense.expenseType)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm">{expense.expenseType}</div>
                                                            {expense.paidTo && <div className="text-[11px] font-bold text-slate-500 dark:text-gray-500 mt-0.5">{expense.paidTo}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {expense.trip && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                                TRP-{expense.trip.id}
                                                            </span>
                                                        )}
                                                        {expense.vehicle && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                                                                <Truck className="w-3 h-3 mr-1"/> {expense.vehicle.vehicleNumber}
                                                            </span>
                                                        )}
                                                        {!expense.trip && !expense.vehicle && <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">None</span>}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">{expense.paymentMode || 'Cash'}</span>
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end text-rose-600 font-black">
                                                        <ArrowDownRight className="w-3 h-3 mr-1 opacity-70" />
                                                        ₹{expense.amount.toLocaleString('en-IN')}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50/50 border-t-2 border-gray-100">
                                            <td colSpan="4" className="p-4 pl-6 text-right font-bold text-gray-600 text-sm uppercase tracking-wider">Total for {monthYear}</td>
                                            <td className="p-4 pr-6 text-right font-black text-rose-600 text-lg">
                                                ₹{data.total.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Expense Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-gray-900 font-bold text-lg">Add New Expense</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 dark:text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Date</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                                    <input 
                                        type="number" required placeholder="e.g. 5000"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.expenseType} onChange={(e) => setNewExpense({...newExpense, expenseType: e.target.value})}
                                    >
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Fuel">Fuel</option>
                                        <option value="Loan EMI">Loan EMI</option>
                                        <option value="Driver Salary">Driver Salary</option>
                                        <option value="Toll">Toll</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Miscellaneous">Miscellaneous</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Vehicle (Optional)</label>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.vehicleId} onChange={(e) => setNewExpense({...newExpense, vehicleId: e.target.value})}
                                    >
                                        <option value="">-- None --</option>
                                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Paid To (Vendor)</label>
                                    <input 
                                        type="text" required placeholder="e.g. Ashok Leyland Service"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.paidTo} onChange={(e) => setNewExpense({...newExpense, paidTo: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Payment Mode</label>
                                    <select 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        value={newExpense.paymentMode} onChange={(e) => setNewExpense({...newExpense, paymentMode: e.target.value})}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    rows="2" placeholder="e.g. Changed 2 front tyres"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-indigo-600 text-slate-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseLedger;

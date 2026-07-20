import { useState, useEffect } from 'react';
import api from '../api/axios';
import { IndianRupee, TrendingUp, TrendingDown, Calendar as CalendarIcon, Download, Filter, Search } from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Finances = () => {
    const [summary, setSummary] = useState(null);
    const [periodSummary, setPeriodSummary] = useState(null);
    const [yearlyTrend, setYearlyTrend] = useState([]);
    const [expenseBreakdown, setExpenseBreakdown] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [vehicleProfit, setVehicleProfit] = useState([]);
    const [driverSalaries, setDriverSalaries] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [period, setPeriod] = useState('monthly');
    
    const [reportPeriod, setReportPeriod] = useState('monthly');
    const [reportVehicleId, setReportVehicleId] = useState('');
    const [customReportData, setCustomReportData] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [customers, setCustomers] = useState([]);

    // Customer Payment State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState(null);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'CASH',
        referenceNumber: '',
        remarks: ''
    });

    const COLORS = ['#D8621C', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    const tabs = ['Dashboard', 'Vehicle-wise', 'Expense Breakdown', 'Driver & Salary', 'Documents', 'Customer Ledger'];

    useEffect(() => {
        const fetchFinances = async () => {
            try {
                const [summaryRes, periodRes, trendRes, breakdownRes, kpisRes, vpRes, dsRes, docRes] = await Promise.all([
                    api.get('/finances/summary'),
                    api.get(`/finances/period-summary?period=${period}`),
                    api.get('/finances/yearly-trend'),
                    api.get('/finances/expense-breakdown'),
                    api.get('/finances/kpis'),
                    api.get('/finances/vehicle-profit'),
                    api.get('/finances/driver-salaries'),
                    api.get('/finances/documents')
                ]);
                setSummary(summaryRes.data);
                setPeriodSummary(periodRes.data);
                setYearlyTrend(trendRes.data);
                setVehicleProfit(vpRes.data);
                setDriverSalaries(dsRes.data);
                setDocuments(docRes.data);
                
                // Format expense breakdown for Recharts
                const formattedBreakdown = Object.entries(breakdownRes.data).map(([name, value]) => ({
                    name, value
                }));
                setExpenseBreakdown(formattedBreakdown);
                setKpis(kpisRes.data);
            } catch (error) {
                console.error("Error fetching finance data", error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchVehicles = async () => {
            try {
                const res = await api.get('/vehicles');
                setVehicles(res.data);
            } catch (err) {
                console.error("Error fetching vehicles", err);
            }
        };
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                setCustomers(res.data);
            } catch (err) {
                console.error("Error fetching customers", err);
            }
        };
        fetchFinances();
        fetchVehicles();
        fetchCustomers();
    }, [period]);

    useEffect(() => {
        const fetchCustomReport = async () => {
            try {
                let url = `/finances/custom-vehicle-report?period=${reportPeriod}`;
                if (reportVehicleId) {
                    url += `&vehicleId=${reportVehicleId}`;
                }
                const res = await api.get(url);
                setCustomReportData(res.data);
            } catch (error) {
                console.error("Error fetching custom vehicle report", error);
            }
        };
        fetchCustomReport();
    }, [reportPeriod, reportVehicleId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const handleExportExcel = async () => {
        try {
            const response = await api.get('/finances/export', {
                responseType: 'blob', // Important for file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'overall_financial_report.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error exporting report", error);
            alert("Failed to export report");
        }
    };

    const renderCustomerLedger = () => {
        const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8621C]/5 rounded-bl-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-[#D8621C]" />
                                Customer Outstanding Ledger
                            </h2>
                            <p className="text-slate-500 dark:text-gray-400 text-sm">Track pending payments from all your customers</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-[#151515] px-6 py-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                            <div className="text-slate-500 dark:text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Total Market Pending</div>
                            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalOutstanding)}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 dark:bg-[#151515] text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-[#2A2A2A]">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Customer Name</th>
                                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                                    <th className="px-6 py-4 font-semibold text-right">Outstanding Balance</th>
                                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {customers.length > 0 ? customers.map(c => (
                                    <tr key={c.id} className="hover:bg-[#1A1A1A] transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                                            <div>{c.mobile || '-'}</div>
                                            {c.gstNumber && <div className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">GST: {c.gstNumber}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${c.outstandingBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {formatCurrency(c.outstandingBalance || 0)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCustomerForPayment(c);
                                                    setPaymentForm({
                                                        amount: '',
                                                        paymentDate: new Date().toISOString().split('T')[0],
                                                        paymentMode: 'CASH',
                                                        referenceNumber: '',
                                                        remarks: ''
                                                    });
                                                    setIsPaymentModalOpen(true);
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-slate-900 dark:text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                                            >
                                                + Add Payment
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-gray-500">
                                            No customers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingPayment(true);
        try {
            await api.post(`/customers/${selectedCustomerForPayment.id}/payments`, {
                amount: parseFloat(paymentForm.amount),
                paymentDate: paymentForm.paymentDate,
                paymentMode: paymentForm.paymentMode,
                referenceNumber: paymentForm.referenceNumber,
                remarks: paymentForm.remarks
            });
            // Refresh customers to update balances
            const res = await api.get('/customers');
            setCustomers(res.data);
            setIsPaymentModalOpen(false);
            alert("Payment recorded successfully!");
        } catch (error) {
            console.error("Error submitting payment", error);
            alert("Failed to record payment");
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8621C]"></div>
            </div>
        );
    }

    const todayString = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

    const renderDashboard = () => (
        <>
            {/* Header / Date Selector */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-slate-900 dark:text-white font-bold text-lg">Financial Dashboard</h2>
                    <div className="text-slate-500 dark:text-gray-500 text-sm mt-1">Today - {todayString}</div>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#D8621C]"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="all_time">All Time (Overall)</option>
                    </select>
                    <button 
                        onClick={handleExportExcel}
                        className="flex items-center px-4 py-2 bg-[#D8621C] text-slate-900 dark:text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/20 hover:bg-[#c25617]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel Report
                    </button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Row 1 */}
                <div className="stripe-card p-5 border-l-2 border-l-[#D8621C]">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Today's Income</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(kpis?.todayIncome)}</div>
                </div>
                <div className="stripe-card p-5 border-l-2 border-l-[#EF4444]">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Today's Expense</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(kpis?.todayExpense)}</div>
                </div>
                <div className="stripe-card p-5 border-l-2 border-l-[#10B981]">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Today's Profit</div>
                    <div className="text-2xl font-bold text-[#10B981]">{formatCurrency(kpis?.todayProfit)}</div>
                </div>
                <div className="stripe-card p-5 border-l-2 border-l-blue-500">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Vehicles Active</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpis?.activeTrips || 0}</div>
                </div>

                {/* Row 2 */}
                <div className="stripe-card p-5 bg-white dark:bg-[#1C1C1C]">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{period === 'all_time' ? 'Overall' : period} Income</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(periodSummary?.totalIncome)}</div>
                </div>
                <div className="stripe-card p-5 bg-white dark:bg-[#1C1C1C]">
                    <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{period === 'all_time' ? 'Overall' : period} Expense</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(periodSummary?.totalExpense)}</div>
                </div>
                <div className="stripe-card p-5 bg-white dark:bg-[#1C1C1C] border border-[#10B981]/30">
                    <div className="text-[#10B981] text-[10px] font-bold uppercase tracking-wider mb-2">{period === 'all_time' ? 'Overall' : period} Net Profit</div>
                    <div className="text-2xl font-bold text-[#10B981]">{formatCurrency(periodSummary?.netProfit)}</div>
                </div>
                <div className="stripe-card p-5 bg-white dark:bg-[#1C1C1C] border border-[#D8621C]/30">
                    <div className="text-[#D8621C] text-[10px] font-bold uppercase tracking-wider mb-2">{period === 'all_time' ? 'Overall' : period} Diesel Spend</div>
                    <div className="text-2xl font-bold text-[#D8621C]">{formatCurrency(periodSummary?.dieselSpend)}</div>
                </div>
                {period === 'all_time' && (
                    <div className="stripe-card p-5 bg-white dark:bg-[#1C1C1C] border border-[#8B5CF6]/30">
                        <div className="text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider mb-2">Total Investment</div>
                        <div className="text-2xl font-bold text-[#8B5CF6]">{formatCurrency(periodSummary?.totalInvestment)}</div>
                    </div>
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar/Line Chart */}
                <div className="stripe-card p-6 lg:col-span-2">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Income vs Expense - 2025</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yearlyTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2A" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                                <RechartsTooltip 
                                    cursor={{fill: '#2A2A2A'}}
                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#E5E7EB' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="income" name="Income" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="stripe-card p-6">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Expense Split</h3>
                    <div className="h-[300px] w-full relative flex items-center justify-center">
                        {expenseBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdown}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {expenseBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500 dark:text-gray-500 text-sm">No expenses recorded</div>
                        )}
                        {/* Center Text */}
                        {expenseBreakdown.length > 0 && (
                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total</div>
                                <div className="text-slate-900 dark:text-white font-bold text-xl">
                                    {formatCurrency(expenseBreakdown.reduce((sum, item) => sum + item.value, 0))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    const renderVehicleWise = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-slate-900 dark:text-white font-bold text-lg">Detailed Vehicle Profit & Loss</h2>
                <div className="flex flex-col md:flex-row gap-3">
                    <select 
                        value={reportPeriod}
                        onChange={(e) => setReportPeriod(e.target.value)}
                        className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#D8621C]"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="all_time">All Time</option>
                    </select>
                    <select 
                        value={reportVehicleId}
                        onChange={(e) => setReportVehicleId(e.target.value)}
                        className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#D8621C]"
                    >
                        <option value="">All Vehicles</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.type})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {customReportData.map((v, i) => (
                    <div key={i} className="bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D8621C]/10 to-transparent rounded-bl-full pointer-events-none"></div>
                        
                        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-[#2A2A2A] pb-4">
                            <div>
                                <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Vehicle</div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-xl">{v.vehicleNumber}</h3>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${v.netProfit >= 0 ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {v.netProfit >= 0 ? 'PROFIT' : 'LOSS'}
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Revenue */}
                            <div className="flex justify-between items-center bg-[#1A1A1A] p-3 rounded-lg border border-slate-200 dark:border-[#2A2A2A]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-slate-600 dark:text-gray-300 text-sm font-medium">Trip Revenue</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(v.revenue)}</span>
                            </div>

                            {/* Expenses List */}
                            <div className="pl-4 border-l-2 border-slate-200 dark:border-[#2A2A2A] space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-gray-500 text-sm">Diesel Cost</span>
                                    <span className="text-red-400 font-medium">-{formatCurrency(v.dieselCost)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-gray-500 text-sm">Driver Salary</span>
                                    <span className="text-red-400 font-medium">-{formatCurrency(v.driverSalary)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-gray-500 text-sm">Food & Bata</span>
                                    <span className="text-red-400 font-medium">-{formatCurrency(v.foodCost)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-gray-500 text-sm">Maintenance</span>
                                    <span className="text-red-400 font-medium">-{formatCurrency(v.maintenanceCost)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 dark:text-gray-500 text-sm">Other Exp / Materials</span>
                                    <span className="text-red-400 font-medium">-{formatCurrency(v.otherExpenses)}</span>
                                </div>
                            </div>
                            
                            {/* Total Expenses */}
                            <div className="flex justify-between items-center bg-[#1A1A1A] p-3 rounded-lg border border-slate-200 dark:border-[#2A2A2A]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-slate-600 dark:text-gray-300 text-sm font-medium">Total Expenses</span>
                                </div>
                                <span className="text-red-400 font-bold">-{formatCurrency(v.totalExpense)}</span>
                            </div>
                        </div>

                        {/* Net Profit */}
                        <div className={`mt-auto pt-4 border-t border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center`}>
                            <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Net Profit</span>
                            <span className={`text-2xl font-black ${v.netProfit >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                                {formatCurrency(v.netProfit)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {customReportData.length === 0 && (
                <div className="text-center text-slate-500 dark:text-gray-500 py-10 bg-slate-100 dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-[#2A2A2A]">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="text-lg font-medium text-slate-500 dark:text-gray-400">No data found</div>
                    <div className="text-sm mt-1">Try selecting a different timeframe or vehicle.</div>
                </div>
            )}
        </div>
    );

    const renderExpenseBreakdown = () => (
        <div className="space-y-6">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Detailed Expense Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart Duplicate */}
                <div className="stripe-card p-6">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Expense Split</h3>
                    <div className="h-[300px] w-full relative flex items-center justify-center">
                        {expenseBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdown}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {expenseBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500 dark:text-gray-500 text-sm">No expenses recorded</div>
                        )}
                        {/* Center Text */}
                        {expenseBreakdown.length > 0 && (
                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <div className="text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total</div>
                                <div className="text-slate-900 dark:text-white font-bold text-xl">
                                    {formatCurrency(expenseBreakdown.reduce((sum, item) => sum + item.value, 0))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* List View */}
                <div className="stripe-card p-6">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-6">Category Totals</h3>
                    <div className="space-y-4">
                        {expenseBreakdown.sort((a,b) => b.value - a.value).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-slate-600 dark:text-gray-300 font-medium">{item.name}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(item.value)}</span>
                            </div>
                        ))}
                        {expenseBreakdown.length === 0 && <div className="text-center text-slate-500 dark:text-gray-500 py-10">No expenses recorded.</div>}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDriverSalary = () => (
        <div className="space-y-6">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Driver Salaries & Payouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {driverSalaries.map((d, i) => (
                    <div key={i} className="stripe-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-semibold text-lg">{d.driverName}</h3>
                                <p className="text-slate-500 dark:text-gray-500 text-xs mt-1">{d.mobile}</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold">
                                {d.totalTrips} Trips
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            <div className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg border border-slate-200 dark:border-[#2A2A2A]">
                                <span className="text-slate-500 dark:text-gray-400 text-sm">Total Salary Paid</span>
                                <span className="text-[#10B981] font-bold text-lg">{formatCurrency(d.totalSalaryPaid)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {driverSalaries.length === 0 && <div className="text-center text-slate-500 dark:text-gray-500 py-10">No driver salary data available.</div>}
        </div>
    );

    const renderDocuments = () => (
        <div className="space-y-6">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Uploaded Bills & Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, i) => (
                    <div key={i} className="stripe-card p-0 overflow-hidden flex flex-col">
                        <div className="p-4 bg-[#1A1A1A] border-b border-slate-200 dark:border-[#2A2A2A]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-slate-900 dark:text-white font-medium">{doc.expenseType}</span>
                                <span className="text-[#D8621C] font-bold">{formatCurrency(doc.amount)}</span>
                            </div>
                            <div className="text-slate-500 dark:text-gray-500 text-xs">
                                {new Date(doc.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-[#121212] flex-1 flex items-center justify-center min-h-[200px]">
                            {doc.billUrl?.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                <img src={doc.billUrl} alt="Bill Document" className="max-h-full max-w-full rounded shadow-md border border-slate-200 dark:border-[#2A2A2A]" />
                            ) : (
                                <a href={doc.billUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center text-blue-500 hover:text-blue-400 transition-colors">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <span className="font-medium">View Document</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {documents.length === 0 && <div className="text-center text-slate-500 dark:text-gray-500 py-10">No bills or documents uploaded yet.</div>}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#121212]">
            
            {/* Top Sub-Navbar */}
            <div className="flex items-center px-8 border-b border-slate-200 dark:border-[#2A2A2A] bg-[#1A1A1A]">
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-all ${
                            activeTab === tab 
                            ? 'border-[#D8621C] text-[#D8621C]' 
                            : 'border-transparent text-slate-900 dark:text-white hover:text-[#D8621C]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-8 w-full mx-auto space-y-6 w-full flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'Dashboard' && renderDashboard()}
                {activeTab === 'Vehicle-wise' && renderVehicleWise()}
                {activeTab === 'Expense Breakdown' && renderExpenseBreakdown()}
                {activeTab === 'Driver & Salary' && renderDriverSalary()}
                {activeTab === 'Documents' && renderDocuments()}
                {activeTab === 'Customer Ledger' && renderCustomerLedger()}
            </div>
            
            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-5 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-100 dark:bg-[#151515] rounded-t-2xl">
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Record Payment</h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">✕</button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Customer</label>
                                <div className="bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                                    {selectedCustomerForPayment?.name}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Date</label>
                                    <input type="date" required className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500" value={paymentForm.paymentDate} onChange={e => setPaymentForm({...paymentForm, paymentDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Amount (Rs)</label>
                                    <input type="number" required placeholder="0" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Mode</label>
                                    <select className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500" value={paymentForm.paymentMode} onChange={e => setPaymentForm({...paymentForm, paymentMode: e.target.value})}>
                                        <option value="CASH">CASH</option>
                                        <option value="BANK_TRANSFER">BANK TRANSFER</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Ref No (Optional)</label>
                                    <input type="text" placeholder="e.g. UTR or Cheque No" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500" value={paymentForm.referenceNumber} onChange={e => setPaymentForm({...paymentForm, referenceNumber: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Remarks</label>
                                <textarea rows="2" className="w-full bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-green-500" value={paymentForm.remarks} onChange={e => setPaymentForm({...paymentForm, remarks: e.target.value})}></textarea>
                            </div>
                            <button type="submit" disabled={isSubmittingPayment} className="w-full bg-green-600 hover:bg-green-700 text-slate-900 dark:text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2">
                                {isSubmittingPayment ? 'Saving...' : 'Save Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finances;

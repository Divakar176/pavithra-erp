import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { generatePnLReport } from '../utils/pdfGenerator';
import { PieChart, Download, Calendar as CalendarIcon, TrendingUp, IndianRupee, Truck, FileText } from 'lucide-react';

const Reports = () => {
    const [kpis, setKpis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('This Month');

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                // In a real application, you would pass start/end dates to the backend based on `dateRange`
                // For now, we fetch the default KPIs which represent the current month's data.
                const res = await api.get('/finances/kpis');
                setKpis(res.data);
            } catch (error) {
                console.error("Error fetching KPIs for reports:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchKpis();
    }, [dateRange]);

    const handleDownloadReport = () => {
        if (!kpis) return;
        generatePnLReport(kpis, dateRange);
    };

    if (isLoading) {
        return <div className="p-6 text-[#A0A0A0]">Loading reports...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reports & Analytics</h1>
                    <p className="text-[#A0A0A0]">Generate financial reports and export to PDF</p>
                </div>
                
                <button
                    onClick={handleDownloadReport}
                    className="flex items-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-slate-900 dark:text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-lg shadow-[#10B981]/20"
                >
                    <Download size={20} />
                    <span>Export P&L PDF</span>
                </button>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] mb-8">
                <div className="flex items-center space-x-4 mb-6">
                    <CalendarIcon className="text-[#D8621C]" />
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-[#222222] text-slate-900 dark:text-white border border-[#333] px-4 py-2 rounded-lg focus:outline-none focus:border-[#D8621C]"
                    >
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="This Quarter">This Quarter</option>
                        <option value="This Year">This Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-[#222222] border border-[#333] p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                                <IndianRupee size={24} />
                            </div>
                            <span className="text-sm font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">+12.5%</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹{kpis?.totalRevenue?.toLocaleString() || 0}</h3>
                    </div>

                    {/* Total Expenses */}
                    <div className="bg-[#222222] border border-[#333] p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-sm font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">-2.4%</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                            ₹{((kpis?.totalFuelCost || 0) + (kpis?.totalDriverSalary || 0) + (kpis?.totalMaintenance || 0)).toLocaleString()}
                        </h3>
                    </div>

                    {/* Net Profit */}
                    <div className="bg-[#222222] border border-[#333] p-6 rounded-xl ring-1 ring-[#D8621C]/50 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D8621C]/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-[#D8621C]/20 flex items-center justify-center text-[#D8621C]">
                                <PieChart size={24} />
                            </div>
                        </div>
                        <p className="text-[#D8621C] text-sm font-bold mb-1 relative z-10">Net Profit</p>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white relative z-10">₹{kpis?.netProfit?.toLocaleString() || 0}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Previews or Other Reports */}
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                        <FileText className="mr-2 text-[#D8621C]" size={20} /> Available Reports
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#222222] rounded-xl border border-[#333]">
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-medium">Profit & Loss Statement</h4>
                                <p className="text-sm text-slate-500 dark:text-gray-500">Summary of all income and expenses</p>
                            </div>
                            <button onClick={handleDownloadReport} className="p-2 text-[#A0A0A0] hover:text-[#10B981] transition-colors">
                                <Download size={20} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#222222] rounded-xl border border-[#333] opacity-50">
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-medium">Driver Performance Report</h4>
                                <p className="text-sm text-slate-500 dark:text-gray-500">Detailed stats on driver trips (Coming Soon)</p>
                            </div>
                            <button disabled className="p-2 text-[#A0A0A0]">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                        <Truck className="mr-2 text-blue-500" size={20} /> Vehicle Health Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#222222] rounded-xl border border-[#333] opacity-50">
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-medium">Fleet Maintenance Logs</h4>
                                <p className="text-sm text-slate-500 dark:text-gray-500">Summary of recent services (Coming Soon)</p>
                            </div>
                            <button disabled className="p-2 text-[#A0A0A0]">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

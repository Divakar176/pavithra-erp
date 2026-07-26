import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Printer, ChevronLeft, Building2, CheckSquare, Square } from 'lucide-react';

const Billing = () => {
    const [customers, setCustomers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedTrips, setSelectedTrips] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [invoiceMode, setInvoiceMode] = useState(false);
    
    // Invoice details
    const [invoiceNo] = useState(`INV-${new Date().getTime().toString().slice(-6)}`);
    const [invoiceDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [custRes, tripRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/trips')
                ]);
                setCustomers(custRes.data || []);
                // Filter to only show COMPLETED trips if needed. For now show all.
                setTrips((tripRes.data || []).sort((a,b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate)));
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleCustomerChange = (e) => {
        setSelectedCustomerId(e.target.value);
        setSelectedTrips(new Set());
    };

    const toggleTripSelection = (tripId) => {
        const newSet = new Set(selectedTrips);
        if (newSet.has(tripId)) {
            newSet.delete(tripId);
        } else {
            newSet.add(tripId);
        }
        setSelectedTrips(newSet);
    };

    const handleSelectAll = (customerTrips) => {
        if (selectedTrips.size === customerTrips.length) {
            setSelectedTrips(new Set());
        } else {
            setSelectedTrips(new Set(customerTrips.map(t => t.id)));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const customerTrips = trips.filter(t => t.customer && t.customer.id.toString() === selectedCustomerId.toString());
    const tripsToBill = trips.filter(t => selectedTrips.has(t.id));
    
    const subtotal = tripsToBill.reduce((sum, t) => sum + (t.tripCharges || 0), 0);
    const taxRate = 0.05; // 5% GST
    const gstAmount = subtotal * taxRate;
    const grandTotal = subtotal + gstAmount;
    
    const selectedCustomerDetails = customers.find(c => c.id.toString() === selectedCustomerId.toString());

    if (invoiceMode) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center print:p-0 print:bg-white print:block">
                
                {/* Non-printable action bar */}
                <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 print:hidden">
                    <button 
                        onClick={() => setInvoiceMode(false)}
                        className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm font-semibold transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Selection
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center bg-indigo-600 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 font-bold transition-all"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
                    </button>
                </div>

                {/* Printable A4 Page */}
                <div className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-12 print:p-0 relative text-gray-900">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-indigo-900 uppercase">Pavithra<br/><span className="text-orange-500">Enterprises</span></h1>
                            <p className="text-sm text-slate-500 dark:text-gray-500 font-semibold mt-2">Transport & Logistics Management</p>
                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">123 Logistics Park, Highway Road<br/>Coimbatore, Tamil Nadu 641001</p>
                            <p className="text-xs font-bold text-gray-700 mt-1">GSTIN: <span className="font-mono">33ABCDE1234F1Z5</span></p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-gray-200 uppercase tracking-widest">INVOICE</h2>
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <span className="text-slate-500 dark:text-gray-500 font-semibold text-right">Invoice No:</span>
                                <span className="font-bold text-gray-900 text-left">#{invoiceNo}</span>
                                <span className="text-slate-500 dark:text-gray-500 font-semibold text-right">Date:</span>
                                <span className="font-bold text-gray-900 text-left">{new Date(invoiceDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                                <span className="text-slate-500 dark:text-gray-500 font-semibold text-right">Due Date:</span>
                                <span className="font-bold text-gray-900 text-left">Immediate</span>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="mb-10">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
                        <h4 className="text-xl font-bold text-gray-900">{selectedCustomerDetails?.name}</h4>
                        {selectedCustomerDetails?.address && (
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap max-w-xs">{selectedCustomerDetails.address}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Phone: {selectedCustomerDetails?.phone}</p>
                        {selectedCustomerDetails?.gstNumber && (
                            <p className="text-sm font-bold text-gray-700 mt-1">GSTIN: <span className="font-mono">{selectedCustomerDetails.gstNumber !== 'TEMP-GST' ? selectedCustomerDetails.gstNumber : 'N/A'}</span></p>
                        )}
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-left border-collapse mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-900 text-gray-900 text-xs uppercase tracking-wider font-bold">
                                <th className="py-3 px-2">Date</th>
                                <th className="py-3 px-2">Vehicle</th>
                                <th className="py-3 px-2">Route / Material</th>
                                <th className="py-3 px-2 text-right">Weight/Qty</th>
                                <th className="py-3 px-2 text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tripsToBill.map(trip => (
                                <tr key={trip.id} className="text-sm text-gray-800">
                                    <td className="py-4 px-2 whitespace-nowrap">{new Date(trip.startDate || trip.createdAt).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</td>
                                    <td className="py-4 px-2 font-bold text-gray-900">{trip.vehicle?.vehicleNumber}</td>
                                    <td className="py-4 px-2">
                                        <div className="font-semibold text-gray-900">{trip.source} {trip.destination ? `→ ${trip.destination}` : ''}</div>
                                        {trip.material && <div className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{trip.material}</div>}
                                    </td>
                                    <td className="py-4 px-2 text-right">{trip.loadWeight ? `${trip.loadWeight} Tons` : (trip.totalHours ? `${(Math.round(parseFloat(trip.totalHours) * 10) / 10)} Hrs` : '-')}</td>
                                    <td className="py-4 px-2 text-right font-semibold">{(trip.tripCharges || 0).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-72 bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-600 font-semibold">Subtotal</span>
                                <span className="text-sm font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-600 font-semibold">GST (5%)</span>
                                <span className="text-sm font-bold text-gray-900">₹{gstAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="pt-3 border-t-2 border-gray-900 flex justify-between items-center">
                                <span className="font-black text-gray-900 uppercase">Grand Total</span>
                                <span className="font-black text-indigo-600 text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-12 left-12 right-12 border-t border-gray-200 pt-8 flex justify-between items-end">
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">Bank Details</h4>
                            <p className="text-xs text-gray-600">Bank: HDFC Bank Ltd</p>
                            <p className="text-xs text-gray-600">A/C Name: Pavithra Enterprises</p>
                            <p className="text-xs text-gray-600">A/C No: 50200012345678</p>
                            <p className="text-xs text-gray-600">IFSC: HDFC0001234</p>
                        </div>
                        <div className="text-center">
                            <div className="h-16 w-48 border-b border-gray-300 mb-2"></div>
                            <p className="text-xs font-bold text-gray-900 uppercase">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-center text-slate-500 dark:text-gray-500">Loading Billing Data...</div>;
    }

    return (
        <div className="p-8 animate-fade-in w-full mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-200 tracking-tight">Billing & Invoices</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">Select trips and generate professional PDF invoices</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        disabled={selectedTrips.size === 0}
                        onClick={() => setInvoiceMode(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center"
                    >
                        <FileText className="w-4 h-4 mr-2" /> Generate Invoice ({selectedTrips.size})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                
                {/* Left Panel: Customer Selection */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
                        <label className="block text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-3">Select Customer</label>
                        <div className="relative">
                            <select 
                                value={selectedCustomerId}
                                onChange={handleCustomerChange}
                                className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-3 text-slate-900 dark:text-gray-200 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                            >
                                <option value="">-- Choose Customer --</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Building2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                    
                    {selectedCustomerId && selectedCustomerDetails && (
                        <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-4">Customer Details</h3>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{selectedCustomerDetails.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">{selectedCustomerDetails.phone}</p>
                            <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                <span className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-bold block mb-1">Total Trips Found</span>
                                <span className="text-xl font-black text-indigo-400">{customerTrips.length}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Trip Selection */}
                <div className="lg:col-span-3 flex flex-col bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl shadow-sm overflow-hidden relative">
                    {!selectedCustomerId ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-slate-500 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Customer Selected</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-500 mt-2">Please choose a customer from the left to view their billable trips.</p>
                        </div>
                    ) : customerTrips.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Trips Found</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-500 mt-2">This customer has no recorded trips yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-slate-200 dark:border-[#2A2A2A] bg-slate-50 dark:bg-[#1A1A1A] flex justify-between items-center sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handleSelectAll(customerTrips)}
                                        className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
                                    >
                                        {selectedTrips.size === customerTrips.length ? (
                                            <CheckSquare className="w-5 h-5 text-indigo-500" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                        Select All
                                    </button>
                                </div>
                                <div className="text-sm text-slate-500 dark:text-gray-400 font-medium">
                                    <span className="text-slate-900 dark:text-white font-bold">{selectedTrips.size}</span> selected
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="grid gap-3">
                                    {customerTrips.map(trip => {
                                        const isSelected = selectedTrips.has(trip.id);
                                        return (
                                            <div 
                                                key={trip.id}
                                                onClick={() => toggleTripSelection(trip.id)}
                                                className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#2A2A2A] hover:border-gray-600'}`}
                                            >
                                                <div className="mr-4">
                                                    {isSelected ? (
                                                        <CheckSquare className="w-5 h-5 text-indigo-500" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-slate-500 dark:text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase mb-0.5">Date</p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-gray-200">{new Date(trip.startDate || trip.createdAt).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase mb-0.5">Vehicle</p>
                                                        <p className="text-sm font-bold text-orange-400">{trip.vehicle?.vehicleNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase mb-0.5">Route/Material</p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-gray-200 truncate">{trip.source} {trip.destination ? `→ ${trip.destination}` : ''}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase mb-0.5">Charges</p>
                                                        <p className="text-sm font-black text-indigo-400">₹{(trip.tripCharges || 0).toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Billing;

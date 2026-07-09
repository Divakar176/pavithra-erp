import { useState, useEffect } from 'react';
import { Printer, FileText, Download } from 'lucide-react';

const WeighmentSlip = () => {
    const [formData, setFormData] = useState({
        companyName: 'SHARA BRICKS & MINERALS PRIVATE LIMITED',
        material: 'M SAND',
        tokenNo: `S${new Date().getFullYear()}${Math.floor(Math.random() * 100000)}-26`,
        refNo: `SBM/631/26-27`,
        date: new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'2-digit', year:'numeric'}),
        inTime: '10:05 AM',
        outTime: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
        customer: 'PAVITHRA',
        vehicle: 'TN19BU1792',
        emptyWeight: '13330',
        loadWeight: '44970',
        paymentMode: 'Cash'
    });

    const netWeight = (parseFloat(formData.loadWeight || 0) - parseFloat(formData.emptyWeight || 0)).toFixed(2);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
        window.print();
    };

    // Google Font for Barcode
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <div className="p-8 animate-fade-in w-full mx-auto h-full flex flex-col print:p-0 print:bg-white print:block">
            <div className="flex justify-between items-center mb-8 shrink-0 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-200 tracking-tight">Documents & Slips</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Generate and print professional Weighment Slips instantly</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handlePrint}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Print Slip
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 print:block">
                
                {/* Left Panel: Edit Form (Hidden on Print) */}
                <div className="flex flex-col bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl shadow-sm overflow-hidden relative print:hidden">
                    <div className="p-5 border-b border-[#2A2A2A] bg-[#1A1A1A]">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-indigo-400" /> Slip Details
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5">
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Company Header</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material</label>
                                <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Token No</label>
                                <input type="text" name="tokenNo" value={formData.tokenNo} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ref No</label>
                                <input type="text" name="refNo" value={formData.refNo} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                                <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">In Time</label>
                                <input type="text" name="inTime" value={formData.inTime} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Out Time</label>
                                <input type="text" name="outTime" value={formData.outTime} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer</label>
                                <input type="text" name="customer" value={formData.customer} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vehicle</label>
                                <input type="text" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Empty (Kg)</label>
                                <input type="number" name="emptyWeight" value={formData.emptyWeight} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Load (Kg)</label>
                                <input type="number" name="loadWeight" value={formData.loadWeight} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment</label>
                                <input type="text" name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Panel: Live Receipt Preview (Visible on Print) */}
                <div className="flex justify-center items-start print:w-full print:justify-start">
                    <div className="bg-white text-black w-[350px] p-6 shadow-2xl print:shadow-none print:w-full print:max-w-[80mm] print:p-0 print:m-0 font-sans">
                        
                        <div className="text-center mb-6">
                            <div className="border-t-2 border-black mb-3"></div>
                            <h2 className="text-[16px] font-semibold leading-snug px-2 uppercase tracking-wide">{formData.companyName}</h2>
                            <h3 className="text-[14px] font-medium mt-4 tracking-wider">WEIGHMENT SLIP</h3>
                        </div>

                        <div className="text-center mb-4 overflow-hidden">
                            {/* Barcode Mock */}
                            <div className="flex justify-center w-full">
                                <p className="text-5xl my-2 tracking-widest" style={{fontFamily: "'Libre Barcode 39 Text', cursive", transform: "scaleX(1.2)"}}>{formData.tokenNo}</p>
                            </div>
                            
                            <h3 className="text-xl font-black tracking-[0.25em] uppercase mt-4">【 {formData.material.split('').join(' ')} 】</h3>
                        </div>

                        <div className="space-y-4 text-[16px] font-medium px-4 mt-6">
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Token No</span>
                                <span>: {formData.tokenNo}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>RefNo</span>
                                <span>: {formData.refNo}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Date</span>
                                <span>: {formData.date}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>In Time</span>
                                <span>: {formData.inTime}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Out Time</span>
                                <span>: {formData.outTime}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start mt-6">
                                <span>Customer</span>
                                <span>: {formData.customer}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Vehicle</span>
                                <span>: {formData.vehicle}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start mt-6">
                                <span>Empty</span>
                                <span>: {parseFloat(formData.emptyWeight || 0).toFixed(2)}Kg</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Load</span>
                                <span>: {parseFloat(formData.loadWeight || 0).toFixed(2)}Kg</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start mt-6">
                                <span>Net Weight</span>
                                <span>: {netWeight}Kg</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start mt-6">
                                <span>Payment</span>
                                <span>: {formData.paymentMode}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeighmentSlip;

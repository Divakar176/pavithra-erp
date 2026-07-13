import { useState, useEffect } from 'react';
import { Printer, FileText, MessageCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PaymentReceipt = () => {
    const [formData, setFormData] = useState({
        companyName: 'SHARA BRICKS & MINERALS PRIVATE LIMITED',
        receiptNo: `PR-${new Date().getFullYear()}${Math.floor(Math.random() * 100000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customer: '',
        material: 'M SAND',
        amount: '0',
        paymentMode: 'Cash',
        remarks: 'Advance Payment'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShareWhatsApp = async () => {
        const receiptElement = document.getElementById('receipt-preview');
        if (!receiptElement) return;

        try {
            // Temporarily reset scroll to fix html2canvas cropping bug
            window.scrollTo(0, 0);
            
            const canvas = await html2canvas(receiptElement, { 
                scale: 2,
                useCORS: true,
                scrollY: 0,
                scrollX: 0
            });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, (canvas.height * 80) / canvas.width]
            });
            pdf.addImage(imgData, 'JPEG', 0, 0, 80, (canvas.height * 80) / canvas.width);
            
            const pdfBlob = pdf.output('blob');
            const pdfFile = new File([pdfBlob], `${formData.receiptNo}-receipt.pdf`, { type: 'application/pdf' });

            if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                await navigator.share({
                    files: [pdfFile],
                    title: 'Payment Receipt',
                    text: `Hello ${formData.customer}, here is your payment receipt for Rs.${formData.amount}.`,
                });
            } else {
                pdf.save(`${formData.receiptNo}-receipt.pdf`);
                const waUrl = `https://wa.me/?text=Hello ${formData.customer}, please find the attached Payment Receipt (${formData.receiptNo}) for Rs.${formData.amount}.`;
                window.open(waUrl, '_blank');
            }
        } catch (error) {
            console.error("Error sharing to WhatsApp:", error);
            alert("Failed to share receipt. Please try printing instead.");
        }
    };

    return (
        <div className="p-8 animate-fade-in w-full mx-auto h-full flex flex-col print:p-0 print:bg-white print:block">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 print:hidden">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Payment Receipts</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Generate and share professional payment receipts instantly</p>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                    <button onClick={handleShareWhatsApp}
                        className="w-full md:w-auto justify-center bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center"
                    >
                        <MessageCircle className="w-4 h-4 mr-2 fill-current" /> Share on WhatsApp
                    </button>
                    <button
                        onClick={handlePrint}
                        className="w-full md:w-auto justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Print Receipt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 print:block">

                {/* Left Panel: Edit Form (Hidden on Print) */}
                <div className="flex flex-col bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl shadow-sm overflow-hidden relative print:hidden">
                    <div className="p-5 border-b border-[#2A2A2A] bg-[#1A1A1A]">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-indigo-400" /> Receipt Details
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Company Header</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Receipt No</label>
                                <input type="text" name="receiptNo" value={formData.receiptNo} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material</label>
                                <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                                <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time</label>
                                <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer Name</label>
                            <input type="text" name="customer" value={formData.customer} onChange={handleChange} placeholder="e.g. John Doe" className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount Paid (₹)</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Mode</label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500">
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Remarks</label>
                            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Live Receipt Preview (Visible on Print) */}
                <div className="flex justify-center items-start print:w-full print:justify-start w-full overflow-x-auto pb-4">
                    <div id="receipt-preview" className="bg-white text-black w-full min-w-[300px] max-w-[350px] p-4 sm:p-6 shadow-2xl print:shadow-none print:w-full print:max-w-[80mm] print:p-0 print:m-0 font-sans mx-auto">

                        <div className="text-center mb-6">
                            <div className="border-t-2 border-black mb-3"></div>
                            <h2 className="text-[16px] font-semibold leading-snug px-2 uppercase tracking-wide">{formData.companyName}</h2>
                            <h3 className="text-[14px] font-medium mt-4 tracking-wider">PAYMENT RECEIPT</h3>
                        </div>

                        <div className="text-center mb-4 border-b-2 border-black pb-4 border-dashed">
                            <h3 className="text-xl font-black uppercase mt-2">{formData.customer || 'Customer Name'}</h3>
                            <p className="text-sm font-bold text-gray-600 uppercase mt-1 tracking-widest">{formData.material}</p>
                        </div>

                        <div className="space-y-4 text-[16px] font-medium px-4 mt-6">
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Receipt No</span>
                                <span>: {formData.receiptNo}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Date</span>
                                <span>: {formData.date}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Time</span>
                                <span>: {formData.time}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start mt-6">
                                <span>Mode</span>
                                <span className="uppercase">: {formData.paymentMode}</span>
                            </div>
                            <div className="grid grid-cols-[110px_auto] items-start">
                                <span>Remarks</span>
                                <span>: {formData.remarks}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t-2 border-black text-center">
                            <p className="text-sm uppercase font-bold text-gray-500 mb-1">Amount Received</p>
                            <p className="text-3xl font-black tracking-tighter">₹ {parseFloat(formData.amount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="text-center mt-8 pb-4">
                            <p className="text-xs font-semibold tracking-wider uppercase text-gray-500">Authorized Signatory</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentReceipt;

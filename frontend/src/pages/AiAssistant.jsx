import { useState } from 'react';
import { Bot, UploadCloud, AlertTriangle, CheckCircle, Search, Sparkles, FileText, ArrowRight } from 'lucide-react';

const AiAssistant = () => {
    const [query, setQuery] = useState('');
    const [biResponse, setBiResponse] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleAskAI = (e) => {
        e.preventDefault();
        if (!query) return;
        
        setIsThinking(true);
        setTimeout(() => {
            if (query.toLowerCase().includes('profitable')) {
                setBiResponse("Based on historical trip data, the Chennai to Bangalore route yields the highest average net profit margin of 32%.");
            } else if (query.toLowerCase().includes('highest maintenance')) {
                setBiResponse("Vehicle TN 02 XY 9876 (JCB) has incurred the highest maintenance cost this quarter (₹45,000).");
            } else {
                setBiResponse("I analyzed your ERP data. Your fleet is operating at 85% efficiency this week. Fuel costs are down 3% compared to last month.");
            }
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="p-8 animate-fade-in w-full mx-auto">
            <div className="mb-8 flex items-center">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mr-5 shadow-sm">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Intelligence Hub</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-medium mt-1">OCR Receipt Scanning & AI Business Insights</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Chat / BI */}
                <div className="stripe-card p-8 flex flex-col h-[550px]">
                    <div className="flex items-center mb-6">
                        <Bot className="w-5 h-5 mr-3 text-indigo-600" />
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Ask Pavithra AI</h3>
                    </div>

                    <div className="flex-1 bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 mb-5 overflow-y-auto custom-scrollbar shadow-inner">
                        {biResponse ? (
                            <div className="flex items-start mb-4 animate-fade-in">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4 shrink-0 border border-gray-200 shadow-sm">
                                    <Bot className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-sm text-sm text-gray-700 border border-gray-200 shadow-sm font-medium leading-relaxed">
                                    {biResponse}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Bot className="w-8 h-8 text-slate-500 dark:text-gray-400" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-gray-500 max-w-xs">Ask me anything about your fleet, expenses, or profits.</p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 cursor-pointer hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all" onClick={() => setQuery('Which route is most profitable?')}>"Which route is most profitable?"</span>
                                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 cursor-pointer hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all" onClick={() => setQuery('Show highest maintenance cost')}>"Show highest maintenance cost"</span>
                                </div>
                            </div>
                        )}
                        {isThinking && (
                            <div className="flex items-center text-indigo-600 text-sm mt-5 font-bold animate-pulse">
                                <Sparkles className="w-4 h-4 mr-2" /> AI is analyzing your data...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleAskAI} className="relative z-10">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type your natural language query..." 
                            className="w-full pl-5 pr-14 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all shadow-sm font-medium placeholder-gray-400"
                        />
                        <button type="submit" disabled={isThinking} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-slate-900 dark:text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/20">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* OCR & Auditing */}
                <div className="stripe-card p-8">
                    <div className="flex items-center mb-6">
                        <UploadCloud className="w-5 h-5 mr-3 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Smart Receipt OCR & Audit</h3>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer mb-8 group bg-white">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-gray-900 text-base">Drag & Drop Invoice or Bill</p>
                        <p className="text-sm text-slate-500 dark:text-gray-500 mt-1 font-medium">Supports JPG, PNG, PDF</p>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-gray-500 mb-4 flex items-center tracking-wider uppercase">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" /> Recent AI Audit Log
                        </h4>
                        
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden mb-4 hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold px-2.5 py-1 bg-red-50 text-red-600 rounded-md uppercase tracking-wider">High Risk (Score: 85)</span>
                                <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">INV-HTL-901</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium mt-2 leading-relaxed">The expense amount (<span className="text-gray-900 font-bold">₹12,500</span>) exceeds the standard corporate allowance for Hotel stays. Vendor mismatch detected via OCR.</p>
                            <div className="mt-4 text-xs text-blue-600 font-bold cursor-pointer hover:text-blue-700 flex items-center">
                                Review Receipt Image <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md uppercase tracking-wider">Verified (Score: 12)</span>
                                <span className="text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">INV-IOCL-2023</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium mt-2 flex items-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" /> Perfect match with Indian Oil OCR data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;

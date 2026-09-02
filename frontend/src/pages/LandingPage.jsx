import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, BarChart3, Shield, Globe2, Zap, Activity } from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/20 overflow-x-hidden relative">
            {/* --- COMMERCIAL WHITE AI BACKGROUND MESH & LIGHT GLOWS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Ambient Soft Gradient Base */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(79,70,229,0.08),rgba(255,255,255,0))]"></div>

                {/* Tech Dot Matrix Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                {/* Luminous Soft Pastel Ambient Lighting */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-200/40 via-blue-100/30 to-transparent blur-[140px]"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-purple-200/40 via-indigo-100/30 to-transparent blur-[160px]"></div>
                <div className="absolute top-[35%] left-[50%] w-[35vw] h-[35vw] rounded-full bg-cyan-100/40 blur-[120px]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 relative flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
                            <Globe2 className="w-5 h-5 text-white z-10" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-widest uppercase">
                                PAVITHRA
                            </h1>
                            <p className="text-[9px] font-bold text-indigo-600 tracking-[0.25em] uppercase">AI Enterprise ERP</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#fleet" className="hover:text-indigo-600 transition-colors">Our Fleet</a>
                        <a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                            Client Login
                        </Link>
                        <Link 
                            to="/login" 
                            className="relative group px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-indigo-600 shadow-md transition-all duration-300 overflow-hidden flex items-center gap-2"
                        >
                            <span className="relative z-10 text-sm font-bold">Access Portal</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 pt-36 pb-24">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                                <span>AI Next-Gen Logistics OS</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
                                Master Your <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                    Transport Fleet
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                                Experience intelligent UI and neural control over your Lorries, JCBs, and enterprise logistics. Real-time GPS tracking, AI-driven predictive insights, and automated operations.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link 
                                    to="/login" 
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Enter AI Dashboard <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm transition-all">
                                    View Live Demo
                                </button>
                            </div>
                        </div>

                        {/* Showcase Image Panel */}
                        <div className="flex-1 relative w-full max-w-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/50 to-indigo-200/50 rounded-3xl blur-2xl"></div>
                            
                            {/* Main Commercial White Frame */}
                            <div className="relative z-10 bg-white border border-slate-200/80 rounded-3xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transform perspective-1000 rotate-y-[-3deg] rotate-x-[2deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                                <div className="relative rounded-2xl overflow-hidden group border border-slate-100 shadow-inner">
                                    <img 
                                        src="/fleet_banner_v2.jpg" 
                                        alt="Pavithra Enterprises Fleet" 
                                        className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="relative z-10 py-24 bg-white border-t border-slate-200/70">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-3">
                            <Activity className="w-3.5 h-3.5 text-indigo-600" />
                            <span>AI Intelligence Matrix</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Enterprise Grade AI Tools</h3>
                        <p className="text-slate-600 max-w-2xl mx-auto font-normal">Everything you need to manage hundreds of heavy vehicles, automated ledger calculation, and AI route optimization.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                                <Truck className="w-7 h-7 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-slate-900">Fleet AI Tracking</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Real-time GPS tracking for all your Lorries and JCBs. Monitor fuel levels, speed, and driver behavior with predictive telemetry.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                                <BarChart3 className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-slate-900">Automated Billing</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Generate GST compliant invoices, track ledgers, and manage payments with our seamless financial AI suite.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                                <Shield className="w-7 h-7 text-purple-600" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-slate-900">Bank-Grade Security</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Role-based access control, JWT authentication, and encrypted data vaults keep your enterprise logistics secure.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* --- CTA SECTION --- */}
            <section className="relative z-10 py-24 overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to upgrade your logistics with AI?</h2>
                    <p className="text-slate-300 mb-10 max-w-2xl mx-auto font-light">Join thousands of fleet operators managing their Lorries and JCBs with Pavithra ERP.</p>
                    <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-lg shadow-2xl hover:bg-indigo-50 hover:scale-105 transition-all duration-300 gap-3"
                    >
                        Access Secure AI Portal <ArrowRight className="w-6 h-6 text-indigo-600" />
                    </Link>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 bg-white py-8 text-center text-slate-500 text-sm">
                <p>&copy; 2026 Pavithra Enterprises Logistics & AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

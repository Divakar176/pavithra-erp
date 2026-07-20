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
        <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* --- MAGICAL BACKGROUND EFFECTS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Noise overlay for premium texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay"></div>
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
                <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-teal-500/10 blur-[100px] animate-[pulse_6s_ease-in-out_infinite]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030712]/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 relative flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all">
                            <Globe2 className="w-5 h-5 text-white z-10" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-widest uppercase">
                                PAVITHRA
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#fleet" className="hover:text-white transition-colors">Our Fleet</a>
                        <a href="#about" className="hover:text-white transition-colors">About Us</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            Client Login
                        </Link>
                        <Link 
                            to="/login" 
                            className="relative group px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden flex items-center gap-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 text-sm font-bold">Access Portal</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 pt-32 pb-20">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-fade-in-up">
                                <Zap className="w-3 h-3" />
                                <span>Next-Gen Logistics</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                                Master Your <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                                    Transport Fleet
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                                Experience magical UI and unparalleled control over your Lorries, JCBs, and enterprise logistics. Real-time tracking, AI-driven insights, and automated operations.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link 
                                    to="/login" 
                                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#030712] font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Enter Dashboard <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition-all">
                                    View Live Demo
                                </button>
                            </div>
                        </div>

                        {/* Magical Graphic / Glassmorphic Showcase */}
                        <div className="flex-1 relative w-full max-w-2xl">
                            {/* Floating elements backdrop */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
                            
                            {/* Main Glass Panel */}
                            <div className="relative z-10 bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                                <div className="relative rounded-2xl overflow-hidden group border border-white/5 shadow-2xl">
                                    {/* Custom Fleet Banner */}
                                    <img 
                                        src="/fleet_banner_v2.jpg" 
                                        alt="Pavithra Enterprises Fleet" 
                                        className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-1000"
                                    />
                                </div>

                        </div>
                    </div>
                </div>
            </div>
            </main>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="relative z-10 py-24 bg-[#050a15] border-t border-white/5">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-black mb-4">Enterprise Grade Tools</h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to manage hundreds of vehicles, track expenses, and automate your operations globally.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Truck className="w-7 h-7 text-blue-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Fleet Tracking</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">Real-time GPS tracking for all your Lorries and JCBs. Monitor fuel levels, speed, and driver behavior instantly.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Automated Billing</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">Generate GST compliant invoices, track ledgers, and manage payments with our seamless financial suite.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-purple-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Bank-Grade Security</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">Role-based access control, JWT authentication, and encrypted data vaults keep your enterprise safe.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* --- CTA SECTION --- */}
            <section className="relative z-10 py-24 overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 border-y border-blue-500/20 backdrop-blur-sm"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to upgrade your logistics?</h2>
                    <p className="text-blue-200 mb-10 max-w-2xl mx-auto">Join thousands of fleet operators managing their Lorries and JCBs with Pavithra ERP.</p>
                    <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 gap-3"
                    >
                        Access Secure Portal <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-[#030712] py-8 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Pavithra Enterprises Logistics. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

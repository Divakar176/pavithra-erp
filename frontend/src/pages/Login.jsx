import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Truck, Lock, User as UserIcon, Loader2, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/authenticate', { username, password });
            login(response.data);
            if (response.data.role === 'DRIVER') {
                navigate('/driver-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-[#030712] font-sans items-center justify-center relative overflow-hidden">
            {/* Background Graphic & Ambient Effects */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/premium_bg.png" 
                    alt="Premium ERP Background" 
                    className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite] opacity-60"
                />
                {/* Radial Gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030712]/60 to-[#030712]"></div>
                {/* Modern subtle grid overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Glowing orbs behind the form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

            {/* Centered Minimalist Login Form */}
            <div className="w-full max-w-[340px] flex flex-col justify-center items-center relative z-10">
                
                <div className="w-full flex flex-col items-center">
                    
                    {/* Exact Logo Replication */}
                    <div className="flex flex-col items-center mb-12">
                        {/* Custom 'E' Logo to match screenshot */}
                        <div className="w-16 h-20 mb-4 relative flex flex-col justify-between py-2 px-1">
                            {/* Top bar */}
                            <div className="h-1.5 w-12 bg-gradient-to-r from-teal-300 to-teal-500 rounded-r-full absolute top-2 left-0"></div>
                            {/* Middle bar */}
                            <div className="h-1.5 w-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-r-full absolute top-1/2 -translate-y-1/2 left-0"></div>
                            {/* Bottom bar */}
                            <div className="h-1.5 w-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-r-full absolute bottom-2 left-0"></div>
                            {/* Vertical spine */}
                            <div className="w-1.5 h-full bg-gradient-to-b from-teal-300 via-teal-400 to-blue-600 rounded-full absolute top-0 left-0"></div>
                        </div>
                        
                        <h1 className="text-[26px] font-black text-gray-200 tracking-wide uppercase text-center leading-none mb-1">
                            ENTERPRISE
                        </h1>
                        <h2 className="text-sm font-semibold tracking-widest text-gray-400 uppercase text-center">
                            FLEET MANAGEMENT
                        </h2>
                    </div>

                    {error && (
                        <div className="w-full mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                            <span className="text-red-400 text-xs font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="w-full">
                            <input
                                type="text"
                                className="block w-full px-4 py-3 bg-[#111625]/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:bg-[#111625]/60 focus:outline-none focus:border-teal-500/50 transition-all duration-300 text-sm"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                className="block w-full px-4 py-3 bg-[#111625]/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:bg-[#111625]/60 focus:outline-none focus:border-teal-500/50 transition-all duration-300 text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-teal-100 bg-teal-900/20 border border-teal-500/40 hover:bg-teal-900/40 hover:border-teal-400/60 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

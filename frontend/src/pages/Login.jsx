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

            {/* Centered Premium Login Form */}
            <div className="w-full max-w-md flex flex-col justify-center items-center p-8 sm:p-10 relative z-10 bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all hover:scale-[1.01] duration-500">
                
                <div className="w-full relative z-10 flex flex-col items-center">
                    
                    {/* Logo & Brand Header */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)] mb-4">
                            <Truck className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight uppercase text-center leading-none">
                            PAVITHRA<br/><span className="text-lg text-teal-400">ENTERPRISES</span>
                        </h1>
                    </div>

                    <div className="w-full mb-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Secure Portal</h2>
                        <p className="text-sm text-gray-400">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="w-full mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                            <span className="text-red-400 text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider uppercase text-gray-400 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#0A0D14]/80 border border-white/5 rounded-2xl text-white placeholder-gray-600 focus:bg-[#0A0D14] focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 outline-none shadow-inner"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider uppercase text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-teal-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#0A0D14]/80 border border-white/5 rounded-2xl text-white placeholder-gray-600 focus:bg-[#0A0D14] focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 outline-none shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 pb-4">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500/30 focus:ring-offset-gray-900 transition-colors cursor-pointer" />
                                <label htmlFor="remember-me" className="ml-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">Remember me</label>
                            </div>
                            <a href="#" className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_30px_rgba(20,184,166,0.4)]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Access Enterprise Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center space-x-2 text-gray-500 w-full">
                        <ShieldCheck className="w-4 h-4 text-teal-500/70" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Military-Grade Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

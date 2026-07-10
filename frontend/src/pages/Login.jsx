import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Loader2, Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const trimmedUsername = username.trim();
            const response = await api.post('/auth/authenticate', { username: trimmedUsername, password });
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
        <div className="min-h-screen w-full relative flex items-center justify-center font-sans overflow-hidden bg-[#030712]">
            
            {/* --- CINEMATIC NEON BACKGROUND --- */}
            <div className="absolute inset-0 z-0 bg-[#030712]">
                <img 
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
                    alt="Dark Neon Wet Road Background" 
                    className="w-full h-full object-cover opacity-30"
                />
                {/* Heavy dark gradient overlay to recreate the moody neon vibe */}
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply backdrop-blur-[2px]"></div>
                {/* Radial gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030712]/60 to-[#030712]"></div>
            </div>

            {/* --- EXACT UI MATCH LOGIN BOX --- */}
            <div className="relative z-10 w-full max-w-[420px] mx-4 p-10 bg-[#0c1222]/80 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-fade-in-up">
                
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#4F46E5] rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                        {/* Box/Cube Icon to match the mockup */}
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase text-center mb-1">
                        PAVITHRA
                    </h1>
                    <div className="flex items-center gap-2">
                        <h2 className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase text-center">
                            ENTERPRISES
                        </h2>
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <h2 className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase text-center">
                            LOGISTICS
                        </h2>
                    </div>
                </div>

                {error && (
                    <div className="w-full mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                        <span className="text-red-400 text-xs font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    
                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white font-semibold placeholder-gray-300 focus:bg-white/20 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 text-sm [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                            placeholder="Email or Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="block w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white font-semibold placeholder-gray-300 focus:bg-white/20 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 text-sm [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white focus:outline-none transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338ca] focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    Sign In Securely
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Forgot Password Link */}
                <div className="mt-8 text-center">
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                        Forgot Password?
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Login;

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Loader2, Eye, EyeOff, Mail, Lock, ShieldCheck, Zap, Activity, Navigation, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen w-full relative flex items-center justify-center font-sans overflow-hidden bg-slate-950 selection:bg-indigo-500/30">

            {/* --- CINEMATIC FULL HD FLEET BACKDROP WITH MOODY LIGHTING --- */}
            <div className="absolute inset-0 z-0">
                {/* Fleet Backdrop Image */}
                <img
                    src="/fleet_banner_v2.jpg"
                    alt="Pavithra Enterprises Cinematic Fleet"
                    className="w-full h-full object-cover opacity-45 scale-105 animate-[pulse_12s_ease-in-out_infinite_reverse]"
                />
                
                {/* Dual-Tone Moody Overlay (Deep Navy & Charcoal Depth) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-indigo-950/70 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.85)_100%)]"></div>

                {/* Moody Gold & Blue Ambient Lighting Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-600/20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-amber-500/15 blur-[160px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
                <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] rounded-full bg-indigo-600/20 blur-[130px]"></div>

                {/* Tech Dot Matrix Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15"></div>
            </div>

            {/* Back to Home Link */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md hover:bg-white/20 transition-all shadow-lg"
            >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Back to Home</span>
            </Link>

            {/* --- FLOATING STATUS WIDGETS --- */}
            {/* Top Right Floating Badge */}
            <div className="hidden lg:flex absolute top-12 right-12 z-20 items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-2xl animate-fade-in">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                    <p className="text-xs font-bold text-white">AI Fleet Telemetry Active</p>
                    <p className="text-[10px] font-medium text-slate-400">120+ JCBs & Lorries Online</p>
                </div>
            </div>

            {/* Bottom Left Floating Badge */}
            <div className="hidden lg:flex absolute bottom-12 left-12 z-20 items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-2xl animate-fade-in">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                    <p className="text-xs font-bold text-white">Real-Time GPS Tracking</p>
                    <p className="text-[10px] font-medium text-amber-300">Live Trip Monitoring</p>
                </div>
            </div>

            {/* --- CINEMATIC FLOATING GLASS LOGIN CARD --- */}
            <div className="relative z-10 w-full max-w-[440px] mx-4 p-10 bg-slate-900/75 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.85)] animate-fade-in-up">

                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 mb-5 flex items-center justify-center bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 rounded-2xl shadow-[0_0_35px_rgba(79,70,229,0.5)]">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-widest uppercase text-center mb-1 drop-shadow-md">
                        PAVITHRA
                    </h1>
                    <div className="flex items-center gap-2">
                        <h2 className="text-[9px] font-bold tracking-[0.3em] text-cyan-400 uppercase text-center">
                            ENTERPRISES
                        </h2>
                        <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                        <h2 className="text-[9px] font-bold tracking-[0.3em] text-cyan-400 uppercase text-center">
                            LOGISTICS OS
                        </h2>
                    </div>
                </div>

                {error && (
                    <div className="w-full mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center backdrop-blur-sm">
                        <span className="text-red-300 text-xs font-semibold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">

                    {/* Username Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white font-bold placeholder-slate-400 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-sm shadow-inner [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="block w-full pl-11 pr-12 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white font-bold placeholder-slate-400 focus:bg-slate-950 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-sm shadow-inner [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#0f172a_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white focus:outline-none transition-colors z-10"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl gap-2 hover:scale-[1.01]"
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
                    <a href="#" className="text-xs text-slate-400 hover:text-cyan-300 transition-colors">
                        Forgot Password?
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Login;

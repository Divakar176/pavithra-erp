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
        <div className="min-h-screen flex w-full bg-gray-950 font-sans items-center justify-center relative">
            {/* Background Graphic */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/bg.png" 
                    alt="Pavithra ERP Background" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gray-950/70"></div>
            </div>

            {/* Right Column - Login Form */}
            {/* Centered Login Form */}
            <div className="w-full max-w-md flex flex-col justify-center items-center p-8 sm:p-12 relative z-10 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl">
                {/* Mobile Background Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl lg:hidden"></div>
                
                <div className="w-full max-w-md relative z-10">
                    <div className="flex items-center space-x-4 mb-10">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Truck className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-extrabold text-white tracking-tight uppercase">PAVITHRA ENTERPRISES</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
                        <p className="text-gray-400">Sign in to access your enterprise dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
                            <div className="w-1.5 h-10 bg-red-500 rounded-full"></div>
                            <span className="text-red-400 text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 outline-none"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 outline-none"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-teal-500 focus:ring-teal-500/30" />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300">Remember me</label>
                            </div>
                            <a href="#" className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-teal-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-teal-600/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-12 flex items-center justify-center space-x-2 text-gray-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Enterprise Grade Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

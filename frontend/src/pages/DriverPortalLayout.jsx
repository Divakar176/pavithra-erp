import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Route as RouteIcon, LogOut, Truck, WifiOff } from 'lucide-react';

const DriverPortalLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

    React.useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-950 font-sans text-white">
            {/* Top Navigation Bar */}
            <header className="bg-[#111] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D8621C] to-orange-400 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight uppercase">Driver Portal</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-white capitalize">{user?.username || 'Driver'}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-[#222] rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Offline Indicator */}
            {isOffline && (
                <div className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1.5 flex items-center justify-center gap-2 shadow-inner z-10 relative">
                    <WifiOff className="w-3 h-3" />
                    You are offline. Showing cached data.
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar relative">
                <Outlet />
            </main>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 w-full bg-[#111]/90 backdrop-blur-md border-t border-[#2A2A2A] pb-safe z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex justify-around items-center h-16">
                    <NavLink
                        to="/driver-portal"
                        end
                        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[#D8621C]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                    </NavLink>

                    <NavLink
                        to="/driver-portal/trips"
                        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[#D8621C]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <RouteIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">My Trips</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default DriverPortalLayout;

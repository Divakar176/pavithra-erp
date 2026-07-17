import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Truck, Users, Activity, Navigation, IndianRupee, Sparkles, Bell, Search, BookOpen, FileText, PieChart, Wrench, Receipt, Package, Settings as SettingsIcon, Archive as ArchiveIcon, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications/unread');
                setNotifications(res.data || []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };
        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put(`/notifications/read-all`);
            setNotifications([]);
            setIsNotificationOpen(false);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // RBAC: Added roles array to each item
    const sections = [
        {
            title: "OVERVIEW",
            items: [
                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] }
            ]
        },
        {
            title: "OPERATIONS",
            items: [
                { path: '/dashboard/vehicles', label: 'Vehicles', icon: Truck, roles: ['SUPER_ADMIN', 'ADMIN'] },
                { path: '/dashboard/drivers', label: 'Staff', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
                { path: '/dashboard/trips', label: 'Trips', icon: Navigation, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
                { path: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench, roles: ['SUPER_ADMIN', 'ADMIN'] },
                { path: '/dashboard/inventory', label: 'Inventory', icon: Package, roles: ['SUPER_ADMIN', 'ADMIN'] },
                { path: '/dashboard/customers', label: 'Customers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] }
            ]
        },
        {
            title: 'Analytics',
            items: [
                { path: '/dashboard/finances', label: 'Finances', icon: PieChart, roles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
                { path: '/dashboard/reports', label: 'Reports', icon: FileText, roles: ['SUPER_ADMIN', 'ACCOUNTANT', 'ADMIN'] },
                { path: '/dashboard/billing', label: 'Billing', icon: Receipt, roles: ['SUPER_ADMIN', 'ACCOUNTANT'] },
                { path: '/dashboard/ledger', label: 'Expenses', icon: IndianRupee, roles: ['SUPER_ADMIN', 'ACCOUNTANT'] }
            ]
        },
        {
            title: 'ADMIN',
            items: [
                { path: '/dashboard/ai', label: 'AI Assistant', icon: Sparkles, badge: '✨', roles: ['SUPER_ADMIN'] },
                { path: '/dashboard/documents/slip', label: 'Weighment Slips', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN'] },
                { path: '/dashboard/documents/receipt', label: 'Payment Receipts', icon: Receipt, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
                { path: '/dashboard/activity', label: 'Activity Log', icon: Activity, roles: ['SUPER_ADMIN'] },
                { path: '/dashboard/archive', label: 'Archive', icon: ArchiveIcon, roles: ['SUPER_ADMIN'] },
                { path: '/dashboard/settings', label: 'Settings', icon: SettingsIcon, roles: ['SUPER_ADMIN'] }
            ]
        }
    ];

    const userRole = user?.role || 'SUPER_ADMIN';

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-gray-200 flex font-sans selection:bg-orange-500/30 print:bg-white print:text-black overflow-hidden relative">
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`w-64 bg-[#1E1E1E] border-r border-[#2A2A2A] flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-[72px] flex items-center px-6 border-b border-[#2A2A2A]">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-orange-500/20 mr-3 shrink-0 overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight text-white leading-tight">Pavithra Enterprises</span>
                        <span className="text-[10px] text-gray-400 font-medium">Transport Management</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                    {sections.map((section, idx) => {
                        // RBAC: Filter out items the user doesn't have permission to see
                        const allowedItems = section.items.filter(item => item.roles.includes(userRole));
                        
                        // If they can't see any items in this section, hide the whole section
                        if (allowedItems.length === 0) return null;

                        return (
                            <div key={idx}>
                                <div className="px-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">
                                    {section.title}
                                </div>
                                <div className="space-y-1">
                                    {allowedItems.map(item => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                                        return (
                                            <Link 
                                                key={item.label}
                                                to={item.path} 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-medium group ${isActive ? 'bg-[#FFF0E5] text-[#D8621C]' : 'text-white hover:text-[#D8621C] hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center">
                                                    <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-[#D8621C]' : 'text-white group-hover:text-[#D8621C]'}`} />
                                                    <span className="text-sm">{item.label}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badge === '✨' ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>
                
                <div className="p-4 border-t border-[#2A2A2A] mt-auto">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] font-bold text-sm">
                                {user?.username?.substring(0, 2).toUpperCase() || 'KP'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-200 capitalize">{user?.username || 'K. Pavithra'}</span>
                                <span className="text-[10px] text-gray-500">{user?.role?.replace('_', ' ') || 'Admin (Owner)'}</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative bg-[#121212] print:h-auto print:overflow-visible print:bg-white">
                <header className="h-[72px] border-b border-[#2A2A2A] flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-10 bg-[#121212] print:hidden">
                    <div className="flex items-center">
                        <button 
                            className="lg:hidden p-2 mr-3 text-gray-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center text-xl font-bold text-gray-200 capitalize tracking-tight truncate max-w-[150px] lg:max-w-none">
                            {location.pathname.split('/').pop() === 'dashboard' ? 'Dashboard' : 
                             location.pathname.split('/').pop() === 'drivers' ? 'Staff Management' :
                             location.pathname.split('/').pop()}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 lg:gap-4 relative">
                        <button 
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="relative p-2.5 text-gray-400 border border-[#2A2A2A] rounded-xl hover:text-gray-200 hover:bg-white/5 transition-all"
                        >
                            <Bell className="w-4 h-4" />
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute top-12 right-0 w-80 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-4 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515]">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <button onClick={handleMarkAllAsRead} className="text-xs text-orange-500 hover:text-orange-400 font-medium">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-[#2A2A2A]">
                                            {notifications.map(notification => (
                                                <div key={notification.id} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleMarkAsRead(notification.id)}>
                                                    <div className="flex gap-3 items-start">
                                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                                            <Bell className="w-4 h-4 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-300 font-medium leading-relaxed">{notification.message}</p>
                                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto relative z-0 custom-scrollbar pb-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

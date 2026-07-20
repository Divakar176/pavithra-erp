import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { IndianRupee, MapPin, Truck, AlertCircle } from 'lucide-react';
import InstallAppBanner from '../components/InstallAppBanner';

const DriverHome = () => {
    const { user } = useContext(AuthContext);
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // Fetch driver salaries and find the current logged in driver's balance
                const res = await api.get('/finances/driver-salaries');
                const mySalary = res.data.find(s => s.driverName === user.username);
                if (mySalary) {
                    setBalance(mySalary.netPayable);
                }
            } catch (err) {
                console.error("Failed to fetch balance", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBalance();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D8621C]"></div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="pt-2">
                <h1 className="text-2xl font-bold">Hello, {user.username}! 👋</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Drive safe. Here's your overview.</p>
            </div>

            <InstallAppBanner />

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#D8621C] to-orange-600 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <IndianRupee className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <p className="text-orange-100 text-sm font-medium uppercase tracking-wider mb-1">Total Payable Balance</p>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">₹{balance.toLocaleString()}</h2>
                    <p className="text-xs text-orange-200">Pending salary & advances</p>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl p-5 border border-slate-200 dark:border-[#333]">
                <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Daily Reminder</h3>
                </div>
                <ul className="text-sm text-slate-500 dark:text-gray-400 space-y-2 list-disc pl-4">
                    <li>Always check vehicle oil and tires before starting.</li>
                    <li>Update your trip status in the "My Trips" tab.</li>
                    <li>Collect fuel receipts for all refuels.</li>
                </ul>
            </div>
        </div>
    );
};

export default DriverHome;

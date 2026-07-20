import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { MapPin, Navigation, Calendar, Package } from 'lucide-react';

const DriverTrips = () => {
    const { user } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                // Fetch all trips, filter for driver
                const res = await api.get('/trips');
                // We're matching by username string as trips store driver.username (or we can match logic)
                const myTrips = res.data.filter(t => t.driver?.username === user.username);
                // Sort by date descending
                myTrips.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTrips(myTrips);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrips();
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
                <h1 className="text-xl font-bold">My Trips</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Your recent and upcoming routes.</p>
            </div>

            {trips.length === 0 ? (
                <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl p-8 border border-[#333] text-center">
                    <Navigation className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-slate-500 dark:text-gray-400 font-medium">No trips assigned yet.</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {trips.map(trip => (
                        <div key={trip.id} className="bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#333]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(trip.date).toLocaleDateString('en-GB')}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trip.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                    {trip.status}
                                </span>
                            </div>
                            
                            <div className="relative pl-6 pb-2 border-l-2 border-gray-800 ml-2 space-y-4">
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[#333] border-2 border-[#1A1A1A]"></div>
                                    <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-wider">Origin</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{trip.origin}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[#D8621C] border-2 border-[#1A1A1A]"></div>
                                    <p className="text-xs text-slate-500 dark:text-gray-500 font-bold uppercase tracking-wider">Destination</p>
                                    <p className="text-slate-900 dark:text-white font-medium">{trip.destination}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                                    <Package className="w-4 h-4" />
                                    <span>{trip.material}</span>
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                    ₹{trip.driverSalary?.toLocaleString() || 0}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DriverTrips;

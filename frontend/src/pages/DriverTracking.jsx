import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const DriverTracking = () => {
    const { tripId } = useParams();
    const [isTracking, setIsTracking] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, active, error
    const [errorMsg, setErrorMsg] = useState('');
    const [watchId, setWatchId] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        // Fetch basic trip info to show to driver
        api.get(`/trips/${tripId}`)
            .then(res => setTripDetails(res.data))
            .catch(err => {
                setStatus('error');
                setErrorMsg('Invalid Trip Link or Trip Not Found');
            });
    }, [tripId]);

    const startTracking = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMsg('Geolocation is not supported by your browser');
            return;
        }

        setStatus('active');
        setIsTracking(true);

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // Send to backend
                api.post(`/trips/${tripId}/location`, { latitude, longitude })
                    .catch(err => console.error("Failed to send location update", err));
            },
            (error) => {
                setStatus('error');
                if (error.code === error.PERMISSION_DENIED) {
                    setErrorMsg('Please allow Location Access to start tracking.');
                } else {
                    setErrorMsg('Failed to get location. Please check your signal.');
                }
                setIsTracking(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    };

    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsTracking(false);
        setStatus('idle');
    };

    if (status === 'error' && !tripDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Link Invalid</h2>
                    <p className="text-slate-500 dark:text-gray-500 text-sm">{errorMsg}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-brand-600 text-slate-900 dark:text-white p-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Truck className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Driver Tracking</h1>
                </div>
                {tripDetails && (
                    <div className="text-center mt-4 bg-white/10 p-4 rounded-xl">
                        <p className="text-sm text-brand-100 uppercase tracking-wider font-semibold">Active Trip</p>
                        <p className="text-lg font-bold">{tripDetails.source} → {tripDetails.destination}</p>
                        <p className="text-sm mt-1">Vehicle: {tripDetails.vehicle?.vehicleNumber}</p>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                
                {status === 'active' && (
                    <div className="mb-8 animate-pulse flex flex-col items-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Tracking Active</h2>
                        <p className="text-slate-500 dark:text-gray-500 mt-2">Your location is being shared live.</p>
                    </div>
                )}

                {status === 'idle' && (
                    <div className="mb-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-12 h-12 text-slate-500 dark:text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Ready to Start</h2>
                        <p className="text-slate-500 dark:text-gray-500 mt-2">Click below when you begin driving.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mb-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-red-600">Tracking Paused</h2>
                        <p className="text-red-500 mt-2 px-4">{errorMsg}</p>
                    </div>
                )}

                {!isTracking ? (
                    <button 
                        onClick={startTracking}
                        className="w-full max-w-sm py-4 bg-brand-600 hover:bg-brand-700 text-slate-900 dark:text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <MapPin className="w-6 h-6" />
                        Start Live Tracking
                    </button>
                ) : (
                    <button 
                        onClick={stopTracking}
                        className="w-full max-w-sm py-4 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Stop Tracking
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 text-center text-slate-500 dark:text-gray-400 text-sm">
                <p>Keep this page open while driving to ensure continuous tracking.</p>
            </div>
        </div>
    );
};

export default DriverTracking;

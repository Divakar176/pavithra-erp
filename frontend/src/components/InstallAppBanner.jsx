import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallAppBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setDeferredPrompt(null);
        } else {
            console.log('User dismissed the install prompt');
        }
    };

    if (!deferredPrompt || isDismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Download className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 pr-4">
                <h3 className="font-bold text-lg mb-1">Install Driver App</h3>
                <p className="text-sm text-blue-100">Add Pavithra ERP to your home screen for quick access and offline mode.</p>
            </div>
            
            <div className="relative z-10 flex flex-col gap-2">
                <button 
                    onClick={handleInstallClick}
                    className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold shadow-md hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                    Install Now
                </button>
                <button 
                    onClick={() => setIsDismissed(true)}
                    className="text-xs text-blue-200 hover:text-white transition-colors"
                >
                    Not now
                </button>
            </div>
        </div>
    );
};

export default InstallAppBanner;

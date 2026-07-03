import React, { useState } from 'react';
import { ShieldAlert, X, Fingerprint, KeyRound } from 'lucide-react';

import api from '../api/axios';

const SecurityPinModal = ({ isOpen, onClose, onSuccess, actionName }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);
        try {
            const response = await api.post('/auth/verify-pin', { pin });
            if (response.data.success) {
                setPin('');
                onSuccess();
            } else {
                setError('Incorrect Security PIN. Access Denied.');
                setPin('');
            }
        } catch (err) {
            setError('Error verifying PIN.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCancel = () => {
        setPin('');
        setError('');
        onClose();
    };

    const handleBiometricAuth = async () => {
        try {
            setError('');
            if (!window.PublicKeyCredential) {
                setError("Biometrics not supported on this browser.");
                return;
            }

            const storedCred = localStorage.getItem('erp_biometric_id');

            if (!storedCred) {
                // First time setup
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                const userId = new Uint8Array(16);
                window.crypto.getRandomValues(userId);
                
                const credential = await navigator.credentials.create({ 
                    publicKey: {
                        challenge,
                        rp: { name: "Pavithra ERP", id: window.location.hostname },
                        user: { id: userId, name: "admin", displayName: "Administrator" },
                        pubKeyCredParams: [{alg: -7, type: "public-key"}, {alg: -257, type: "public-key"}],
                        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
                        timeout: 60000,
                    }
                });
                
                const rawId = Array.from(new Uint8Array(credential.rawId))
                    .map(b => b.toString(16).padStart(2, '0')).join('');
                localStorage.setItem('erp_biometric_id', rawId);
                
                onSuccess();
            } else {
                // Verify existing
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                
                const rawIdArray = new Uint8Array(storedCred.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

                await navigator.credentials.get({ 
                    publicKey: {
                        challenge,
                        rpId: window.location.hostname,
                        allowCredentials: [{ type: "public-key", id: rawIdArray }],
                        userVerification: "required",
                        timeout: 60000,
                    }
                });
                onSuccess();
            }
        } catch (err) {
            console.error("Biometric auth error:", err);
            setError("Biometric authentication failed or cancelled.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl shadow-red-500/10">
                <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515]">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h2 className="text-white font-bold text-lg">Security Check</h2>
                    </div>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="text-sm text-gray-400 text-center mb-4">
                        Authenticate to proceed with <span className="text-white font-bold">{actionName}</span>.
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        onClick={handleBiometricAuth}
                        className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-2"
                    >
                        <Fingerprint className="w-8 h-8" />
                        <span>Use Fingerprint / Face ID</span>
                    </button>
                    
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px bg-[#2A2A2A] flex-1"></div>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">OR PIN</span>
                        <div className="h-px bg-[#2A2A2A] flex-1"></div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="password" 
                                placeholder="Enter 4-digit PIN"
                                maxLength={4}
                                className="w-full bg-[#151515] border border-[#2A2A2A] rounded-xl pl-12 pr-4 py-4 text-center text-white text-xl tracking-[0.5em] focus:outline-none focus:border-red-500 transition-colors"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                            />
                        </div>
                        
                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button" 
                                onClick={handleCancel}
                                className="flex-1 py-3 px-4 bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#2A2A2A] text-gray-300 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!pin || isVerifying}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SecurityPinModal;

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Building, MapPin, Phone, FileText, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const Settings = () => {
    const [companyDetails, setCompanyDetails] = useState({
        name: 'Pavithra Enterprises',
        address: '123 Transport Nagar, Logistics Hub',
        city: 'Chennai, Tamil Nadu 600001',
        phone: '+91 98765 43210',
        email: 'info@pavithraenterprises.in',
        gstin: '33AABCP1234D1Z5'
    });
    
    const [isSaved, setIsSaved] = useState(false);

    // Security State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    useEffect(() => {
        const savedData = localStorage.getItem('companyDetails');
        if (savedData) {
            try {
                setCompanyDetails(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse company details", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        setCompanyDetails({
            ...companyDetails,
            [e.target.name]: e.target.value
        });
        setIsSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('companyDetails', JSON.stringify(companyDetails));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setPasswordStatus({ type: '', message: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters' });
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await api.post('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordStatus({ type: 'success', message: response.data.message || 'Password updated successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to change password. Please verify your current password.';
            setPasswordStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <SettingsIcon className="mr-3 text-[#D8621C]" size={32} /> System Settings
                    </h1>
                    <p className="text-[#A0A0A0]">Configure your company profile and application preferences</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] mb-8">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-[#333] pb-4 flex items-center">
                    <Building className="mr-2 text-gray-400" size={20} /> Company Information
                </h2>
                <p className="text-gray-400 text-sm mb-6">These details will automatically appear on all generated Tax Invoices, Payslips, and Reports.</p>
                
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Company Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={companyDetails.name} 
                                    onChange={handleChange} 
                                    required
                                    className="pl-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#D8621C]" 
                                    placeholder="e.g. Pavithra Enterprises"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">GSTIN</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    name="gstin" 
                                    value={companyDetails.gstin} 
                                    onChange={handleChange} 
                                    className="pl-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#D8621C]" 
                                    placeholder="e.g. 33AABCP1234D1Z5"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Street Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={companyDetails.address} 
                                    onChange={handleChange} 
                                    required
                                    className="pl-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#D8621C]" 
                                    placeholder="e.g. 123 Transport Nagar"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">City & State / PIN</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={companyDetails.city} 
                                    onChange={handleChange} 
                                    required
                                    className="pl-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#D8621C]" 
                                    placeholder="e.g. Chennai, Tamil Nadu 600001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={companyDetails.phone} 
                                    onChange={handleChange} 
                                    required
                                    className="pl-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#D8621C]" 
                                    placeholder="e.g. +91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#333] flex items-center space-x-4">
                        <button 
                            type="submit" 
                            className="bg-[#D8621C] hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold flex items-center transition-colors shadow-lg"
                        >
                            <Save className="w-5 h-5 mr-2" /> Save Settings
                        </button>
                        
                        {isSaved && (
                            <span className="text-green-500 text-sm font-medium animate-pulse">
                                ✓ Settings saved successfully!
                            </span>
                        )}
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] mb-8">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-[#333] pb-4 flex items-center">
                    <ShieldCheck className="mr-2 text-teal-400" size={20} /> Security Settings
                </h2>
                <p className="text-gray-400 text-sm mb-6">Change your password to secure your enterprise account.</p>

                {passwordStatus.message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${passwordStatus.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{passwordStatus.message}</span>
                    </div>
                )}

                <form onSubmit={submitPasswordChange} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Current Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type={showPasswords.current ? "text" : "password"} 
                                    name="currentPassword" 
                                    value={passwordData.currentPassword} 
                                    onChange={handlePasswordChange} 
                                    required
                                    className="pl-10 pr-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-teal-500" 
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#2A2A2A] pt-6">
                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type={showPasswords.new ? "text" : "password"} 
                                    name="newPassword" 
                                    value={passwordData.newPassword} 
                                    onChange={handlePasswordChange} 
                                    required
                                    className="pl-10 pr-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-teal-500" 
                                    placeholder="New password (min 6 chars)"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    type={showPasswords.confirm ? "text" : "password"} 
                                    name="confirmPassword" 
                                    value={passwordData.confirmPassword} 
                                    onChange={handlePasswordChange} 
                                    required
                                    className="pl-10 pr-10 w-full bg-[#222222] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-teal-500" 
                                    placeholder="Re-type new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#333] flex items-center">
                        <button 
                            type="submit" 
                            disabled={isChangingPassword}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-xl font-bold flex items-center transition-colors shadow-[0_0_15px_rgba(20,184,166,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;

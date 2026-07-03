import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Building, MapPin, Phone, FileText } from 'lucide-react';

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
        </div>
    );
};

export default Settings;

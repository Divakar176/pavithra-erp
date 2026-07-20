import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Plus, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        itemName: '',
        sku: '',
        category: 'GENERAL',
        stockQuantity: 0,
        reorderLevel: 5,
        unitPrice: 0.0
    });

    const categories = ['TIRES', 'OIL', 'BRAKES', 'ELECTRICAL', 'GENERAL', 'TOOLS'];

    const fetchInventory = async () => {
        try {
            const res = await api.get('/inventory');
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching inventory", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (item = null) => {
        if (item) {
            setFormData(item);
        } else {
            setFormData({
                id: null,
                itemName: '',
                sku: '',
                category: 'GENERAL',
                stockQuantity: 0,
                reorderLevel: 5,
                unitPrice: 0.0
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                stockQuantity: parseInt(formData.stockQuantity),
                reorderLevel: parseInt(formData.reorderLevel),
                unitPrice: parseFloat(formData.unitPrice)
            };

            if (formData.id) {
                await api.put(`/inventory/${formData.id}`, payload);
            } else {
                await api.post('/inventory', payload);
            }
            setIsModalOpen(false);
            fetchInventory();
        } catch (error) {
            console.error("Error saving item", error);
            alert("Failed to save item");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/inventory/${id}`);
                fetchInventory();
            } catch (error) {
                console.error("Error deleting item", error);
                alert("Failed to delete item");
            }
        }
    };

    const adjustStock = async (id, change) => {
        try {
            await api.patch(`/inventory/${id}/stock`, { quantityChange: change });
            fetchInventory();
        } catch (error) {
            console.error("Error adjusting stock", error);
            alert("Failed to update stock");
        }
    };

    if (isLoading) {
        return <div className="p-6 text-[#A0A0A0]">Loading inventory...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Spare Parts Inventory</h1>
                    <p className="text-[#A0A0A0]">Manage your garage stock and get low stock alerts</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-[#FF6B00] hover:bg-[#FF8533] text-slate-900 dark:text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-lg shadow-[#FF6B00]/20"
                >
                    <Plus size={20} />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#222222] text-[#A0A0A0] text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Item Details</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium text-center">Stock Level</th>
                                <th className="p-4 font-medium text-right">Unit Price</th>
                                <th className="p-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-[#A0A0A0]">
                                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                                        No items in inventory. Click "Add Item" to start tracking.
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => {
                                    const isLowStock = item.stockQuantity <= item.reorderLevel;
                                    return (
                                        <tr key={item.id} className="hover:bg-[#222222] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-500/10 text-red-500' : 'bg-slate-200 dark:bg-[#2A2A2A] text-[#A0A0A0]'}`}>
                                                        <Package size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">{item.itemName}</div>
                                                        <div className="text-sm text-[#A0A0A0]">SKU: {item.sku || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-slate-200 dark:bg-[#2A2A2A] text-[#E0E0E0] px-3 py-1 rounded-full text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center space-x-4">
                                                        <button 
                                                            onClick={() => adjustStock(item.id, -1)}
                                                            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] flex items-center justify-center text-slate-900 dark:text-white transition-colors"
                                                        >-</button>
                                                        <span className={`text-xl font-bold w-12 text-center ${isLowStock ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                                            {item.stockQuantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => adjustStock(item.id, 1)}
                                                            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] flex items-center justify-center text-slate-900 dark:text-white transition-colors"
                                                        >+</button>
                                                    </div>
                                                    {isLowStock && (
                                                        <div className="flex items-center space-x-1 text-red-500 mt-2 text-xs font-medium bg-red-500/10 px-2 py-1 rounded">
                                                            <AlertTriangle size={12} />
                                                            <span>Low Stock (Min: {item.reorderLevel})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="text-slate-900 dark:text-white font-medium">₹{item.unitPrice?.toLocaleString()}</div>
                                                <div className="text-xs text-[#A0A0A0]">Total: ₹{(item.unitPrice * item.stockQuantity).toLocaleString()}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => openModal(item)} className="p-2 text-[#A0A0A0] hover:text-slate-900 dark:text-white transition-colors bg-slate-200 dark:bg-[#2A2A2A] rounded-lg hover:bg-[#333]">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-[#A0A0A0] hover:text-red-500 transition-colors bg-slate-200 dark:bg-[#2A2A2A] rounded-lg hover:bg-[#333]">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A]">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.id ? 'Edit Item' : 'Add New Item'}</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Item Name *</label>
                                    <input type="text" name="itemName" required value={formData.itemName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g., MRF Zapper Tire" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#A0A0A0] mb-1">SKU / Part Number</label>
                                        <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="Optional" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Category *</label>
                                        <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors">
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Current Stock *</label>
                                        <input type="number" min="0" name="stockQuantity" required value={formData.stockQuantity} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Alert Level (Min) *</label>
                                        <input type="number" min="0" name="reorderLevel" required value={formData.reorderLevel} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#A0A0A0] mb-1">Unit Price (₹) *</label>
                                    <input type="number" step="0.01" min="0" name="unitPrice" required value={formData.unitPrice} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                                </div>
                                <div className="flex space-x-3 pt-4 border-t border-slate-200 dark:border-[#2A2A2A]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-200 dark:bg-[#2A2A2A] hover:bg-[#333] text-slate-900 dark:text-white rounded-xl transition-colors font-medium">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-3 px-4 bg-[#FF6B00] hover:bg-[#FF8533] text-slate-900 dark:text-white rounded-xl transition-colors font-medium disabled:opacity-50">
                                        {isSaving ? 'Saving...' : 'Save Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;

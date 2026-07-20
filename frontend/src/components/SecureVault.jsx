import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, Download, Trash2, Lock } from 'lucide-react';
import api from '../api/axios';

const SecureVault = ({ isOpen, onClose, vehicle }) => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState('PDF');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && vehicle) {
            fetchDocuments();
        }
    }, [isOpen, vehicle]);

    const fetchDocuments = async () => {
        try {
            const res = await api.get(`/documents/vehicle/${vehicle.id}`);
            setDocuments(res.data);
        } catch (err) {
            console.error("Failed to fetch documents", err);
            setError("Could not load documents.");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !docName) {
            setError("Please select a file and enter a document name.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", docName);
        formData.append("type", docType);

        try {
            setUploading(true);
            setError('');
            await api.post(`/documents/vehicle/${vehicle.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setDocName('');
            fetchDocuments();
        } catch (err) {
            console.error(err);
            setError("Failed to upload document.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm("Are you sure you want to delete this document from the vault?")) return;
        try {
            await api.delete(`/documents/${docId}`);
            fetchDocuments();
        } catch (err) {
            console.error(err);
            setError("Failed to delete document.");
        }
    };

    const handleDownload = async (doc) => {
        try {
            const res = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.originalFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            setError("Failed to download document.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#1C1C1C] border border-emerald-500/20 rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                
                {/* Header */}
                <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center bg-gradient-to-r from-[#151515] to-[#1A2520]">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                            <Lock className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-slate-900 dark:text-white font-bold text-lg">Secure Document Vault</h2>
                            <p className="text-emerald-500 text-xs font-mono">{vehicle?.vehicleNumber}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Left: Upload Form */}
                    <div className="w-full md:w-1/3 bg-slate-100 dark:bg-[#151515] border-r border-slate-200 dark:border-[#2A2A2A] p-6 flex flex-col gap-6 overflow-y-auto">
                        <h3 className="text-sm text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Add Document</h3>
                        
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-xs font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-2">Document Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. RC Book"
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={docName}
                                    onChange={(e) => setDocName(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-2">Document Type</label>
                                <select 
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                >
                                    <option value="PDF">PDF</option>
                                    <option value="IMAGE">Image (JPG/PNG)</option>
                                    <option value="DOC">Word Document</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-2">File</label>
                                <div className="border-2 border-dashed border-[#333] rounded-xl p-4 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative group">
                                    <input 
                                        type="file" 
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <UploadCloud className="w-8 h-8 text-slate-500 dark:text-gray-500 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                                    <div className="text-xs text-slate-500 dark:text-gray-400 truncate">
                                        {file ? file.name : "Click or drag file here"}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
                                <Lock className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right: Document List */}
                    <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-white dark:bg-[#1C1C1C]">
                        <h3 className="text-sm text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-6">Stored Documents</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {documents.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-slate-500 dark:text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Vault is empty for this vehicle.</p>
                                </div>
                            ) : documents.map(doc => (
                                <div key={doc.id} className="bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-[#2A2A2A] hover:border-emerald-500/30 rounded-xl p-4 transition-all group flex flex-col justify-between">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-slate-200 dark:bg-[#2A2A2A] p-3 rounded-lg text-emerald-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="text-slate-900 dark:text-white font-medium truncate">{doc.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{doc.type} • {(doc.fileSize / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-[#2A2A2A]">
                                        <button 
                                            onClick={() => handleDownload(doc)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 text-slate-500 dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecureVault;

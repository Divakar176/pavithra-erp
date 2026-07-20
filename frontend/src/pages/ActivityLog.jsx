import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Activity, Clock, User, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/audit-logs');
            setLogs(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching logs", err);
            setError("Failed to load activity history.");
            setIsLoading(false);
        }
    };

    const getIconForAction = (action) => {
        if (action.includes('Delete')) return <ShieldAlert className="w-5 h-5 text-red-500" />;
        if (action.includes('Paid') || action.includes('Payment')) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        if (action.includes('Vault') || action.includes('Document')) return <FileText className="w-5 h-5 text-blue-500" />;
        return <Activity className="w-5 h-5 text-purple-500" />;
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-purple-500" />
                        Activity Log
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400">Track all actions performed by owners across the system.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center font-bold">
                    {error}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden">
                    <div className="divide-y divide-[#2A2A2A]">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-gray-500">No activity recorded yet.</div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-[#222222] transition-colors">
                                    <div className="bg-slate-100 dark:bg-[#151515] p-3 rounded-xl border border-slate-200 dark:border-[#2A2A2A]">
                                        {getIconForAction(log.actionName)}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                                                <span className="font-bold text-gray-200 capitalize">{log.username}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500 font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(log.createdAt)}
                                            </div>
                                        </div>
                                        
                                        <div className="text-slate-900 dark:text-white font-medium text-lg mb-1">
                                            {log.actionName} <span className="text-slate-500 dark:text-gray-500 text-sm font-normal">({log.entityName})</span>
                                        </div>
                                        
                                        <p className="text-slate-500 dark:text-gray-400 text-sm">
                                            {log.details}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;

import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Shield, Activity, Clock, Download, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import axios from 'axios';

const Timeline = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/history')
      .then(res => {
        setHistoryData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Forensic History</h2>
          <p className="text-slate-400 text-sm">Review past analysis reports and investigation logs.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by ID or Filename..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs w-64 focus:outline-none focus:border-primary/50"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Case ID</th>
              <th className="px-6 py-4">Artifact Name</th>
              <th className="px-6 py-4">Scan Type</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading History...</p>
                </td>
              </tr>
            )}
            {!loading && historyData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center opacity-50">
                  <History className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No previous scans found</p>
                </td>
              </tr>
            )}
            {!loading && historyData.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-all group">
                <td className="px-6 py-4 text-xs font-mono text-primary font-bold">VC-{item.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200">{item.file_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.analysis_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.created_at}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase italic border",
                    item.status === 'completed' ? "bg-success/10 text-success border-success/20" : 
                    item.status === 'failed' ? "bg-danger/10 text-danger border-danger/20" : "bg-warning/10 text-warning border-warning/20"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-primary transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">{historyData.length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Scans Conducted</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">{historyData.filter(i => i.status === 'failed').length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Failed Scans</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-black italic text-white tracking-tighter">99.8%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analysis Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

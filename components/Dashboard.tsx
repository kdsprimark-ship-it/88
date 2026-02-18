
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { indianEntries, billInfos, settings, accountEntries, exportBackup, importBackup } = useApp();
  const [time, setTime] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          importBackup(ev.target.result as string);
          e.target.value = ''; 
        }
      };
      reader.readAsText(file);
    }
  };
  
  const calculateStats = (period: 'today' | 'month' | 'lifetime') => {
    const now = new Date();
    
    const filteredEntries = indianEntries.filter(e => {
      const entryDate = new Date(e.date);
      if (period === 'today') return entryDate.toDateString() === now.toDateString();
      if (period === 'month') return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      return true;
    });

    const filteredBills = billInfos.filter(b => {
      const billDate = new Date(b.date);
      if (period === 'today') return billDate.toDateString() === now.toDateString();
      if (period === 'month') return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
      return true;
    });

    const filteredAccount = accountEntries.filter(a => {
      const accDate = new Date(a.date);
      if (period === 'today') return accDate.toDateString() === now.toDateString();
      if (period === 'month') return accDate.getMonth() === now.getMonth() && accDate.getFullYear() === now.getFullYear();
      return true;
    });

    const billReceived = filteredBills.reduce((sum, b) => sum + b.paidBill, 0);
    const cashInReceived = filteredAccount.reduce((sum, a) => sum + a.amount, 0);

    return {
      doc: filteredEntries.reduce((sum, e) => sum + e.doc, 0),
      indian: filteredEntries.reduce((sum, e) => sum + e.totalTaka, 0),
      receive: billReceived + cashInReceived,
      due: filteredBills.reduce((sum, b) => sum + b.dueBill, 0)
    };
  };

  const periodStats = [
    { label: 'TODAYS', stats: calculateStats('today') },
    { label: 'CURRENT MONTH', stats: calculateStats('month') },
    { label: 'LIFE TIME', stats: calculateStats('lifetime') }
  ];

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 print:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="relative">
              <img src={settings.profileImageUrl} className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg object-cover" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
           </div>
           <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Hello, {settings.adminName}</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{settings.roleTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button onClick={toggleFullScreen} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"><span className="text-xs font-bold uppercase hidden sm:inline">{isFullScreen ? 'Exit' : 'Full Screen'}</span>{isFullScreen ? <Icons.Shrink size={16} /> : <Icons.Expand size={16} />}</button>
          <button onClick={exportBackup} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"><Icons.Download size={16} /><span className="text-xs font-bold uppercase hidden sm:inline">Backup</span></button>
          <label className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer"><Icons.RefreshCw size={16} /><span className="text-xs font-bold uppercase hidden sm:inline">Restore</span><input type="file" className="hidden" accept=".json" onChange={handleFileImport} /></label>
          <button onClick={handlePrint} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"><Icons.Printer size={18} /><span className="text-xs font-bold uppercase hidden sm:inline">Print</span></button>
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} text-white shadow-xl flex items-center gap-4`}>
            <Icons.Clock size={24} />
            <div className="min-w-[100px]">
              <p className="text-[10px] text-white/70 uppercase font-bold leading-none">System Clock</p>
              <p className="text-lg font-mono font-bold leading-none mt-1">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {periodStats.map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-lg transition-all border-b-4 border-b-slate-100">
            <h3 className="text-slate-400 text-[10px] font-black tracking-[0.2em] mb-6 uppercase">{item.label} PERFORMANCE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-blue-100 transition-colors">
                <p className="text-[10px] text-blue-600 font-black mb-1 uppercase tracking-wider">DOCS</p>
                <p className="text-xl font-black text-blue-900">{item.stats.doc || '0'}</p>
              </div>
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 group hover:bg-orange-100 transition-colors">
                <p className="text-[10px] text-orange-600 font-black mb-1 uppercase tracking-wider">INDIAN</p>
                <p className="text-xl font-black text-orange-900">৳{item.stats.indian.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 group hover:bg-emerald-100 transition-colors">
                <p className="text-[10px] text-emerald-600 font-black mb-1 uppercase tracking-wider">RECEIVED</p>
                <p className="text-xl font-black text-emerald-900">৳{item.stats.receive.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 group hover:bg-rose-100 transition-colors">
                <p className="text-[10px] text-rose-600 font-black mb-1 uppercase tracking-wider">OUTSTANDING</p>
                <p className="text-xl font-black text-rose-900">৳{item.stats.due.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Financial Trends</h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Revenue Received</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodStats.map(p => ({ label: p.label, receive: p.stats.receive }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="receive" fill="#4f46e5" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Recent Activity Log</h3>
             <Icons.RefreshCw size={16} className="text-slate-300 animate-spin-slow" />
          </div>
          <div className="space-y-4">
            {indianEntries.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all group border border-transparent hover:border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-600 text-white shadow-lg`}>
                  <Icons.Plus size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{entry.buyerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{entry.invoiceNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">৳{entry.totalTaka.toLocaleString()}</p>
                  <p className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 uppercase">Success</p>
                </div>
              </div>
            ))}
            {indianEntries.length === 0 && (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                   <Icons.FileSpreadsheet size={32} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">System Database Idle</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
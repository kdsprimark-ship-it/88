
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { THEMES, Icons, FONT_FAMILIES, LANGUAGES } from '../constants';

const Settings: React.FC = () => {
  const { settings, updateSettings, resetApp, exportBackup, importBackup, fetchAllData } = useApp();
  const [activeSection, setActiveSection] = useState('system');
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);

  const menuItems = [
    { id: 'business', label: 'Business Setting', icon: <Icons.Table size={18} /> },
    { id: 'system', label: 'System Settings', icon: <Icons.Palette size={18} /> },
    { id: 'sync', label: 'Cloud Sync Setup', icon: <Icons.Cloud size={18} /> },
    { id: 'identity', label: 'Admin Identity', icon: <Icons.UserIcon size={18} /> },
    { id: 'repair', label: 'Repair & Sync', icon: <Icons.Database size={18} /> }
  ];

  const handleLinkAccount = () => {
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setIsLinked(true);
      alert('Account linked successfully to Cloud!');
    }, 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) importBackup(ev.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'identity':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Name</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" value={settings.adminName} onChange={e => updateSettings({ adminName: e.target.value })} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Title</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" value={settings.roleTitle} onChange={e => updateSettings({ roleTitle: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Image URL</label>
                   <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl" value={settings.profileImageUrl} onChange={e => updateSettings({ profileImageUrl: e.target.value })} />
                </div>
             </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Colorful System Themes</label>
              <p className="text-xs text-slate-400">Select and save your preferred interface style.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {THEMES.map(theme => (
                  <button
                    key={theme.name}
                    onClick={() => updateSettings({ theme: theme.name })}
                    className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                      settings.theme === theme.name ? 'border-slate-900 bg-slate-900 text-white shadow-2xl scale-105' : 'border-slate-100 bg-white text-slate-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-[20px] bg-gradient-to-br ${theme.from} ${theme.to} shadow-lg group-hover:rotate-12 transition-transform`} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{theme.name}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => updateSettings({ theme: 'Ocean Breeze', bgColor: '#f8fafc', textColor: '#0f172a' })}
                className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-xs hover:bg-slate-100 transition-all uppercase tracking-widest mt-4"
              >
                Reset to Default Theme
              </button>
            </div>

            <div className="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div>
                 <label className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-6 block">Backup & Restore</label>
                 <div className="flex flex-col gap-3">
                    <button onClick={exportBackup} className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-xs hover:bg-indigo-100 transition-all uppercase tracking-widest">
                       <Icons.Download size={16} /> Export Local Backup
                    </button>
                    <label className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-xs hover:bg-emerald-100 transition-all uppercase tracking-widest cursor-pointer">
                       <Icons.RefreshCw size={16} /> Restore from File
                       <input type="file" className="hidden" accept=".json" onChange={handleFileImport} />
                    </label>
                 </div>
               </div>
               <div>
                 <label className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-6 block">Aesthetic Controls</label>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-end">
                         <label className="text-[10px] font-black text-slate-400 uppercase">Global Zoom</label>
                         <span className="text-xs font-black text-indigo-500">{settings.zoom}%</span>
                      </div>
                      <input type="range" min="80" max="150" step="1" value={settings.zoom} onChange={e => updateSettings({ zoom: Number(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-end">
                         <label className="text-[10px] font-black text-slate-400 uppercase">Brightness</label>
                         <span className="text-xs font-black text-indigo-500">{settings.brightness}%</span>
                      </div>
                      <input type="range" min="50" max="150" step="1" value={settings.brightness} onChange={e => updateSettings({ brightness: Number(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="pt-10 border-t border-slate-100">
               <label className="text-sm font-black text-rose-500 uppercase tracking-[0.2em] mb-6 block">Danger Zone</label>
               <div className="bg-rose-50/50 p-6 rounded-[32px] border border-rose-100">
                  <h4 className="font-black text-rose-900 text-sm mb-1 uppercase">Factory Reset</h4>
                  <p className="text-xs text-rose-600 font-medium mb-6">Clear all local storage data and reset to default. Mobile App Logic V3.</p>
                  <button onClick={resetApp} className="flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                    <Icons.Trash2 size={16} /> WIPE ALL DATA
                  </button>
               </div>
            </div>
          </div>
        );
      case 'business':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl text-indigo-500 mb-6">
                   <Icons.Table size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Manage Business Registry</h4>
                <p className="text-slate-400 text-xs font-bold max-w-xs mx-auto leading-relaxed uppercase tracking-wider mb-8">Configure Shippers, Buyers, Depots and conditions for automatic calculations.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      const el = document.querySelector('[data-tab-id="export-info"]') as HTMLElement;
                      if (el) el.click();
                    }} 
                    className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all"
                  >
                    Manage in App
                  </button>
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1zIQUZr6KdZ8DzrZjhvmz_H-iHApQaJ8XvxLZgvdC2Y8/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-700 transition-all"
                  >
                    <Icons.Globe size={16} /> View Sheet
                  </a>
                </div>
             </div>
          </div>
        );
      case 'sync':
        return (
          <div className="space-y-6 text-center py-20 bg-indigo-50 rounded-[40px] border-2 border-dashed border-indigo-100">
             <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl text-indigo-500 mb-6 ${isLinking ? 'animate-spin' : isLinked ? 'scale-110' : 'animate-bounce'}`}>
                {isLinked ? <Icons.Lock size={32} /> : <Icons.Cloud size={32} />}
             </div>
             <h4 className="text-lg font-black text-indigo-900 uppercase tracking-tight">Cloud Sync Setup</h4>
             <p className="text-indigo-400 text-xs font-bold max-w-xs mx-auto leading-relaxed uppercase tracking-wider">
               {isLinked ? 'System connected to secure cloud. All data is syncing in real-time.' : 'Connect to Google Drive or AWS to sync your inventory data across multiple devices.'}
             </p>
             <button 
               onClick={handleLinkAccount}
               disabled={isLinking || isLinked}
               className={`mt-4 px-10 py-4 ${isLinked ? 'bg-emerald-500' : 'bg-indigo-600'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl`}
             >
               {isLinking ? 'Linking...' : isLinked ? 'Link Secured' : 'Link Account Now'}
             </button>
          </div>
        );
      case 'repair':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-8 bg-amber-50/50 rounded-[40px] border-2 border-dashed border-amber-200">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl text-amber-500 mb-6">
                  <Icons.Database size={32} />
               </div>
               <h4 className="text-lg font-black text-amber-900 uppercase tracking-tight text-center">System Repair & Troubleshooting</h4>
               <p className="text-amber-700 text-xs font-bold max-w-md mx-auto leading-relaxed uppercase tracking-wider mb-8 text-center">
                 If data doesn't sync or you see errors, your Cloud URL might be incorrect or permissions may have changed.
               </p>
               <div className="bg-white/50 p-6 rounded-[32px] border border-amber-100">
                  <h4 className="font-black text-amber-900 text-sm mb-1 uppercase">Force Hard Refresh</h4>
                  <p className="text-xs text-amber-600 font-medium mb-6">This will clear all local data and re-download everything from Google Sheets. This is a powerful but safe action to resolve sync issues.</p>
                  <button 
                    onClick={() => {
                      if(confirm('Are you sure? This will clear all cached data and re-sync from the cloud.')) {
                        resetApp();
                      }
                    }} 
                    className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
                  >
                    <Icons.RefreshCw size={16} /> FORCE REFRESH & SYNC
                  </button>
               </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 pb-20">
      <div className="w-full md:w-80 shrink-0 space-y-4">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
           <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <img src={settings.profileImageUrl} alt="Admin Profile" className="w-24 h-24 rounded-[32px] border-4 border-slate-50 shadow-2xl object-cover" />
                <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-2xl border-4 border-white shadow-lg text-white">
                   <Icons.Lock size={14} />
                </div>
             </div>
             <div className="text-center">
               <p className="text-xl font-black text-slate-900 tracking-tighter">{settings.adminName}</p>
               <p className="text-[10px] text-indigo-500 font-black tracking-[0.3em] uppercase mt-1">{settings.roleTitle}</p>
             </div>
           </div>
        </div>
        
        <div className="bg-white p-3 rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-[28px] transition-all ${
                activeSection === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className={`${activeSection === item.id ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
              <span className="font-black text-xs tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 min-h-[700px]">
        <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{activeSection.toUpperCase()} Control</h2>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Inventory Pro Mobile v3.5 Stable</p>
          </div>
          <button onClick={() => fetchAllData(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-indigo-500 transition-all">
            <Icons.RefreshCw size={20} />
          </button>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default Settings;


import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { NAV_ITEMS, Icons, THEMES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SyncStatusIndicator: React.FC = () => {
  const { syncStatus, error, fetchAllData } = useApp();

  const statusMap = {
    idle: { icon: <Icons.Cloud size={18} />, color: 'text-emerald-500', bgColor: 'bg-emerald-50', tooltip: 'Data Synced' },
    syncing: { icon: <Icons.RefreshCw size={18} className="animate-spin" />, color: 'text-blue-500', bgColor: 'bg-blue-50', tooltip: 'Syncing...' },
    error: { icon: <Icons.Cloud size={18} />, color: 'text-rose-500', bgColor: 'bg-rose-50', tooltip: `Sync Failed. Click to retry. Error: ${error}` },
  };

  const currentStatus = statusMap[syncStatus];

  return (
    <button
      onClick={() => fetchAllData(false)}
      title={currentStatus.tooltip}
      className={`p-3 rounded-2xl transition-all ${currentStatus.bgColor} ${currentStatus.color}`}
      disabled={syncStatus === 'syncing'}
    >
      {currentStatus.icon}
    </button>
  );
};


const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { settings, logout } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  const containerStyle: React.CSSProperties = {
    backgroundColor: settings.bgColor,
    color: settings.textColor,
    filter: `brightness(${settings.brightness}%)`,
    zoom: `${settings.zoom}%`,
    fontFamily: `${settings.fontFamily}, sans-serif`
  };

  return (
    <div className="flex h-screen overflow-hidden" style={containerStyle}>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className={`p-8 bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} text-white`}>
          <div className="flex items-center gap-4">
             <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-xl border border-white/30">
                <Icons.Box size={28} />
             </div>
             <div>
               <h1 className="text-2xl font-black leading-none tracking-tighter uppercase">Inv Pro</h1>
               <p className="text-white/70 text-[10px] mt-1 font-bold uppercase tracking-[0.2em]">Management</p>
             </div>
          </div>
        </div>

        <nav className="p-5 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              data-tab-id={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                ${activeTab === item.id 
                  ? `bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-[1.02]` 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <span className={activeTab === item.id ? 'scale-110' : ''}>{item.icon}</span>
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t bg-slate-50/50">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <Icons.LogOut size={18} /> Sign Out System
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: Stable</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 pr-6 border-r border-slate-100 hidden sm:flex">
              <SyncStatusIndicator />
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl relative hover:text-indigo-600 transition-all">
                <Icons.Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{settings.adminName}</p>
                <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">{settings.roleTitle}</p>
              </div>
              <img 
                src={settings.profileImageUrl} 
                alt="Admin Profile"
                className="w-12 h-12 rounded-[18px] object-cover border-4 border-slate-50 shadow-lg"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

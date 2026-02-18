
import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IndianEntry from './components/IndianEntry';
import BillInfo from './components/BillInfo';
import MasterDataSheet from './components/MasterDataSheet';
import ExportInfo from './components/ExportInfo';
import AccountInfo from './components/AccountInfo';
import HMCutoff from './components/HMCutoff';
import TruckInfo from './components/TruckInfo';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import Login from './components/Login';
import PriceRateSettings from './components/PriceRateSettings';
import { Icons } from './components/../constants';

const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-600">
    <div className="ipad-loader mb-4"></div>
    <p className="text-white font-black animate-pulse tracking-widest text-xs uppercase">Syncing with Google Sheets...</p>
  </div>
);

const FullScreenError: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-rose-50 p-4 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-6">
            <Icons.Cloud size={40} />
        </div>
        <h2 className="text-xl font-black text-rose-900">Connection Error</h2>
        <p className="text-rose-600 max-w-sm mt-2 mb-8">{message}</p>
        <button
            onClick={() => onRetry()}
            className="px-8 py-4 bg-rose-600 text-white font-bold rounded-2xl flex items-center gap-2"
        >
            <Icons.RefreshCw size={16} /> Retry Connection
        </button>
    </div>
);

const MainContent: React.FC = () => {
  const { isAuthenticated, isLoading, error, fetchAllData, indianEntries } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }
  
  if (isLoading) {
    return <FullScreenLoader />;
  }

  // Show full screen error only if the initial data load fails (i.e., we have an error and no data).
  // Subsequent background sync errors will be handled by the new indicator in Layout.
  if (error && !indianEntries.length) {
    return <FullScreenError message={error} onRetry={() => fetchAllData(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'indian-entry': return <IndianEntry />;
      case 'bill-info': return <BillInfo />;
      case 'master-data': return <MasterDataSheet />;
      case 'export-info': return <ExportInfo />;
      case 'account-info': return <AccountInfo />;
      case 'hm-cutoff': return <HMCutoff />;
      case 'truck-info': return <TruckInfo />;
      case 'price-rates': return <PriceRateSettings />;
      case 'user-management': return <UserManagement />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

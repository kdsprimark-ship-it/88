
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

const MainContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
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

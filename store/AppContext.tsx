
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, IndianEntry, BillInfo, AccountEntry, TruckInfo, Settings, BusinessEntity, DepotCode } from '../types';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  settings: Settings;
  indianEntries: IndianEntry[];
  billInfos: BillInfo[];
  accountEntries: AccountEntry[];
  truckInfos: TruckInfo[];
  businessEntities: BusinessEntity[];
  depotCodes: DepotCode[];
  users: User[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  // Indian Entry
  addIndianEntry: (e: Omit<IndianEntry, 'id'>) => void;
  updateIndianEntry: (id: string, e: Partial<IndianEntry>) => void;
  deleteIndianEntry: (id: string) => void;
  // Bill Info
  addBillInfo: (b: Omit<BillInfo, 'id'>) => void;
  deleteBillInfo: (id: string) => void;
  // Account Info
  addAccountEntry: (a: Omit<AccountEntry, 'id'>) => void;
  deleteAccountEntry: (id: string) => void;
  // Truck Info
  addTruckInfo: (t: Omit<TruckInfo, 'id'>) => void;
  deleteTruckInfo: (id: string) => void;
  // Business Entities
  addBusinessEntity: (e: Omit<BusinessEntity, 'id'>) => void;
  removeBusinessEntity: (id: string) => void;
  // Depot Codes
  addDepotCode: (c: string) => void;
  removeDepotCode: (id: string) => void;
  // Users
  addUser: (u: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  // System
  resetApp: () => void;
  exportBackup: () => void;
  importBackup: (data: string) => void;
}

const DEFAULT_SETTINGS: Settings = {
  adminName: 'Inventory Admin',
  roleTitle: 'Administrator',
  profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  theme: 'Ocean Breeze',
  brightness: 100,
  zoom: 100,
  fontFamily: 'Poppins',
  bgColor: '#f8fafc',
  textColor: '#0f172a',
  language: 'en'
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('is_auth') === 'true');
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('app_settings_v3_5');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [indianEntries, setIndianEntries] = useState<IndianEntry[]>(() => {
    const saved = localStorage.getItem('indian_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [billInfos, setBillInfos] = useState<BillInfo[]>(() => {
    const saved = localStorage.getItem('bill_infos');
    return saved ? JSON.parse(saved) : [];
  });

  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>(() => {
    const saved = localStorage.getItem('account_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [truckInfos, setTruckInfos] = useState<TruckInfo[]>(() => {
    const saved = localStorage.getItem('truck_infos');
    return saved ? JSON.parse(saved) : [];
  });

  const [depotCodes, setDepotCodes] = useState<DepotCode[]>(() => {
    const saved = localStorage.getItem('depot_codes');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'OCL' },
      { id: '2', code: 'SAPL' },
      { id: '3', code: 'KDS' },
      { id: '4', code: 'VERTEX' },
    ];
  });

  const [businessEntities, setBusinessEntities] = useState<BusinessEntity[]>(() => {
    const saved = localStorage.getItem('business_entities');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'BUYER', name: 'H&M' },
      { id: '2', type: 'BUYER', name: 'H&M SEA AIR' },
      { id: '3', type: 'BUYER', name: 'PRIMARK' },
      { id: '4', type: 'BUYER', name: 'MATALON' },
      { id: '5', type: 'SHIPPER', name: 'CONFERENCE KNITWEAR LTD' },
      { id: '6', type: 'DEPOT', name: 'OCL' },
      { id: '7', type: 'DEPOT', name: 'SAPL' },
      { id: '8', type: 'DEPOT', name: 'KDS' },
    ];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users_list');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Admin', email: 'admin@app.com', role: 'Administrator', permissions: ['all'] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('is_auth', isAuthenticated.toString());
    localStorage.setItem('app_settings_v3_5', JSON.stringify(settings));
    localStorage.setItem('indian_entries', JSON.stringify(indianEntries));
    localStorage.setItem('bill_infos', JSON.stringify(billInfos));
    localStorage.setItem('account_entries', JSON.stringify(accountEntries));
    localStorage.setItem('truck_infos', JSON.stringify(truckInfos));
    localStorage.setItem('business_entities', JSON.stringify(businessEntities));
    localStorage.setItem('depot_codes', JSON.stringify(depotCodes));
    localStorage.setItem('users_list', JSON.stringify(users));
  }, [isAuthenticated, settings, indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, users]);

  const login = (email: string, pass: string) => {
    // Basic logic for demo - in real app, check against users list
    if ((email === 'admin@app.com' && pass === 'admin123') || email === 'user@app.com') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));

  const addIndianEntry = (e: Omit<IndianEntry, 'id'>) => {
    setIndianEntries(prev => [{ ...e, id: Date.now().toString() }, ...prev]);
  };
  const updateIndianEntry = (id: string, e: Partial<IndianEntry>) => {
    setIndianEntries(prev => prev.map(item => item.id === id ? { ...item, ...e } : item));
  };
  const deleteIndianEntry = (id: string) => {
    setIndianEntries(prev => prev.filter(e => e.id !== id));
  };

  const addBillInfo = (b: Omit<BillInfo, 'id'>) => {
    setBillInfos(prev => [{ ...b, id: Date.now().toString() }, ...prev]);
  };
  const deleteBillInfo = (id: string) => {
    setBillInfos(prev => prev.filter(b => b.id !== id));
  };

  const addAccountEntry = (a: Omit<AccountEntry, 'id'>) => {
    setAccountEntries(prev => [{ ...a, id: Date.now().toString() }, ...prev]);
  };
  const deleteAccountEntry = (id: string) => {
    setAccountEntries(prev => prev.filter(a => a.id !== id));
  };

  const addTruckInfo = (t: Omit<TruckInfo, 'id'>) => {
    setTruckInfos(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
  };
  const deleteTruckInfo = (id: string) => {
    setTruckInfos(prev => prev.filter(t => t.id !== id));
  };

  const addBusinessEntity = (e: Omit<BusinessEntity, 'id'>) => {
    setBusinessEntities(prev => [...prev, { ...e, id: Date.now().toString() }]);
  };
  const removeBusinessEntity = (id: string) => {
    setBusinessEntities(prev => prev.filter(e => e.id !== id));
  };

  const addDepotCode = (code: string) => {
    setDepotCodes(prev => [...prev, { id: Date.now().toString(), code: code.toUpperCase() }]);
  };
  const removeDepotCode = (id: string) => {
    setDepotCodes(prev => prev.filter(c => c.id !== id));
  };

  const addUser = (u: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...u, id: Date.now().toString() }]);
  };
  const deleteUser = (id: string) => {
    if (users.length > 1) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const exportBackup = () => {
    const data = { settings, indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, users };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importBackup = (dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      if (data.settings) setSettings(data.settings);
      if (data.indianEntries) setIndianEntries(data.indianEntries);
      if (data.billInfos) setBillInfos(data.billInfos);
      if (data.accountEntries) setAccountEntries(data.accountEntries);
      if (data.truckInfos) setTruckInfos(data.truckInfos);
      if (data.businessEntities) setBusinessEntities(data.businessEntities);
      if (data.depotCodes) setDepotCodes(data.depotCodes);
      if (data.users) setUsers(data.users);
      alert('System Restored Successfully!');
    } catch (e) {
      alert('Critical Error: Invalid backup file format.');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser: users[0],
      isAuthenticated,
      settings, indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, users,
      login, logout, updateSettings, addIndianEntry, updateIndianEntry, deleteIndianEntry,
      addBillInfo, deleteBillInfo,
      addAccountEntry, deleteAccountEntry,
      addTruckInfo, deleteTruckInfo,
      addBusinessEntity, removeBusinessEntity,
      addDepotCode, removeDepotCode,
      addUser, deleteUser,
      resetApp, exportBackup, importBackup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

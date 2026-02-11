
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, IndianEntry, BillInfo, AccountEntry, TruckInfo, Settings, BusinessEntity, DepotCode } from '../types';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxG2iHKQvO9QiwU9N-MowsDxYelRp6FERNZ89UhYETiJuY3_ySp3EboxgUdA7L2E8UfyA/exec';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  settings: Settings;
  isLoading: boolean;
  error: string | null;
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
  fetchAllData: () => Promise<void>;
  // API Methods
  addIndianEntry: (e: Omit<IndianEntry, 'id'>) => Promise<void>;
  updateIndianEntry: (id: string, e: Partial<IndianEntry>) => Promise<void>;
  deleteIndianEntry: (id: string) => Promise<void>;
  addBillInfo: (b: Omit<BillInfo, 'id'>) => Promise<void>;
  deleteBillInfo: (id: string) => Promise<void>;
  addAccountEntry: (a: Omit<AccountEntry, 'id'>) => Promise<void>;
  deleteAccountEntry: (id: string) => Promise<void>;
  addTruckInfo: (t: Omit<TruckInfo, 'id'>) => Promise<void>;
  deleteTruckInfo: (id: string) => Promise<void>;
  addBusinessEntity: (e: Omit<BusinessEntity, 'id'>) => Promise<void>;
  removeBusinessEntity: (id: string) => Promise<void>;
  addDepotCode: (c: string) => Promise<void>;
  removeDepotCode: (id: string) => Promise<void>;
  addUser: (u: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
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
    const saved = localStorage.getItem('app_settings_v3_6');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [indianEntries, setIndianEntries] = useState<IndianEntry[]>([]);
  const [billInfos, setBillInfos] = useState<BillInfo[]>([]);
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([]);
  const [truckInfos, setTruckInfos] = useState<TruckInfo[]>([]);
  const [businessEntities, setBusinessEntities] = useState<BusinessEntity[]>([]);
  const [depotCodes, setDepotCodes] = useState<DepotCode[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const apiRequest = async (action: string, payload?: any) => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, payload }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || `API action '${action}' failed.`);
      }
      return result.data;
    } catch (e: any) {
      setError(e.message);
      console.error(`API Request Failed for action ${action}:`, e);
      throw e; // Re-throw for component-level handling
    }
  };
  
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRequest('readAll');
      if (data) {
        setIndianEntries(data.indianEntries || []);
        setBillInfos(data.billInfos || []);
        setAccountEntries(data.accountEntries || []);
        setTruckInfos(data.truckInfos || []);
        setBusinessEntities(data.businessEntities || []);
        setDepotCodes(data.depotCodes || []);
        setUsers(data.users || []);
      }
    } catch (e: any) {
       setError('Failed to load data from Google Sheets. Please check your connection or script URL.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      setIsLoading(false);
      // Clear data on logout
      setIndianEntries([]);
      setBillInfos([]);
      setAccountEntries([]);
      setTruckInfos([]);
      setBusinessEntities([]);
      setDepotCodes([]);
      setUsers([]);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    localStorage.setItem('is_auth', isAuthenticated.toString());
    localStorage.setItem('app_settings_v3_6', JSON.stringify(settings));
  }, [isAuthenticated, settings]);

  const login = (email: string, pass: string) => {
    if ((email === 'admin@app.com' && pass === 'admin123') || email === 'user@app.com') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  const logout = () => setIsAuthenticated(false);
  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));

  const createCrudFunction = (actionPrefix: string) => ({
      add: async (payload: any) => { await apiRequest(`add${actionPrefix}`, payload); await fetchAllData(); },
      update: async (payload: any) => { await apiRequest(`update${actionPrefix}`, payload); await fetchAllData(); },
      delete: async (id: string) => { await apiRequest(`delete${actionPrefix}`, { id }); await fetchAllData(); },
  });

  const indianEntryCrud = createCrudFunction('IndianEntry');
  const billInfoCrud = createCrudFunction('BillInfo');
  const accountEntryCrud = createCrudFunction('AccountEntry');
  const truckInfoCrud = createCrudFunction('TruckInfo');
  const businessEntityCrud = createCrudFunction('BusinessEntity');
  const depotCodeCrud = createCrudFunction('DepotCode');
  const userCrud = createCrudFunction('User');

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
  
  const importBackup = (dataString: string) => alert("Import is disabled when connected to Google Sheets.");

  return (
    <AppContext.Provider value={{
      currentUser: users[0] || null, isAuthenticated, settings, isLoading, error,
      indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, users,
      login, logout, updateSettings, fetchAllData,
      addIndianEntry: indianEntryCrud.add,
      updateIndianEntry: async (id, data) => await indianEntryCrud.update({ id, ...data }),
      deleteIndianEntry: indianEntryCrud.delete,
      addBillInfo: billInfoCrud.add,
      deleteBillInfo: billInfoCrud.delete,
      addAccountEntry: accountEntryCrud.add,
      deleteAccountEntry: accountEntryCrud.delete,
      addTruckInfo: truckInfoCrud.add,
      deleteTruckInfo: truckInfoCrud.delete,
      addBusinessEntity: businessEntityCrud.add,
      removeBusinessEntity: businessEntityCrud.delete,
      addDepotCode: async (code) => await depotCodeCrud.add({ code }),
      removeDepotCode: depotCodeCrud.delete,
      addUser: userCrud.add,
      deleteUser: userCrud.delete,
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

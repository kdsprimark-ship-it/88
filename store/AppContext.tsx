
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, IndianEntry, BillInfo, AccountEntry, TruckInfo, Settings, BusinessEntity, DepotCode, PriceRate } from '../types';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxG2iHKQvO9QiwU9N-MowsDxYelRp6FERNZ89UhYETiJuY3_ySp3EboxgUdA7L2E8UfyA/exec';

// Helper to safely get and parse data from localStorage
function getStoredState<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(key);
    try {
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (e: any) {
        console.warn(`Could not parse stored state for key: ${key}`, e);
        localStorage.removeItem(key); // Clear corrupted data
        return defaultValue;
    }
}

const DATA_VERSION = 'v3.6';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  indianEntries: IndianEntry[];
  billInfos: BillInfo[];
  accountEntries: AccountEntry[];
  truckInfos: TruckInfo[];
  businessEntities: BusinessEntity[];
  depotCodes: DepotCode[];
  priceRates: PriceRate[];
  users: User[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  fetchAllData: (isBackgroundRefresh?: boolean) => Promise<void>;
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
  addPriceRate: (r: Omit<PriceRate, 'id'>) => Promise<void>;
  deletePriceRate: (id: string) => Promise<void>;
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
  profileImageUrl: 'https://images.unsplash.com/photo-153571387S002-d1d0cf377fde?w=200&h=200&fit=crop',
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
  const [settings, setSettings] = useState<Settings>(() => getStoredState(`app_settings_${DATA_VERSION}`, DEFAULT_SETTINGS));

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  const [indianEntries, setIndianEntries] = useState<IndianEntry[]>(() => getStoredState(`data_${DATA_VERSION}_indianEntries`, []));
  const [billInfos, setBillInfos] = useState<BillInfo[]>(() => getStoredState(`data_${DATA_VERSION}_billInfos`, []));
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>(() => getStoredState(`data_${DATA_VERSION}_accountEntries`, []));
  const [truckInfos, setTruckInfos] = useState<TruckInfo[]>(() => getStoredState(`data_${DATA_VERSION}_truckInfos`, []));
  const [businessEntities, setBusinessEntities] = useState<BusinessEntity[]>(() => getStoredState(`data_${DATA_VERSION}_businessEntities`, []));
  const [depotCodes, setDepotCodes] = useState<DepotCode[]>(() => getStoredState(`data_${DATA_VERSION}_depotCodes`, []));
  const [priceRates, setPriceRates] = useState<PriceRate[]>(() => getStoredState(`data_${DATA_VERSION}_priceRates`, []));
  const [users, setUsers] = useState<User[]>(() => getStoredState(`data_${DATA_VERSION}_users`, []));

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
      console.error(`API Request Failed for action ${action}:`, e);
      throw e; // Re-throw for component-level handling
    }
  };
  
  const fetchAllData = useCallback(async (isBackgroundRefresh = false) => {
    // Prevent multiple syncs at once
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
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
        setPriceRates(data.priceRates || []);
        setUsers(data.users || []);
        setSyncStatus('idle');
      }
    } catch (e: any) {
       const msg = 'Failed to sync with Google Sheets. Displaying local data. Please check connection.';
       setError(msg);
       setSyncStatus('error');
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }, [syncStatus]); // Add syncStatus to dependencies to prevent race conditions

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData(false); // Initial fetch with loader

      // Fallback periodic sync
      const intervalId = setInterval(() => {
        fetchAllData(true); 
      }, 30000);

      return () => clearInterval(intervalId); // Cleanup on logout/unmount
    } else {
      setIsLoading(false);
      setIndianEntries([]); setBillInfos([]); setAccountEntries([]); setTruckInfos([]);
      setBusinessEntities([]); setDepotCodes([]); setPriceRates([]); setUsers([]);
    }
  }, [isAuthenticated]); // Removed fetchAllData from here to prevent re-triggering this whole effect block
  
  // Real-time sync on focus
  useEffect(() => {
    const handleSync = () => {
        if (isAuthenticated && document.visibilityState === 'visible') {
            fetchAllData(true);
        }
    };
    
    window.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
        window.removeEventListener('visibilitychange', handleSync);
        window.removeEventListener('focus', handleSync);
    };
  }, [isAuthenticated, fetchAllData]);

  useEffect(() => {
    localStorage.setItem('is_auth', isAuthenticated.toString());
    localStorage.setItem(`app_settings_${DATA_VERSION}`, JSON.stringify(settings));
  }, [isAuthenticated, settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`data_${DATA_VERSION}_indianEntries`, JSON.stringify(indianEntries));
      localStorage.setItem(`data_${DATA_VERSION}_billInfos`, JSON.stringify(billInfos));
      localStorage.setItem(`data_${DATA_VERSION}_accountEntries`, JSON.stringify(accountEntries));
      localStorage.setItem(`data_${DATA_VERSION}_truckInfos`, JSON.stringify(truckInfos));
      localStorage.setItem(`data_${DATA_VERSION}_businessEntities`, JSON.stringify(businessEntities));
      localStorage.setItem(`data_${DATA_VERSION}_depotCodes`, JSON.stringify(depotCodes));
      localStorage.setItem(`data_${DATA_VERSION}_priceRates`, JSON.stringify(priceRates));
      localStorage.setItem(`data_${DATA_VERSION}_users`, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, priceRates, users]);

  const login = (email: string, pass: string) => {
    if ((email === 'admin@app.com' && pass === 'admin123') || email === 'user@app.com') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  const logout = () => setIsAuthenticated(false);
  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));

  // --- Optimistic CRUD Functions ---

  const addIndianEntry = async (entry: Omit<IndianEntry, 'id'>) => {
    const tempId = `optimistic-${Date.now()}`;
    const newEntry: IndianEntry = { ...entry, id: tempId };
    setIndianEntries(prev => [newEntry, ...prev]);
    try {
        await apiRequest('addIndianEntry', entry);
        await fetchAllData(true);
    } catch (e) {
        setIndianEntries(prev => prev.filter(ie => ie.id !== tempId));
        throw e;
    }
  };

  const updateIndianEntry = async (id: string, entryData: Partial<IndianEntry>) => {
    const originalEntries = indianEntries;
    const entryToUpdate = originalEntries.find(e => e.id === id);
    if (!entryToUpdate) throw new Error("Entry not found for update");
    const updatedEntry = { ...entryToUpdate, ...entryData };
    setIndianEntries(prev => prev.map(e => e.id === id ? updatedEntry : e));
    try {
        await apiRequest('updateIndianEntry', { id, ...entryData });
        await fetchAllData(true);
    } catch (e) {
        setIndianEntries(originalEntries);
        throw e;
    }
  };

  const deleteIndianEntry = async (id: string) => {
    const originalEntries = indianEntries;
    setIndianEntries(prev => prev.filter(e => e.id !== id));
    try {
        await apiRequest('deleteIndianEntry', { id });
        await fetchAllData(true);
    } catch(e) {
        setIndianEntries(originalEntries);
        throw e;
    }
  };
  
  const addBillInfo = async (bill: Omit<BillInfo, 'id'>) => {
    const tempId = `optimistic-${Date.now()}`;
    const newBill: BillInfo = { ...bill, id: tempId };
    setBillInfos(prev => [newBill, ...prev]);
    try {
        await apiRequest('addBillInfo', bill);
        await fetchAllData(true);
    } catch (e) {
        setBillInfos(prev => prev.filter(b => b.id !== tempId));
        throw e;
    }
  };

  const deleteBillInfo = async (id: string) => {
      const originalBills = billInfos;
      setBillInfos(prev => prev.filter(b => b.id !== id));
      try {
          await apiRequest('deleteBillInfo', { id });
          await fetchAllData(true);
      } catch(e) {
          setBillInfos(originalBills);
          throw e;
      }
  };

  const addAccountEntry = async (entry: Omit<AccountEntry, 'id'>) => {
      const tempId = `optimistic-${Date.now()}`;
      const newEntry: AccountEntry = { ...entry, id: tempId };
      setAccountEntries(prev => [newEntry, ...prev]);
      try {
          await apiRequest('addAccountEntry', entry);
          await fetchAllData(true);
      } catch (e) {
          setAccountEntries(prev => prev.filter(a => a.id !== tempId));
          throw e;
      }
  };

  const deleteAccountEntry = async (id: string) => {
      const originalEntries = accountEntries;
      setAccountEntries(prev => prev.filter(a => a.id !== id));
      try {
          await apiRequest('deleteAccountEntry', { id });
          await fetchAllData(true);
      } catch(e) {
          setAccountEntries(originalEntries);
          throw e;
      }
  };

  const addTruckInfo = async (info: Omit<TruckInfo, 'id'>) => {
      const tempId = `optimistic-${Date.now()}`;
      const newInfo: TruckInfo = { ...info, id: tempId };
      setTruckInfos(prev => [newInfo, ...prev]);
      try {
          await apiRequest('addTruckInfo', info);
          await fetchAllData(true);
      } catch (e) {
          setTruckInfos(prev => prev.filter(t => t.id !== tempId));
          throw e;
      }
  };

  const deleteTruckInfo = async (id: string) => {
      const originalInfos = truckInfos;
      setTruckInfos(prev => prev.filter(t => t.id !== id));
      try {
          await apiRequest('deleteTruckInfo', { id });
          await fetchAllData(true);
      } catch(e) {
          setTruckInfos(originalInfos);
          throw e;
      }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
      const tempId = `optimistic-${Date.now()}`;
      const newUser: User = { ...user, id: tempId };
      setUsers(prev => [newUser, ...prev]);
      try {
          await apiRequest('addUser', user);
          await fetchAllData(true);
      } catch (e) {
          setUsers(prev => prev.filter(u => u.id !== tempId));
          throw e;
      }
  };
  
  const deleteUser = async (id: string) => {
      const originalUsers = users;
      setUsers(prev => prev.filter(u => u.id !== id));
      try {
          await apiRequest('deleteUser', { id });
          await fetchAllData(true);
      } catch(e) {
          setUsers(originalUsers);
          throw e;
      }
  };

  const addBusinessEntity = async (entity: Omit<BusinessEntity, 'id'>) => {
    const tempId = `optimistic-${Date.now()}`;
    const newEntity: BusinessEntity = { ...entity, id: tempId };
    setBusinessEntities(prev => [...prev, newEntity].sort((a, b) => a.name.localeCompare(b.name)));
    try {
        await apiRequest('addBusinessEntity', entity);
        await fetchAllData(true);
    } catch (e) {
        setBusinessEntities(prev => prev.filter(be => be.id !== tempId));
        throw e;
    }
  };

  const removeBusinessEntity = async (id: string) => {
    const originalEntities = businessEntities;
    setBusinessEntities(prev => prev.filter(be => be.id !== id));
    try {
        await apiRequest('deleteBusinessEntity', { id });
        await fetchAllData(true);
    } catch (e) {
        setBusinessEntities(originalEntities);
        throw e;
    }
  };
  
  const addDepotCode = async (code: string) => {
    const tempId = `optimistic-${Date.now()}`;
    const newCode: DepotCode = { id: tempId, code };
    setDepotCodes(prev => [...prev, newCode].sort((a, b) => a.code.localeCompare(b.code)));
    try {
        await apiRequest('addDepotCode', { code });
        await fetchAllData(true);
    } catch (e) {
        setDepotCodes(prev => prev.filter(c => c.id !== tempId));
        throw e;
    }
  }

  const removeDepotCode = async (id: string) => {
    const originalCodes = depotCodes;
    setDepotCodes(prev => prev.filter(c => c.id !== id));
    try {
        await apiRequest('deleteDepotCode', { id });
        await fetchAllData(true);
    } catch(e) {
        setDepotCodes(originalCodes);
        throw e;
    }
  }
  
  const addPriceRate = async (rate: Omit<PriceRate, 'id'>) => {
    const tempId = `optimistic-${Date.now()}`;
    const newRate: PriceRate = { ...rate, id: tempId };
    setPriceRates(prev => [...prev, newRate]);
    try {
        await apiRequest('addPriceRate', rate);
        await fetchAllData(true);
    } catch (e) {
        setPriceRates(prev => prev.filter(r => r.id !== tempId));
        throw e;
    }
  };

  const deletePriceRate = async (id: string) => {
    const originalRates = priceRates;
    setPriceRates(prev => prev.filter(r => r.id !== id));
    try {
        await apiRequest('deletePriceRate', { id });
        await fetchAllData(true);
    } catch(e) {
        setPriceRates(originalRates);
        throw e;
    }
  };

  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const exportBackup = () => {
     const data = { settings, indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, priceRates, users };
     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
     link.click();
  };
  
  const importBackup = (dataString: string) => {
    if (!confirm('Restore from backup? This temporarily replaces your current view with the backup data. Reloading the app will re-sync from Google Sheets.')) {
      return;
    }
    try {
      const data = JSON.parse(dataString);
      if (data.settings) setSettings(data.settings);
      if (data.indianEntries) setIndianEntries(data.indianEntries);
      if (data.billInfos) setBillInfos(data.billInfos);
      if (data.accountEntries) setAccountEntries(data.accountEntries);
      if (data.truckInfos) setTruckInfos(data.truckInfos);
      if (data.businessEntities) setBusinessEntities(data.businessEntities);
      if (data.depotCodes) setDepotCodes(data.depotCodes);
      if (data.priceRates) setPriceRates(data.priceRates);
      if (data.users) setUsers(data.users);
      alert('Local data view has been restored from backup.');
    } catch (error) {
      alert('Failed to import backup. The file might be corrupted.');
      console.error("Backup import error:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser: users[0] || null, isAuthenticated, settings, isLoading, error, syncStatus,
      indianEntries, billInfos, accountEntries, truckInfos, businessEntities, depotCodes, priceRates, users,
      login, logout, updateSettings, fetchAllData,
      addIndianEntry,
      updateIndianEntry,
      deleteIndianEntry,
      addBillInfo,
      deleteBillInfo,
      addAccountEntry,
      deleteAccountEntry,
      addTruckInfo,
      deleteTruckInfo,
      addBusinessEntity,
      removeBusinessEntity,
      addDepotCode,
      removeDepotCode,
      addPriceRate,
      deletePriceRate,
      addUser,
      deleteUser,
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

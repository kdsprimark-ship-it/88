
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';
import AddEntityModal from './AddEntityModal';
import { IndianEntry as IndianEntryType } from '../types';

const IndianEntryForm: React.FC = () => {
  const { businessEntities, addIndianEntry, updateIndianEntry, deleteIndianEntry, indianEntries, settings, priceRates } = useApp();
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState<'SHIPPER' | 'BUYER' | 'DEPOT' | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    shipperName: '',
    buyerName: '',
    depotName: '',
    doc: 0,
    ctn: 0,
    ton: 0,
    truckUnload: 0,
    con: 0,
    others: 0
  });

  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const shippers = businessEntities.filter(e => e.type === 'SHIPPER');
  const buyers = businessEntities.filter(e => e.type === 'BUYER');
  const depots = businessEntities.filter(e => e.type === 'DEPOT');

  const defaultRates = useMemo(() => ({
    'DOC': 485,
    'CTN': 3,
    'TON': 249,
    'TRUCK UNLOAD': 150
  }), []);

  useEffect(() => {
    const getRate = (condition: 'DOC' | 'CTN' | 'TON' | 'TRUCK UNLOAD') => {
      const buyerSpecificRate = priceRates.find(r => r.buyerName === formData.buyerName && r.condition === condition);
      return buyerSpecificRate ? buyerSpecificRate.rate : defaultRates[condition];
    };

    let total = 0;
    total += formData.doc * getRate('DOC');
    total += formData.ctn * getRate('CTN');
    total += formData.ton * getRate('TON');
    total += formData.truckUnload * getRate('TRUCK UNLOAD');
    total += (formData.con || 0);
    total += (formData.others || 0);
    
    setCalculatedTotal(total);
  }, [formData, priceRates, defaultRates]);

  const resetForm = () => {
     setFormData({
      date: new Date().toISOString().split('T')[0],
      invoiceNo: '', shipperName: '', buyerName: '', depotName: '',
      doc: 0, ctn: 0, ton: 0, truckUnload: 0, con: 0, others: 0
    });
  }

  const handleSaveFromModal = (newName: string) => {
    if (modalType) {
        setFormData(prev => ({ ...prev, [`${modalType.toLowerCase()}Name`]: newName }));
    }
    setModalType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNo || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateIndianEntry(isEditing, { ...formData, totalTaka: calculatedTotal });
      } else {
        await addIndianEntry({ ...formData, totalTaka: calculatedTotal });
      }
      resetForm();
      setIsEditing(null);
    } catch (error) {
      alert('Operation Failed: Could not save data to Google Sheets.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: IndianEntryType) => {
    setIsEditing(entry.id);
    setFormData({
      date: entry.date, invoiceNo: entry.invoiceNo, shipperName: entry.shipperName,
      buyerName: entry.buyerName, depotName: entry.depotName, doc: entry.doc,
      ctn: entry.ctn, ton: entry.ton, truckUnload: entry.truckUnload,
      con: entry.con, others: entry.others
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this entry from Google Sheets? This action cannot be undone.')) {
          try {
              await deleteIndianEntry(id);
              alert('Entry deleted successfully.');
          } catch(e) {
              alert('Failed to delete entry.');
          }
      }
  };

  const handleNumChange = (field: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const renderValue = (val: number) => (val === 0 ? '' : val.toString());

  return (
    <div className="space-y-6">
       {modalType && (
        <AddEntityModal 
          entityType={modalType}
          onClose={() => setModalType(null)}
          onSave={handleSaveFromModal}
        />
      )}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
           <div className={`p-2 rounded-xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} text-white`}>
              <Icons.FileSpreadsheet size={20} />
           </div>
           {isEditing ? 'EDIT INDIAN ENTRY' : 'INDIAN ENTRY FORM'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">DATE</label>
            <input type="date" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-semibold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">INVOICE NO-</label>
            <input type="text" required placeholder="e.g. 10223-A" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" value={formData.invoiceNo} onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">SHIPPER NAME</label>
                <button type="button" onClick={() => setModalType('SHIPPER')} className="px-3 py-1 bg-indigo-50 text-indigo-500 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-all flex items-center gap-1"><Icons.Plus size={12}/> ADD</button>
            </div>
            <select required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-semibold" value={formData.shipperName} onChange={(e) => setFormData({...formData, shipperName: e.target.value})}>
              <option value="">Select Shipper</option>
              {shippers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">BUYER NAME</label>
                <button type="button" onClick={() => setModalType('BUYER')} className="px-3 py-1 bg-indigo-50 text-indigo-500 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-all flex items-center gap-1"><Icons.Plus size={12}/> ADD</button>
            </div>
            <select required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-semibold" value={formData.buyerName} onChange={(e) => setFormData({...formData, buyerName: e.target.value})}>
              <option value="">Select Buyer</option>
              {buyers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">DEPOT NAME</label>
              <button type="button" onClick={() => setModalType('DEPOT')} className="px-3 py-1 bg-indigo-50 text-indigo-500 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-all flex items-center gap-1"><Icons.Plus size={12}/> ADD</button>
            </div>
            <select required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-semibold" value={formData.depotName} onChange={(e) => setFormData({...formData, depotName: e.target.value})}>
              <option value="">Select Depot</option>
              {depots.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 col-span-1 md:col-span-2 lg:col-span-3 pt-8 border-t border-slate-50 mt-4">
            {[{ id: 'doc', label: 'DOC' }, { id: 'ctn', label: 'CTN' }, { id: 'ton', label: 'TON' }, { id: 'truckUnload', label: 'TRUCK UNLOAD' }, { id: 'con', label: 'CON' }, { id: 'others', label: 'OTHERS' }].map(item => (
              <div key={item.id} className="space-y-2 group">
                <label className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-indigo-500 transition-colors">{item.label}</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 transition-all font-mono" value={renderValue((formData as any)[item.id])} onChange={(e) => handleNumChange(item.id, e.target.value)} />
              </div>
            ))}
          </div>

          <div className={`col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 shadow-2xl`}>
            <div>
              <p className="text-slate-400 text-[10px] font-bold tracking-widest mb-1 uppercase">Total Taka Calculation</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-white/50 text-xl">৳</span>
                 <span className="text-4xl text-white font-black">{calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="flex gap-4">
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(null); resetForm(); }} className="px-8 py-5 bg-slate-700 text-white font-black rounded-[20px] uppercase tracking-widest text-sm">Cancel</button>
              )}
              <button type="submit" disabled={isSubmitting} className={`w-full sm:w-auto px-12 py-5 bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} text-white font-black rounded-[20px] transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50`}>
                {isSubmitting && <div className="ipad-loader !w-5 !h-5 border-white/20 border-t-white" />}
                {isSubmitting ? 'SAVING...' : isEditing ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Detailed Entry List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
              <tr>
                <th className="px-8 py-6">Date</th><th className="px-8 py-6">Invoice</th><th className="px-8 py-6">Buyer</th><th className="px-8 py-6">Depot</th><th className="px-8 py-6">Stats (D/C/T)</th><th className="px-8 py-6 text-right">Total Amount</th><th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {indianEntries.map((e, idx) => (
                <tr key={e.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-indigo-50/50 transition-colors`}>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{e.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{e.invoiceNo}</td>
                  <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700`}>{e.buyerName}</span></td>
                  <td className="px-8 py-6 text-sm font-semibold text-slate-600">{e.depotName}</td>
                  <td className="px-8 py-6 text-xs font-mono font-bold text-slate-400"><span className="text-blue-500">{e.doc || '0'}D</span> • <span className="text-emerald-500">{e.ctn || '0'}C</span> • <span className="text-amber-500">{e.ton || '0'}T</span></td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 text-right"><span className="text-xs font-bold text-slate-300 mr-1">৳</span>{e.totalTaka.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                       <button onClick={() => handleEdit(e)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"><Icons.RefreshCw size={16} /></button>
                       <button onClick={() => handleDelete(e.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Icons.Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {indianEntries.length === 0 && (
                <tr><td colSpan={7} className="px-8 py-20 text-center"><p className="text-slate-300 font-bold italic tracking-widest uppercase">No Entries Found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndianEntryForm;

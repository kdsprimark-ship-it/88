
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';

const AccountInfo: React.FC = () => {
  const { accountEntries, addAccountEntry, deleteAccountEntry, settings } = useApp();
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    amount: 0,
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose || formData.amount === 0) return alert('Purpose and Amount are required');
    addAccountEntry(formData);
    setFormData({ date: new Date().toISOString().split('T')[0], purpose: '', amount: 0, remarks: '' });
    alert('Cash In Entry Saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
           <div className={`p-2 rounded-xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} text-white`}>
              <Icons.Wallet size={20} />
           </div>
           CASH IN ENTRY
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DATE</label>
            <input type="date" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-semibold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PURPOSE</label>
            <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" placeholder="e.g. Sales" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AMOUNT (TK)</label>
            <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black" value={formData.amount === 0 ? '' : formData.amount} onChange={e => setFormData({...formData, amount: e.target.value === '' ? 0 : Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REMARKS</label>
            <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl" placeholder="Note..." value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
          </div>
          <button type="submit" className={`lg:col-span-4 py-5 bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} text-white font-black rounded-3xl hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-sm`}>
            SAVE TRANSACTION
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 font-black text-slate-900 tracking-tighter text-lg uppercase">Entry Display History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Purpose / Parpas</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {accountEntries.map((a, idx) => (
                <tr key={a.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/10'} hover:bg-emerald-50/30 transition-colors`}>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{a.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 uppercase">{a.purpose}</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-600">৳{a.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <button onClick={() => { if(confirm('Remove Entry?')) deleteAccountEntry(a.id); }} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Icons.Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;


import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';

const TruckInfo: React.FC = () => {
  const { truckInfos, addTruckInfo, deleteTruckInfo, businessEntities, settings } = useApp();
  const depots = businessEntities.filter(e => e.type === 'DEPOT');
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    truckNumber: '',
    driverMobile: '',
    depot: '',
    inTime: '',
    outTime: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrucks = truckInfos.filter(t => 
    t.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.depot.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.driverMobile.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.truckNumber || !formData.depot) return alert('Truck number and Depot are required');
    addTruckInfo(formData);
    setFormData({ date: new Date().toISOString().split('T')[0], truckNumber: '', driverMobile: '', depot: '', inTime: '', outTime: '' });
    alert('Truck Movement Logged!');
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase">
           <div className={`p-2 rounded-xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} text-white`}>
              <Icons.Truck size={20} />
           </div>
           Truck Movement Entry
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</label>
            <input type="date" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-semibold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TRUCK NUMBER</label>
            <input type="text" required placeholder="DHA-GA-11-2233" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-black uppercase" value={formData.truckNumber} onChange={e => setFormData({...formData, truckNumber: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DRIVERS MOBILE NO</label>
            <input type="tel" required placeholder="017xxxxxxxx" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" value={formData.driverMobile} onChange={e => setFormData({...formData, driverMobile: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEPOT</label>
            <select required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-semibold" value={formData.depot} onChange={e => setFormData({...formData, depot: e.target.value})}>
              <option value="">Select Depot</option>
              {depots.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IN TIME</label>
            <input type="time" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-mono" value={formData.inTime} onChange={e => setFormData({...formData, inTime: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OUT TIME</label>
            <input type="time" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-mono" value={formData.outTime} onChange={e => setFormData({...formData, outTime: e.target.value})} />
          </div>
          <button type="submit" className={`md:col-span-2 lg:col-span-3 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl tracking-widest uppercase text-sm`}>
            LOG MOVEMENT
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-slate-900 uppercase text-lg">Entry List Show</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
               <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Filter list..." className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={handlePrint} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"><Icons.Printer size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Truck Number</th>
                <th className="px-8 py-6">Depot</th>
                <th className="px-8 py-6">In/Out</th>
                <th className="px-8 py-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTrucks.map((t, idx) => (
                <tr key={t.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'} hover:bg-slate-100 transition-colors`}>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{t.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 uppercase">{t.truckNumber}</td>
                  <td className="px-8 py-6 text-sm font-black text-indigo-600">{t.depot}</td>
                  <td className="px-8 py-6 text-sm font-bold">
                    <span className="text-emerald-500">{t.inTime || '--'}</span> / <span className="text-rose-500">{t.outTime || '--'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => { if(confirm('Remove Log?')) deleteTruckInfo(t.id); }} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Icons.Trash2 size={16} /></button>
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

export default TruckInfo;

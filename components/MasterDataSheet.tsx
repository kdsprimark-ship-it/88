
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';

const MasterDataSheet: React.FC = () => {
  const { indianEntries, billInfos } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterShipper, setFilterShipper] = useState('');

  const filteredData = indianEntries.filter(entry => {
    const matchesSearch = entry.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || entry.date === filterDate;
    const matchesBuyer = !filterBuyer || entry.buyerName === filterBuyer;
    const matchesShipper = !filterShipper || entry.shipperName === filterShipper;
    
    return matchesSearch && matchesDate && matchesBuyer && matchesShipper;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Master Data Sheet</h3>
            <p className="text-slate-500 text-sm mt-1">Unified view of all system entries and movements</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              <Icons.Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
              <Icons.Printer size={16} /> Print Sheet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Invoice/Buyer..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <input 
            type="date" 
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <select 
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm"
            value={filterBuyer}
            onChange={e => setFilterBuyer(e.target.value)}
          >
            <option value="">All Buyers</option>
            {Array.from(new Set(indianEntries.map(e => e.buyerName))).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select 
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm"
            value={filterShipper}
            onChange={e => setFilterShipper(e.target.value)}
          >
            <option value="">All Shippers</option>
            {Array.from(new Set(indianEntries.map(e => e.shipperName))).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-50">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Buyer / Shipper</th>
                <th className="px-6 py-4">Depot</th>
                <th className="px-6 py-4">Details (D/C/T)</th>
                <th className="px-6 py-4">Total Bill</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map(entry => {
                const bill = billInfos.find(b => b.invoiceNo === entry.invoiceNo);
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{entry.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{entry.invoiceNo}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 leading-none">{entry.buyerName}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{entry.shipperName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{entry.depotName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {entry.doc}D • {entry.ctn}C • {entry.ton}T
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">৳{entry.totalTaka.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {bill ? (
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold ${bill.dueBill === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {bill.dueBill === 0 ? 'PAID' : 'PARTIAL'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[9px] font-bold">UNBILLED</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic">No entries match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterDataSheet;

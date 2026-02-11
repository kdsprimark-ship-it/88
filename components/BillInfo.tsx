
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';

const BillInfo: React.FC = () => {
  const { billInfos, addBillInfo, deleteBillInfo, indianEntries, settings } = useApp();
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    paidBill: 0,
  });

  const [matchedEntry, setMatchedEntry] = useState<any>(null);

  useEffect(() => {
    if (formData.invoiceNo) {
      const entry = indianEntries.find(e => e.invoiceNo.toLowerCase() === formData.invoiceNo.toLowerCase());
      setMatchedEntry(entry || null);
    } else {
      setMatchedEntry(null);
    }
  }, [formData.invoiceNo, indianEntries]);

  const totalBill = matchedEntry ? (matchedEntry.totalTaka + (matchedEntry.doc * 165)) : 0;
  const dueBill = Math.max(0, totalBill - formData.paidBill);
  const miscApprove = formData.paidBill > totalBill ? formData.paidBill - totalBill : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedEntry || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
        await addBillInfo({
            date: formData.date,
            invoiceNo: formData.invoiceNo,
            shipperName: matchedEntry.shipperName,
            totalDoc: matchedEntry.doc,
            totalIndian: matchedEntry.totalTaka,
            totalBill,
            paidBill: formData.paidBill,
            dueBill: dueBill,
            miscApprovedBill: miscApprove
        });
        setFormData({ ...formData, invoiceNo: '', paidBill: 0 });
        alert('Bill Information Logged to Cloud!');
    } catch(err) {
        alert('Failed to log bill information.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
      if (confirm('Delete this bill record permanently?')) {
          try {
              await deleteBillInfo(id);
              alert('Bill record deleted.');
          } catch(e) {
              alert('Failed to delete bill record.');
          }
      }
  };

  const handleNumChange = (val: string) => {
    setFormData(prev => ({ ...prev, paidBill: val === '' ? 0 : Number(val) }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} text-white`}><Icons.Receipt size={20} /></div>BILL INFORMATION
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BILLING DATE</label>
              <input type="date" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-semibold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">INVOICE NO</label>
              <input type="text" placeholder="Search Invoice..." className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PAID BILL (TK)</label>
              <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-black" value={formData.paidBill === 0 ? '' : formData.paidBill} onChange={e => handleNumChange(e.target.value)} />
            </div>
          </div>

          {matchedEntry ? (
            <div className="p-8 bg-slate-50 rounded-[32px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in zoom-in-95 duration-300">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">SHIPPER</p><p className="text-sm font-bold text-slate-900">{matchedEntry.shipperName}</p></div>
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">INDIAN AMOUNT</p><p className="text-sm font-bold text-slate-900">৳{matchedEntry.totalTaka.toLocaleString()}</p></div>
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">DOC AD-ON (165/doc)</p><p className="text-sm font-bold text-indigo-600">৳{(matchedEntry.doc * 165).toLocaleString()}</p></div>
              <div className="space-y-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-indigo-500 uppercase">TOTAL BILL</p><p className="text-2xl font-black text-indigo-900">৳{totalBill.toLocaleString()}</p></div>
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className={`p-4 rounded-2xl ${dueBill === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'} border border-transparent`}><p className="text-[10px] font-black uppercase">DUE BILL</p><p className="text-xl font-black">৳{dueBill.toLocaleString()}</p></div>
                {miscApprove > 0 && (<div className="p-4 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100"><p className="text-[10px] font-black uppercase">MISCNIAS APPROVE BILL</p><p className="text-xl font-black">+ ৳{miscApprove.toLocaleString()}</p></div>)}
              </div>
            </div>
          ) : formData.invoiceNo && (
            <div className="p-8 bg-rose-50 rounded-3xl text-rose-600 font-bold text-center border border-rose-100 italic">Invoice not found in system. Please verify Indian Entry first.</div>
          )}

          <button type="submit" disabled={!matchedEntry || isSubmitting} className={`w-full py-5 bg-slate-900 text-white font-black rounded-[20px] hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl tracking-widest text-sm flex items-center justify-center gap-3`}>
            {isSubmitting && <div className="ipad-loader !w-5 !h-5 border-white/20 border-t-white" />}
            {isSubmitting ? 'SUBMITTING...' : 'CONFIRM & SUBMIT BILL'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 font-black text-slate-900 tracking-tighter text-lg uppercase">Bill Summary Logs</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr><th className="px-8 py-6">Date</th><th className="px-8 py-6">Invoice</th><th className="px-8 py-6">Total Bill</th><th className="px-8 py-6">Paid</th><th className="px-8 py-6">Due</th><th className="px-8 py-6">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {billInfos.map((b, idx) => (
                <tr key={b.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'} hover:bg-slate-100 transition-colors`}>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{b.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 uppercase">{b.invoiceNo}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-800">৳{b.totalBill.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-600">৳{b.paidBill.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-rose-600">৳{b.dueBill.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <button onClick={() => handleDelete(b.id)} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Icons.Trash2 size={16} /></button>
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

export default BillInfo;

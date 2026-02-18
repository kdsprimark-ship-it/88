import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';
import { PriceRate } from '../types';

const PriceRateSettings: React.FC = () => {
    const { priceRates, addPriceRate, deletePriceRate, businessEntities } = useApp();
    const buyers = businessEntities.filter(e => e.type === 'BUYER');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormState = {
        buyerName: '',
        condition: 'DOC' as PriceRate['condition'],
        rate: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    const ratesByBuyer = useMemo(() => {
        return priceRates.reduce((acc, rate) => {
            if (!acc[rate.buyerName]) {
                acc[rate.buyerName] = [];
            }
            acc[rate.buyerName].push(rate);
            return acc;
        }, {} as Record<string, PriceRate[]>);
    }, [priceRates]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.buyerName || isSubmitting) {
            alert('Please select a buyer.');
            return;
        }
        setIsSubmitting(true);
        try {
            await addPriceRate(formData);
            setFormData(initialFormState);
        } catch (err) {
            alert('Failed to save the price rate.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this price rate?')) {
            try {
                await deletePriceRate(id);
            } catch (err) {
                alert('Failed to delete the price rate.');
            }
        }
    };

    const conditions: PriceRate['condition'][] = ['DOC', 'CTN', 'TON', 'TRUCK UNLOAD'];

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        <Icons.Tags size={20} />
                    </div>
                    PRICE RATE AUTOMATION SETTINGS
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BUYER</label>
                        <select required className="w-full p-4 bg-white border-none rounded-2xl font-semibold" value={formData.buyerName} onChange={e => setFormData({ ...formData, buyerName: e.target.value })}>
                            <option value="">Select Buyer</option>
                            {buyers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CONDITION</label>
                        <select className="w-full p-4 bg-white border-none rounded-2xl font-semibold" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value as PriceRate['condition'] })}>
                            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RATE (TK)</label>
                        <input type="number" step="any" required className="w-full p-4 bg-white border-none rounded-2xl font-black" value={formData.rate === 0 ? '' : formData.rate} onChange={e => setFormData({ ...formData, rate: Number(e.target.value) })} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50">
                        {isSubmitting && <div className="ipad-loader !w-5 !h-5 border-white/20 border-t-white" />}
                        {isSubmitting ? 'SAVING' : 'Set Rate'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Current Buyer-Specific Rates</h3>
                <div className="space-y-6">
                    {Object.keys(ratesByBuyer).length > 0 ? Object.entries(ratesByBuyer).map(([buyerName, rates]) => (
                        <div key={buyerName} className="p-6 bg-slate-50/50 rounded-3xl">
                            <h4 className="font-black text-indigo-700 text-sm uppercase tracking-wider mb-4">{buyerName}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* FIX: Cast `rates` to `PriceRate[]` as `Object.entries` may not preserve strong value types, leading to an 'unknown' type inference. */}
                                {(rates as PriceRate[]).map(rate => (
                                    <div key={rate.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{rate.condition}</p>
                                            <p className="text-lg font-black text-slate-800">৳{rate.rate}</p>
                                        </div>
                                        <button onClick={() => handleDelete(rate.id)} className="p-2 text-rose-300 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors">
                                            <Icons.Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                         <div className="text-center py-20 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                               <Icons.Tags size={32} />
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No buyer-specific rates set.</p>
                            <p className="text-slate-400 text-xs max-w-sm">The system is using default rates for all calculations. Add a rate above to override the defaults for a specific buyer.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PriceRateSettings;
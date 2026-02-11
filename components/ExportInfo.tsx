
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';

const ExportInfo: React.FC = () => {
  const { businessEntities, removeBusinessEntity, addBusinessEntity } = useApp();
  const [activeList, setActiveList] = useState<'SHIPPER' | 'BUYER' | 'DEPOT'>('SHIPPER');
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentList = businessEntities.filter(e => e.type === activeList);

  const handleAdd = async () => {
    if (!newName || isSubmitting) return;
    setIsSubmitting(true);
    try {
        await addBusinessEntity({ type: activeList, name: newName });
        setNewName('');
    } catch(e) {
        alert(`Failed to add ${activeList}.`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
      try {
          await removeBusinessEntity(id);
      } catch(e) {
          alert(`Failed to remove ${activeList}.`);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
          {['SHIPPER', 'BUYER', 'DEPOT'].map((type) => (
            <button key={type} onClick={() => setActiveList(type as any)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeList === type ? 'bg-slate-900 text-white shadow-xl translate-x-1' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>Manage {type}s</button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Registered {activeList}s</h3>
            </div>

            <div className="flex gap-3 mb-8">
              <input type="text" placeholder={`New ${activeList} Name...`} className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-200" value={newName} onChange={e => setNewName(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAdd()} />
              <button onClick={handleAdd} disabled={isSubmitting} className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50">
                {isSubmitting && <div className="ipad-loader !w-4 !h-4 border-white/20 border-t-white" />}
                Add {activeList}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentList.map(item => (
                <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Icons.Trash2 size={16} /></button>
                </div>
              ))}
              {currentList.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">No {activeList.toLowerCase()}s found. Add your first one above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportInfo;

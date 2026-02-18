
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';

interface AddEntityModalProps {
  entityType: 'SHIPPER' | 'BUYER' | 'DEPOT';
  onClose: () => void;
  onSave: (newName: string) => void;
}

const AddEntityModal: React.FC<AddEntityModalProps> = ({ entityType, onClose, onSave }) => {
  const { addBusinessEntity } = useApp();
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await addBusinessEntity({ type: entityType, name: newName.trim() });
      onSave(newName.trim()); // Pass the new name back to parent
    } catch (err) {
      setError(`Failed to add ${entityType}. Please try again.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[40px] shadow-2xl p-8 w-full max-w-md m-4 space-y-6 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Add New {entityType}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <Icons.Shrink size={20} />
          </button>
        </div>
        
        {error && (
            <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold">
                {error}
            </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entityType} NAME</label>
          <input 
            type="text" 
            autoFocus
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-slate-100 text-slate-700 font-black rounded-2xl uppercase text-sm tracking-widest hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-sm tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting && <div className="ipad-loader !w-5 !h-5 border-white/20 border-t-white" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntityModal;

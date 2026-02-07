
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, NAV_ITEMS } from '../constants';

const UserManagement: React.FC = () => {
  const { users, addUser } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff' as any,
    permissions: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: formData.permissions
    });
    setFormData({ name: '', email: '', password: '', role: 'Staff', permissions: [] });
    alert('User created!');
  };

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">USER NAME</label>
              <input type="text" required className="w-full p-3 bg-slate-50 border-none rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">GMAIL ID</label>
              <input type="email" required className="w-full p-3 bg-slate-50 border-none rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">PASSWORD</label>
              <input type="password" required className="w-full p-3 bg-slate-50 border-none rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">SIDEBAR ACCESS (PERMISSIONS)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePermission(item.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${formData.permissions.includes(item.id) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-50 bg-slate-50 text-slate-500'}
                  `}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
            Add System User
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">👤</div>
              <div>
                <p className="font-bold text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{u.role}</span>
              {u.permissions.map(p => (
                <span key={p} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;

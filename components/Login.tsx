
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons, THEMES } from '../constants';

const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Hint: admin@app.com / admin123');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 p-4 font-['Poppins']">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-100 mb-4">
             <Icons.Box size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Inventory Pro</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Secure Mobile Gateway</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
               <Icons.UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="email" 
                 required
                 placeholder="admin@app.com"
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Token / Password</label>
            <div className="relative">
               <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="password" 
                 required
                 placeholder="••••••••"
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
          >
            {loading ? <div className="ipad-loader !w-5 !h-5 border-white/20 border-t-white" /> : <Icons.LogOut size={18} />}
            {loading ? 'Authenticating...' : 'Sign In To System'}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Version 3.5 Stable • Build 2024.10
        </p>
      </div>
    </div>
  );
};

export default Login;

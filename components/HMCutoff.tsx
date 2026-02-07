
import React, { useState } from 'react';
import { Icons, THEMES } from '../constants';
import { useApp } from '../store/AppContext';

const HMCutoff: React.FC = () => {
  const { depotCodes, addDepotCode, removeDepotCode, settings } = useApp();
  const activeTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];
  
  const [rawData, setRawData] = useState('');
  const [results, setResults] = useState<{depot: string, count: number}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [showManager, setShowManager] = useState(false);

  const analyzeData = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const currentCodes = depotCodes.map(c => c.code);
      const analysis: {[key: string]: number} = {};
      
      currentCodes.forEach(d => {
        const regex = new RegExp(d, 'gi');
        const matches = rawData.match(regex);
        if (matches) analysis[d] = matches.length;
      });

      setResults(Object.entries(analysis).map(([depot, count]) => ({ depot, count })));
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleAddCode = () => {
    if (!newCode) return;
    addDepotCode(newCode);
    setNewCode('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">H&M CUT OFF INFO</h3>
            <p className="text-slate-500 text-sm">Depot Distribution Analyzer</p>
          </div>
          <button 
            onClick={() => setShowManager(!showManager)}
            className="px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-100"
          >
            <Icons.Table size={18} /> {showManager ? 'Close Manager' : 'Manage Depot Codes'}
          </button>
        </div>

        {showManager && (
          <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Registry Manager</label>
            <div className="flex gap-3 mb-6">
              <input 
                type="text" 
                placeholder="e.g. VERTEX" 
                className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-black"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
              />
              <button 
                onClick={handleAddCode}
                className={`px-8 py-4 bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} text-white font-bold rounded-2xl shadow-lg`}
              >
                Add Code
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {depotCodes.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 group">
                  <span className="text-sm font-black text-slate-800">{c.code}</span>
                  <button onClick={() => removeDepotCode(c.id)} className="text-rose-300 hover:text-rose-500 transition-colors">
                    <Icons.Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paste Raw Cutoff Data</label>
          <textarea 
            className="w-full h-48 p-4 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
            placeholder="Paste your raw data here. The system will detect: OCL, SAPL, KDS, VERTEX etc."
            value={rawData}
            onChange={e => setRawData(e.target.value)}
          />
          <button 
            onClick={analyzeData}
            disabled={!rawData || isAnalyzing}
            className={`w-full py-5 bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} text-white font-black rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-sm`}
          >
            {isAnalyzing ? <div className="ipad-loader !w-5 !h-5" /> : <Icons.BarChart3 size={20} />}
            {isAnalyzing ? 'Processing Analysis...' : 'Execute Distribution Analysis'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in zoom-in-95 duration-500">
          {results.map((res) => (
            <div key={res.depot} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center hover:shadow-lg transition-all border-b-4 border-b-indigo-500/10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.depot}</p>
              <p className="text-4xl font-black text-slate-900 mt-2">{res.count}</p>
              <div className="mt-3 px-3 py-1 bg-indigo-50 rounded-full inline-block">
                 <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">Items Detected</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HMCutoff;

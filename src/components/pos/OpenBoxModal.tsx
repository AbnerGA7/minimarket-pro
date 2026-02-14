'use client';
import { useState } from 'react';
import { useCashSession } from '@/hooks/useCashSession';

export default function OpenBoxModal() {
  const [monto, setMonto] = useState('');
  const { openBox } = useCashSession();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-black text-slate-800 mb-2">BUENOS DÍAS ☀️</h2>
        <p className="text-slate-500 mb-8">Antes de empezar, ingresa el monto inicial de la caja.</p>
        
        <input 
          type="number" 
          placeholder="S/ 0.00"
          className="w-full text-5xl font-mono text-center py-6 bg-slate-50 border-2 border-slate-200 rounded-2xl mb-6 outline-none focus:border-blue-500 transition-all"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <button 
          onClick={() => openBox(Number(monto))}
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
        >
          ABRIR CAJA Y EMPEZAR
        </button>
      </div>
    </div>
  );
}
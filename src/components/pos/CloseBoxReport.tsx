'use client';
import { useState } from 'react';
import { useCashSession } from '@/hooks/useCashSession';

export default function CloseBoxReport() {
  const [montoFinal, setMontoFinal] = useState('');
  const [reporte, setReporte] = useState<any>(null);
  const { session, closeBox } = useCashSession();

  const handleCierre = async () => {
    const res = await closeBox(Number(montoFinal));
    setReporte(res);
  };

  if (reporte) {
    return (
      <div className="p-6 bg-white rounded-3xl border-2 border-slate-100 shadow-sm text-center">
        <h3 className="font-bold text-slate-400 text-sm uppercase mb-4">Resumen de Cierre</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs text-slate-500">Ventas del Turno</p>
            <p className="text-xl font-bold">S/ {reporte.totalSales.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-2xl ${reporte.difference < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            <p className="text-xs opacity-70">Diferencia</p>
            <p className="text-xl font-bold">S/ {reporte.difference.toFixed(2)}</p>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold underline">Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 text-white rounded-3xl">
      <h3 className="text-lg font-bold mb-4">Cerrar Turno Actual</h3>
      <input 
        type="number"
        placeholder="¿Cuánto dinero hay en físico?"
        className="w-full bg-slate-800 border-none rounded-xl p-4 mb-4 text-white font-mono"
        value={montoFinal}
        onChange={(e) => setMontoFinal(e.target.value)}
      />
      <button 
        onClick={handleCierre}
        className="w-full bg-red-500 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
      >
        CERRAR CAJA AHORA
      </button>
    </div>
  );
}
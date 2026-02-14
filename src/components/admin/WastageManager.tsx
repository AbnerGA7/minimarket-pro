'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, AlertCircle } from 'lucide-react';

export default function WastageManager() {
  const [batchId, setBatchId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('Vencido');

  const handleWastage = async () => {
    // 1. Registrar la merma
    const { error: wastageError } = await supabase
      .from('wastage')
      .insert([{ 
        batch_id: parseInt(batchId), 
        quantity: parseFloat(qty), 
        reason: reason 
      }]);

    if (wastageError) return alert("Error al registrar merma");

    // 2. Descontar del inventario real
    const { data: batch } = await supabase
      .from('product_batches')
      .select('current_qty')
      .eq('id', batchId)
      .single();

    if (batch) {
      await supabase
        .from('product_batches')
        .update({ current_qty: batch.current_qty - parseFloat(qty) })
        .eq('id', batchId);
    }

    alert("Merma registrada y stock actualizado");
    setBatchId('');
    setQty('');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md">
      <div className="flex items-center gap-3 mb-6 text-red-600">
        <AlertCircle size={24} />
        <h2 className="font-black text-xl uppercase tracking-tighter">Retirar Producto (Merma)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">ID del Lote</label>
          <input 
            type="number" 
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-red-500"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Cantidad a retirar</label>
          <input 
            type="number" 
            step="0.001"
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-red-500 font-mono"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Motivo</label>
          <select 
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="Vencido">Vencido</option>
            <option value="Dañado/Roto">Dañado / Roto</option>
            <option value="Error de Inventario">Error de Inventario</option>
          </select>
        </div>

        <button 
          onClick={handleWastage}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} /> REGISTRAR RETIRO
        </button>
      </div>
    </div>
  );
}
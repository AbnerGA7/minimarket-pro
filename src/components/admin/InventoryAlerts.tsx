'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, Clock } from 'lucide-react';

export default function InventoryAlerts() {
  const [alerts, setAlerts] = useState<{lowStock: any[], expiring: any[]}>({lowStock: [], expiring: []});

  useEffect(() => {
    const fetchAlerts = async () => {
      // 1. Productos con stock bajo el límite configurado
      const { data: products } = await supabase
        .from('products')
        .select('name, min_stock_alert, product_batches(current_qty)');

      // 2. Lotes que vencen en los próximos 7 días
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const { data: batches } = await supabase
        .from('product_batches')
        .select('expiration_date, current_qty, products(name)')
        .lte('expiration_date', sevenDaysFromNow.toISOString().split('T')[0])
        .gt('current_qty', 0);

      setAlerts({
        lowStock: products?.filter(p => p.product_batches.reduce((acc, b) => acc + b.current_qty, 0) <= p.min_stock_alert) || [],
        expiring: batches || []
      });
    };
    fetchAlerts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Columna Stock Bajo */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4 text-orange-600">
          <AlertTriangle size={20} />
          <h3 className="font-bold uppercase text-sm tracking-widest">Stock Crítico</h3>
        </div>
        <div className="space-y-3">
          {alerts.lowStock.map((p, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-xl text-sm">
              <span className="font-medium text-slate-700">{p.name}</span>
              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-lg font-bold">Reponer ya</span>
            </div>
          ))}
        </div>
      </div>

      {/* Columna Vencimientos Proximos */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4 text-red-600">
          <Clock size={20} />
          <h3 className="font-bold uppercase text-sm tracking-widest">Próximos a Vencer</h3>
        </div>
        <div className="space-y-3">
          {alerts.expiring.map((b, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-xl text-sm">
              <span className="font-medium text-slate-700">{b.products.name}</span>
              <span className="text-red-700 font-bold">{b.expiration_date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
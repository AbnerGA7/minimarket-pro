'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';
import { Search, Barcode } from 'lucide-react';

export default function Scanner() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  // Mantiene el foco en el input siempre
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    
    // Buscamos el producto y su lote más antiguo (FIFO) con stock disponible
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, 
        name, 
        unit_measure,
        product_batches (
          id,
          sale_price,
          current_qty,
          expiration_date
        )
      `)
      .eq('barcode', query)
      .gt('product_batches.current_qty', 0)
      .order('expiration_date', { foreignTable: 'product_batches', ascending: true })
      .limit(1)
      .single();

    if (data && data.product_batches.length > 0) {
      const batch = data.product_batches[0];
      addItem({
        id: data.id,
        name: data.name,
        price: batch.sale_price,
        quantity: 1,
        unit: data.unit_measure
      });
      setQuery(''); // Limpia para el siguiente escaneo
    } else {
      alert("Producto no encontrado o sin stock");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        ) : (
          <Barcode className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
        )}
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escanea el código de barras o busca manualmente..."
        className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-lg transition-all shadow-inner"
      />

      <div className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-slate-400">
        [ENTER] PARA AGREGAR
      </div>
    </form>
  );
}
'use client';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cart, removeItem, updateQuantity } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
        <ShoppingCart size={20} />
        <h2 className="font-bold uppercase tracking-wider">Carrito de Venta</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-800 uppercase text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">S/ {item.price.toFixed(2)} x {item.unit}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Input Inteligente para Unidades o KG */}
                <input
                  type="number"
                  step={item.unit === 'kg' ? "0.001" : "1"}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                  className="w-20 p-1 border rounded text-center font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                
                <p className="w-20 text-right font-bold text-slate-700">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </p>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-50 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-medium text-slate-600">TOTAL</span>
          <span className="text-4xl font-black text-slate-900">S/ {total.toFixed(2)}</span>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
          PAGAR (F1)
        </button>
      </div>
    </div>
  );
}
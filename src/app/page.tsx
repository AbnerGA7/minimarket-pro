import Scanner from '@/components/pos/Scanner';
import Cart from '@/components/pos/Cart';

export default function SalesPage() {
  return (
    <main className="h-screen bg-slate-200 p-4 flex flex-col gap-4">
      {/* Cabecera Minimalista */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-black text-slate-800">SMART MARKET <span className="text-blue-600">PRO</span></h1>
        <div className="flex gap-4 text-sm font-medium">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Caja Abierta</span>
          <span className="text-slate-500">Cajero: AbnerGA7</span>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Lado Izquierdo: Buscador y Atajos */}
        <div className="flex-[2] flex flex-col gap-4">
          <Scanner />
          <div className="bg-white p-6 rounded-2xl flex-1 shadow-sm">
             <p className="text-slate-400 text-center mt-20 italic">El área de promociones o productos rápidos irá aquí...</p>
          </div>
        </div>

        {/* Lado Derecho: Carrito */}
        <div className="flex-1 min-w-[400px]">
          <Cart />
        </div>
      </div>
    </main>
  );
}
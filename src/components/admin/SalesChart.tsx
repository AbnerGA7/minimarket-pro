'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Datos de ejemplo (Luego los traeremos de la DB)
const data = [
  { name: 'Lun', ventas: 400 },
  { name: 'Mar', ventas: 700 },
  { name: 'Mie', ventas: 500 },
  { name: 'Jue', ventas: 900 },
  { name: 'Vie', ventas: 1200 },
  { name: 'Sab', ventas: 1500 },
  { name: 'Dom', ventas: 800 },
];

export default function SalesChart() {
  return (
    <div className="h-[300px] w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-slate-400 font-bold text-xs uppercase mb-6 tracking-widest">Flujo de Ventas Semanal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <YAxis hide />
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
          />
          <Bar dataKey="ventas" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
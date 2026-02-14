'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, ShieldCheck, UserX } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center bg-slate-50">
        <h3 className="font-black text-slate-800 tracking-tight">PERSONAL DEL MINIMARKET</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
          <UserPlus size={18} /> AGREGAR TRABAJADOR
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <th className="p-4">Nombre Completo</th>
            <th className="p-4">Rol</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 font-medium text-slate-700">{user.full_name}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <span className={`flex items-center gap-1 text-xs font-bold ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  {user.is_active ? 'Activo' : 'Desactivado'}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => toggleStatus(user.id, user.is_active)}
                  className={`p-2 rounded-lg transition-colors ${user.is_active ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-green-500 hover:bg-green-50'}`}
                  title={user.is_active ? "Desactivar empleado" : "Activar empleado"}
                >
                  {user.is_active ? <UserX size={20} /> : <ShieldCheck size={20} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
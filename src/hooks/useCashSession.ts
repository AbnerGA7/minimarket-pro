import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface CashSession {
  id: number;
  opening_balance: number;
  opened_at: string;
}

interface CashStore {
  session: CashSession | null;
  loading: boolean;
  checkActiveSession: () => Promise<void>;
  openBox: (amount: number) => Promise<void>;
  closeBox: (finalAmount: number) => Promise<{ expected: number, difference: number } | any>;
}

export const useCashSession = create<CashStore>((set, get) => ({
  session: null,
  loading: true,

  // Verifica si hay una caja abierta al cargar la página
  checkActiveSession: async () => {
    const { data } = await supabase
      .from('cash_sessions')
      .select('*')
      .eq('status', 'open')
      .maybeSingle();
    set({ session: data, loading: false });
  },

  // Abre la caja con el monto inicial
  openBox: async (amount) => {
    const { data, error } = await supabase
      .from('cash_sessions')
      .insert([{ opening_balance: amount, status: 'open' }])
      .select().single();
    if (!error) set({ session: data });
  },

  // Cierra la caja y calcula si falta o sobra dinero
  closeBox: async (finalAmount) => {
    const { session } = get();
    if (!session) return;

    // 1. Sumamos todas las ventas de esta sesión
    const { data: sales } = await supabase
      .from('sales')
      .select('total')
      .eq('session_id', session.id);

    const totalSales = sales?.reduce((acc, s) => acc + Number(s.total), 0) || 0;
    const expected = Number(session.opening_balance) + totalSales;
    const difference = finalAmount - expected;

    // 2. Actualizamos la base de datos
    await supabase
      .from('cash_sessions')
      .update({
        closing_balance: finalAmount,
        status: 'closed',
        closed_at: new Date().toISOString()
      })
      .eq('id', session.id);

    set({ session: null });
    return { expected, difference, totalSales };
  }
}));
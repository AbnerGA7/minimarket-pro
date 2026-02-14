import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string; // 'unid' o 'kg'
}

interface CartStore {
  cart: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  cart: [],
  addItem: (product) => set((state) => {
    const exists = state.cart.find((item) => item.id === product.id);
    if (exists) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, product] };
  }),
  removeItem: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id),
  })),
  updateQuantity: (id, qty) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    ),
  })),
  clearCart: () => set({ cart: [] }),
}));
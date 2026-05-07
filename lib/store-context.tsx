"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CartItem {
  id: string; // This is line_item id in Medusa
  variant_id: string;
  title: string;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  variant_title: string;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  metadata?: Record<string, any>;
}

interface StoreContextType {
  // Auth
  customer: Customer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  authLoading: boolean;
  // Cart
  cartId: string | null;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (variant_id: string, quantity: number, itemInfo: Omit<CartItem, "id" | "variant_id" | "quantity">) => Promise<void>;
  removeFromCart: (line_id: string) => Promise<void>;
  updateQuantity: (line_id: string, qty: number) => Promise<void>;
  clearCart: () => void;
  // UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

const StoreContext = createContext<StoreContextType | null>(null);

const TOKEN_KEY = "alize_customer_token";
const CART_KEY = "alize_cart_id";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Load token & cart ID từ localStorage khi mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
      fetchCustomer(savedToken);
    }
    
    const savedCartId = localStorage.getItem(CART_KEY);
    if (savedCartId) {
      setCartId(savedCartId);
      fetchCart(savedCartId);
    }
  }, []);

  const fetchCustomer = async (t: string) => {
    try {
      const res = await fetch(`/api/medusa/store/customers/me`, {
        headers: { 
          Authorization: `Bearer ${t}`,
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
      });
      if (res.ok) {
        const { customer } = await res.json();
        setCustomer(customer);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
    } catch {}
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const res = await fetch(`/api/medusa/auth/customer/emailpass`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Sai email hoặc mật khẩu");
      }
      const { token: t } = await res.json();
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      await fetchCustomer(t);
      setAuthModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setAuthLoading(true);
    try {
      const authRes = await fetch(`/api/medusa/auth/customer/emailpass/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (!authRes.ok) {
        const err = await authRes.json();
        throw new Error(err.message || "Lỗi đăng ký tài khoản");
      }
      const { token: t } = await authRes.json();

      const profileRes = await fetch(`/api/medusa/store/customers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${t}`,
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ email: data.email, first_name: data.first_name, last_name: data.last_name, phone: data.phone }),
      });
      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.message || "Lỗi tạo hồ sơ");
      }

      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      await fetchCustomer(t);
      setAuthModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCustomer(null);
  };

  // --- Cart Logic (Medusa) ---
  const fetchCart = async (id: string) => {
    try {
      const res = await fetch(`/api/medusa/store/carts/${id}`, {
        headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
      });
      if (res.ok) {
        const { cart } = await res.json();
        syncCartState(cart);
      } else {
        localStorage.removeItem(CART_KEY);
        setCartId(null);
        setCart([]);
      }
    } catch {}
  };

  const createCart = async () => {
    const res = await fetch(`/api/medusa/store/carts`, {
      method: "POST",
      headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
    });
    const { cart } = await res.json();
    localStorage.setItem(CART_KEY, cart.id);
    setCartId(cart.id);
    return cart.id;
  };

  const syncCartState = (medusaCart: any) => {
    if (!medusaCart || !medusaCart.items) return;
    const mappedItems: CartItem[] = medusaCart.items.map((item: any) => ({
      id: item.id,
      variant_id: item.variant_id,
      title: item.title,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
      unit_price: item.unit_price,
      variant_title: item.variant?.title || ""
    }));
    setCart(mappedItems);
  };

  const addToCart = async (variant_id: string, quantity: number, itemInfo: Omit<CartItem, "id" | "variant_id" | "quantity">) => {
    let currentCartId = cartId;
    
    // Nếu Medusa không bật hoặc lỗi, fallback về Local State để UI vẫn mượt
    try {
      if (!currentCartId) {
        currentCartId = await createCart();
      }

      const res = await fetch(`/api/medusa/store/carts/${currentCartId}/line-items`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ variant_id, quantity }),
      });
      
      if (res.ok) {
        const { cart: updatedCart } = await res.json();
        syncCartState(updatedCart);
      } else {
        throw new Error("Medusa API failed");
      }
    } catch (err) {
      console.warn("Medusa Cart error, fallback to local state:", err);
      // Fallback cho local state khi offline
      setCart(prev => {
        const existing = prev.find(i => i.variant_id === variant_id);
        if (existing) {
          return prev.map(i => i.variant_id === variant_id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { ...itemInfo, id: `local_${Date.now()}`, variant_id, quantity }];
      });
    }
    setCartOpen(true);
  };

  const removeFromCart = async (line_id: string) => {
    if (line_id.startsWith("local_")) {
      setCart(prev => prev.filter(i => i.id !== line_id));
      return;
    }
    if (!cartId) return;
    try {
      const res = await fetch(`/api/medusa/store/carts/${cartId}/line-items/${line_id}`, {
        method: "DELETE",
        headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
      });
      if (res.ok) {
        const { cart: updatedCart } = await res.json();
        syncCartState(updatedCart);
      }
    } catch {}
  };

  const updateQuantity = async (line_id: string, qty: number) => {
    if (qty <= 0) {
      await removeFromCart(line_id);
      return;
    }
    if (line_id.startsWith("local_")) {
      setCart(prev => prev.map(i => i.id === line_id ? { ...i, quantity: qty } : i));
      return;
    }
    if (!cartId) return;
    try {
      const res = await fetch(`/api/medusa/store/carts/${cartId}/line-items/${line_id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ quantity: qty }),
      });
      if (res.ok) {
        const { cart: updatedCart } = await res.json();
        syncCartState(updatedCart);
      }
    } catch {}
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
    setCartId(null);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      customer, token, login, logout, register, authLoading,
      cartId, cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart,
      cartOpen, setCartOpen,
      authModalOpen, setAuthModalOpen, authMode, setAuthMode,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

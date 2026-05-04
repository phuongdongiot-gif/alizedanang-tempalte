"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MEDUSA_URL } from "../lib/medusa";

interface CartItem {
  id: string;
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
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Load token từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      fetchCustomer(saved);
    }
    // Load cart từ localStorage
    const savedCart = localStorage.getItem("alize_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch {}
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("alize_cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCustomer = async (t: string) => {
    try {
      const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
        headers: { Authorization: `Bearer ${t}` },
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
      const res = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      // Bước 1: Tạo auth credentials
      const authRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (!authRes.ok) {
        const err = await authRes.json();
        throw new Error(err.message || "Lỗi đăng ký tài khoản");
      }
      const { token: t } = await authRes.json();

      // Bước 2: Tạo profile khách hàng
      const profileRes = await fetch(`${MEDUSA_URL}/store/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
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

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCart(prev => {
      const key = `${item.title}-${item.variant_title}`;
      const existing = prev.find(i => `${i.title}-${i.variant_title}` === key);
      if (existing) {
        return prev.map(i => `${i.title}-${i.variant_title}` === key ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, id: key + Date.now() }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      customer, token, login, logout, register, authLoading,
      cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart,
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

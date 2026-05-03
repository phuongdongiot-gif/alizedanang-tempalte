"use client";
import { StoreProvider } from "../lib/store-context";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

export default function StoreShell({ children, locale }: { children: React.ReactNode; locale: string }) {
  return (
    <StoreProvider>
      {children}
      <AuthModal />
      <CartDrawer locale={locale} />
    </StoreProvider>
  );
}

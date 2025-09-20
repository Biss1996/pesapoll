// src/context/AdminContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Keys
const ADMIN_FLAG_KEY = "app:admin.flag.v1";        // "true" | "false"
const AUTH_VERSION_KEY = "auth:version";           // bump to notify UI/nav

// Optional: set this in your .env (Vite) -> import.meta.env.VITE_ADMIN_PASSWORD
const DEFAULT_ADMIN_PASSWORD = import.meta?.env?.VITE_ADMIN_PASSWORD || "admin123";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return localStorage.getItem(ADMIN_FLAG_KEY) === "true"; }
    catch { return false; }
  });

  // keep other tabs in sync & refresh on focus
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === ADMIN_FLAG_KEY || e.key === AUTH_VERSION_KEY) {
        setIsAdmin(localStorage.getItem(ADMIN_FLAG_KEY) === "true");
      }
    };
    const onFocus = () => {
      setIsAdmin(localStorage.getItem(ADMIN_FLAG_KEY) === "true");
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const login = (password) => {
    const ok = String(password) === String(DEFAULT_ADMIN_PASSWORD);
    if (ok) {
      localStorage.setItem(ADMIN_FLAG_KEY, "true");
      bumpAuth();
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.setItem(ADMIN_FLAG_KEY, "false");
    bumpAuth();
    setIsAdmin(false);
  };

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

function bumpAuth() {
  try { localStorage.setItem(AUTH_VERSION_KEY, String(Date.now())); } catch {}
}

// Export keys if your Navbar wants to listen directly (optional)
export const ADMIN_KEYS = { ADMIN_FLAG_KEY, AUTH_VERSION_KEY };

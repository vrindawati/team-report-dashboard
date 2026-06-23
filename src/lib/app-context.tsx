import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "user";
export type Department = "CFR" | "LR";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  departments: Department[];
  avatarUrl?: string;
}

interface AppContextValue {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_USER: AppUser = {
  id: "u_admin_1",
  name: "Aarav Mehta",
  email: "aarav@company.com",
  phone: "+91 98765 43210",
  role: "admin",
  departments: ["CFR", "LR"],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("tpi_user") : null;
    if (stored) {
      try { setUserState(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const t = typeof window !== "undefined" ? localStorage.getItem("tpi_theme") : null;
    if (t === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setUser = (u: AppUser | null) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("tpi_user", JSON.stringify(u));
      else localStorage.removeItem("tpi_user");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      if (typeof window !== "undefined") localStorage.setItem("tpi_theme", next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ user, setUser, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export const DEMO_ADMIN: AppUser = DEFAULT_USER;
export const DEMO_USER: AppUser = {
  id: "u_user_1",
  name: "Priya Sharma",
  email: "priya@company.com",
  phone: "+91 99887 76543",
  role: "user",
  departments: ["CFR", "LR"],
};

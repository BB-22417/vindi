"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  subscriptionTier?: "free" | "basic" | "premium" | "premium_plus";
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vindi_token");
    const storedUser = localStorage.getItem("vindi_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("vindi_token");
        localStorage.removeItem("vindi_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem("vindi_token", token);
    localStorage.setItem("vindi_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", { name, email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem("vindi_token", token);
    localStorage.setItem("vindi_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const socialLogin = useCallback(async (provider: string) => {
    const response = await api.post("/auth/social", { provider });
    const { token, user: userData } = response.data;
    localStorage.setItem("vindi_token", token);
    localStorage.setItem("vindi_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vindi_token");
    localStorage.removeItem("vindi_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("vindi_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, socialLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router, adminOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}

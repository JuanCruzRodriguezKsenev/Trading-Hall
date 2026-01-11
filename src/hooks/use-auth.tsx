// src/hooks/use-auth.tsx
"use client"; // ¡Importante! Esto corre en el navegador

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api-client";
import { SafeUser } from "@/types";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Al cargar la app, preguntamos al servidor: "¿Quién soy?"
  // (Necesitaremos crear el endpoint /api/auth/me más adelante)
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      // Si falla (401), es que no hay sesión. No es un error grave.
      const { user } = await apiCall<{ user: SafeUser }>("/api/auth/me");
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Función de Login
  const login = async (credentials: any) => {
    const res = await apiCall<{ user: SafeUser }>("/api/auth/login", {
      data: credentials,
    });
    setUser(res.user);
    router.push("/worlds"); // Redirigir al dashboard
  };

  // 3. Función de Registro
  const register = async (credentials: any) => {
    const res = await apiCall<{ user: SafeUser }>("/api/auth/register", {
      data: credentials,
    });
    setUser(res.user);
    router.push("/worlds");
  };

  // 4. Función de Logout
  const logout = async () => {
    try {
      await apiCall("/api/auth/logout", { method: "POST" }); // (Endpoint pendiente)
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// El hook que usarás en tus componentes: const { user } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

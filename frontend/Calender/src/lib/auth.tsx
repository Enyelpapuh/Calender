"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Interfaz para los datos del usuario que extraemos del token
interface User {
  username: string;
  email: string;
  user_id: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        // Solo decodificamos si el token existe
        const decodedToken = jwtDecode<User>(accessToken);
        setUser(decodedToken);
        setIsAuthenticated(true);
        setToken(accessToken);
      } catch (error) {
        console.error("Token inválido al cargar, cerrando sesión:", error);
        // Si el token está corrupto o ha expirado, limpiamos todo
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const login = (access: string, refresh: string) => {
    try {
      const decodedToken = jwtDecode<User>(access);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(decodedToken);
      setIsAuthenticated(true);
      setToken(access);
      navigate('/');
    } catch (error) {
      console.error("Error al decodificar el token en login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

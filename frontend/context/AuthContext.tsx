import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';

// Definimos los tipos para mantener el rigor de ingeniería
type UserRole = 'patient' | 'doctor' | null;

interface AuthContextType {
  token: string | null;
  userRole: UserRole;
  login: (role: UserRole, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  const login = (role: UserRole, userToken: string) => {
    setToken(userToken);
    setUserRole(role);
    // Redirección basada en el rol definido en tus requerimientos
    if (role === 'patient') router.replace('/(paciente)/home');
    if (role === 'doctor') router.replace('/(doctor)/home');
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
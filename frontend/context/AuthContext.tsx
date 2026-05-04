import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthRespuestaRol } from '../api/models/authRespuestaRol';
import { setAutorizacionAxios } from '../api/axios-instance';

// --- CONFIGURACION DE ALMACENAMIENTO HIBRIDO ---
const USER_STORAGE_KEY = 'atria_user_session';

const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// --- TIPOS ---
interface DatosUsuario {
  token: string;
  rol: typeof AuthRespuestaRol[keyof typeof AuthRespuestaRol];
  usuario_id: string;
}

interface AuthContextType {
  usuario: DatosUsuario | null;
  isReady: boolean;
  iniciarSesion: (datos: DatosUsuario) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<DatosUsuario | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        // Usamos nuestro traductor híbrido 
        let sessionString = await storage.getItem(USER_STORAGE_KEY);

        if (!sessionString && __DEV__) {
          const sessionPrueba = { token: 'mock-token', rol: 'paciente', usuario_id: 'dev-1' };
          sessionString = JSON.stringify(sessionPrueba);
        }

        if (sessionString) {
          const datosGuardados = JSON.parse(sessionString);
          setUsuario(datosGuardados);
          setAutorizacionAxios(datosGuardados.token);
          console.log("Sesión recuperada de:", Platform.OS);
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error);
      } finally {
        setIsReady(true);
      }
    };
    cargarSesion();
  }, []);

  const iniciarSesion = async (datos: DatosUsuario) => {
    try {
      await storage.setItem(USER_STORAGE_KEY, JSON.stringify(datos));
      setUsuario(datos);
      setAutorizacionAxios(datos.token);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await storage.removeItem(USER_STORAGE_KEY);
      setUsuario(null);
      setAutorizacionAxios(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, isReady, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
import { AuthRespuestaRol } from "@/api/models";
import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { setAutorizacionAxios } from "@/api/axios-instance";

// 1. El Molde de los Datos
interface DatosUsuario {
  token: string;
  rol: typeof AuthRespuestaRol[keyof typeof AuthRespuestaRol]; // 'PACIENTE' | 'DOCTOR'
  usuario_id: string;
}

// 2. El Molde del Contexto: Agregamos 'isReady' para saber cuándo termino de cargar
interface AuthContextType {
  usuario: DatosUsuario | null,
  isReady: boolean; // Para evitar parpadeos al iniciar
  iniciarSesion: (datos: DatosUsuario) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

// 3. Creamos la caja fuerte (vacía por defecto)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El nombre del archivo donde guardaremos todo
const USER_STORAGE_KEY = 'atria_user_session';

// 4. El Proveedor: Este componente envolverá toda tu app para darle acceso a la caja fuerte
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<DatosUsuario | null>(null);
  const [isReady, setIsReady] = useState(false);   // isReady empieza en false mientras buscamos en el disco duro

  // --- EFECTO INICIAL: Buscar si hay sesión guardada al abrir la app ---
  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const sessionString = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        if (sessionString) {
          const datosGuardados = JSON.parse(sessionString);
          setUsuario(datosGuardados);
          // Le compartimos a Axios el token recuperado del disco
          setAutorizacionAxios(datosGuardados.token);
        }
      }catch(error) {
        console.error("Error al cargar la sesión: ", error)
      } finally {
        setIsReady(true);
      }
    };

    cargarSesion();
  }, []);
  
  // --- INICIAR SESIÓN: Guardar en RAM y en Disco ---
  const iniciarSesion = async (datos: DatosUsuario) => {
    try {
      // Lo guardamos en el telefono cmoo texto (JSON)
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(datos));
      // Lo guardamos en la memoria temporal (Contexto)
      setUsuario(datos);
      // Le compartimos a Axios el nuevo token
      setAutorizacionAxios(datos.token);
    } catch (error) {
      console.error("Error al guardar la sesión:", error);
    }
  };

  // --- CERRAR SESIÓN: Borrar de RAM y de Disco ---
  const cerrarSesion = async () => {
    try {
      // Borramos el archivo del telefono
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      // Vaciamos la memoria (Contexto)
      setUsuario(null);
      // Limpiamos las cabeceras de Axios
      setAutorizacionAxios(null);
    } catch (error) {
      console.error("Error al cerrar la sesión: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, isReady, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. El Hook Personalizado: Una llave rapida para abrir la caja en cualquier pantalla
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Si el contexto es undefined, significa que olvidamos envolver la app en el AuthProvider
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
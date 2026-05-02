import { AuthRespuestaRol } from "@/api/models";
import { createContext, useContext, useState } from "react";

// 1. El Molde de los Datos: ¿Qué vamos a guardar?
interface DatosUsuario {
  token: string;
  rol: typeof AuthRespuestaRol[keyof typeof AuthRespuestaRol]; // 'PACIENTE' | 'DOCTOR'
  usuario_id: string;
}

// 2. El Molde del Contexto: ¿Qué acciones podemos hacer con la caja fuerte?
interface AuthContextType {
  usuario: DatosUsuario | null,
  iniciarSesion: (datos: DatosUsuario) => void;
  cerrarSesion: () => void;
}

// 3. Creamos la caja fuerte (vacía por defecto)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. El Proveedor: Este componente envolverá toda tu app para darle acceso a la caja fuerte
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [usuario, setUsuario] = useState<DatosUsuario | null>(null);

  const iniciarSesion = (datos: DatosUsuario) => {
    setUsuario(datos);
  };

  const cerrarSesion = () => {
    setUsuario(null); // Al cerrar sesión, volvemos al estado inicial
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. El Hook Personalizado: Una llave rápida para abrir la caja en cualquier pantalla
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Si el contexto es undefined, significa que olvidamos envolver la app en el AuthProvider
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
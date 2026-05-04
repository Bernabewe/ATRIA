import React, { createContext, useContext, useState } from 'react';

interface DatosReserva {
  id_especialidad?: string;
  id_sucursal?: string;
  id_doctor?: string;
  fecha?: string;
  hora?: string;
  id_metodo_pago?: string;
}

interface ContextoReservaType {
  reserva: DatosReserva;
  actualizarReserva: (datos: Partial<DatosReserva>) => void;
  reiniciarReserva: () => void;
}

const ContextoReserva = createContext<ContextoReservaType | undefined>(undefined);

export const ProveedorReserva = ({ children }: { children: React.ReactNode }) => {
  const [reserva, setReserva] = useState<DatosReserva>({});

  // Función para actualizar partes específicas de la reserva sin borrar lo anterior[cite: 11]
  const actualizarReserva = (datos: Partial<DatosReserva>) => {
    setReserva((prev) => ({ ...prev, ...datos }));
  };

  // Limpiar el estado después de completar una cita o cancelar el proceso[cite: 11]
  const reiniciarReserva = () => setReserva({});

  return (
    <ContextoReserva.Provider value={{ reserva, actualizarReserva, reiniciarReserva }}>
      {children}
    </ContextoReserva.Provider>
  );
};

export const useReserva = () => {
  const context = useContext(ContextoReserva);
  if (!context) {
    throw new Error('useReserva debe usarse dentro de un ProveedorReserva');
  }
  return context;
};
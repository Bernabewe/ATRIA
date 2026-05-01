import React, { createContext, useContext, useState } from 'react';

interface DatosReserva {
  especialidadId?: string;
  sucursalId?: string;
  doctorId?: string;
  fecha?: string;
  hora?: string;
}

interface ContextoReservaType {
  reserva: DatosReserva;
  actualizarReserva: (datos: Partial<DatosReserva>) => void;
  reiniciarReserva: () => void;
}

const ContextoReserva = createContext<ContextoReservaType | undefined>(undefined);

export const ProveedorReserva = ({ children }: { children: React.ReactNode }) => {
  const [reserva, setReserva] = useState<DatosReserva>({});

  const actualizarReserva = (datos: Partial<DatosReserva>) => {
    setReserva((prev) => ({ ...prev, ...datos }));
  };

  const reiniciarReserva = () => setReserva({});

  return (
    <ContextoReserva.Provider value={{ reserva, actualizarReserva, reiniciarReserva }}>
      {children}
    </ContextoReserva.Provider>
  );
};

export const useReserva = () => {
  const context = useContext(ContextoReserva);
  if (!context) throw new Error('useReserva debe usarse dentro de un ProveedorReserva');
  return context;
};
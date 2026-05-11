import { Avatar } from "@/components/ui/Avatar";
import { Boton } from "@/components/ui/Boton";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { Card } from "@/components/ui/Card";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs } from "@/components/ui/Tabs";
import { Calendario } from "@/components/ui/Calendario";
import { Typography } from "@/components/ui/Typography";
import { View } from "react-native";


export default function Pruebas() {
    return (
        <View>
            <Etiqueta estado="confirmada" texto="Confirmada" />
            <Etiqueta estado="pendiente" texto="Pendiente" />
            <Icono nombre="user" tamaño={20} color="rojo" bgcolor="crema" />

            <Icono nombre="credit-card" tamaño={20} color="rojo" bgcolor="verde" />
            <Boton icono="calendar" onPress={() => console.log('Siguiente Paso')} texto="Siguiente Paso" />

            <Card borde="izquierda">
                <Typography variant="h3" className="mb-2">
                    Cita con Dr. Pérez
                </Typography>
                <Etiqueta estado="confirmada" texto="Confirmada" />
            </Card>

            <Avatar url="" />

            <CampoTexto icono="user" placeholder="Usuario" />

            <Toggle activo={false} onToggle={(valor) => console.log(valor)} />

            <Tabs opciones={['Pendientes', 'Completadas']} seleccionado="Pendientes" onChange={(opcion) => console.log(opcion)} />

            <Calendario dias={[{ fecha: '2026-05-10', diaSemana: 'Hoy', numeroDia: '10' }, { fecha: '2026-05-11', diaSemana: 'Mañ', numeroDia: '11' }, { fecha: '2026-05-12', diaSemana: 'Mié', numeroDia: '12' }]} fechaSeleccionada="2026-05-10" onSelect={(fecha) => console.log(fecha)} />
        </View>
    )
}
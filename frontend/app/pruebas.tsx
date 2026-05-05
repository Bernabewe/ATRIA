import { Avatar } from "@/components/ui/Avatar";
import { Boton } from "@/components/ui/Boton";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { Card } from "@/components/ui/Card";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icono } from "@/components/ui/Icono";
import { Typography } from "@/components/ui/Typography";
import { View } from "react-native";


export default function Pruebas(){
    return (
        <View>
            <Etiqueta estado="confirmada" texto="Confirmada"/>
            <Etiqueta estado="pendiente" texto="Pendiente"/>
            <Icono nombre="user" tamaño={20} color="rojo" bgcolor="crema" />

            <Icono nombre="credit-card" tamaño={20} color="rojo" bgcolor="verde" />
            <Boton icono="calendar" onPress={() => console.log('Siguiente Paso')} texto="Siguiente Paso" />

            <Card borde="izquierda">
                <Typography variant="h3" className="mb-2">
                    Cita con Dr. Pérez
                </Typography>
                <Etiqueta estado="confirmada" texto="Confirmada" />
            </Card>

            <Avatar url=""/>

            <CampoTexto icono="user" placeholder="Usuario"/>
        </View>
    )
}
/**
 * Componente ScheduleCard.
 * 
 * Propósito: Tarjeta para mostrar horario de atención de la empresa.
 * Usado en la página de Contact para informar disponibilidad.
 * 
 * Props:
 * - schedule: Array de objetos con días y horarios
 *   Estructura: { days: string, hours: string, closed?: boolean }
 * 
 * Características:
 * - Diseño con gradiente de fondo (primary)
 * - Filas de horario con separadores
 * - Estilo especial para días cerrados
 * - Hover effect con elevación
 * - Totalmente responsivo
 * 
 * @author Yariangel Aray
 * @date 2025-12-18
 */

import { Card, CardContent } from "@/components/ui/card";

interface ScheduleItem {
  days: string;
  hours: string;
  closed?: boolean;
}

interface ScheduleCardProps {
  schedule?: ScheduleItem[];
}

// Horario por defecto si no se pasa ninguno
const defaultSchedule: ScheduleItem[] = [
  { days: "Lunes a Viernes", hours: "8:00 AM – 5:00 PM" },
  { days: "Sábados", hours: "8:00 AM – 12:00 PM" },
  { days: "Domingos", hours: "Cerrado", closed: true }
];

export default function ScheduleCard({ schedule = defaultSchedule }: ScheduleCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/70 to-primary shadow-lg border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4 text-white tracking-wide drop-shadow-sm">
          Horario de Atención
        </h3>

        <div className="space-y-3 text-sm">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center ${
                index === schedule.length - 1 ? "pt-3 border-t border-white/20" : ""
              }`}
            >
              <span className={item.closed ? "text-orange-50/90" : "text-orange-50/90"}>
                {item.days}
              </span>
              <span
                className={`font-semibold drop-shadow-sm ${
                  item.closed ? "text-red-50" : "text-white"
                }`}
              >
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
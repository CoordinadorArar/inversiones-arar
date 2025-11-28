import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

/**
 * Componente: NotificationsButton
 * Botón de notificaciones con badge indicador
 */
export const NotificationsButton = () => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hover:bg-primary/10 transition-colors"
    >
      <Bell className="h-5 w-5" />
      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
    </Button>
  );
};
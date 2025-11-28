import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

/**
 * Componente: SearchButton
 * Botón de búsqueda del dashboard
 */
export const SearchButton = () => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hidden md:flex hover:bg-primary/10 transition-colors"
    >
      <Search className="h-5 w-5" />
    </Button>
  );
};
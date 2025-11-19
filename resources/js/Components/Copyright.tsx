import { cn } from "@/lib/utils";

interface CopyrightProps {
  className?: string;
}

export default function Copyright({ className }: CopyrightProps) {
    return (
        <div className={cn("mt-8 pt-8 text-center text-xs md:text-sm text-muted-foreground", className)}>
            <p>© {new Date().getFullYear()} Inversiones Arar. Todos los derechos reservados.</p>
        </div>
    );
}
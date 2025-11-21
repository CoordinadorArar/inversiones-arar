
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface BadgeCustomProps {
    title: string;
    icon: React.ElementType;
    className?: string;
}

export default function BadgeCustom({ title, icon:Icon, className }: BadgeCustomProps) {
    return (
        <Badge className={cn("bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 inline-flex items-center gap-1.5 transition-all", className)}>
            <Icon className="h-3 w-3" />
            <span className="text-xs sm:text-sm">{title}</span>
        </Badge>
    );
}
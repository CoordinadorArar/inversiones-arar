import { Badge } from "./ui/badge";

export function EmptyBadge({ text="N/A" }) {
    return (
        <Badge variant="secondary" className="text-xs font-normal bg-muted text-muted-foreground border-0">
            {text}
        </Badge>
    );
}
import { Button } from "./ui/button";
interface ActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "primary";
}
export function ActionButton({ onClick, icon, label, variant = "default" }: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className={`h-8 gap-1.5 ${
        variant === "primary"
          ? "border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
          : "border-border hover:bg-muted"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
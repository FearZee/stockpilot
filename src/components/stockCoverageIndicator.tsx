import { Badge } from "./ui/badge";

interface StockCoverageIndicatorProps {
  daysRemaining: number;
  className?: string;
}

export function StockCoverageIndicator({
  daysRemaining,
  className = "",
}: StockCoverageIndicatorProps) {
  const getStatusConfig = (days: number) => {
    if (days <= 7) {
      return {
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800 border-red-200",
        status: "Kritisch",
        icon: "🔴",
      };
    } else if (days <= 14) {
      return {
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        status: "Warnung",
        icon: "🟡",
      };
    } else {
      return {
        variant: "default" as const,
        color: "bg-green-100 text-green-800 border-green-200",
        status: "Gut",
        icon: "🟢",
      };
    }
  };

  const getDaysDisplayText = (days: number) => {
    if (days >= 360) {
      return `mehr als ${days} Tage`;
    } else if (days <= 7) {
      return `weniger als ${days} Tage`;
    } else if (days <= 14) {
      return `weniger als ${days} Tage`;
    } else {
      return `${days} Tage`;
    }
  };

  const config = getStatusConfig(daysRemaining);
  const displayDays = Math.max(0, Math.round(daysRemaining));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className={config.color}>{config.status}</Badge>
      <span className="text-sm text-muted-foreground">
        {getDaysDisplayText(displayDays)}
      </span>
    </div>
  );
}

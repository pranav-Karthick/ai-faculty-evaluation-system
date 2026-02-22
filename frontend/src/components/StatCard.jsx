import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => {
  // Map color strings to Tailwind classes if needed, or assume input is a class
  const colorClass = color?.includes("bg-") ? color : "bg-primary";

  return (
    <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-secondary/50 text-foreground">
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

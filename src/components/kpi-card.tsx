import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  spark?: number[];
  tone?: "primary" | "success" | "warning" | "destructive" | "info" | "muted";
  icon?: React.ComponentType<{ className?: string }>;
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/15",
  destructive: "text-destructive bg-destructive/10",
  info: "text-info bg-info/10",
  muted: "text-muted-foreground bg-muted",
};

export function KpiCard({ label, value, delta, spark, tone = "primary", icon: Icon }: Props) {
  const data = (spark ?? [3, 5, 4, 7, 6, 9, 8, 11, 10, 13]).map((v, i) => ({ i, v }));
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="group relative overflow-hidden p-5 transition-all hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
          {delta !== undefined && (
            <div className={cn("mt-1 inline-flex items-center gap-1 text-xs font-medium",
              positive ? "text-success" : "text-destructive")}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}% vs last period
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", TONES[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="-mx-5 -mb-5 mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2}
              fill={`url(#spark-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

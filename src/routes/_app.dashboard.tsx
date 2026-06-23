import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, XCircle, Calendar, UserX, MinusCircle, Clock, Pause, Target, TrendingUp, Sparkles, ListChecks } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const trendData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  CFR: 40 + Math.round(Math.sin(i / 2) * 12 + Math.random() * 8),
  LR: 30 + Math.round(Math.cos(i / 2) * 10 + Math.random() * 6),
}));

const deptData = [
  { name: "Done", CFR: 320, LR: 245 },
  { name: "Pass", CFR: 180, LR: 130 },
  { name: "Fail", CFR: 60, LR: 40 },
  { name: "Reschedule", CFR: 50, LR: 35 },
  { name: "No Show", CFR: 30, LR: 25 },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="A live snapshot of organization-wide performance across CFR and LR departments."
        actions={<Badge variant="secondary" className="gap-1.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Slots" value="2,840" delta={8.4} icon={Calendar} tone="primary" />
        <KpiCard label="Total Done" value="2,310" delta={11.2} icon={CheckCircle2} tone="success" />
        <KpiCard label="Total Pass" value="1,640" delta={6.8} icon={Activity} tone="info" />
        <KpiCard label="Total Fail" value="280" delta={-4.1} icon={XCircle} tone="destructive" />
        <KpiCard label="Reschedule" value="195" delta={2.3} icon={Clock} tone="warning" />
        <KpiCard label="No Show" value="120" delta={-1.7} icon={UserX} tone="destructive" />
        <KpiCard label="Disinterested" value="85" delta={-0.9} icon={MinusCircle} tone="muted" />
        <KpiCard label="Empty" value="42" delta={-2.6} icon={Pause} tone="muted" />
        <KpiCard label="Buffer" value="65" delta={1.4} icon={ListChecks} tone="info" />
        <KpiCard label="Conversion Rate" value="71%" delta={4.2} icon={Target} tone="success" />
        <KpiCard label="Productivity Score" value="92" delta={3.1} icon={Sparkles} tone="primary" />
        <KpiCard label="Monthly Growth" value="+18.4%" delta={5.6} icon={TrendingUp} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Department Activity — 14 days</h3>
              <p className="text-xs text-muted-foreground">CFR vs LR submissions trend</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[--color-cfr]" /> CFR</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[--color-lr]" /> LR</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="CFR" stroke="var(--color-cfr)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="LR" stroke="var(--color-lr)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Department Overview</h3>
          <div className="space-y-4">
            {[
              { name: "CFR Department", score: 92, color: "var(--color-cfr)", members: 18 },
              { name: "LR Department", score: 86, color: "var(--color-lr)", members: 14 },
            ].map((d) => (
              <div key={d.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.members} active interns</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: d.color }}>{d.score}</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Outcome Distribution — CFR vs LR</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="CFR" fill="var(--color-cfr)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="LR" fill="var(--color-lr)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

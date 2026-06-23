import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList,
  Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, Filter } from "lucide-react";

const daily = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`, slots: 80 + Math.round(Math.random() * 40), done: 60 + Math.round(Math.random() * 30),
}));

const weekly = Array.from({ length: 12 }, (_, i) => ({
  w: `W${i + 1}`, value: 500 + Math.round(Math.random() * 250),
}));

const monthly = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({
  m, value: 1800 + i * 120 + Math.round(Math.random() * 200),
}));

const funnel = [
  { name: "Slots", value: 2840, fill: "var(--color-chart-1)" },
  { name: "Done", value: 2310, fill: "var(--color-chart-2)" },
  { name: "Pass", value: 1640, fill: "var(--color-chart-3)" },
  { name: "Converted", value: 980, fill: "var(--color-chart-4)" },
];

const donut = [
  { name: "Pass", value: 64, fill: "var(--color-success)" },
  { name: "Fail", value: 11, fill: "var(--color-destructive)" },
  { name: "Reschedule", value: 12, fill: "var(--color-warning)" },
  { name: "No Show", value: 8, fill: "var(--color-info)" },
  { name: "Other", value: 5, fill: "var(--color-muted-foreground)" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["9a", "11a", "1p", "3p", "5p", "7p"];

export function AnalyticsView({ dept }: { dept: "CFR" | "LR" }) {
  const accent = dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${dept} Analytics`}
        description={`Deep-dive analytics for the ${dept} department.`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
            <Button size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {["Today", "7 days", "30 days", "Quarter", "YTD"].map((p, i) => (
          <Badge key={p} variant={i === 2 ? "default" : "outline"} className="cursor-pointer">{p}</Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Daily Trends</h3>
          <p className="mb-3 text-xs text-muted-foreground">Slots vs completed — last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="slots" stroke={accent} strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="done" stroke="var(--color-success)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Weekly Trends</h3>
          <p className="mb-3 text-xs text-muted-foreground">Cumulative weekly output</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="w" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill={accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Monthly Growth</h3>
          <p className="mb-3 text-xs text-muted-foreground">Year-to-date</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke={accent} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Conversion Funnel</h3>
          <p className="mb-3 text-xs text-muted-foreground">From slot to conversion</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={funnel} isAnimationActive>
                  <LabelList position="right" fill="var(--color-foreground)" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Outcome Distribution</h3>
          <p className="mb-3 text-xs text-muted-foreground">Share of outcomes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {donut.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold">Activity Heatmap</h3>
          <p className="mb-3 text-xs text-muted-foreground">By day & hour</p>
          <div className="grid grid-cols-[auto_repeat(6,minmax(0,1fr))] gap-1.5">
            <div />
            {hours.map((h) => <div key={h} className="text-center text-[10px] text-muted-foreground">{h}</div>)}
            {days.map((day) => (
              <>
                <div key={day + "l"} className="text-[10px] text-muted-foreground">{day}</div>
                {hours.map((h) => {
                  const v = Math.random();
                  return (
                    <div key={day + h} className="h-7 rounded"
                      style={{ background: `color-mix(in oklab, ${accent} ${Math.round(v * 90)}%, transparent)` }} />
                  );
                })}
              </>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

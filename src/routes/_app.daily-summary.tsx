import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, FileSpreadsheet, Printer, CalendarDays,
  CheckCircle2, XCircle, Clock, UserX, Slash, Layers, Inbox, Coffee, TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/_app/daily-summary")({
  component: DailySummary,
});

type Metrics = {
  done: number; pass: number; fail: number; resched: number;
  noshow: number; disinterested: number; slots: number; empty: number; buffer: number;
};

const LR: Metrics = { done: 48, pass: 31, fail: 9, resched: 5, noshow: 3, disinterested: 2, slots: 60, empty: 7, buffer: 5 };
const CFR: Metrics = { done: 52, pass: 38, fail: 8, resched: 4, noshow: 2, disinterested: 1, slots: 65, empty: 8, buffer: 5 };

const sum = (a: Metrics, b: Metrics): Metrics => ({
  done: a.done + b.done, pass: a.pass + b.pass, fail: a.fail + b.fail,
  resched: a.resched + b.resched, noshow: a.noshow + b.noshow,
  disinterested: a.disinterested + b.disinterested, slots: a.slots + b.slots,
  empty: a.empty + b.empty, buffer: a.buffer + b.buffer,
});

const TREND = [
  { d: "Mon", cfr: 42, lr: 38, conv: 62 },
  { d: "Tue", cfr: 47, lr: 41, conv: 65 },
  { d: "Wed", cfr: 51, lr: 44, conv: 68 },
  { d: "Thu", cfr: 49, lr: 46, conv: 64 },
  { d: "Fri", cfr: 55, lr: 49, conv: 71 },
  { d: "Sat", cfr: 50, lr: 45, conv: 67 },
  { d: "Sun", cfr: 52, lr: 48, conv: 69 },
];

function KPI({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; tone?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${tone ?? "bg-primary/10 text-primary"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
    </Card>
  );
}

function MetricBlock({ title, color, m }: { title: string; color: string; m: Metrics }) {
  const items: [string, number][] = [
    ["Total Done", m.done], ["Total Pass", m.pass], ["Total Fail", m.fail],
    ["Total Reschedule", m.resched], ["Total No Show", m.noshow],
    ["Total Disinterested", m.disinterested], ["Total Slots", m.slots],
    ["Total Empty", m.empty], ["Total Buffer", m.buffer],
  ];
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b px-5 py-3" style={{ background: `${color}15` }}>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <div className="font-semibold">{title}</div>
        </div>
        <Badge variant="outline" style={{ borderColor: color, color }}>{m.done}/{m.slots} done</Badge>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-9">
        {items.map(([k, v]) => (
          <div key={k} className="bg-card p-3">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DailySummary() {
  const [date, setDate] = useState("2026-06-16");
  const [dept, setDept] = useState("all");
  const [user, setUser] = useState("all");

  const total = useMemo(() => sum(LR, CFR), []);
  const convRate = Math.round((total.pass / Math.max(total.done, 1)) * 100);

  const passFail = [
    { name: "Pass", value: total.pass, fill: "var(--color-success, hsl(142 71% 45%))" },
    { name: "Fail", value: total.fail, fill: "var(--color-destructive, hsl(0 84% 60%))" },
    { name: "Reschedule", value: total.resched, fill: "hsl(38 92% 50%)" },
    { name: "No Show", value: total.noshow, fill: "hsl(220 9% 60%)" },
  ];
  const compare = [
    { k: "Done", CFR: CFR.done, LR: LR.done },
    { k: "Pass", CFR: CFR.pass, LR: LR.pass },
    { k: "Fail", CFR: CFR.fail, LR: LR.fail },
    { k: "Resched", CFR: CFR.resched, LR: LR.resched },
    { k: "No Show", CFR: CFR.noshow, LR: LR.noshow },
    { k: "Slots", CFR: CFR.slots, LR: LR.slots },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Summary"
        description={`Executive operational summary • ${new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> PDF</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> Print</Button>
          </>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[180px]" />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cfr">Culture-Fit Rounds</SelectItem>
              <SelectItem value="lr">Learning Rounds</SelectItem>
            </SelectContent>
          </Select>
          <Select value={user} onValueChange={setUser}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Team Member" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              <SelectItem value="rahul">Rahul Menon</SelectItem>
              <SelectItem value="priya">Priya Sharma</SelectItem>
              <SelectItem value="anjali">Anjali V.</SelectItem>
              <SelectItem value="sameer">Sameer K.</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto"><Badge variant="secondary">Snapshot: {date}</Badge></div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <KPI icon={Layers} label="Total Slots" value={total.slots} />
        <KPI icon={CheckCircle2} label="Total Done" value={total.done} tone="bg-success/10 text-success" />
        <KPI icon={CheckCircle2} label="Total Pass" value={total.pass} tone="bg-success/10 text-success" />
        <KPI icon={XCircle} label="Total Fail" value={total.fail} tone="bg-destructive/10 text-destructive" />
        <KPI icon={Clock} label="Reschedule" value={total.resched} tone="bg-warning/10 text-warning" />
        <KPI icon={UserX} label="No Show" value={total.noshow} tone="bg-muted text-muted-foreground" />
        <KPI icon={Slash} label="Disinterested" value={total.disinterested} tone="bg-muted text-muted-foreground" />
        <KPI icon={TrendingUp} label="Conversion Rate" value={`${convRate}%`} tone="bg-primary/10 text-primary" />
      </div>

      {/* Visualizations */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Pass vs Fail</div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passFail} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {passFail.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4 lg:col-span-2">
          <div className="mb-2 text-sm font-semibold">CFR vs LR Comparison</div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compare}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="k" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="CFR" fill="hsl(221 83% 53%)" radius={[4,4,0,0]} />
                <Bar dataKey="LR" fill="hsl(262 83% 58%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4 lg:col-span-2">
          <div className="mb-2 text-sm font-semibold">Daily Performance</div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="d" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="cfr" name="CFR" fill="hsl(221 83% 53%)" radius={[4,4,0,0]} />
                <Bar dataKey="lr" name="LR" fill="hsl(262 83% 58%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">Conversion Trend</div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="d" className="text-xs" />
                <YAxis className="text-xs" domain={[0,100]} />
                <Tooltip />
                <Line type="monotone" dataKey="conv" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Grouped metric blocks */}
      <div className="space-y-4">
        <MetricBlock title="Learning Rounds Online" color="hsl(262 83% 58%)" m={LR} />
        <MetricBlock title="Culture-Fit Rounds Online" color="hsl(221 83% 53%)" m={CFR} />
      </div>

      {/* Detailed table */}
      <Card className="overflow-hidden p-0">
        <div className="border-b px-5 py-3 font-semibold">Category Breakdown</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Done</TableHead>
              <TableHead className="text-right">Pass</TableHead>
              <TableHead className="text-right">Fail</TableHead>
              <TableHead className="text-right">Resched.</TableHead>
              <TableHead className="text-right">No Show</TableHead>
              <TableHead className="text-right">Disinterested</TableHead>
              <TableHead className="text-right">Slots</TableHead>
              <TableHead className="text-right">Empty</TableHead>
              <TableHead className="text-right">Buffer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {([
              ["Culture-Fit Rounds Online", CFR],
              ["Learning Rounds Online", LR],
            ] as const).map(([name, m]) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="font-mono text-xs">{date}</TableCell>
                <TableCell className="text-right">{m.done}</TableCell>
                <TableCell className="text-right font-semibold text-success">{m.pass}</TableCell>
                <TableCell className="text-right text-destructive">{m.fail}</TableCell>
                <TableCell className="text-right text-warning">{m.resched}</TableCell>
                <TableCell className="text-right text-muted-foreground">{m.noshow}</TableCell>
                <TableCell className="text-right text-muted-foreground">{m.disinterested}</TableCell>
                <TableCell className="text-right">{m.slots}</TableCell>
                <TableCell className="text-right">{m.empty}</TableCell>
                <TableCell className="text-right">{m.buffer}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/40 font-semibold">
              <TableCell>Subtotal</TableCell>
              <TableCell className="font-mono text-xs">{date}</TableCell>
              <TableCell className="text-right">{total.done}</TableCell>
              <TableCell className="text-right text-success">{total.pass}</TableCell>
              <TableCell className="text-right text-destructive">{total.fail}</TableCell>
              <TableCell className="text-right text-warning">{total.resched}</TableCell>
              <TableCell className="text-right">{total.noshow}</TableCell>
              <TableCell className="text-right">{total.disinterested}</TableCell>
              <TableCell className="text-right">{total.slots}</TableCell>
              <TableCell className="text-right">{total.empty}</TableCell>
              <TableCell className="text-right">{total.buffer}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Highlighted Total Interviews */}
      <Card className="relative overflow-hidden border-primary/30 p-0">
        <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-primary)" }} />
        <div className="relative border-b border-primary/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Combined Summary</div>
              <div className="text-xl font-bold">Total Interviews (CFR + LR)</div>
            </div>
            <Badge className="bg-primary text-primary-foreground">{convRate}% Conversion</Badge>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-px bg-border md:grid-cols-3 lg:grid-cols-9">
          {([
            ["Total Done", total.done, CheckCircle2],
            ["Total Pass", total.pass, CheckCircle2],
            ["Total Fail", total.fail, XCircle],
            ["Total Reschedule", total.resched, Clock],
            ["Total No Show", total.noshow, UserX],
            ["Total Disinterested", total.disinterested, Slash],
            ["Total Slots", total.slots, Layers],
            ["Total Empty", total.empty, Inbox],
            ["Total Buffer", total.buffer, Coffee],
          ] as const).map(([label, value, Icon]) => (
            <div key={label} className="bg-card/80 p-4 backdrop-blur">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3 w-3" /> {label}
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

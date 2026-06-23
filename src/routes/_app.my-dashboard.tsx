import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle2, Activity, Search, Filter, Clock, ClipboardList, CheckCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/_app/my-dashboard")({ component: MyDashboard });

const HISTORY = Array.from({ length: 10 }, (_, i) => ({
  date: `2026-06-${String(15 - i).padStart(2, "0")}`,
  dept: i % 2 === 0 ? "CFR" : "LR",
  slots: 18, done: 16, pass: 12, fail: 1, resched: 1, noshow: 1, disint: 1, empty: 0, buffer: 1,
}));

const ACTIVITY = [
  { d: "12 Jun", what: "CFR Submitted", ok: true },
  { d: "12 Jun", what: "LR Submitted", ok: true },
  { d: "11 Jun", what: "CFR Submitted", ok: true },
  { d: "11 Jun", what: "LR Submitted", ok: true },
  { d: "10 Jun", what: "CFR Submitted", ok: true },
];

function MyDashboard() {
  const { user } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]} 👋`}
        description="Your personal performance snapshot for this month."
        actions={<Button asChild className="gap-1.5"><Link to="/daily-report"><ClipboardList className="h-3.5 w-3.5" /> Submit Today</Link></Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Total Slots" value="340" delta={6.8} icon={Calendar} tone="primary" />
        <KpiCard label="Total Done" value="298" delta={9.1} icon={CheckCircle2} tone="success" />
        <KpiCard label="Total Pass" value="214" delta={4.5} icon={Activity} tone="info" />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Today's Submission Status</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SubmissionTile dept="CFR" submitted />
          <SubmissionTile dept="LR" submitted={false} />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-2 p-4">
          <h3 className="mr-auto font-semibold">My Submission History</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-48 pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date range</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead className="text-right">Slots</TableHead>
              <TableHead className="text-right">Done</TableHead>
              <TableHead className="text-right">Pass</TableHead>
              <TableHead className="text-right">Fail</TableHead>
              <TableHead className="text-right">Resched.</TableHead>
              <TableHead className="text-right">No Show</TableHead>
              <TableHead className="text-right">Disint.</TableHead>
              <TableHead className="text-right">Empty</TableHead>
              <TableHead className="text-right">Buffer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORY.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{r.date}</TableCell>
                <TableCell><Badge variant="outline" style={{ borderColor: r.dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: r.dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)" }}>{r.dept}</Badge></TableCell>
                <TableCell className="text-right">{r.slots}</TableCell>
                <TableCell className="text-right">{r.done}</TableCell>
                <TableCell className="text-right text-success">{r.pass}</TableCell>
                <TableCell className="text-right text-destructive">{r.fail}</TableCell>
                <TableCell className="text-right">{r.resched}</TableCell>
                <TableCell className="text-right">{r.noshow}</TableCell>
                <TableCell className="text-right">{r.disint}</TableCell>
                <TableCell className="text-right">{r.empty}</TableCell>
                <TableCell className="text-right">{r.buffer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Recent Activity</h3>
        <ul className="space-y-3">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success"><CheckCheck className="h-4 w-4" /></span>
              <span className="text-sm font-medium">{a.what}</span>
              <span className="ml-auto text-xs text-muted-foreground">{a.d}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SubmissionTile({ dept, submitted }: { dept: string; submitted: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${submitted ? "bg-success/10 text-success" : "bg-warning/15 text-warning"}`}>
        {submitted ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
      </span>
      <div className="flex-1">
        <div className="font-semibold">{dept} Report</div>
        <div className="text-xs text-muted-foreground">{submitted ? "Submitted at 11:42 AM" : "Pending — due 7:00 PM"}</div>
      </div>
      {!submitted && <Button size="sm" asChild><Link to="/daily-report">Submit</Link></Button>}
    </div>
  );
}

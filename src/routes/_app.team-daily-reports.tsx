import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, Filter, Search, FileText, Sheet, FileSpreadsheet,
  CalendarDays, Users as UsersIcon, Building2,
} from "lucide-react";

export const Route = createFileRoute("/_app/team-daily-reports")({
  component: TeamDailyReportsPage,
});

type Row = {
  name: string;
  done: number;
  pass: number;
  fail: number;
  resched: number;
  noshow: number;
  disinterested: number;
  slots: number;
  empty: number;
  buffer: number;
};

type Dept = "CFR" | "LR";
const MEMBERS: { name: string; depts: Dept[] }[] = [
  { name: "Anisha Rao", depts: ["CFR"] },
  { name: "Manisha Verma", depts: ["LR"] },
  { name: "Kartik Shah", depts: ["CFR", "LR"] },
  { name: "Rahul Menon", depts: ["CFR", "LR"] },
  { name: "Priya Sharma", depts: ["CFR"] },
  { name: "Vivek R.", depts: ["LR"] },
];

function deptBadgeClass(d: Dept) {
  if (d === "CFR") return "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15 dark:text-blue-400";
  return "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/15 dark:text-teal-400";
}

function makeRow(name: string, seed: number): Row {
  const r = (n: number) => Math.abs(Math.sin(seed * (n + 1))) ;
  const slots = 40 + Math.floor(r(1) * 25);
  const done = 28 + Math.floor(r(2) * 18);
  const pass = Math.max(0, done - Math.floor(r(3) * 10));
  const fail = Math.floor(r(4) * 5);
  const resched = Math.floor(r(5) * 4);
  const noshow = Math.floor(r(6) * 3);
  const disinterested = Math.floor(r(7) * 3);
  const empty = Math.max(0, slots - done - resched - noshow);
  const buffer = Math.floor(r(8) * 4);
  return { name, done, pass, fail, resched, noshow, disinterested, slots, empty, buffer };
}

const DATES = [
  "16 June 2026",
  "15 June 2026",
  "12 June 2026",
  "11 June 2026",
];

function buildGroups() {
  return DATES.map((date, di) => {
    const members = MEMBERS.slice(0, 3 + (di % 3));
    const rows: (Row & { dept: Dept })[] = [];
    members.forEach((m, ni) => {
      m.depts.forEach((dept, dj) => {
        const seed = (di + 1) * 7 + ni * 3 + (dept === "CFR" ? 1 : 2) * 11 + dj;
        rows.push({ ...makeRow(m.name, seed), dept });
      });
    });
    return { date, rows };
  });
}

const COLS: { key: keyof Omit<Row, "name">; label: string; tone?: string }[] = [
  { key: "done", label: "Done" },
  { key: "pass", label: "Pass", tone: "text-success font-semibold" },
  { key: "fail", label: "Fail", tone: "text-destructive" },
  { key: "resched", label: "Reschedule", tone: "text-warning" },
  { key: "noshow", label: "No Show", tone: "text-muted-foreground" },
  { key: "disinterested", label: "Disinterested", tone: "text-muted-foreground" },
  { key: "slots", label: "Slots" },
  { key: "empty", label: "Empty", tone: "text-muted-foreground" },
  { key: "buffer", label: "Buffer", tone: "text-muted-foreground" },
];

function TeamDailyReportsPage() {
  const groups = buildGroups();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Daily Reports"
        description="Centralized view of all daily reports grouped by reporting date."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> PDF</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Sheet className="h-3.5 w-3.5" /> CSV</Button>
          </>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, department, or date..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Date</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Department</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><UsersIcon className="h-3.5 w-3.5" /> User</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> More Filters</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Badge variant="secondary">{groups.length} days</Badge>
        </div>
      </Card>

      {/* Date-grouped sections */}
      <div className="space-y-6">
        {groups.map((g) => {
          const totals = COLS.reduce(
            (acc, c) => ({ ...acc, [c.key]: g.rows.reduce((s, r) => s + (r[c.key] as number), 0) }),
            {} as Record<string, number>,
          );
          return (
            <Card key={g.date} className="overflow-hidden p-0">
              {/* Date header */}
              <div
                className="flex items-center justify-between border-b border-border px-5 py-3"
                style={{ background: "var(--gradient-subtle, hsl(var(--muted)))" }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-base font-semibold">{g.date}</div>
                    <div className="text-xs text-muted-foreground">
                      {g.rows.length} team member{g.rows.length === 1 ? "" : "s"} reported
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  Total Done: {totals.done}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    {COLS.map((c) => (
                      <TableHead key={c.key as string} className="text-right">{c.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {g.rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={deptBadgeClass(r.dept)}>{r.dept}</Badge>
                      </TableCell>
                      {COLS.map((c) => (
                        <TableCell key={c.key as string} className={`text-right ${c.tone ?? ""}`}>
                          {r[c.key] as number}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {/* Daily totals row */}
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableCell className="font-semibold uppercase tracking-wide text-xs text-primary">
                      Daily Totals
                    </TableCell>
                    <TableCell />
                    {COLS.map((c) => (
                      <TableCell
                        key={c.key as string}
                        className="text-right font-bold text-foreground"
                      >
                        {totals[c.key as string]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

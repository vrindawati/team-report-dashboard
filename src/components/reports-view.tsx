import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Search, FileText, Sheet, FileSpreadsheet } from "lucide-react";

const NAMES = ["Rahul Menon","Priya Sharma","Anjali V.","Sameer K.","Pooja N.","Vivek R.","Karan Singh","Riya K.","Aman G.","Neha P."];

export function ReportsView({ kind, title, description }: { kind: "Daily" | "Weekly" | "Monthly"; title?: string; description?: string }) {
  const rows = Array.from({ length: 12 }, (_, i) => ({
    date: kind === "Monthly" ? `2026-${String(((i % 12) + 1)).padStart(2, "0")}` :
          kind === "Weekly" ? `Week ${i + 1}` :
          `2026-06-${String(15 - (i % 15)).padStart(2, "0")}`,
    name: NAMES[i % NAMES.length],
    dept: i % 2 === 0 ? "CFR" : "LR",
    slots: 40 + Math.round(Math.random() * 30),
    done: 30 + Math.round(Math.random() * 25),
    pass: 20 + Math.round(Math.random() * 18),
    fail: Math.round(Math.random() * 6),
    resched: Math.round(Math.random() * 4),
    noshow: Math.round(Math.random() * 3),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={title ?? `${kind} Reports`}
        description={description ?? `Browse, filter, and export ${kind.toLowerCase()} performance reports.`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> PDF</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Sheet className="h-3.5 w-3.5" /> CSV</Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, department, or date..." className="pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filters</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Date range</Button>
          <Badge variant="secondary">{rows.length} results</Badge>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{kind === "Daily" ? "Date" : kind === "Weekly" ? "Week" : "Month"}</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead className="text-right">Slots</TableHead>
              <TableHead className="text-right">Done</TableHead>
              <TableHead className="text-right">Pass</TableHead>
              <TableHead className="text-right">Fail</TableHead>
              <TableHead className="text-right">Resched.</TableHead>
              <TableHead className="text-right">No Show</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">{r.date}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell><Badge variant="outline" style={{ borderColor: r.dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: r.dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)" }}>{r.dept}</Badge></TableCell>
                <TableCell className="text-right">{r.slots}</TableCell>
                <TableCell className="text-right">{r.done}</TableCell>
                <TableCell className="text-right font-semibold text-success">{r.pass}</TableCell>
                <TableCell className="text-right text-destructive">{r.fail}</TableCell>
                <TableCell className="text-right text-warning">{r.resched}</TableCell>
                <TableCell className="text-right text-muted-foreground">{r.noshow}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

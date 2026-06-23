import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, UserPlus, FileEdit, Target, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/_app/audit-logs")({ component: AuditLogs });

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  user_create: UserPlus, user_update: Edit, report_change: FileEdit, goal_change: Target, user_delete: Trash2,
};

const LOGS = [
  { type: "user_create", actor: "Aarav Mehta", target: "Riya Kapoor", at: "12 Jun · 14:32", desc: "Invited as LR intern" },
  { type: "goal_change", actor: "Aarav Mehta", target: "CFR Monthly", at: "12 Jun · 11:08", desc: "Target raised 4,000 → 4,200" },
  { type: "report_change", actor: "Priya Sharma", target: "11 Jun · CFR", at: "12 Jun · 09:14", desc: "Edited pass count 22 → 24" },
  { type: "user_update", actor: "Aarav Mehta", target: "Vivek R.", at: "11 Jun · 17:42", desc: "Department reassigned to CFR" },
  { type: "user_delete", actor: "Aarav Mehta", target: "Mock User", at: "10 Jun · 10:21", desc: "Account deleted" },
];

function AuditLogs() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Every user, report, and goal change is tracked here."
        actions={<Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>}
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by actor, target, or event..." className="pl-9" />
          </div>
          {["All", "User", "Report", "Goal"].map((t, i) => (
            <Badge key={t} variant={i === 0 ? "default" : "outline"} className="cursor-pointer">{t}</Badge>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LOGS.map((l, i) => {
              const Icon = ICONS[l.type];
              return (
                <TableRow key={i}>
                  <TableCell><div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-primary"><Icon className="h-4 w-4" /></div></TableCell>
                  <TableCell><Badge variant="outline">{l.type.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="font-medium">{l.actor}</TableCell>
                  <TableCell>{l.target}</TableCell>
                  <TableCell className="text-muted-foreground">{l.desc}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">{l.at}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";
import { CheckCircle2, AlertCircle, Lock, Save, Eye, History } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/daily-report")({ component: DailyReport });

const FIELDS = ["Slots","Done","Pass","Fail","Reschedule","No Show","Disinterested","Empty","Buffer"] as const;
type FieldKey = typeof FIELDS[number];

type ReportStatus = "Draft" | "Submitted" | "Locked";
type ReportState = {
  values: Record<FieldKey, string>;
  status: ReportStatus;
  editCount: number;
  submittedAt?: string;
  submittedBy?: string;
  lastEditedAt?: string;
  lastEditedBy?: string;
  adminEdits?: { adminEditedAt: string; adminEditedBy: string; actionType: "Admin Override" }[];
};


function emptyValues(): Record<FieldKey, string> {
  return FIELDS.reduce((acc, f) => ({ ...acc, [f]: "" }), {} as Record<FieldKey, string>);
}

function DailyReport() {
  const { user } = useApp();
  const depts = user?.departments ?? ["CFR"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Report"
        description="Submit your performance data for today. You may edit your report once after submission."
        actions={<Badge variant="outline" className="gap-1.5"><Lock className="h-3 w-3" /> 1 edit allowed after submit</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-4">
          <Label>Date</Label>
          <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        </Card>
        <Card className="space-y-2 p-4">
          <Label>Departments Assigned</Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {depts.map((d) => (
              <Badge key={d} variant="outline" style={{ borderColor: d === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: d === "CFR" ? "var(--color-cfr)" : "var(--color-lr)" }}>{d}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {depts.map((d) => <DeptReportCard key={d} dept={d} userName={user?.name ?? "Team Member"} isAdmin={user?.role === "admin"} />)}
    </div>
  );
}

function nowStr() {
  return new Date().toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function DeptReportCard({ dept, userName, isAdmin }: { dept: string; userName: string; isAdmin: boolean }) {
  const [state, setState] = useState<ReportState>({ values: emptyValues(), status: "Draft", editCount: 0 });
  const [editing, setEditing] = useState(true);
  const [viewing, setViewing] = useState(false);

  const isLocked = state.status === "Locked";
  const isSubmitted = state.status === "Submitted" || state.status === "Locked";

  const validation = useMemo(() => {
    const missing: string[] = [];
    const invalid: string[] = [];
    for (const f of FIELDS) {
      const raw = state.values[f];
      if (raw === "" || raw == null) { missing.push(f); continue; }
      if (!/^\d+(\.\d+)?$/.test(raw.trim())) { invalid.push(f); continue; }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) { invalid.push(f); }
    }
    return { ok: missing.length === 0 && invalid.length === 0, missing, invalid };
  }, [state.values]);

  const setVal = (f: FieldKey, v: string) => setState((s) => ({ ...s, values: { ...s.values, [f]: v } }));

  const handleSubmit = () => {
    if (!validation.ok) return;
    const ts = nowStr();
    setState((s) => ({ ...s, status: "Submitted", editCount: 0, submittedAt: ts, submittedBy: userName }));
    setEditing(false);
    toast.success(`${dept} report submitted`);
  };

  const handleSaveEdit = () => {
    if (!validation.ok) return;
    const ts = nowStr();
    setState((s) => {
      if (isAdmin) {
        // Admin override: do not consume the user's one-time edit allowance.
        const adminEntry = { adminEditedAt: ts, adminEditedBy: userName, actionType: "Admin Override" as const };
        return {
          ...s,
          adminEdits: [...(s.adminEdits ?? []), adminEntry],
          // status and editCount unchanged
        };
      }
      const newCount = s.editCount + 1;
      const newStatus: ReportStatus = newCount >= 1 ? "Locked" : "Submitted";
      return { ...s, editCount: newCount, status: newStatus, lastEditedAt: ts, lastEditedBy: userName };
    });
    setEditing(false);
    toast.success(`${dept} report updated${isAdmin ? " (admin override)" : " — now locked"}`);
  };

  const canEdit = isAdmin || (isSubmitted && state.editCount < 1 && !isLocked);



  // VIEW MODE (read-only modal-like card)
  if (viewing) {
    return (
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge style={{ background: dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: "white" }}>{dept}</Badge>
            <h3 className="font-semibold">{dept} Report — View</h3>
            <Badge variant="outline">{state.status}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => setViewing(false)}>Close</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {FIELDS.map((f) => (
            <div key={f} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f}</Label>
              <Input value={state.values[f]} readOnly disabled />
            </div>
          ))}
        </div>
        <AuditPanel state={state} />
      </Card>
    );
  }

  // SUBMITTED (not currently editing)
  if (isSubmitted && !editing) {
    return (
      <Card className={`p-5 ${isLocked ? "border-muted-foreground/30 bg-muted/30" : "border-success/30 bg-success/5"}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${isLocked ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
            {isLocked ? <Lock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold">
              {dept} Report {isLocked ? "Locked" : "Submitted"}
              {isLocked && <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> Locked</Badge>}
            </div>
            <div className="text-xs text-muted-foreground">
              {state.submittedAt && <>Submitted at {state.submittedAt}. </>}
              {state.lastEditedAt && <>Last edited {state.lastEditedAt}. </>}
              Edits used: {state.editCount}/{isAdmin ? "∞" : 1}
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setViewing(true)}>
            <Eye className="h-3.5 w-3.5" /> View Report
          </Button>
          {canEdit && (
            <Button size="sm" onClick={() => setEditing(true)}>Edit Report</Button>
          )}
        </div>
        {isLocked && (
          <div className="mt-4 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning-foreground/90">
            <span className="font-semibold">Report Locked:</span> You have already used your one allowed edit. Further changes can only be made by an Administrator.
          </div>
        )}
        <AuditPanel state={state} />
      </Card>
    );
  }

  // EDIT / NEW SUBMIT MODE
  const fieldsDisabled = isLocked && !isAdmin;
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge style={{ background: dept === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: "white" }}>{dept}</Badge>
          <h3 className="font-semibold">{dept} Report {isSubmitted ? "— Edit" : ""}</h3>
        </div>
        {isSubmitted ? (
          <Badge variant="outline" className="gap-1.5">Edit {state.editCount + 1}/{isAdmin ? "∞" : 1}</Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5 text-warning"><AlertCircle className="h-3 w-3" /> Pending</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {FIELDS.map((f) => {
          const raw = state.values[f];
          const isMissing = raw === "";
          const isInvalid = !isMissing && (!/^\d+(\.\d+)?$/.test(raw.trim()) || Number(raw) < 0);
          return (
            <div key={f} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f} <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min={0}
                step="1"
                inputMode="numeric"
                value={raw}
                disabled={fieldsDisabled}
                onChange={(e) => setVal(f, e.target.value)}
                aria-invalid={isInvalid}
                className={isInvalid ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {isInvalid && <p className="text-[11px] text-destructive">Enter a valid non-negative number</p>}
            </div>
          );
        })}
      </div>

      {!validation.ok && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 text-warning" />
          <div>
            <div className="font-semibold">All fields are required.</div>
            {validation.missing.length > 0 && <div className="text-muted-foreground">Missing: {validation.missing.join(", ")}</div>}
            {validation.invalid.length > 0 && <div className="text-muted-foreground">Invalid: {validation.invalid.join(", ")}</div>}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        {isSubmitted && (
          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
        )}
        <Button
          className="gap-1.5"
          disabled={!validation.ok || fieldsDisabled}
          onClick={isSubmitted ? handleSaveEdit : handleSubmit}
        >
          <Save className="h-3.5 w-3.5" /> {isSubmitted ? "Save Changes" : "Submit Report"}
        </Button>
      </div>

      <AuditPanel state={state} />
    </Card>
  );
}

function AuditPanel({ state }: { state: ReportState }) {
  if (state.status === "Draft") return null;
  return (
    <div className="mt-5 rounded-md border border-border bg-muted/30 p-3 text-xs">
      <div className="mb-2 flex items-center gap-1.5 font-semibold text-muted-foreground">
        <History className="h-3.5 w-3.5" /> Report History
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <div><span className="text-muted-foreground">Submitted By:</span> {state.submittedBy ?? "—"}</div>
        <div><span className="text-muted-foreground">Submitted At:</span> {state.submittedAt ?? "—"}</div>
        <div><span className="text-muted-foreground">Last Edited By:</span> {state.lastEditedBy ?? "—"}</div>
        <div><span className="text-muted-foreground">Last Edited At:</span> {state.lastEditedAt ?? "—"}</div>
        <div><span className="text-muted-foreground">Edit Count:</span> {state.editCount}</div>
        <div><span className="text-muted-foreground">Status:</span> {state.status}</div>
      </div>
      {state.adminEdits && state.adminEdits.length > 0 && (
        <div className="mt-3 border-t border-border pt-2">
          <div className="mb-1 font-semibold text-muted-foreground">Admin Overrides ({state.adminEdits.length})</div>
          <ul className="space-y-1">
            {state.adminEdits.map((a, i) => (
              <li key={i} className="flex flex-wrap gap-x-3">
                <span><span className="text-muted-foreground">By:</span> {a.adminEditedBy}</span>
                <span><span className="text-muted-foreground">At:</span> {a.adminEditedAt}</span>
                <span><span className="text-muted-foreground">Action:</span> {a.actionType}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

  );
}

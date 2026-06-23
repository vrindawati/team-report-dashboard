import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Ban, Search, UserCheck, UserX, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

const USERS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  name: ["Rahul Menon","Priya Sharma","Anjali V.","Sameer K.","Pooja N.","Vivek R.","Karan Singh","Riya K.","Aman G."][i],
  email: ["rahul","priya","anjali","sameer","pooja","vivek","karan","riya","aman"][i] + "@company.com",
  phone: "+91 98" + (100000 + i * 1111).toString(),
  role: i === 0 ? "admin" : "user",
  depts: i % 3 === 0 ? ["CFR", "LR"] : i % 2 === 0 ? ["CFR"] : ["LR"],
  status: i === 7 ? "inactive" : "active",
  created: `2026-0${(i % 6) + 1}-12`,
}));

function UsersPage() {
  const [open, setOpen] = useState(false);
  const total = USERS.length, active = USERS.filter(u => u.status === "active").length, inactive = total - active;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage users, roles, and departmental access."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add User</Button></DialogTrigger>
            <AddUserDialog onSubmit={() => { setOpen(false); toast.success("User invited"); }} />
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Total Users", value: total, icon: Users, tone: "primary" },
          { label: "Active Users", value: active, icon: UserCheck, tone: "success" },
          { label: "Inactive Users", value: inactive, icon: UserX, tone: "muted" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <div className={`grid h-12 w-12 place-items-center rounded-xl bg-${s.tone}/10 text-${s.tone === "muted" ? "muted-foreground" : s.tone}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
          <Badge variant="outline">{total} users</Badge>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Departments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{u.name.split(" ").map(p=>p[0]).join("")}</AvatarFallback></Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="font-mono text-xs">{u.phone}</TableCell>
                <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"} className="uppercase">{u.role}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {u.depts.map((d) => (
                      <Badge key={d} variant="outline" style={{ borderColor: d === "CFR" ? "var(--color-cfr)" : "var(--color-lr)", color: d === "CFR" ? "var(--color-cfr)" : "var(--color-lr)" }}>{d}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                    {u.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.created}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Ban className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AddUserDialog({ onSubmit }: { onSubmit: () => void }) {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>Invite a teammate and assign their access.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-2">
        <div className="space-y-2"><Label>Name</Label><Input placeholder="Full name" /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="user@company.com" /></div>
        <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 ..." /></div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select defaultValue="user"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="user">User</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Assigned Departments</Label>
          <div className="flex gap-4 rounded-lg border border-border p-3">
            <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> CFR</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox /> LR</label>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue="active"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Reporting Manager</Label><Input placeholder="Manager name" /></div>
      </div>
      <DialogFooter>
        <Button variant="ghost">Cancel</Button>
        <Button onClick={onSubmit}>Send Invite</Button>
      </DialogFooter>
    </DialogContent>
  );
}

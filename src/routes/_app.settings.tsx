import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-context";
import { Building2, Target, Palette, KeyRound, Briefcase } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your organization, departments, goals, and authentication." />

      <Section icon={Building2} title="Company Settings" desc="Basic information about your organization.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Name" defaultValue="Acme Talent Co." />
          <Field label="Timezone" defaultValue="Asia/Kolkata" />
          <Field label="Workday Start" defaultValue="09:00" />
          <Field label="Workday End" defaultValue="19:00" />
        </div>
      </Section>

      <Section icon={Briefcase} title="Department Settings" desc="Configure CFR and LR departments.">
        <div className="grid grid-cols-2 gap-4">
          {["CFR", "LR"].map((d) => (
            <Card key={d} className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{d} Department</div>
                <Switch defaultChecked />
              </div>
              <Field label="Daily Slot Target" defaultValue={d === "CFR" ? "160" : "140"} />
              <Field label="Lead Manager" defaultValue={d === "CFR" ? "Aarav Mehta" : "Naina Roy"} />
            </Card>
          ))}
        </div>
      </Section>

      <Section icon={Target} title="Goal Settings" desc="Default targets used across the platform.">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Daily Target" defaultValue="300" />
          <Field label="Weekly Target" defaultValue="2,100" />
          <Field label="Monthly Target" defaultValue="8,400" />
        </div>
      </Section>

      <Section icon={Palette} title="Theme Settings" desc="Light or dark — your call.">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <div className="font-medium">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Toggles the application theme.</div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </Section>

      <Section icon={KeyRound} title="Google Authentication" desc="Manage which Google domain is allowed.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Allowed Workspace Domain" defaultValue="company.com" />
          <Field label="Backup Admin Email" defaultValue="ops@company.com" />
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Only emails from the allowed domain will be admitted. All others get the Access Denied screen.
        </div>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, desc, children }: {
  icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input {...props} />
    </div>
  );
}

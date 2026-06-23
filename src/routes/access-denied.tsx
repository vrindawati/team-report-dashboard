import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldX, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/access-denied")({
  ssr: false,
  component: AccessDenied,
});

function AccessDenied() {
  return (
    <div className="grid min-h-screen place-items-center bg-background mesh-bg p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 text-center shadow-[var(--shadow-elegant)] backdrop-blur">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your Google account is not authorized to access this platform.
          Please contact your administrator to request access.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Button className="gap-2">
            <Mail className="h-4 w-4" /> Contact Team
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Sparkles, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, DEMO_ADMIN, DEMO_USER } from "@/lib/app-context";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const signIn = (role: "admin" | "user") => {
    setUser(role === "admin" ? DEMO_ADMIN : DEMO_USER);
    navigate({ to: role === "admin" ? "/dashboard" : "/my-dashboard" });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ background: "var(--gradient-primary)" }}>
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold">TPI Platform</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70">Team Intelligence</div>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="max-w-md text-5xl font-bold leading-tight tracking-tight">
            Team performance, reimagined.
          </h1>
          <p className="max-w-md text-base opacity-80">
            Replace spreadsheets with a unified command center for CFR & LR operations, daily
            reporting, analytics, and AI forecasting.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-4">
            {[
              { i: TrendingUp, t: "Real-time analytics" },
              { i: Shield, t: "Role-based access" },
            ].map(({ i: Icon, t }, k) => (
              <div key={k} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <Icon className="mb-2 h-5 w-5" />
                <div className="text-xs font-medium">{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs opacity-60">© 2026 TPI Platform</div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">TPI Platform</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your authorized Google Workspace account to continue.
            </p>
          </div>

          <Button
            onClick={() => signIn("admin")}
            className="h-12 w-full gap-3 bg-card text-foreground shadow-sm hover:bg-muted"
            variant="outline"
          >
            <GoogleIcon /> Continue with Google
          </Button>

          <div className="space-y-2 rounded-lg border border-dashed border-border bg-muted/30 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => signIn("admin")}>Admin demo</Button>
              <Button size="sm" variant="secondary" onClick={() => signIn("user")}>Intern demo</Button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Not authorized?{" "}
            <Link to="/access-denied" className="font-medium text-primary hover:underline">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

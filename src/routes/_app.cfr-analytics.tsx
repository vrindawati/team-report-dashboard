import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_app/cfr-analytics")({
  component: () => <AnalyticsView dept="CFR" />,
});

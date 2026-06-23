import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_app/lr-analytics")({
  component: () => <AnalyticsView dept="LR" />,
});

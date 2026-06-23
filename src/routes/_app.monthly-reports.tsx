import { createFileRoute } from "@tanstack/react-router";
import { ReportsView } from "@/components/reports-view";
export const Route = createFileRoute("/_app/monthly-reports")({ component: () => <ReportsView kind="Monthly" /> });

import { createFileRoute } from "@tanstack/react-router";
import { ReportsView } from "@/components/reports-view";
export const Route = createFileRoute("/_app/weekly-reports")({ component: () => <ReportsView kind="Weekly" /> });

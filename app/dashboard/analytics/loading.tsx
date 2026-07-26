import { PageSkeleton } from "@/components/ui/kit";

export default function AnalyticsLoading() {
  return <PageSkeleton label="Loading analytics…" cards={4} />;
}

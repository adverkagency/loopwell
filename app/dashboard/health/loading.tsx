import { PageSkeleton } from "@/components/ui/kit";

export default function HealthLoading() {
  return <PageSkeleton label="Loading health…" cards={3} />;
}

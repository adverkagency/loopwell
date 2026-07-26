import { PageSkeleton } from "@/components/ui/kit";

export default function HabitsLoading() {
  return <PageSkeleton label="Loading habits…" cards={3} />;
}

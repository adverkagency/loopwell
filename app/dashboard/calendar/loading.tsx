import { PageSkeleton } from "@/components/ui/kit";

export default function CalendarLoading() {
  return <PageSkeleton label="Loading calendar…" cards={2} />;
}

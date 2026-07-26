import { PageSkeleton } from "@/components/ui/kit";

export default function FriendsLoading() {
  return <PageSkeleton label="Loading friends…" cards={2} />;
}

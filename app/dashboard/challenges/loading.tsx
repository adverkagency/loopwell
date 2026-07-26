import { PageSkeleton } from "@/components/ui/kit";

export default function ChallengesLoading() {
  return <PageSkeleton label="Loading challenges…" cards={4} />;
}

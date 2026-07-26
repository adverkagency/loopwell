import { PageSkeleton } from "@/components/ui/kit";

export default function NutritionLoading() {
  return <PageSkeleton label="Loading nutrition…" cards={3} />;
}

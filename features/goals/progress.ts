/**
 * Goal progress — one generic engine, works for "increase to target"
 * (read 12 books) and "decrease to target" (lose weight) alike by using
 * start_value as the baseline when provided.
 */
export function goalProgressPct(goal: {
  target_value: number;
  current_value: number;
  start_value: number | null;
}): number {
  const { target_value: target, current_value: current } = goal;
  const start = goal.start_value ?? 0;

  if (target === start) return current === target ? 100 : 0;
  const pct = ((current - start) / (target - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/**
 * Life Score (Beta) — 0–100 composite, locked weighting:
 * Habits 30 / Sleep 15 / Water 15 / Calories 15 / Workout 15 / Mood 10.
 * Explicitly labeled Beta in the UI; weights tune with real usage data.
 *
 * Component scores (0–1), deliberately simple Beta heuristics:
 * - habits:   (complete + 0.5·partial) / habit count
 * - sleep:    duration vs 8h target, capped at 1
 * - water:    total vs goal, capped at 1
 * - calories: engagement — 1 when anything is logged (no calorie-goal
 *             concept exists yet; proximity scoring would be fake precision)
 * - workout:  engagement — 1 when anything is logged
 * - mood:     mood / 5
 */

export const WEIGHTS = {
  habits: 30,
  sleep: 15,
  water: 15,
  calories: 15,
  workout: 15,
  mood: 10,
} as const;

export type ScoreInput = {
  habitCount: number;
  habitsComplete: number;
  habitsPartial: number;
  sleepMinutes: number | null;
  waterMl: number;
  waterGoalMl: number;
  nutritionLogged: boolean;
  workoutLogged: boolean;
  mood: number | null; // 1–5
};

export type ScoreComponent = {
  key: keyof typeof WEIGHTS;
  label: string;
  weight: number;
  ratio: number; // 0–1
  points: number; // ratio * weight, rounded to 0.1
  detail: string;
};

export function lifeScore(input: ScoreInput): {
  score: number;
  components: ScoreComponent[];
} {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const habitRatio =
    input.habitCount > 0
      ? clamp((input.habitsComplete + 0.5 * input.habitsPartial) / input.habitCount)
      : 0;
  const sleepRatio =
    input.sleepMinutes === null ? 0 : clamp(input.sleepMinutes / 480);
  const waterRatio =
    input.waterGoalMl > 0 ? clamp(input.waterMl / input.waterGoalMl) : 0;
  const calorieRatio = input.nutritionLogged ? 1 : 0;
  const workoutRatio = input.workoutLogged ? 1 : 0;
  const moodRatio = input.mood === null ? 0 : clamp(input.mood / 5);

  const components: ScoreComponent[] = [
    {
      key: "habits",
      label: "Habits",
      weight: WEIGHTS.habits,
      ratio: habitRatio,
      points: round1(habitRatio * WEIGHTS.habits),
      detail:
        input.habitCount > 0
          ? `${input.habitsComplete} complete, ${input.habitsPartial} partial of ${input.habitCount}`
          : "No habits yet",
    },
    {
      key: "sleep",
      label: "Sleep",
      weight: WEIGHTS.sleep,
      ratio: sleepRatio,
      points: round1(sleepRatio * WEIGHTS.sleep),
      detail:
        input.sleepMinutes === null
          ? "Not logged"
          : `${Math.floor(input.sleepMinutes / 60)}h ${input.sleepMinutes % 60}m vs 8h target`,
    },
    {
      key: "water",
      label: "Water",
      weight: WEIGHTS.water,
      ratio: waterRatio,
      points: round1(waterRatio * WEIGHTS.water),
      detail: `${(input.waterMl / 1000).toFixed(2)}L of ${(input.waterGoalMl / 1000).toFixed(1)}L goal`,
    },
    {
      key: "calories",
      label: "Nutrition",
      weight: WEIGHTS.calories,
      ratio: calorieRatio,
      points: round1(calorieRatio * WEIGHTS.calories),
      detail: input.nutritionLogged ? "Logged today" : "Not logged",
    },
    {
      key: "workout",
      label: "Workout",
      weight: WEIGHTS.workout,
      ratio: workoutRatio,
      points: round1(workoutRatio * WEIGHTS.workout),
      detail: input.workoutLogged ? "Logged today" : "Not logged",
    },
    {
      key: "mood",
      label: "Mood",
      weight: WEIGHTS.mood,
      ratio: moodRatio,
      points: round1(moodRatio * WEIGHTS.mood),
      detail: input.mood === null ? "Not logged" : `${input.mood} of 5`,
    },
  ];

  const score = Math.round(components.reduce((s, c) => s + c.points, 0));
  return { score, components };
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

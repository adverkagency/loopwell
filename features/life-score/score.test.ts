import { describe, expect, it } from "vitest";
import { lifeScore, WEIGHTS } from "./score";

const base = {
  habitCount: 0,
  habitsComplete: 0,
  habitsPartial: 0,
  sleepMinutes: null,
  waterMl: 0,
  waterGoalMl: 2000,
  nutritionLogged: false,
  workoutLogged: false,
  mood: null,
};

describe("lifeScore — locked Beta weighting", () => {
  it("weights sum to exactly 100", () => {
    expect(Object.values(WEIGHTS).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("empty day scores 0", () => {
    expect(lifeScore(base).score).toBe(0);
  });

  it("perfect day scores 100", () => {
    const { score } = lifeScore({
      habitCount: 4,
      habitsComplete: 4,
      habitsPartial: 0,
      sleepMinutes: 480,
      waterMl: 2000,
      waterGoalMl: 2000,
      nutritionLogged: true,
      workoutLogged: true,
      mood: 5,
    });
    expect(score).toBe(100);
  });

  it("partial habits earn half credit within the 30% slice", () => {
    const { components } = lifeScore({
      ...base,
      habitCount: 2,
      habitsComplete: 1,
      habitsPartial: 1,
    });
    const habits = components.find((c) => c.key === "habits")!;
    expect(habits.ratio).toBe(0.75); // (1 + 0.5) / 2
    expect(habits.points).toBe(22.5);
  });

  it("sleep is capped at the 8h target (no bonus for oversleeping)", () => {
    const nine = lifeScore({ ...base, sleepMinutes: 540 });
    const eight = lifeScore({ ...base, sleepMinutes: 480 });
    expect(nine.score).toBe(eight.score);
  });

  it("water caps at goal", () => {
    const over = lifeScore({ ...base, waterMl: 5000 });
    expect(over.components.find((c) => c.key === "water")!.points).toBe(
      WEIGHTS.water
    );
  });

  it("mood scales linearly", () => {
    const { components } = lifeScore({ ...base, mood: 3 });
    expect(components.find((c) => c.key === "mood")!.points).toBe(6);
  });

  it("every component reports weight, ratio, points and a human detail", () => {
    const { components } = lifeScore(base);
    expect(components).toHaveLength(6);
    for (const c of components) {
      expect(c.weight).toBeGreaterThan(0);
      expect(c.ratio).toBeGreaterThanOrEqual(0);
      expect(c.detail.length).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from "vitest";
import { qualifyingDates, type MetricSource } from "./metrics";

const src: MetricSource = {
  habitLogs: [
    { date: "2026-03-01", state: "complete" },
    { date: "2026-03-01", state: "partial" },
    { date: "2026-03-02", state: "partial" },
    { date: "2026-03-03", state: "skip" },
    { date: "2026-03-04", state: "complete" },
  ],
  waterLogs: [
    { date: "2026-03-01", amount_ml: 1200 },
    { date: "2026-03-01", amount_ml: 900 },
    { date: "2026-03-02", amount_ml: 500 },
    { date: "2026-03-03", amount_ml: 2000 },
  ],
  waterGoalMl: 2000,
  workoutLogs: [{ date: "2026-03-02" }, { date: "2026-03-02" }],
  sleepLogs: [
    { date: "2026-03-01", duration_minutes: 419 },
    { date: "2026-03-02", duration_minutes: 420 },
    { date: "2026-03-03", duration_minutes: null },
  ],
  moodLogs: [{ date: "2026-03-05" }],
  journalEntries: [
    { date: "2026-03-01", body: "  " },
    { date: "2026-03-02", body: "wrote something" },
    { date: "2026-03-03", body: null },
  ],
};

describe("qualifyingDates", () => {
  it("counts only Complete for habit challenges", () => {
    expect(qualifyingDates("habit_complete", src)).toEqual(
      new Set(["2026-03-01", "2026-03-04"])
    );
  });

  it("sums water across the day and needs the full goal", () => {
    // 1200 + 900 = 2100 ≥ 2000, and an exact 2000 also counts
    expect(qualifyingDates("water_goal", src)).toEqual(
      new Set(["2026-03-01", "2026-03-03"])
    );
  });

  it("counts a day once no matter how many workouts it holds", () => {
    expect(qualifyingDates("workout", src)).toEqual(new Set(["2026-03-02"]));
  });

  it("needs seven full hours of sleep", () => {
    expect(qualifyingDates("sleep", src)).toEqual(new Set(["2026-03-02"]));
  });

  it("counts any mood log", () => {
    expect(qualifyingDates("mood", src)).toEqual(new Set(["2026-03-05"]));
  });

  it("ignores blank journal entries", () => {
    expect(qualifyingDates("journal", src)).toEqual(new Set(["2026-03-02"]));
  });
});

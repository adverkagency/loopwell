import { describe, expect, it } from "vitest";
import { detectUnlocks, type DetectInput } from "./detect";

const T = "2026-07-11";

function log(habit: string, date: string, state: "complete" | "partial" | "skip" = "complete", hourUtc = 12) {
  return {
    habit_id: habit,
    date,
    state,
    created_at: `${date}T${String(hourUtc).padStart(2, "0")}:00:00Z`,
  };
}

const base: DetectInput = {
  today: T,
  timezone: "UTC",
  habitLogs: [],
  habitCount: 1,
  totalWaterMl: 0,
  workoutCount: 0,
  completedGoals: 0,
};

describe("detectUnlocks", () => {
  it("nothing on an empty account", () => {
    expect(detectUnlocks(base)).toEqual([]);
  });

  it("first-habit on any log", () => {
    expect(detectUnlocks({ ...base, habitLogs: [log("a", T)] })).toContain("first-habit");
  });

  it("7-day-streak at exactly 7 consecutive completes", () => {
    const logs = Array.from({ length: 7 }, (_, i) =>
      log("a", `2026-07-${String(5 + i).padStart(2, "0")}`)
    );
    const earned = detectUnlocks({ ...base, habitLogs: logs });
    expect(earned).toContain("7-day-streak");
    expect(earned).not.toContain("30-day-streak");
  });

  it("water/workout/goal thresholds", () => {
    const earned = detectUnlocks({
      ...base,
      habitLogs: [log("a", T)],
      totalWaterMl: 100_000,
      workoutCount: 100,
      completedGoals: 1,
    });
    expect(earned).toEqual(
      expect.arrayContaining(["100l-water", "100-workouts", "first-goal-hit"])
    );
  });

  it("perfect-week requires every habit complete all 7 days", () => {
    const days = Array.from({ length: 7 }, (_, i) =>
      `2026-07-${String(5 + i).padStart(2, "0")}`
    );
    const both = days.flatMap((d) => [log("a", d), log("b", d)]);
    expect(
      detectUnlocks({ ...base, habitCount: 2, habitLogs: both })
    ).toContain("perfect-week");

    const oneMissing = both.slice(0, -1);
    expect(
      detectUnlocks({ ...base, habitCount: 2, habitLogs: oneMissing })
    ).not.toContain("perfect-week");
  });

  it("early-bird respects the user's timezone", () => {
    // 01:00 UTC = 06:00 in Karachi (+5) → early bird there, not in UTC+0? 06<7 yes.
    const l = log("a", T, "complete", 1);
    expect(
      detectUnlocks({ ...base, habitLogs: [l], timezone: "Asia/Karachi" })
    ).toContain("early-bird");
    // Same log in New York (UTC-4/5) is the previous evening — not early bird
    expect(
      detectUnlocks({ ...base, habitLogs: [l], timezone: "America/New_York" })
    ).not.toContain("early-bird");
  });

  it("comeback after a 7+ day gap", () => {
    const earned = detectUnlocks({
      ...base,
      habitLogs: [log("a", "2026-06-20"), log("a", "2026-07-01")],
    });
    expect(earned).toContain("comeback");
  });
});

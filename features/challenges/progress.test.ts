import { describe, expect, it } from "vitest";
import { challengeProgress, challengeTimingLabel } from "./progress";

const base = { joinedOn: "2026-03-01", durationDays: 7, targetDays: 7 };

describe("challengeProgress", () => {
  it("counts only days inside the window", () => {
    const p = challengeProgress({
      ...base,
      today: "2026-03-07",
      // 2026-02-28 is before the window, 2026-03-08 is after it
      qualifyingDates: ["2026-02-28", "2026-03-01", "2026-03-05", "2026-03-08"],
    });
    expect(p.daysDone).toBe(2);
    expect(p.endsOn).toBe("2026-03-07");
  });

  it("never counts days that have not happened yet", () => {
    const p = challengeProgress({
      ...base,
      today: "2026-03-03",
      qualifyingDates: ["2026-03-01", "2026-03-02", "2026-03-03"],
    });
    expect(p.daysElapsed).toBe(3);
    expect(p.daysLeft).toBe(5); // 4 untouched days + today, which is still live
    expect(p.status).toBe("active");
  });

  it("completes as soon as the target is hit, mid-window", () => {
    const p = challengeProgress({
      joinedOn: "2026-03-01",
      durationDays: 30,
      targetDays: 3,
      today: "2026-03-04",
      qualifyingDates: ["2026-03-01", "2026-03-02", "2026-03-04"],
    });
    expect(p.status).toBe("complete");
    expect(p.pct).toBe(100);
    expect(challengeTimingLabel(p)).toBe("Complete");
  });

  it("marks missed the moment the target is arithmetically out of reach", () => {
    // 7-day window, needs all 7, day 2 already unqualified → cannot finish
    const p = challengeProgress({
      ...base,
      today: "2026-03-03",
      qualifyingDates: ["2026-03-01"],
    });
    expect(p.status).toBe("missed");
    expect(p.daysDone).toBe(1);
  });

  it("stays active while the remaining days can still make the target", () => {
    const p = challengeProgress({
      joinedOn: "2026-03-01",
      durationDays: 14,
      targetDays: 12,
      today: "2026-03-05",
      qualifyingDates: ["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04"],
    });
    // 4 done + 9 untouched + today = 14 ≥ 12
    expect(p.status).toBe("active");
    expect(p.daysLeft).toBe(10);
  });

  it("closes the window once the end date has passed", () => {
    const p = challengeProgress({
      ...base,
      today: "2026-03-20",
      qualifyingDates: ["2026-03-01", "2026-03-02"],
    });
    expect(p.daysElapsed).toBe(7);
    expect(p.daysLeft).toBe(0);
    expect(p.status).toBe("missed");
    expect(challengeTimingLabel(p)).toBe("Window closed");
  });

  it("does not let post-window logs top up a finished challenge", () => {
    const p = challengeProgress({
      ...base,
      today: "2026-03-20",
      qualifyingDates: [
        "2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04",
        "2026-03-05", "2026-03-06",
        "2026-03-09", "2026-03-10", // after endsOn — must not count
      ],
    });
    expect(p.daysDone).toBe(6);
    expect(p.status).toBe("missed");
  });

  it("handles the day it was joined", () => {
    const p = challengeProgress({
      ...base,
      today: "2026-03-01",
      qualifyingDates: [],
    });
    expect(p.daysElapsed).toBe(1);
    expect(p.daysLeft).toBe(7);
    expect(p.pct).toBe(0);
    expect(p.status).toBe("active");
    expect(challengeTimingLabel(p)).toBe("7 days to go");
  });

  it("treats the final day as still playable", () => {
    const p = challengeProgress({
      joinedOn: "2026-03-01",
      durationDays: 7,
      targetDays: 1,
      today: "2026-03-07",
      qualifyingDates: [],
    });
    expect(p.daysElapsed).toBe(7);
    expect(p.daysLeft).toBe(1);
    expect(p.status).toBe("active");
    expect(challengeTimingLabel(p)).toBe("Last day");
  });

  it("caps pct at 100 when the user overshoots", () => {
    const p = challengeProgress({
      joinedOn: "2026-03-01",
      durationDays: 30,
      targetDays: 2,
      today: "2026-03-10",
      qualifyingDates: ["2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04"],
    });
    expect(p.pct).toBe(100);
    expect(p.daysDone).toBe(4);
  });
});

import { describe, expect, it } from "vitest";
import { currentStreak, longestStreak, successRate, type HabitState } from "./streak";
import { addDays, daysBetween, todayInTz } from "@/lib/dates";

const logs = (entries: Record<string, HabitState>) =>
  new Map(Object.entries(entries));

describe("todayInTz — timezone boundaries (classic habit-app bug source)", () => {
  // 2026-07-11 23:58 in Karachi is 18:58 UTC the same day;
  // 2026-07-11 00:02 in Karachi is 19:02 UTC on the PREVIOUS day.
  it("11:58pm Karachi is still the Karachi date", () => {
    const now = new Date("2026-07-11T18:58:00Z"); // 23:58 PKT
    expect(todayInTz("Asia/Karachi", now)).toBe("2026-07-11");
  });

  it("00:02am Karachi has rolled to the next Karachi date while UTC hasn't", () => {
    const now = new Date("2026-07-10T19:02:00Z"); // 00:02 PKT Jul 11
    expect(todayInTz("Asia/Karachi", now)).toBe("2026-07-11");
    expect(todayInTz("UTC", now)).toBe("2026-07-10");
  });

  it("US negative-offset timezones lag UTC across midnight", () => {
    const now = new Date("2026-07-11T02:30:00Z");
    expect(todayInTz("America/Los_Angeles", now)).toBe("2026-07-10");
    expect(todayInTz("UTC", now)).toBe("2026-07-11");
  });
});

describe("date math", () => {
  it("addDays crosses month and year ends", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2025-12-31", 1)).toBe("2026-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2024-03-01", -1)).toBe("2024-02-29"); // leap year
  });

  it("daysBetween is signed", () => {
    expect(daysBetween("2026-07-01", "2026-07-11")).toBe(10);
    expect(daysBetween("2026-07-11", "2026-07-01")).toBe(-10);
  });
});

describe("currentStreak — locked product rules", () => {
  const T = "2026-07-11";

  it("empty history → 0", () => {
    expect(currentStreak(logs({}), T)).toBe(0);
  });

  it("consecutive completes count", () => {
    expect(
      currentStreak(
        logs({ "2026-07-09": "complete", "2026-07-10": "complete", "2026-07-11": "complete" }),
        T
      )
    ).toBe(3);
  });

  it("today unlogged does NOT break yesterday's run (day in progress)", () => {
    expect(
      currentStreak(logs({ "2026-07-09": "complete", "2026-07-10": "complete" }), T)
    ).toBe(2);
  });

  it("a fully missed day breaks the streak", () => {
    expect(
      currentStreak(
        logs({ "2026-07-08": "complete", /* 07-09 missed */ "2026-07-10": "complete", "2026-07-11": "complete" }),
        T
      )
    ).toBe(2);
  });

  it("PARTIAL does not extend and does not break — transparent", () => {
    expect(
      currentStreak(
        logs({ "2026-07-08": "complete", "2026-07-09": "complete", "2026-07-10": "partial", "2026-07-11": "complete" }),
        T
      )
    ).toBe(3); // 8,9 complete + 10 transparent + 11 complete
  });

  it("SKIP is transparent the same way", () => {
    expect(
      currentStreak(
        logs({ "2026-07-09": "complete", "2026-07-10": "skip", "2026-07-11": "complete" }),
        T
      )
    ).toBe(2);
  });

  it("all-partial history → streak 0 (nothing extends it)", () => {
    expect(
      currentStreak(logs({ "2026-07-10": "partial", "2026-07-11": "partial" }), T)
    ).toBe(0);
  });
});

describe("longestStreak", () => {
  it("finds the best historical run, not the current one", () => {
    expect(
      longestStreak(
        logs({
          "2026-06-01": "complete",
          "2026-06-02": "complete",
          "2026-06-03": "complete",
          "2026-06-04": "complete",
          /* gap */
          "2026-07-10": "complete",
          "2026-07-11": "complete",
        })
      )
    ).toBe(4);
  });

  it("partial/skip carry a run through without extending it", () => {
    expect(
      longestStreak(
        logs({
          "2026-07-07": "complete",
          "2026-07-08": "partial",
          "2026-07-09": "complete",
          "2026-07-10": "skip",
          "2026-07-11": "complete",
        })
      )
    ).toBe(3);
  });

  it("gap resets the run", () => {
    expect(
      longestStreak(
        logs({ "2026-07-07": "complete", "2026-07-09": "complete" })
      )
    ).toBe(1);
  });
});

describe("successRate — Partial counts toward completion %", () => {
  const T = "2026-07-11";

  it("complete + partial both count as hits", () => {
    const r = successRate(
      logs({ "2026-07-09": "complete", "2026-07-10": "partial", "2026-07-11": "skip" }),
      T
    );
    expect(r.days).toBe(3);
    expect(r.hits).toBe(2);
    expect(r.pct).toBe(67);
  });

  it("no penalty for days before the habit's first log", () => {
    const r = successRate(logs({ "2026-07-11": "complete" }), T);
    expect(r.days).toBe(1);
    expect(r.pct).toBe(100);
  });

  it("missed days inside the window drag the rate down", () => {
    const r = successRate(
      logs({ "2026-07-08": "complete", "2026-07-11": "complete" }),
      T
    );
    expect(r.days).toBe(4);
    expect(r.hits).toBe(2);
    expect(r.pct).toBe(50);
  });
});

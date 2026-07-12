import { describe, expect, it } from "vitest";
import {
  bmi,
  bmiCategory,
  formatDuration,
  kgToLbs,
  lbsToKg,
  sleepDurationMinutes,
} from "./health";

describe("sleepDurationMinutes", () => {
  it("same-day span", () => {
    expect(sleepDurationMinutes("01:00", "09:00")).toBe(480);
  });

  it("wraps past midnight", () => {
    expect(sleepDurationMinutes("23:00", "07:00")).toBe(480);
    expect(sleepDurationMinutes("22:30", "06:15")).toBe(465);
  });

  it("bed == wake reads as a full 24h wrap, not zero", () => {
    expect(sleepDurationMinutes("22:00", "22:00")).toBe(1440);
  });

  it("rejects malformed times", () => {
    expect(() => sleepDurationMinutes("25:00", "07:00")).toThrow();
    expect(() => sleepDurationMinutes("23:00", "7:00")).toThrow();
  });
});

describe("bmi — verified against reference formula kg/m² (M2 checklist)", () => {
  it("WHO reference example: 70kg at 1.75m = 22.9", () => {
    expect(bmi(70, 175)).toBe(22.9);
  });

  it("edge references", () => {
    expect(bmi(50, 160)).toBe(19.5);
    expect(bmi(100, 180)).toBe(30.9);
    expect(bmi(80, 200)).toBe(20);
  });

  it("rejects non-positive inputs", () => {
    expect(() => bmi(0, 175)).toThrow();
    expect(() => bmi(70, 0)).toThrow();
  });

  it("categories at the standard cut points", () => {
    expect(bmiCategory(18.4)).toBe("Underweight");
    expect(bmiCategory(18.5)).toBe("Normal");
    expect(bmiCategory(24.9)).toBe("Normal");
    expect(bmiCategory(25)).toBe("Overweight");
    expect(bmiCategory(30)).toBe("Obese");
  });
});

describe("unit conversion round-trips", () => {
  it("176 lbs ↔ kg", () => {
    expect(lbsToKg(176)).toBe(79.83);
    expect(kgToLbs(79.83)).toBe(176);
  });
});

describe("formatDuration", () => {
  it("formats h/m", () => {
    expect(formatDuration(480)).toBe("8h 0m");
    expect(formatDuration(465)).toBe("7h 45m");
  });
});

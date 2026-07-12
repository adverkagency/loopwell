import { describe, expect, it } from "vitest";
import { goalProgressPct } from "./progress";

describe("goalProgressPct — one engine for increase and decrease goals", () => {
  it("increase goal from implicit 0", () => {
    expect(goalProgressPct({ target_value: 12, current_value: 5, start_value: null })).toBe(42);
  });

  it("decrease goal uses start_value baseline (lose weight 182 → 172)", () => {
    expect(goalProgressPct({ target_value: 172, current_value: 176, start_value: 182 })).toBe(60);
  });

  it("clamps to 0–100", () => {
    expect(goalProgressPct({ target_value: 10, current_value: 15, start_value: 0 })).toBe(100);
    expect(goalProgressPct({ target_value: 172, current_value: 190, start_value: 182 })).toBe(0);
  });

  it("degenerate target == start", () => {
    expect(goalProgressPct({ target_value: 5, current_value: 5, start_value: 5 })).toBe(100);
    expect(goalProgressPct({ target_value: 5, current_value: 4, start_value: 5 })).toBe(0);
  });
});

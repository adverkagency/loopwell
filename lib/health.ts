/** Pure health calculations — unit-tested against reference formulas (M2 checklist). */

/** Minutes between bed and wake, wrapping past midnight ("23:00" → "07:00" = 480). */
export function sleepDurationMinutes(bed: string, wake: string): number {
  const toMin = (t: string) => {
    const m = /^(\d{2}):(\d{2})$/.exec(t);
    if (!m) throw new Error(`Invalid time: ${t}`);
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) throw new Error(`Invalid time: ${t}`);
    return h * 60 + min;
  };
  let diff = toMin(wake) - toMin(bed);
  if (diff <= 0) diff += 24 * 60;
  return diff;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

/** BMI = kg / m² — the ONLY auto-calculated body metric (product spec §7). */
export function bmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) throw new Error("Invalid BMI inputs");
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiCategory(value: number): string {
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Normal";
  if (value < 30) return "Overweight";
  return "Obese";
}

export const KG_PER_LB = 0.45359237;

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * KG_PER_LB * 100) / 100;
}

export function kgToLbs(kg: number): number {
  return Math.round((kg / KG_PER_LB) * 10) / 10;
}

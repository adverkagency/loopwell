import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Food search proxy — USDA FoodData Central (generic foods) + Open Food
 * Facts (packaged). Keys stay server-side; both APIs' shapes normalize to
 * one result format. Served as a Next route handler rather than a Supabase
 * Edge Function (equivalent security property, no separate deploy) — swap
 * later if Edge Functions become the home for other server logic.
 *
 * Graceful degradation is the contract: if either upstream fails or times
 * out, return whatever succeeded — manual entry always works regardless.
 */

export type FoodResult = {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  sugar_g: number | null;
  source: "usda" | "off";
  source_ref: string;
};

const TIMEOUT_MS = 5000;

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "User-Agent": "Loopwell/0.1 (personal life dashboard)" },
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  return res.json();
}

type UsdaNutrient = { nutrientNumber?: string; value?: number };
type UsdaFood = { description?: string; fdcId?: number; foodNutrients?: UsdaNutrient[] };

async function searchUsda(q: string): Promise<FoodResult[]> {
  const key = process.env.USDA_API_KEY ?? "DEMO_KEY";
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
    key
  )}&query=${encodeURIComponent(q)}&pageSize=6&dataType=Foundation,SR%20Legacy`;
  const data = (await fetchJson(url)) as { foods?: UsdaFood[] };

  return (data.foods ?? []).slice(0, 6).map((f) => {
    const nutrient = (num: string) =>
      f.foodNutrients?.find((n) => n.nutrientNumber === num)?.value ?? 0;
    return {
      name: f.description ?? "Unknown food",
      calories: Math.round(nutrient("208")),
      protein_g: Math.round(nutrient("203") * 10) / 10,
      carbs_g: Math.round(nutrient("205") * 10) / 10,
      fat_g: Math.round(nutrient("204") * 10) / 10,
      fiber_g: nutrient("291") || null,
      sugar_g: nutrient("269") || null,
      source: "usda" as const,
      source_ref: String(f.fdcId ?? ""),
    };
  });
}

type OffProduct = {
  product_name?: string;
  code?: string;
  nutriments?: Record<string, number>;
};

async function searchOff(q: string): Promise<FoodResult[]> {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
    q
  )}&search_simple=1&action=process&json=1&page_size=6&fields=product_name,code,nutriments`;
  const data = (await fetchJson(url)) as { products?: OffProduct[] };

  return (data.products ?? [])
    .filter((p) => p.product_name && p.nutriments)
    .slice(0, 6)
    .map((p) => {
      const n = p.nutriments!;
      return {
        name: p.product_name!,
        calories: Math.round(n["energy-kcal_100g"] ?? 0),
        protein_g: Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
        carbs_g: Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10,
        fat_g: Math.round((n["fat_100g"] ?? 0) * 10) / 10,
        fiber_g: n["fiber_100g"] ?? null,
        sugar_g: n["sugars_100g"] ?? null,
        source: "off" as const,
        source_ref: p.code ?? "",
      };
    });
}

export async function GET(request: NextRequest) {
  // Authenticated users only — protects the external API quota
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [usda, off] = await Promise.allSettled([searchUsda(q), searchOff(q)]);
  const results: FoodResult[] = [
    ...(usda.status === "fulfilled" ? usda.value : []),
    ...(off.status === "fulfilled" ? off.value : []),
  ];
  const degraded = usda.status === "rejected" && off.status === "rejected";

  return NextResponse.json({ results, degraded });
}

/**
 * Hand-written row types for M1 tables. Replace with Supabase generated
 * types (`supabase gen types typescript`) once the cloud project exists —
 * the shapes below mirror supabase/migrations/00000000000001 exactly.
 */

export type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  category: string | null;
  frequency_count: number;
  frequency_period: "week" | "month";
  in_quick_log: boolean;
  sort_order: number;
  archived_at: string | null;
  created_at: string;
};

export type HabitLogRow = {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  state: "complete" | "partial" | "skip";
  created_at: string;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  timezone: string;
  theme: "system" | "light" | "dark";
  weight_module_enabled: boolean;
  onboarding_completed_at: string | null;
};

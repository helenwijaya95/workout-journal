import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { StatsCards } from "./components/StatsCards";
import { DashboardTabs } from "./components/DashboardTabs";
import { groupWorkoutsByWeek, getWeekStart } from "@/lib/workout-utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: workouts }, { data: debriefs }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("workout_date", { ascending: false }),
      supabase
        .from("ai_debriefs")
        .select("*")
        .eq("user_id", user.id)
        .order("week_start", { ascending: false }),
    ]);

  const weekGroups = groupWorkoutsByWeek(workouts ?? []);
  const todayWeekStart = getWeekStart(new Date().toISOString().split("T")[0]);
  const currentWeek =
    weekGroups.find((w) => w.weekStart === todayWeekStart) ?? null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">
              {profile?.name ?? "Hey there"} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Your training journal
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 px-4 py-2 rounded-lg transition-all"
            >
              Sign out
            </button>
          </form>
        </div>

        <StatsCards currentWeek={currentWeek} allWorkouts={workouts ?? []} />

        <DashboardTabs
          weekGroups={weekGroups}
          workouts={workouts ?? []}
          debriefs={debriefs ?? []}
        />
      </div>
    </main>
  );
}

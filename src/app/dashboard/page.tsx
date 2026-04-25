import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { StatsCards } from "./components/StatsCards";
import { DashboardTabs } from "./components/DashboardTabs";
import { WorkoutChart } from "./components/workoutChart";
import {
  groupWorkoutsByWeek,
  getWeekStart,
  getWeekEnd,
} from "@/lib/workout-utils";

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

  const debriefsWithStaleness = (debriefs ?? []).map((debrief) => {
    const weekWorkouts = (workouts ?? []).filter((w) => {
      const weekEnd = getWeekEnd(debrief.week_start);
      return w.workout_date >= debrief.week_start && w.workout_date <= weekEnd;
    });

    return {
      ...debrief,
      isStale: weekWorkouts.length !== debrief.total_sessions,
    };
  });

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
        {weekGroups.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <WorkoutChart weekGroups={weekGroups} />
          </div>
        )}
        <DashboardTabs
          weekGroups={weekGroups}
          workouts={workouts ?? []}
          debriefs={debriefsWithStaleness}
        />
      </div>
    </main>
  );
}

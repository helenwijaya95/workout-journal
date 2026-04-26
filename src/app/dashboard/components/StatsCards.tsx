import { WeekGroup } from "@/lib/workout-utils";

interface StatsCardsProps {
  currentWeek: WeekGroup | null;
  allWorkouts: { duration_minutes: number; intensity: number }[];
}

export function StatsCards({ currentWeek, allWorkouts }: StatsCardsProps) {
  const totalMinutes = allWorkouts.reduce(
    (sum, w) => sum + w.duration_minutes,
    0,
  );
  const totalHours = Math.floor(totalMinutes / 60);

  const stats = [
    {
      label: "This week",
      value: currentWeek?.totalSessions ?? 0,
      unit: currentWeek?.totalSessions === 1 ? "session" : "sessions",
      highlight: true,
    },
    {
      label: "Mins this week",
      value: currentWeek?.totalMinutes ?? 0,
      unit: "mins",
      highlight: false,
    },
    {
      label: "Avg intensity",
      value: currentWeek?.avgIntensity ?? "—",
      unit: currentWeek ? "/ 10" : "",
      highlight: false,
    },
    {
      label: "Total hours",
      value: totalHours,
      unit: "hrs all time",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl p-4 border ${
            stat.highlight
              ? "bg-primary/10 border-primary/30"
              : "bg-surface border-slate-800"
          }`}
        >
          <p className="text-xs text-primary-text0 mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold ${
                stat.highlight ? "text-primary-light" : "text-white"
              }`}
            >
              {stat.value}
            </span>
            {stat.unit && (
              <span className="text-xs text-primary-text0">{stat.unit}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

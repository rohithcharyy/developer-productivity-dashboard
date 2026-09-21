import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function TaskStatusChart({ tasks }) {
  const statusData = [
    {
      name: "Todo",
      value: tasks.filter(
        (task) => task.status === "Todo"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,
    },
    {
      name: "Done",
      value: tasks.filter(
        (task) => task.status === "Done"
      ).length,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Task Status
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Distribution of your current tasks.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              <Cell fill="#94a3b8" />
              <Cell fill="#60a5fa" />
              <Cell fill="#4ade80" />
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TaskStatusChart;
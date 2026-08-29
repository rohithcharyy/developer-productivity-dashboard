import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function PriorityChart({ tasks }) {
  const priorityData = [
    {
      name: "High",
      value: tasks.filter(
        (task) => task.priority === "High"
      ).length,
    },
    {
      name: "Medium",
      value: tasks.filter(
        (task) => task.priority === "Medium"
      ).length,
    },
    {
      name: "Low",
      value: tasks.filter(
        (task) => task.priority === "Low"
      ).length,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Priority Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of tasks based on priority.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              <Cell fill="#ef4444" />
              <Cell fill="#facc15" />
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

export default PriorityChart;
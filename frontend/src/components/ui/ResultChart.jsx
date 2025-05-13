import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useMemo } from "react";

const COLORS = ["#22c55e", "#ef4444"];
const GRADIENTS = [
  "url(#uniqueGradient)",
  "url(#plagiarizedGradient)"
];

export default function ResultChart({ percentage }) {
  const data = useMemo(() => [
    { name: "Unique", value: 100 - percentage },
    { name: "Plagiarized", value: percentage },
  ], [percentage]);

  const centerPercentage = `${100 - percentage}%`;

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-2xl rounded-2xl p-6 text-white">
      <h2 className="text-xl font-semibold text-center mb-1 text-[#99f6e4]">Plagiarism Score</h2>
      <p className="text-center text-sm text-green-400 mb-4"> RESULT</p>

      <div className="relative flex justify-center items-center">
        <PieChart width={300} height={300}>
          <defs>
            <linearGradient id="uniqueGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="plagiarizedGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
            </linearGradient>
          </defs>

          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            labelLine={false}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GRADIENTS[index]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: "14px", color: "#d1d5db", marginTop: "16px" }}
          />
        </PieChart>

        <div className="absolute text-center">
          <div className="text-4xl font-bold text-[#99f6e4]">{centerPercentage}</div>
          <div className="text-sm text-gray-300">Unique</div>
        </div>
      </div>
    </div>
  );
}

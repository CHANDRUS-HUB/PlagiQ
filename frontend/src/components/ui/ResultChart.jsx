import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { useMemo } from "react";

export default function ResultChart({ percentage }) {
  const data = useMemo(
    () => [
      { name: "Unique", value: 100 - percentage },
      { name: "Plagiarized", value: percentage },
    ],
    [percentage]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md shadow-[0_4px_60px_rgba(0,0,0,0.3)] rounded-3xl p-6 text-white border border-white/10 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-60 z-0" />

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-center mb-2 text-cyan-300">
          Plagiarism Breakdown
        </h2>
        <p className="text-center text-sm text-green-400 mb-6 tracking-widest">
          BAR VIEW
        </p>

        {/* Glow */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-20 w-40 h-40 bg-teal-400/10 rounded-full blur-2xl animate-pulse z-0" />

        <BarChart
          width={300}
          height={250}
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="barUnique" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="barPlag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            tick={{ fill: "#d1d5db", fontSize: 14 }}
            axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#d1d5db", fontSize: 14 }}
            axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid rgb(237, 239, 241)",  
              borderRadius: 8,
              color: "#f9fafb",
            }}
            labelFormatter={() => ""}

            formatter={(value) =>  [`${value.toFixed(2)}%`, "Value"]}

            itemStyle={{ color: "#ffffff" }} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ color: "#d1d5db", marginTop: 16 }}
          />

          <Bar dataKey="value" barSize={50}>
            {data.map((_, idx) => (
              <Cell
                key={idx}
                fill={idx === 0 ? "url(#barUnique)" : "url(#barPlag)"}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}

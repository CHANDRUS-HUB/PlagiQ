import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaSearch, FaFileAlt, FaTrash } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChecks: 0,
    totalFiles: 0,
    averageMatch: "0%",
    recentChecks: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState({ id: null, idx: null });

  async function confirmDelete() {
    const { id, idx } = pendingDelete;
    try {
      const res = await axios.delete(`http://localhost:7000/api/delete-plagiarism-result/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      if (res.status === 200) {
        setStats(prev => ({
          ...prev,
          recentChecks: prev.recentChecks.filter((_, i) => i !== idx)
        }));
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      toast.error("Server error. Try again.");
    } finally {
      setShowModal(false);
      setPendingDelete({ id: null, idx: null });
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data = {} } = await axios.get("http://localhost:7000/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });

        const recent = Array.isArray(data.recentChecks)
          ? data.recentChecks.map((item) => ({
            id: item.id,
            fileName: item.fileName || "n/a",
            plagiarism: item.plagiarismPercentage || 0,
            date: item.createdAt?.split("T")[0] || "N/A",
          }))
          : [];

        setStats({
          totalChecks: data.totalChecks || 0,
          totalFiles: data.totalFiles || 0,
          averageMatch: data.averageMatch ? `${Math.round(data.averageMatch)}%` : "0%",
          recentChecks: recent,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.recentChecks.map((item) => ({
    date: item.date,
    plagiarism: item.plagiarism,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-6 py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-lg">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Here’s a quick overview of your plagiarism history.
        </p>
        <Link to="/plagarismcheck" className="mt-8 inline-block">
          <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg px-6 py-3 rounded-full shadow-xl transition-transform hover:scale-105">
            Check A New Question Bank
          </Button>
        </Link>
      </div>


      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { title: "Total Checks", value: stats.totalChecks, icon: <FaCheckCircle /> },
          { title: "Average Match", value: stats.averageMatch, icon: <FaSearch /> },
          { title: "Total Files", value: stats.totalFiles, icon: <FaFileAlt /> },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-lg shadow-lg flex justify-between items-center transition-transform hover:shadow-2xl hover:scale-105"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-600">{stat.value}</p>
            </div>
            <div className="text-blue-600 text-4xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Checks Table */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Recent Checks</h2>
        {stats.recentChecks.length === 0 ? (
          <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-lg">
            No recent checks found.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-6 text-left">File Name</th>
                  <th className="py-3 px-6 text-left">Plagiarism (%)</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentChecks.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-none hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6">{c.fileName}</td>
                    <td className="py-3 px-6">{c.plagiarism}%</td>
                    <td className="py-3 px-6">{c.date}</td>
                    <td className="py-3 px-9 text-red-600 hover:text-red-800 cursor-pointer">
                      <FaTrash
                        size={18}
                        title="Delete this entry"
                        onClick={() => {
                          setPendingDelete({ id: c.id, idx: i });
                          setShowModal(true);

                        }}
                      />

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Plagiarism Trend</h2>
          <div className="w-full h-72 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/70 via-[#302b63]/70 to-[#24243e]/70 mix-blend-overlay" />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#d1d5db" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#d1d5db" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    color: "#f9fafb",
                  }}
                  formatter={(value) => [`${value}%`, "Plagiarism"]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ color: "#d1d5db", marginTop: 16 }}
                  payload={[{ value: "Plagiarism", type: "square", id: "plagiarism", color: "#8b5cf6" }]}
                />
                <Bar dataKey="plagiarism" barSize={40} fill="url(#barGradient)">
                  {chartData.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 text-red-600 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Delete Result</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this result? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
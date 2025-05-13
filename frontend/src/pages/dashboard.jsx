import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaCheckCircle, FaSearch, FaFileAlt } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChecks: 0,
    totalFiles: 0,
    averageMatch: "0%",
    recentChecks: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:7000/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const data = response.data || {};

        const recent = Array.isArray(data.recentChecks)
          ? data.recentChecks.map((item) => ({
            fileName: item.fileName || "n/a",
            plagiarism: item.plagiarismPercentage, 
            date: item.createdAt?.split("T")[0] || "N/A", 
          }))
          : [];


        setStats({
          totalChecks: data.totalChecks || 0,
          totalFiles: data.totalFiles || 0,
          averageMatch: data.averageMatch ? `${Math.round(data.averageMatch)}%` : "0%",
          recentChecks: recent,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
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
          Here's a quick overview of your plagiarism check history and performance.
        </p>
        <div className="mt-8">
          <Link to="/plagarismcheck">
            <Button className="w-45 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
              Upload New Question Bank
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { title: "Total Checks", value: stats.totalChecks, icon: <FaCheckCircle /> },
          { title: "Average Match", value: stats.averageMatch, icon: <FaSearch /> },
          { title: "Total Files", value: stats.totalFiles, icon: <FaFileAlt /> },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-lg shadow-lg flex justify-between items-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{stat.title}</h3>
              <p className="text-gray-600 text-3xl font-bold">{stat.value}</p>
            </div>
            <div className="text-blue-600 text-5xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Checks */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Recent Checks</h2>
        {stats.recentChecks.length === 0 ? (
          <p className="text-gray-500 text-center bg-white py-8 rounded-lg shadow-lg">
            No recent checks found.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                  <th className="py-3 px-6 text-left">File</th>
                  <th className="py-3 px-6 text-left">Plagiarism (%)</th>
                  <th className="py-3 px-6 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentChecks.map((check, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                    <td className="py-3 px-6">{check.fileName}</td>
                    <td className="py-3 px-6">{check. plagiarism}%</td>
                    <td className="py-3 px-6">{check.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Plagiarism Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="plagiarism" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

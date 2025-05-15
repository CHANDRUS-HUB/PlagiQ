import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminStatsTable() {
  const [stats, setStats] = useState({
    totalChecks: 0,
    totalFiles: 0,
    averageMatch: "0.00",
    recentChecks: [],
  });
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get("http://localhost:7000/stats", {
          withCredentials: true,
        });
        const adminRes = await axios.get("http://localhost:7000/admin/activity", {
          withCredentials: true,
        });

        setStats({
          totalChecks: statsRes.data.totalChecks ?? 0,
          totalFiles: statsRes.data.totalFiles ?? 0,
          averageMatch: statsRes.data.averageMatch ?? "0.00",
          recentChecks: statsRes.data.recentChecks ?? [],
        });

        setUserStats(adminRes.data.userStats ?? []);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center p-6">Loading stats…</p>;
  }

  if (error) {
    return <p className="text-center p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-indigo-50 rounded-lg text-center">
          <h3 className="text-xl font-medium">Total Checks</h3>
          <p className="text-3xl font-bold">{stats.totalChecks}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <h3 className="text-xl font-medium">Total Files</h3>
          <p className="text-3xl font-bold">{stats.totalFiles}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <h3 className="text-xl font-medium">Avg. Match</h3>
          <p className="text-3xl font-bold">{stats.averageMatch}%</p>
        </div>
      </div>

      {/* Recent Checks Table */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Recent File Checks</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Files Compared</th>
              <th className="px-4 py-2 border">Match %</th>
              <th className="px-4 py-2 border">User Name</th>
              <th className="px-4 py-2 border">Checked At</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentChecks.map((check) => (
              <tr key={check.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{check.id}</td>
                <td className="px-4 py-2 border">{check.fileName}</td>
                <td className="px-4 py-2 border text-center">
                  {check.plagiarismPercentage}%
                </td>
                <td className="px-4 py-2 border text-center">
                  {check.userName}
                </td>
                <td className="px-4 py-2 border text-center">
                  {new Date(check.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Activity Table */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">User Activity Summary</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Login Count</th>
              <th className="px-4 py-2 border">File Checks</th>
            </tr>
          </thead>
          <tbody>
            {userStats.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border text-center">{user.logins}</td>
                <td className="px-4 py-2 border text-center">{user.fileChecks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

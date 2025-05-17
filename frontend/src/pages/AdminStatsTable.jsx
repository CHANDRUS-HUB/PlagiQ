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
   let [intervalId,] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminRes = await axios.get("http://localhost:7000/admin/activity", {
          withCredentials: true,
        });
          const statsRes = await axios.get("http://localhost:7000/stats", {
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
  intervalId = setInterval(fetchStats, 3000); 
  return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p className="text-center p-6">Loading stats…</p>;    
  }

  if (error) {
    return <p className="text-center p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      
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

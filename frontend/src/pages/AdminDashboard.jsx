import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Star, TrendingUp, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/admin/analytics", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of system performance and feedback.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.total_students}
          icon={Users}
          description="Registered students"
        />
        <StatCard
          title="Total Feedback"
          value={stats.total_feedback}
          icon={FileText}
          description="Submissions received"
        />
        <StatCard
          title="Avg Rating"
          value={stats.overall_average_rating.toFixed(2)}
          icon={Star}
          description="Overall faculty rating"
        />
        <StatCard
          title="Response Rate"
          value="85%"
          icon={TrendingUp}
          description="Student participation"
        />
      </div>

      <Separator />

      {/* Faculty Performance Table */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Faculty Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of ratings per faculty member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Faculty Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Average Rating</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Reviews</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {stats.faculty_performance.map((faculty) => (
                  <tr key={faculty.faculty_name} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{faculty.faculty_name}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {faculty.avg_rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{faculty.total_reviews}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${faculty.avg_rating >= 4.0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                          faculty.avg_rating >= 3.0 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                        {faculty.avg_rating >= 4.0 ? "Excellent" : faculty.avg_rating >= 3.0 ? "Good" : "Needs Improvement"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

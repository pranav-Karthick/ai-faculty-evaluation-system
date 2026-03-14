import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Star, TrendingUp, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facultyAILoading, setFacultyAILoading] = useState({});

  // Filter States
  const [departmentList, setDepartmentList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  // Reset States
  const [resetting, setResetting] = useState(false);

  const fetchFilters = () => {
    apiRequest("/departments")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDepartmentList(data);
      })
      .catch(err => console.error("Failed to fetch departments:", err));

    apiRequest("/semesters")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSemesterList(data);
      })
      .catch(err => console.error("Failed to fetch semesters:", err));
  };

  const loadStats = () => {
    setLoading(true);
    let url = "/admin/stats";
    const params = [];
    if (department && department !== "all") params.push(`department=${encodeURIComponent(department)}`);
    if (semester && semester !== "all") params.push(`semester=${encodeURIComponent(semester)}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    apiRequest(url)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);

        // Fetch AI Data
        if (data.faculty_stats && data.faculty_stats.length > 0) {
          const aiLoadState = {};
          data.faculty_stats.forEach(f => {
            aiLoadState[f.faculty_id] = true;
          });
          setFacultyAILoading(aiLoadState);

          data.faculty_stats.forEach(faculty => {
            let aiUrl = `/admin/ai-analysis/${faculty.faculty_id}`;
            const aiParams = [];
            if (department && department !== "all") aiParams.push(`department=${encodeURIComponent(department)}`);
            if (semester && semester !== "all") aiParams.push(`semester=${encodeURIComponent(semester)}`);
            if (aiParams.length > 0) aiUrl += `?${aiParams.join("&")}`;

            apiRequest(aiUrl)
              .then(aiRes => aiRes.json())
              .then(aiResult => {
                if (aiResult.ai_analysis && aiResult.ai_analysis[0]) {
                  setAiData(prev => ({
                    ...prev,
                    [faculty.faculty_id]: aiResult.ai_analysis[0]
                  }));
                }
              })
              .catch(err => console.error(`AI Error for ${faculty.faculty_name}:`, err))
              .finally(() => {
                setFacultyAILoading(prev => ({
                  ...prev,
                  [faculty.faculty_id]: false
                }));
              });
          });
        }
      })
      .catch(err => {
        console.error("Stats Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    loadStats();
  }, [department, semester]);

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all analytics data?\nThis will permanently delete ALL AI summaries and student feedback statistics.")) {
      return;
    }

    setResetting(true);
    try {
      const res = await apiRequest("/admin/reset-analytics", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset analytics");

      alert("Analytics and Feedback reset successfully.");

      // Clear local states
      setDepartment("");
      setSemester("");
      setAiData(null);
      setStats(null);

      // Reload page naturally grabs clear DB
      loadStats();
    } catch (err) {
      console.error(err);
      alert("An error occurred while resetting.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of system performance and feedback.</p>
        </div>
        <Button
          variant="destructive"
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2"
        >
          {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {resetting ? "Resetting..." : "Reset Analytics"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl shadow-sm border border-border/50">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full sm:w-[250px] h-11">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-semibold text-primary">All Departments</SelectItem>
            {departmentList.map((d) => (
              <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-full sm:w-[250px] h-11">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-semibold text-primary">All Semesters</SelectItem>
            {semesterList.map((s) => (
              <SelectItem key={s._id} value={s.semester_number ? s.semester_number.toString() : s.code ? s.code : s.name}>
                {s.name || `Semester ${s.semester_number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          value={(stats.overall_average_rating || 0).toFixed(2)}
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

      {/* Faculty AI Performance Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold tracking-tight">AI Faculty Evaluation</h3>
          {Object.values(facultyAILoading).some(loading => loading) && (
            <div className="flex items-center text-sm text-muted-foreground gap-2 bg-muted/50 px-3 py-1 rounded-full border">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Generating insights...</span>
            </div>
          )}
        </div>

        {(!stats.faculty_stats || stats.faculty_stats.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-border/50 bg-card">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No data available</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              No feedback data exists for this department and semester.
            </p>
          </div>
        )}

        {stats.faculty_stats && stats.faculty_stats.map((faculty, idx) => {
          const { average_ratings = {}, faculty_id } = faculty;
          const isAILoading = facultyAILoading[faculty_id];

          // Get AI data for this faculty if available, otherwise use defaults/loading states
          const facultyAi = aiData && aiData[faculty_id] ? aiData[faculty_id] : {
            sentiment: { positive: 0, neutral: 0, negative: 0 },
            strengths: [],
            concerns: [],
            summary: isAILoading ? "AI is analyzing feedback..." : "No AI analysis available.",
          };

          const safeSentiment = facultyAi?.sentiment || { positive: 0, neutral: 0, negative: 0 };
          const safeSummary = facultyAi?.summary || (isAILoading ? "AI is analyzing feedback..." : "No AI analysis available.");
          const safeStrengths = facultyAi?.strengths || [];
          const safeConcerns = facultyAi?.concerns || [];

          // Calculate an overall average for quick display
          const avgScore = (
            (average_ratings.clarity || 0) +
            (average_ratings.knowledge || 0) +
            (average_ratings.engagement || 0) +
            (average_ratings.communication || 0) +
            (average_ratings.punctuality || 0)
          ) / 5;

          return (
            <Card key={idx} className={`overflow-hidden border-border/50 shadow-md ${isAILoading ? 'opacity-80' : ''}`}>
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{faculty.faculty_name}</CardTitle>
                    <CardDescription>Based on {faculty.total_reviews} student reviews</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full shadow-sm border">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{avgScore.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Ratings & Sentiment */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Parameter Ratings</h4>
                      <div className="space-y-3 bg-secondary/20 p-4 rounded-xl">
                        {[
                          { label: 'Clarity', val: average_ratings.clarity || 0 },
                          { label: 'Knowledge', val: average_ratings.knowledge || 0 },
                          { label: 'Engagement', val: average_ratings.engagement || 0 },
                          { label: 'Communication', val: average_ratings.communication || 0 },
                          { label: 'Punctuality', val: average_ratings.punctuality || 0 }
                        ].map(param => (
                          <div key={param.label} className="flex items-center justify-between text-sm">
                            <span>{param.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(param.val / 5) * 100}%` }} />
                              </div>
                              <span className="font-medium w-6 text-right">{(param.val || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={isAILoading ? "opacity-50 blur-sm transition-all" : "transition-all"}>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Sentiment Breakdown</h4>
                      <div className="flex h-4 rounded-full overflow-hidden mb-2">
                        <div style={{ width: `${safeSentiment.positive}%` }} className="bg-green-500" />
                        <div style={{ width: `${safeSentiment.neutral}%` }} className="bg-yellow-400" />
                        <div style={{ width: `${safeSentiment.negative}%` }} className="bg-red-500" />
                      </div>
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span className="text-green-600 dark:text-green-400">
                          {isAILoading ? '--' : safeSentiment.positive.toFixed(0)}% Pos
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          {isAILoading ? '--' : safeSentiment.neutral.toFixed(0)}% Neu
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          {isAILoading ? '--' : safeSentiment.negative.toFixed(0)}% Neg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Summary & Feedback */}
                  <div className={`lg:col-span-2 space-y-6 ${isAILoading ? "opacity-60 transition-all" : "transition-all"}`}>
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl relative">
                      {isAILoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-xl">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      )}
                      <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary">
                        <Star className="h-4 w-4" /> AI Performance Summary
                      </h4>
                      <p className="text-sm leading-relaxed">{safeSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="space-y-2 border rounded-xl p-4 bg-card relative">
                        {isAILoading && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-xl"></div>
                        )}
                        <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" /> Key Strengths
                        </h4>
                        {safeStrengths.length > 0 ? (
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                            {safeStrengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        ) : <p className="text-sm text-muted-foreground italic">{isAILoading ? "..." : "No specific strengths highlighted."}</p>}
                      </div>

                      {/* Concerns */}
                      <div className="space-y-2 border rounded-xl p-4 bg-card relative">
                        {isAILoading && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-xl"></div>
                        )}
                        <h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" /> Areas of Concern
                        </h4>
                        {safeConcerns.length > 0 ? (
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                            {safeConcerns.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        ) : <p className="text-sm text-muted-foreground italic">{isAILoading ? "..." : "No specific concerns highlighted."}</p>}
                      </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

      </div>
    </div>
  );
};

export default AdminDashboard;

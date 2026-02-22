import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Sparkles, Loader2 } from "lucide-react";
import FacultyCard from "@/components/FacultyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/student/faculty", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFacultyList(data);
        } else {
          console.error("Failed to fetch faculty");
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Extract unique departments
  const departments = [...new Set(facultyList.map((f) => f.department))];

  const filtered = facultyList.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || (f.subject && f.subject.toLowerCase().includes(search.toLowerCase()));
    const matchDept = department === "all" || f.department === department;
    return matchSearch && matchDept;
  });

  const handleFeedback = (faculty) => {
    navigate(`/feedback/${faculty._id}`);
  };

  const handleView = (faculty) => {
    // Optional: View details
    console.log("View faculty", faculty);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 blur-3xl transform skew-x-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome back, Student! <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
          </h1>
          <p className="text-white/80 max-w-xl">
            Your feedback shapes the future of education. Browse faculty profiles and share your anonymous insights.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl shadow-sm border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by faculty name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-secondary/50 border-transparent focus:bg-background transition-all"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full sm:w-[200px] h-11">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Faculty Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((faculty) => (
          <FacultyCard key={faculty._id} faculty={{ ...faculty, id: faculty._id }} onFeedback={handleFeedback} onView={handleView} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No faculty found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search filters</p>
          <Button variant="link" onClick={() => { setSearch(""); setDepartment("all"); }} className="mt-2 text-primary">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Sparkles, Loader2, Star, CheckCircle2 } from "lucide-react";
import FacultyCard from "@/components/FacultyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/utils/api";

const StudentDashboard = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const navigate = useNavigate();

  // Modal State
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ratings State
  const [ratings, setRatings] = useState({
    clarity_score: 5,
    knowledge_score: 5,
    engagement_score: 5,
    communication_score: 5,
    punctuality_score: 5,
  });
  const [comment, setComment] = useState("");

  const fetchFaculty = () => {
    if (!department || !semester) {
      setFacultyList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiRequest(`/faculty?department=${encodeURIComponent(department)}`)
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          localStorage.removeItem("name");
          navigate("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFacultyList(data);
        } else {
          console.error("Expected array for faculties, got:", data);
          setFacultyList([]);
        }
      })
      .catch(err => {
        console.error("Error fetching faculties:", err);
        setFacultyList([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchFilters = () => {
    apiRequest("/departments")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDepartmentList(data);
        else {
          console.error("Expected array for departments, got:", data);
          setDepartmentList([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch departments", err);
        setDepartmentList([]);
      });

    apiRequest("/semesters")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSemesterList(data);
        else {
          console.error("Expected array for semesters, got:", data);
          setSemesterList([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch semesters", err);
        setSemesterList([]);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate('/login');
      return;
    }

    if (role !== "student") {
      navigate('/login');
      return;
    }

    fetchFilters();
  }, [navigate]);

  useEffect(() => {
    fetchFaculty();
  }, [department, semester]);

  const safeFacultyList = Array.isArray(facultyList) ? facultyList : [];
  const filtered = safeFacultyList.filter((f) => {
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase()) || f.subject?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleFeedbackClick = (faculty) => {
    setSelectedFaculty(faculty);
    setRatings({
      clarity_score: 5,
      knowledge_score: 5,
      engagement_score: 5,
      communication_score: 5,
      punctuality_score: 5,
    });
    setComment("");
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) return;

    if (!department || !semester) {
      alert("Please select department and semester before submitting feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest("/feedback", {
        method: "POST",
        body: JSON.stringify({
          faculty_id: selectedFaculty._id || selectedFaculty.id,
          department: department,
          semester: semester,
          ratings: {
            clarity: ratings.clarity_score,
            knowledge: ratings.knowledge_score,
            engagement: ratings.engagement_score,
            communication: ratings.communication_score,
            punctuality: ratings.punctuality_score
          },
          comment: comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Failed to submit feedback";
        if (errorData.detail) {
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => `${err.loc.slice(-1).join(".")}: ${err.msg}`).join(", ");
          }
        }
        throw new Error(errorMessage);
      }

      setIsModalOpen(false);
      setIsSuccessOpen(true);
      fetchFaculty(); // Refresh data
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && facultyList.length === 0) {
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
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departmentList.length === 0 && <SelectItem value="loading" disabled>Loading...</SelectItem>}
            {departmentList.map((d) => (
              <SelectItem key={d._id} value={d.name}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-full sm:w-[200px] h-11">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterList.length === 0 && <SelectItem value="loading" disabled>Loading...</SelectItem>}
            {semesterList.map((s) => (
              <SelectItem key={s._id} value={s.semester_number ? s.semester_number.toString() : s.code ? s.code : s.name}>
                {s.name || `Semester ${s.semester_number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Faculty Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((faculty) => (
          <FacultyCard
            key={faculty._id || faculty.id}
            faculty={faculty}
            onFeedback={() => handleFeedbackClick(faculty)}
          />
        ))}
      </div>

      {!department || !semester ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-border/50">
          <Filter className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">Select Department & Semester</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Please select a department and a semester from the dropdowns above to view the corresponding faculty members.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No faculty found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
          <Button variant="link" onClick={() => setSearch("")} className="mt-2 text-primary">
            Clear search
          </Button>
        </div>
      ) : null}

      {/* Rating Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rate Faculty: {selectedFaculty?.name}</DialogTitle>
            <DialogDescription>
              Please rate your experience on a scale of 1 to 5.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRatingSubmit} className="space-y-6 py-4">

            {[
              { key: "clarity_score", label: "Clarity" },
              { key: "knowledge_score", label: "Knowledge" },
              { key: "engagement_score", label: "Engagement" },
              { key: "communication_score", label: "Communication" },
              { key: "punctuality_score", label: "Punctuality" },
            ].map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="font-medium text-sm text-foreground">{criterion.label}</label>
                  <span className="text-sm font-bold text-primary">{ratings[criterion.key]}/5</span>
                </div>
                <Slider
                  value={[ratings[criterion.key]]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(val) => setRatings({ ...ratings, [criterion.key]: val[0] })}
                  className="py-2"
                />
              </div>
            ))}

            <div className="space-y-2 pt-2">
              <label className="font-medium text-sm text-foreground">Comments (Optional)</label>
              <Textarea
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-brand hover:opacity-90">
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-6 gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Feedback Submitted!</h2>
              <p className="text-muted-foreground text-sm">
                Your review has been successfully recorded. Thank you!
              </p>
            </div>
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;

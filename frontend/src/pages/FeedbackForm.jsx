import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/utils/api";

const ratingLabels = [
  { key: "clarity_score", label: "Teaching Clarity", desc: "How clearly does the faculty explain concepts?" },
  { key: "knowledge_score", label: "Subject Knowledge", desc: "Depth of knowledge in the subject area." },
  { key: "engagement_score", label: "Engagement", desc: "Engagement with students during class." },
  { key: "communication_score", label: "Communication", desc: "Effectiveness of communication skills." },
  { key: "punctuality_score", label: "Punctuality", desc: "Timeliness in starting and ending sessions." },
];

const FeedbackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [faculty, setFaculty] = useState(location.state?.faculty || null);
  const [loading, setLoading] = useState(!faculty);

  const [ratings, setRatings] = useState({
    clarity_score: 3,
    knowledge_score: 3,
    engagement_score: 3,
    communication_score: 3,
    punctuality_score: 3,
  });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!faculty) {
      const fetchFaculty = async () => {
        try {
          const res = await apiRequest("/faculty");
          if (res.ok) {
            const data = await res.json();
            const found = data.find(f => f._id === id || f.id === id);
            setFaculty(found);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchFaculty();
    }
  }, [id, faculty]);

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[500px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!faculty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Faculty not found
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        faculty_id: faculty.id || faculty._id,
        clarity_score: ratings.clarity_score,
        knowledge_score: ratings.knowledge_score,
        engagement_score: ratings.engagement_score,
        communication_score: ratings.communication_score,
        punctuality_score: ratings.punctuality_score,
        comment: comment
      };

      const response = await apiRequest("/feedback", {
        method: "POST",
        body: JSON.stringify(payload)
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

      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: error.message || "Could not submit feedback.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    toast({ title: "Feedback submitted!", description: "Thank you for challenging us to be better." });
    navigate("/student");
  };

  const getRatingColor = (val) => {
    if (val >= 4) return "text-green-500";
    if (val === 3) return "text-yellow-500";
    return "text-red-500";
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button onClick={() => navigate(-1)} variant="ghost" className="gap-2 pl-0">
        <ArrowLeft className="h-4 w-4" /> Cancel Review
      </Button>

      {/* Header Info */}
      <div className="flex items-center gap-5 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.name}`} />
          <AvatarFallback>{faculty.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{faculty.name}</h1>
          <p className="text-muted-foreground font-medium">{faculty.subject}</p>
          <div className="flex items-center gap-1.5 mt-1 text-sm bg-secondary/50 px-2 py-0.5 rounded-md w-fit">
            <span className="text-muted-foreground">{faculty.department} Department</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-sm glass-card">
          <CardContent className="p-6 space-y-8">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Rate your experience
              </h2>
              <p className="text-sm text-muted-foreground">Your honest feedback helps improve our education quality.</p>
            </div>

            <div className="grid gap-8">
              {ratingLabels.map(({ key, label, desc }) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="font-medium text-foreground">{label}</label>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <span className={`text-lg font-bold ${getRatingColor(ratings[key])}`}>
                      {ratings[key]}<span className="text-sm text-muted-foreground font-normal">/5</span>
                    </span>
                  </div>
                  <Slider
                    defaultValue={[ratings[key]]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(val) => setRatings({ ...ratings, [key]: val[0] })}
                    className="py-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1 uppercase tracking-wider">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm glass-card">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Detailed Feedback</h2>
              <p className="text-sm text-muted-foreground mb-4">Share specific examples of what went well or could be improved.</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comments here..."
                rows={5}
                className="bg-secondary/30 resize-none focus:bg-background transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="h-12 px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 px-8 bg-gradient-brand shadow-lg hover:opacity-90 transition-all rounded-xl"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-6 gap-4 animate-in zoom-in-50 duration-300">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Feedback Submitted!</h2>
              <p className="text-muted-foreground">
                Your review has been successfully recorded. Thank you for your contribution.
              </p>
            </div>
            <Button onClick={handleSuccessClose} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-xl">
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackForm;

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare, Calendar, Award, BookOpen, Clock, HelpCircle, UserCheck } from "lucide-react";
import { faculties, feedbacks } from "@/data/mockData";
import SentimentMeter from "@/components/SentimentMeter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const FacultyPerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const faculty = faculties.find((f) => f.id === id);

  if (!faculty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground flex-col gap-4">
        <UserCheck className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold">Faculty not found</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const avgCategories = [
    { label: "Teaching Clarity", value: 4.5, icon: BookOpen },
    { label: "Subject Knowledge", value: 4.7, icon: Award },
    { label: "Interaction", value: 3.8, icon: MessageSquare },
    { label: "Punctuality", value: 4.4, icon: Clock },
    { label: "Doubt Solving", value: 4.0, icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button onClick={() => navigate(-1)} variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 blur-3xl transform skew-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <Avatar className="h-28 w-28 border-4 border-white/20 shadow-2xl">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.name}`} />
            <AvatarFallback className="text-4xl font-bold bg-white/10 text-white">{faculty.avatar}</AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{faculty.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/80">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">{faculty.department}</Badge>
              <span>•</span>
              <span className="font-medium">{faculty.subject}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                <span className="text-xl font-bold">{faculty.avgRating}</span>
                <span className="text-sm opacity-70">/ 5.0</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                <MessageSquare className="h-5 w-5 text-blue-200" />
                <span className="text-xl font-bold">{faculty.totalFeedbacks}</span>
                <span className="text-sm opacity-70">Reviews</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <SentimentMeter score={faculty.sentimentScore} size="lg" />
            <p className="text-center text-xs mt-2 opacity-70 font-medium">Overall Sentiment</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Rating Breakdown */}
        <Card className="md:col-span-2 border-none shadow-sm glass-card">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {avgCategories.map(({ label, value, icon: Icon }) => (
              <div key={label} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </div>
                  <span className="text-sm font-bold">{value}/5</span>
                </div>
                <Progress value={(value / 5) * 100} className="h-2.5" indicatorClassName="bg-gradient-to-r from-primary to-purple-500" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights (Mock) */}
        <Card className="border-none shadow-sm glass-card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm mb-1">Top Strength</h4>
              <p className="text-sm opacity-80">Excellent subject knowledge and clear explanations in lectures.</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-1">Area for Growth</h4>
              <p className="text-sm opacity-80">Could improve on punctuality for morning sessions.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Comments */}
      <h2 className="text-xl font-bold flex items-center gap-2 mt-8">
        <MessageSquare className="h-5 w-5 text-primary" />
        Recent Feedback
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {feedbacks.map((fb) => (
          <Card key={fb.id} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-brand text-white text-xs">
                      {fb.studentName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{fb.studentName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {fb.date}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`
                   ${fb.sentiment === "positive" ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                    fb.sentiment === "negative" ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}
                `}>
                  {fb.sentiment}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{fb.comment}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacultyPerformance;

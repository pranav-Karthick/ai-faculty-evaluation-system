import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FacultyCard = ({ faculty, onFeedback, onView }) => {
  return (
    <Card className="glass-card border-none shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
      {/* Decorative gradient blob */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 border-2 border-white dark:border-white/10 shadow-sm relative z-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.name}`} />
              <AvatarFallback className="bg-gradient-brand text-white">{faculty.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg leading-tight truncate pr-2">{faculty.name}</h3>
              <p className="text-xs text-muted-foreground font-medium">{faculty.department}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 text-xs font-normal">
            {faculty.subject}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-border/50 mb-4 bg-secondary/10 rounded-xl px-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold">
              <Star className="h-3.5 w-3.5 fill-yellow-500" /> {faculty.average_rating || faculty.avgRating || "N/A"}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rating</p>
          </div>
          <div className="text-center border-l border-border/50">
            <div className="flex items-center justify-center gap-1 text-blue-500 font-bold">
              <MessageSquare className="h-3.5 w-3.5" /> {faculty.total_reviews || faculty.totalFeedbacks || 0}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Reviews</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          {onView && (
            <Button onClick={() => onView(faculty)} variant="outline" className="flex-1 h-9 text-xs rounded-lg hover:bg-secondary">
              View Profile
            </Button>
          )}
          {onFeedback && (
            <Button onClick={() => onFeedback(faculty)} className="flex-1 h-9 text-xs rounded-lg bg-gradient-brand hover:opacity-90 shadow-sm">
              Rate Faculty
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyCard;

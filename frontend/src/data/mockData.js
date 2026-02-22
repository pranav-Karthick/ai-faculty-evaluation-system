



export const faculties = [
  { id: "1", name: "Dr. Ananya Sharma", department: "Computer Science", subject: "Data Structures", avatar: "AS", avgRating: 4.5, totalFeedbacks: 128, sentimentScore: 87 },
  { id: "2", name: "Prof. Rajesh Kumar", department: "Mathematics", subject: "Linear Algebra", avatar: "RK", avgRating: 4.2, totalFeedbacks: 95, sentimentScore: 78 },
  { id: "3", name: "Dr. Priya Menon", department: "Physics", subject: "Quantum Mechanics", avatar: "PM", avgRating: 4.8, totalFeedbacks: 142, sentimentScore: 92 },
  { id: "4", name: "Prof. Vikram Singh", department: "Computer Science", subject: "Machine Learning", avatar: "VS", avgRating: 4.1, totalFeedbacks: 110, sentimentScore: 74 },
  { id: "5", name: "Dr. Meera Patel", department: "Electronics", subject: "Digital Circuits", avatar: "MP", avgRating: 4.6, totalFeedbacks: 88, sentimentScore: 85 },
  { id: "6", name: "Prof. Arjun Reddy", department: "Mathematics", subject: "Probability & Statistics", avatar: "AR", avgRating: 3.9, totalFeedbacks: 76, sentimentScore: 68 },
];

export const feedbacks = [
  { id: "1", studentName: "Rahul M.", date: "2025-02-10", ratings: { teachingClarity: 5, subjectKnowledge: 5, interaction: 4, punctuality: 5, doubtSolving: 4 }, comment: "Excellent teaching methodology. Explains complex topics with real-world examples.", sentiment: "positive" },
  { id: "2", studentName: "Sneha K.", date: "2025-02-08", ratings: { teachingClarity: 4, subjectKnowledge: 5, interaction: 3, punctuality: 4, doubtSolving: 4 }, comment: "Very knowledgeable but could improve interaction with students.", sentiment: "neutral" },
  { id: "3", studentName: "Amit P.", date: "2025-02-05", ratings: { teachingClarity: 5, subjectKnowledge: 5, interaction: 5, punctuality: 5, doubtSolving: 5 }, comment: "Best professor I've had. Makes every class interesting and engaging.", sentiment: "positive" },
  { id: "4", studentName: "Divya S.", date: "2025-01-28", ratings: { teachingClarity: 3, subjectKnowledge: 4, interaction: 2, punctuality: 3, doubtSolving: 3 }, comment: "Needs to be more approachable for doubt solving sessions.", sentiment: "negative" },
  { id: "5", studentName: "Karan T.", date: "2025-01-25", ratings: { teachingClarity: 4, subjectKnowledge: 4, interaction: 4, punctuality: 5, doubtSolving: 4 }, comment: "Consistently punctual and well-prepared. Great overall experience.", sentiment: "positive" },
];

export const departmentData = [
  { department: "Computer Science", avgRating: 4.3, feedbackCount: 238 },
  { department: "Mathematics", avgRating: 4.05, feedbackCount: 171 },
  { department: "Physics", avgRating: 4.8, feedbackCount: 142 },
  { department: "Electronics", avgRating: 4.6, feedbackCount: 88 },
];

export const performanceData = faculties.map(f => ({
  name: f.name.split(" ").slice(-1)[0],
  rating: f.avgRating,
  feedbacks: f.totalFeedbacks,
}));

export const sentimentData = [
  { name: "Positive", value: 62, fill: "hsl(152, 60%, 42%)" },
  { name: "Neutral", value: 24, fill: "hsl(38, 92%, 50%)" },
  { name: "Negative", value: 14, fill: "hsl(0, 72%, 56%)" },
];

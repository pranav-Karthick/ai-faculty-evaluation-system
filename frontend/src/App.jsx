import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";

import StudentDashboard from "@/pages/StudentDashboard";
import FeedbackForm from "@/pages/FeedbackForm";
import AdminDashboard from "@/pages/AdminDashboard";
import FacultyPerformance from "@/pages/FacultyPerformance";
import NotFound from "./pages/NotFound";

import DashboardLayout from "@/layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout role="student" />
            </ProtectedRoute>
          }>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/feedback/:id" element={<FeedbackForm />} />
          </Route>

          {/* Admin Routes */}
          <Route element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/faculty" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Faculty Routes (Placeholder, if needed later) */}
          <Route element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <DashboardLayout role="faculty" />
            </ProtectedRoute>
          }>
            <Route path="/faculty/:id" element={<FacultyPerformance />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

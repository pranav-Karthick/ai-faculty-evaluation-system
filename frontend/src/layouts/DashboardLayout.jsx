import * as React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    GraduationCap,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ role = "student" }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const location = useLocation();

    const navItems = {
        student: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
            { icon: Users, label: "Faculty", href: "/student/faculty" }, // Assuming this route exists or matches dashboard
        ],
        faculty: [
            { icon: LayoutDashboard, label: "Overview", href: "/faculty/dashboard" },
            { icon: Star, label: "My Ratings", href: "/faculty/ratings" },
        ],
        admin: [
            { icon: LayoutDashboard, label: "Overview", href: "/admin" },
            { icon: Users, label: "Faculty Mgmt", href: "/admin/faculty" },
            { icon: GraduationCap, label: "Students", href: "/admin/students" },
        ]
    };

    const currentNav = navItems[role] || navItems.student;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar - Desktop */}
            <aside
                className={cn(
                    "hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed h-full z-30 transition-all duration-300",
                    !isSidebarOpen && "-ml-64"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        EvalAI
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {currentNav.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 text-base font-medium h-12",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive text-destructive"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("name");
                            window.location.href = "/login";
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-300 min-h-screen flex flex-col",
                isSidebarOpen ? "md:ml-64" : "md:ml-0"
            )}>
                {/* Topbar */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-20 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex">
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Mobile Sidebar Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="p-6 flex items-center gap-3 border-b border-border">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold">EvalAI</span>
                                </div>
                                <nav className="p-4 space-y-2">
                                    {currentNav.map((item) => (
                                        <Link key={item.href} to={item.href}>
                                            <Button variant="ghost" className="w-full justify-start gap-3 mb-1">
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-lg font-semibold sm:hidden">EvalAI</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{localStorage.getItem("name") || "User"}</p>
                                <p className="text-xs text-muted-foreground capitalize">{role}</p>
                            </div>
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// Placeholder icon for missing 'Star'
const Star = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

export default DashboardLayout;

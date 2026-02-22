import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isLogin = location.pathname === "/";

  if (isLogin) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text">EvalAI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {!isAdmin ? (
            <>
              <Link to="/student" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Dashboard</Link>
              <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Admin</Link>
            </>
          ) : (
            <Link to="/student" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Student View</Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden animate-slide-up">
          {!isAdmin ? (
            <>
              <Link to="/student" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Dashboard</Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Admin</Link>
            </>
          ) : (
            <Link to="/student" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Student View</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

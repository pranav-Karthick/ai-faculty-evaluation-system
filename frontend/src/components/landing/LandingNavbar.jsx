import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingNavbar = () => {
    return (
        <nav className="fixed w-full z-50 bg-[#020617]/50 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="h-10 w-10 rounded-xl bg-[#0f172a] border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300">
                        <GraduationCap className="h-6 w-6 text-cyan-400 group-hover:text-purple-400 transition-colors duration-300" />
                    </div>
                    <span className="text-xl font-bold animated-gradient-text tracking-tight">
                        EvalAI
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
                    <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
                    <Link to="/how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button className="rounded-full px-8 bg-white text-black hover:bg-slate-200 transition-all font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-transparent hover:border-white/50">
                            Login
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;

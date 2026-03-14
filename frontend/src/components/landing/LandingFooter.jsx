import React from "react";
import { GraduationCap } from "lucide-react";

const LandingFooter = () => {
    return (
        <footer className="py-12 border-t border-white/10 mt-auto bg-[#020617] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#8b5cf6]/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#0f172a] border border-white/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-lg font-bold animated-gradient-text">
                        EvalAI
                    </span>
                </div>

                <div className="text-sm text-slate-500 text-center md:text-left">
                    © {new Date().getFullYear()} EvalAI Academic Analytics. All rights reserved.
                </div>

                <div className="flex gap-6 text-sm">
                    <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-slate-500 hover:text-purple-400 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;

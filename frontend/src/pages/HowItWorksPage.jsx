import * as React from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import WorkflowSection from "@/components/landing/WorkflowSection";
import LandingFooter from "@/components/landing/LandingFooter";

const HowItWorksPage = () => {
    return (
        <div className="dark">
            <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary relative">
                {/* Global Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] pointer-events-none z-0" />

                <div className="relative z-10 flex flex-col min-h-screen">
                    <LandingNavbar />

                    <main className="flex-grow pt-20">
                        <WorkflowSection />
                    </main>

                    <LandingFooter />
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;

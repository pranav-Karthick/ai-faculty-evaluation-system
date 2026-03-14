import React from "react";
import { motion } from "framer-motion";
import {
    LogIn,
    MessageSquare,
    Database,
    ZapOff,
    UserCheck,
    BrainCircuit,
    FilePieChart,
    Zap,
    LayoutDashboard,
    Workflow,
    Users
} from "lucide-react";

const steps = [
    { id: 1, title: "Student Login", icon: LogIn, desc: "Secure authentication" },
    { id: 2, title: "Select Department", icon: Users, desc: "Choose department" },
    { id: 3, title: "Select Semester", icon: FilePieChart, desc: "Choose current semester" },
    { id: 4, title: "View Faculty List", icon: UserCheck, desc: "See assigned faculty" },
    { id: 5, title: "Submit Rating & Feedback", icon: MessageSquare, desc: "Evaluate performance" },
    { id: 6, title: "Feedback Stored in MongoDB", icon: Database, desc: "Secure NoSQL storage" },
    { id: 7, title: "AI Model Performs Sentiment Analysis", icon: BrainCircuit, desc: "Automated categorization" },
    { id: 8, title: "AI Generates Summary, Strengths & Concerns", icon: Zap, desc: "Intelligent insights" },
    { id: 9, title: "Admin Dashboard Displays Insights", icon: LayoutDashboard, desc: "Real-time analytics" },
];

const WorkflowSection = () => {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#020617] pointer-events-none z-0" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-4 border border-purple-500/20">
                        <Workflow className="h-3 w-3 fill-purple-400" /> Pipeline
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animated-gradient-text">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        A seamless, fast, and intelligent flow from student feedback to administrative insight.
                    </p>
                </div>

                <div className="relative">
                    {/* Animated Connection Line Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6]/20 via-[#22d3ee]/50 to-[#8b5cf6]/20 -translate-y-1/2 z-0 rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent shadow-[0_0_15px_#22d3ee]"
                            animate={{ left: ["-10%", "110%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Animated Connection Line Mobile */}
                    <div className="block lg:hidden absolute top-0 bottom-0 left-[2.25rem] w-[2px] bg-gradient-to-b from-[#8b5cf6]/20 via-[#22d3ee]/50 to-[#8b5cf6]/20 z-0 rounded-full">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-[#22d3ee] to-transparent shadow-[0_0_15px_#22d3ee]"
                            animate={{ top: ["-10%", "110%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-y-12 gap-x-6 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-row lg:flex-col items-center gap-6 lg:gap-4 w-full lg:w-40 group cursor-default"
                                >
                                    {/* Icon Circle */}
                                    <div className="relative flex-shrink-0">
                                        <div className="h-16 w-16 rounded-full glass-panel border-white/20 flex items-center justify-center shadow-lg group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 relative z-10">
                                            <Icon className="h-7 w-7 text-white group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#22d3ee] flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.5)] border-2 border-[#0f172a] z-20">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-left lg:text-center flex-1 lg:flex-none">
                                        <h4 className="font-semibold text-white text-sm lg:text-[15px] mb-1 leading-tight group-hover:text-cyan-300 transition-colors">
                                            {step.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 w-full">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkflowSection;

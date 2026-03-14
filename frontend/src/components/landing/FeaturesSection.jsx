import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BrainCircuit,
    MessageSquareHeart,
    ThumbsUp,
    AlertTriangle,
    BarChart3,
    Shield,
    Users,
    Zap,
    Database,
    Workflow
} from "lucide-react";

const features = [
    {
        id: "ai-sentiment",
        title: "AI Sentiment Analysis",
        icon: MessageSquareHeart,
        description: "Automatically analyzes student comments to categorize sentiments as positive, neutral, or negative."
    },
    {
        id: "semester-eval",
        title: "Semester-wise Faculty Evaluation",
        icon: Users,
        description: "Enables comprehensive performance tracking across different semesters for detailed insights."
    },
    {
        id: "ai-summary",
        title: "AI Generated Performance Summary",
        icon: BrainCircuit,
        description: "Summarizes vast amounts of feedback into concise, meaningful academic insights for administrators."
    },
    {
        id: "strength-concern",
        title: "Key Strength & Concern Detection",
        icon: AlertTriangle,
        description: "Proactively identifies persistent issues and highlights areas where faculty members excel."
    },
    {
        id: "admin-analytics",
        title: "Real-time Admin Analytics Dashboard",
        icon: BarChart3,
        description: "Instantly computes and displays overall faculty ratings and metrics."
    },
    {
        id: "secure-auth",
        title: "Secure Student Authentication",
        icon: Shield,
        description: "Ensures secure, anonymous and reliable session management during the evaluation process."
    },
    {
        id: "filtering",
        title: "Department & Semester Filtering",
        icon: Database,
        description: "Provides granular data filtering to allow precise analysis across various academic parameters."
    },
    {
        id: "reset-analytics",
        title: "Reset Analytics Option",
        icon: Zap,
        description: "Allows administrators to completely reset analytics to begin a new evaluation cycle."
    }
];

const FeaturesSection = () => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleFeature = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-4 border border-cyan-500/20">
                        <Zap className="h-3 w-3 fill-cyan-400" /> Core Engine
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animated-gradient-text">
                        Powerful capabilities for modern education
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        EvalAI streamlines the entire feedback loop with intelligent systems tailored for academic excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const isExpanded = expandedId === feature.id;

                        return (
                            <motion.div
                                layout
                                key={feature.id}
                                className={`group cursor-pointer rounded-2xl glass-panel transition-all duration-300 relative ${isExpanded ? 'neon-border shadow-[0_0_30px_rgba(139,92,246,0.3)]' : ''}`}
                                onClick={() => toggleFeature(feature.id)}
                                whileHover={!isExpanded ? { scale: 1.02, y: -4 } : {}}
                            >
                                {/* Hover Glow Injector */}
                                {!isExpanded && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-[#22d3ee]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                )}

                                <div className="p-6 relative z-10">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#22d3ee]/20 flex items-center justify-center border border-white/10 group-hover:border-[#22d3ee]/50 transition-colors shadow-lg">
                                            <Icon className="h-6 w-6 text-cyan-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors flex-1">
                                            {feature.title}
                                        </h3>
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                                                    {feature.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;

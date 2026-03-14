import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";

const HeroSection = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        particles: {
            color: { value: ["#8b5cf6", "#22d3ee"] },
            links: { color: "#ffffff", distance: 150, enable: false, opacity: 0.1, width: 1 },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: true,
                speed: 0.8,
                straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.3, random: true },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 }, random: true },
        },
        detectRetina: true,
    };

    return (
        <section className="pt-32 pb-20 px-6 relative overflow-hidden flex items-center min-h-screen">
            {/* Particles Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="h-full w-full" />
            </div>

            {/* Background Gradient Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-40 left-10 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center">

                    {/* Center Content */}
                    <div className="w-full text-center flex flex-col items-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-300 text-sm font-semibold mb-8 border border-white/10 hover:border-cyan-400/30 transition-colors cursor-default neon-glow">
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">Next-Gen Faculty Evaluation Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]" style={{ background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Elevate Education with <br className="hidden md:block" />
                            Intelligent Analytics
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
                            Empower institutions with AI-driven faculty evaluation. EvalAI intelligently analyzes student feedback, generates structured performance summaries, and delivers meaningful academic insights in real time.
                        </p>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;

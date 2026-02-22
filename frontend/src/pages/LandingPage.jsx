import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, ShieldCheck, Users, Star, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            EvalAI
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/student">
                            <Button variant="ghost" className="font-medium">Dashboard</Button>
                        </Link>
                        <Link to="/student">
                            <Button className="rounded-full px-6 bg-gradient-brand hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-40 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Star className="h-4 w-4 fill-primary" />
                        <span>#1 AI-Powered Faculty Evaluation Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Elevate Education with <br className="hidden md:block" />
                        <span className="text-gradient">Intelligent Analytics</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        Transform feedback into actionable insights. EvalAI uses advanced machine learning to analyze teaching performance and student engagement in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <Button size="lg" className="rounded-full text-lg h-14 px-8 bg-gradient-brand hover:opacity-90 shadow-xl shadow-primary/30 w-full sm:w-auto">
                            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-8 border-2 w-full sm:w-auto">
                            Request Demo
                        </Button>
                    </div>

                    {/* Hero Image / Dashboard Mockup */}
                    <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden glass aspect-video animate-in fade-in zoom-in duration-1000 delay-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/30 dark:from-white/5 dark:to-white/10" />
                        {/* Mockup Content would go here or an image */}
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="text-center">
                                <BarChart2 className="h-24 w-24 mx-auto mb-4 opacity-50" />
                                <p>Interactive Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EvalAI?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive tools designed for modern educational institutions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={BarChart2}
                            title="Advanced Analytics"
                            description="Visualize performance trends, identify strengths, and uncover areas for improvement with our AI-driven dashboards."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Secure & Anonymous"
                            description="Ensure honest feedback with our end-to-end encrypted, anonymous submission system protecting student identity."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Role-Based Access"
                            description="Tailored views for Administrators, Faculty, and Students, ensuring the right information reaches the right people."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border mt-auto">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">EvalAI</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} EvalAI. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
            <Icon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;

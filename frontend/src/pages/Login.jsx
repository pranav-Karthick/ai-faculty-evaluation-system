import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Login failed");
            }

            const data = await response.json();

            // Store in localStorage
            localStorage.setItem("access_token", data.access_token || data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", email);

            // Redirect based on role
            if (data.role === "student") {
                navigate("/student");
            } else if (data.role === "admin") {
                navigate("/admin");
            } else {
                // Fallback or unknown role
                setError("Unknown user role");
            }

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark">
            <div
                className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-white transition-all duration-300"
                style={{
                    background: "radial-gradient(circle at top, #0f172a, #020617)"
                }}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8 mt-4">
                        <div
                            className="inline-flex items-center justify-center h-16 w-16 mb-4 relative group"
                        >
                            <div
                                className="absolute inset-0 rounded-2xl animate-pulse"
                                style={{
                                    background: "linear-gradient(135deg,#22d3ee,#8b5cf6)",
                                    boxShadow: "0 0 25px rgba(139,92,246,0.6)",
                                    zIndex: 0
                                }}
                            ></div>
                            <div className="relative z-10 h-full w-full bg-[#0f172a]/80 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                <GraduationCap className="h-8 w-8 text-white group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                        <p className="mt-2 text-[#94a3b8] font-medium text-[15px]">Sign in to your account</p>
                    </div>

                    <Card
                        className="shadow-xl"
                        style={{
                            background: "rgba(15,23,42,0.6)",
                            backdropFilter: "blur(14px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 0 40px rgba(139,92,246,0.25)",
                            borderRadius: "16px"
                        }}
                    >
                        <CardContent className="pt-8">
                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-950/50 border-red-500/50 text-red-100">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="transition-all duration-300"
                                        style={{
                                            background: "rgba(15,23,42,0.6)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            color: "white"
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#8b5cf6";
                                            e.target.style.boxShadow = "0 0 8px #8b5cf6";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="password" className="text-sm font-medium text-white/80">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="transition-all duration-300"
                                        style={{
                                            background: "rgba(15,23,42,0.6)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            color: "white"
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#8b5cf6";
                                            e.target.style.boxShadow = "0 0 8px #8b5cf6";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 flex justify-center items-center mt-4 cursor-pointer"
                                    disabled={loading}
                                    style={{
                                        background: "linear-gradient(90deg,#22d3ee,#8b5cf6)",
                                        color: "white",
                                        fontWeight: "600",
                                        borderRadius: "10px",
                                        transition: "all .3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.5)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center pb-6">
                            <p className="text-[#94a3b8] text-sm hover:text-white transition-colors cursor-pointer">
                                Contact your administrator for access.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;

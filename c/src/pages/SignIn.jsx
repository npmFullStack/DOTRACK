// src/pages/SignIn.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Loader2
} from "lucide-react";
import Button from "@/components/_Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logoSvg from "@/assets/images/logo.svg";
import { supabase } from "@/config/supabase";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user && data.session) {
                toast.success("Successfully signed in! Welcome back!", {
                    icon: (
                        <CheckCircle size={20} className="text-emerald-500" />
                    ),
                    duration: 3000
                });
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Signin error:", err);

            let errorMessage = "Failed to sign in. Please try again.";

            if (err.message?.includes("Invalid login credentials")) {
                errorMessage = "Invalid email or password. Please try again.";
            } else if (err.message?.includes("Email not confirmed")) {
                errorMessage =
                    "Please confirm your email address before signing in. Check your inbox for the verification link.";
            } else if (err.message?.includes("rate_limit")) {
                errorMessage =
                    "Too many sign-in attempts. Please wait a few minutes and try again.";
            }

            toast.error(errorMessage, {
                icon: <AlertCircle size={20} className="text-red-500" />,
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });
            if (error) throw error;
        } catch (err) {
            setGoogleLoading(false);
            toast.error(err.message || "Failed to sign in with Google", {
                icon: <AlertCircle size={20} className="text-red-500" />
            });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation Bar - Like Header */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center py-12 px-4">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md mx-auto"
                    >
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center">
                                <img
                                    src={logoSvg}
                                    alt="DoTrack Logo"
                                    className="h-8 w-auto"
                                />
                                <div className="font-logo text-4xl tracking-wide font-black">
                                    <span className="text-primary">Do</span>
                                    <span className="text-secondary">
                                        Track
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">
                                Sign in to continue your journey
                            </p>
                        </div>

                        {/* Sign In Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="you@example.com"
                                        required
                                        disabled={loading || googleLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="••••••••"
                                        required
                                        disabled={loading || googleLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={loading || googleLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-primary hover:text-red-600 text-sm"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center"
                                disabled={loading || googleLoading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || googleLoading}
                        >
                            {googleLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2
                                        size={20}
                                        className="animate-spin text-gray-600"
                                    />
                                    <span className="text-gray-700">
                                        Signing in with Google...
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-gray-700">
                                        Sign in with Google
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:text-red-600 font-semibold"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;

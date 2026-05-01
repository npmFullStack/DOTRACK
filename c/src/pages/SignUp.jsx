// src/pages/SignUp.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/_Button";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import logoSvg from "@/assets/images/logo.svg";
import { supabase } from '@/config/supabase';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });
            
            if (error) throw error;
            
            // Check if email confirmation is required
            if (data.user && data.session) {
                // User is automatically signed in
                toast.success('Account created successfully! Welcome to DoTrack', {
                    icon: <CheckCircle size={20} className="text-emerald-500" />,
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#064e3b',
                    },
                });
                navigate("/dashboard");
            } else if (data.user && !data.session) {
                // Email confirmation required
                toast.success('Verification email sent! Please check your inbox to confirm your account.', {
                    icon: <Mail size={20} className="text-blue-500" />,
                    duration: 5000,
                    style: {
                        background: '#fff',
                        color: '#1e40af',
                    },
                });
                navigate("/signin");
            }
        } catch (err) {
            console.error('Signup error:', err);
            
            let errorMessage = "Failed to sign up. Please try again.";
            
            // Handle specific Supabase errors
            if (err.message?.includes("rate_limit") || err.message?.includes("over_email_send_rate_limit")) {
                errorMessage = "Too many signup attempts. Please wait a few minutes before trying again.";
            } else if (err.message?.includes("already registered")) {
                errorMessage = "An account with this email already exists. Please sign in instead.";
            } else if (err.message?.includes("valid email")) {
                errorMessage = "Please enter a valid email address.";
            } else if (err.message?.includes("password")) {
                errorMessage = "Password must be at least 6 characters long.";
            }
            
            toast.error(errorMessage, {
                icon: <AlertCircle size={20} className="text-red-500" />,
                duration: 5000,
                style: {
                    background: '#fff',
                    color: '#991b1b',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center relative">
            <div className="container mx-auto px-4">
                {/* Back Button - Fixed positioning */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/")}
                    className="fixed top-8 left-4 md:left-8 flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-50 transition-colors z-10"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-md mx-auto"
                >
                    {/* Logo Section - Block positioning, not absolute */}
                    <div className="text-center mb-8">
                        <div
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <img
                                src={logoSvg}
                                alt="DoTrack Logo"
                                className="h-8 w-auto"
                            />
                            <div className="font-logo text-4xl tracking-wide font-black">
                                <span className="text-primary">Do</span>
                                <span className="text-secondary">Track</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mt-2">
                            Start tracking your progress today
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="John Doe"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

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
                                    disabled={loading}
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 6 characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                "Sign Up"
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

                    {/* Google Sign Up Button */}
                    <button
                        onClick={() => {
                            toast.info('Google sign up coming soon!', {
                                icon: <Mail size={20} className="text-blue-500" />,
                            });
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        <span className="text-gray-700">Sign up with Google</span>
                    </button>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-primary hover:text-red-600 font-semibold"
                        >
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;
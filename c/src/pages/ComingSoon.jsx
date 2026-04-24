// src/pages/ComingSoon.jsx
import { motion } from "framer-motion";
import { Mail, Bell, Smartphone } from "lucide-react";
import Button from "@/components/_Button";
import Header from "@/components/_Header";

const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-bgLight">
            <Header />

            {/* Hero Section with Paper Background */}
            <section className="min-h-screen flex items-center justify-center relative pt-20 bg-bgLight overflow-hidden">
                {/* Ruled lines background */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-blue-300/40"
                            style={{ top: `${i * 32 + 64}px` }}
                        />
                    ))}
                    <div className="absolute top-0 bottom-0 left-24 w-px bg-red-400/50" />
                    <div className="absolute top-20 left-0 right-0 h-px bg-blue-300/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bgLight/80" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    {/* Main heading */}
                    <motion.h1
                        className="font-logo text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide"
                        style={{ fontWeight: 700 }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-secondary">Mobile App</span>
                        <span className="text-primary block">Coming Soon</span>
                    </motion.h1>

                    {/* Subheading */}


                    {/* Mobile app message */}
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Smartphone size={20} className="text-primary" />
                        <p className="text-gray-600">
                            Mobile app in progress — will be released soon on
                            iOS and Android
                        </p>
                    </motion.div>

                    {/* Get notified form */}
                    <motion.div
                        className="max-w-md mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 justify-center">
                                <Bell size={18} className="text-primary" />
                                <h3 className="font-semibold text-gray-800">
                                    Get notified when we launch
                                </h3>
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent mb-3"
                            />
                            <Button
                                variant="primary"
                                icon={Mail}
                                className="w-full justify-center"
                            >
                                Notify Me
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ComingSoon;

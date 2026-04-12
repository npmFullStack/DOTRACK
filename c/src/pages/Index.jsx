// src/pages/Index.jsx
import Header from "@/components/_Header";
import Button from "@/components/_Button";
import { motion } from "framer-motion";
import {
    Play,
    Download,
    ArrowRight,
    CheckCircle,
    Calendar,
    TrendingUp,
    Target,
    Zap
} from "lucide-react";

const Index = () => {
    const features = [
        {
            icon: Calendar,
            title: "Custom Duration Lists",
            description:
                "Create to-do lists for any number of days. Plan your tasks for a week, month, or any custom period."
        },
        {
            icon: CheckCircle,
            title: "Daily Check-ins",
            description:
                "Check off tasks as you complete them. Unchecked tasks are automatically recorded for review."
        },
        {
            icon: TrendingUp,
            title: "Track Progress",
            description:
                "Watch your progress grow. See which days you completed and where you can improve."
        },
        {
            icon: Target,
            title: "Set Goals",
            description:
                "Define clear objectives for each day and track your achievement rate over time."
        },
        {
            icon: Zap,
            title: "Quick Reset",
            description:
                "Tasks reset automatically each day, keeping your focus on what matters today."
        },
        {
            icon: TrendingUp,
            title: "Analytics",
            description:
                "Get insights into your productivity patterns and celebrate your streaks."
        }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen">
            <Header />

            <section className="min-h-screen flex items-center justify-center relative pt-20">
                <div className="absolute inset-0 bg-[#F9F6E8] overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-primary/20"
                            style={{ top: `${i * 40 + 80}px` }}
                        />
                    ))}
                    <div className="absolute left-24 top-0 bottom-0 w-px bg-secondary/30" />
                    <div className="absolute top-20 left-0 right-0 h-px bg-secondary/30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F9F6E8]/90" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        className="font-logo text-5xl md:text-7xl lg:text-8xl mb-6 font-black tracking-wide"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary">Track</span>{" "}
                        <span className="text-secondary">Your</span>
                        <span className="text-primary block font-black">
                            Daily Progress
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Create custom task lists for any duration, track your
                        daily completions, and build lasting habits. Stay
                        consistent with DoTrack's flexible tracking system.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Button variant="primary" icon={Play}>
                            Start Tracking
                        </Button>
                        <Button variant="outline" icon={Download}>
                            Download App
                        </Button>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-logo text-4xl md:text-5xl mb-4 font-black tracking-wide">
                            <span className="text-primary">How</span>{" "}
                            <span className="text-secondary">DoTrack</span>{" "}
                            <span className="text-primary">Works</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto font-sans">
                            Simple, effective, and designed to keep you on track
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center p-6 rounded-2xl bg-[#F9F6E8] border border-primary/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon
                                        className="text-primary"
                                        size={32}
                                    />
                                </div>
                                <h3 className="font-button text-xl font-bold text-secondary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 font-sans">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-4 bg-primary">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.h2
                        className="font-logo text-4xl md:text-5xl text-white mb-4 font-black tracking-wide"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Start Your Journey?
                    </motion.h2>
                    <motion.p
                        className="text-white/90 text-lg mb-8 font-sans"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Join thousands of users building better habits with
                        DoTrack's flexible tracking system.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Button
                            variant="outline"
                            icon={ArrowRight}
                            className="bg-white text-primary hover:bg-gray-100 mx-auto"
                        >
                            Create Your First List
                        </Button>
                    </motion.div>
                    <motion.p
                        className="text-white/80 text-sm mt-6 font-sans"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Free forever • No credit card required
                    </motion.p>
                </div>
            </section>
        </div>
    );
};

export default Index;
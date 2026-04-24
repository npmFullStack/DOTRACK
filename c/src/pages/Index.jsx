// src/pages/Index.jsx
import Header from "@/components/_Header";
import Footer from "@/components/_Footer";
import Button from "@/components/_Button";
import StickyNotesCard from "@/components/_StickyNotesCard";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Play,
    Smartphone,
    ArrowRight,
    CheckCircle,
    Calendar,
    TrendingUp,
    Target,
    Zap,
    Trophy
} from "lucide-react";

const Index = () => {
    const navigate = useNavigate();

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

    // Mock leaderboard data with avatars and task completion counts
    const leaderboardData = [
        {
            id: 1,
            name: "Alex Johnson",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            tasksCompleted: 247,
            rank: 1
        },
        {
            id: 2,
            name: "Sarah Chen",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            tasksCompleted: 231,
            rank: 2
        },
        {
            id: 3,
            name: "Marcus Williams",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            tasksCompleted: 218,
            rank: 3
        },
        {
            id: 4,
            name: "Emma Rodriguez",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            tasksCompleted: 204,
            rank: 4
        },
        {
            id: 5,
            name: "David Kim",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            tasksCompleted: 189,
            rank: 5
        },
        {
            id: 6,
            name: "Olivia Taylor",
            avatar: "https://randomuser.me/api/portraits/women/6.jpg",
            tasksCompleted: 175,
            rank: 6
        },
        {
            id: 7,
            name: "James Wilson",
            avatar: "https://randomuser.me/api/portraits/men/7.jpg",
            tasksCompleted: 162,
            rank: 7
        },
        {
            id: 8,
            name: "Isabella Martinez",
            avatar: "https://randomuser.me/api/portraits/women/8.jpg",
            tasksCompleted: 148,
            rank: 8
        },
        {
            id: 9,
            name: "William Brown",
            avatar: "https://randomuser.me/api/portraits/men/9.jpg",
            tasksCompleted: 135,
            rank: 9
        },
        {
            id: 10,
            name: "Sophia Lee",
            avatar: "https://randomuser.me/api/portraits/women/10.jpg",
            tasksCompleted: 122,
            rank: 10
        }
    ];

    const getRankBadge = rank => {
        const badges = {
            1: {
                text: "1st",
                className: "bg-yellow-100 text-yellow-700 border-yellow-300"
            },
            2: {
                text: "2nd",
                className: "bg-gray-100 text-gray-600 border-gray-300"
            },
            3: {
                text: "3rd",
                className: "bg-amber-100 text-amber-700 border-amber-300"
            }
        };

        if (rank <= 3) {
            const badge = badges[rank];
            return (
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${badge.className}`}
                >
                    {badge.text}
                </div>
            );
        }

        return (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-semibold text-gray-500 bg-gray-100 border border-gray-200">
                {rank}
            </div>
        );
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Split data into left (1-5) and right (6-10)
    const leftColumnData = leaderboardData.slice(0, 5);
    const rightColumnData = leaderboardData.slice(5, 10);

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
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
                    <motion.h1
                        className="font-logo text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide"
                        style={{ fontWeight: 700 }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-secondary">Track Your</span>
                        <span className="text-primary block">
                            Daily Progress
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Build custom task lists, check in every day, and stay
                        consistent with DoTrack's simple tracking system.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link to="/signup">
                            <Button variant="primary" icon={Play}>
                                Start Tracking
                            </Button>
                        </Link>
                        <Link to="/coming-soon">
                            <Button variant="outline" icon={Smartphone}>
                                Download App
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-8 bg-white">
                <div className="border-[16px] border-amber-700 rounded-sm shadow-2xl mx-auto max-w-6xl">
                    <div className="border-[6px] border-amber-900 rounded-sm">
                        <div className="bg-emerald-900 px-10 py-16 relative overflow-hidden rounded-sm">
                            {/* Chalk residue effect */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_20%_30%,_white_0%,_transparent_50%),_radial-gradient(ellipse_at_80%_70%,_white_0%,_transparent_50%),_radial-gradient(ellipse_at_40%_85%,_white_0%,_transparent_60%),_radial-gradient(ellipse_at_60%_15%,_white_0%,_transparent_50%)]" />
                                <div className="absolute top-1/4 left-0 w-full h-12 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm rotate-3" />
                                <div className="absolute top-2/3 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm -rotate-2" />
                                <div className="absolute top-10 left-1/4 w-px h-20 bg-white/20 blur-[1px] rotate-12" />
                                <div className="absolute top-20 left-2/3 w-px h-32 bg-white/15 blur-[1px] -rotate-6" />
                                <div className="absolute top-32 left-16 w-24 h-16 bg-white/5 rounded-full blur-xl" />
                                <div className="absolute bottom-20 right-12 w-32 h-20 bg-white/6 rounded-full blur-xl" />

                                {/* Chalk speckles */}
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute bg-white rounded-full"
                                        style={{
                                            width: `${Math.random() * 4 + 1}px`,
                                            height: `${Math.random() * 4 + 1}px`,
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            opacity: Math.random() * 0.1 + 0.02
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10">
                                <motion.div
                                    className="text-center mb-16"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="text-4xl md:text-5xl mb-4 tracking-wide font-bold text-white">
                                        How{" "}
                                        <span className="text-green-400">
                                            DoTrack
                                        </span>{" "}
                                        Works?
                                    </h2>
                                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                                        Simple, effective, and designed to keep
                                        you on track
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-80px" }}
                                >
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            variants={fadeInUp}
                                        >
                                            <StickyNotesCard
                                                icon={feature.icon}
                                                title={feature.title}
                                                description={
                                                    feature.description
                                                }
                                                index={index}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboards Section */}
            <section className="py-20 px-4 relative bg-bgLight overflow-hidden">
                {/* Ruled lines background - paper style */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-blue-300/30"
                            style={{ top: `${i * 32 + 60}px` }}
                        />
                    ))}
                    {/* Left red margin line */}
                    <div className="absolute top-0 bottom-0 left-32 w-px bg-red-400/30" />
                    {/* Top red margin line */}
                    <div className="absolute top-20 left-0 right-0 h-px bg-red-400/30" />
                    {/* Torn paper edge effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bgLight to-transparent" />
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    {/* Header - centered title */}
                    <div className="text-center mb-6">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-bold text-secondary font-logo tracking-wide"
                        >
                            Leaderboards
                        </motion.h2>
                        <div className="w-24 h-0.5 bg-secondary/30 mx-auto mt-2" />
                    </div>

                    {/* View Leaderboards button with border bottom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-end mb-10"
                    >
                        <button
                            onClick={() => navigate("/leaderboards")}
                            className="inline-flex items-center gap-2 text-primary hover:text-red-700 font-bold transition-colors group text-md border-b border-primary/30 pb-1"
                        >
                            View Leaderboards
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Two column layout - Left: 1-5, Right: 6-10 */}
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column - Ranks 1-5 */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            {leftColumnData.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 py-2 border-b border-gray-200/50 last:border-0"
                                >
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0">
                                        {getRankBadge(user.rank)}
                                    </div>

                                    {/* Avatar */}
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                                    />

                                    {/* Name and Tasks */}
                                    <div className="flex-1">
                                        <h3 className="text-secondary font-semibold text-base">
                                            {user.name}
                                        </h3>
                                        <p className="text-primary text-md font-medium">
                                            {user.tasksCompleted}{" "}
                                            <span className="text-sm text-secondary font-medium">
                                                task completed
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Right Column - Ranks 6-10 */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            {rightColumnData.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 py-2 border-b border-gray-200/50 last:border-0"
                                >
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0">
                                        {getRankBadge(user.rank)}
                                    </div>

                                    {/* Avatar */}
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                                    />

                                    {/* Name and Tasks */}
                                    <div className="flex-1">
                                        <h3 className="text-secondary font-semibold text-base">
                                            {user.name}
                                        </h3>
                                        <p className="text-primary text-md font-medium">
                                            {user.tasksCompleted}{" "}
                                            <span className="text-sm text-secondary font-medium">
                                                task completed
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-primary">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.h2
                        className="font-logo text-4xl md:text-5xl text-white mb-4 tracking-wide"
                        style={{ fontWeight: 700 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Start Your Journey?
                    </motion.h2>
                    <motion.p
                        className="text-white/90 text-lg mb-8"
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
                        <Link to="/signup">
                            <Button
                                variant="outline"
                                icon={ArrowRight}
                                className="bg-white text-primary hover:bg-gray-100 mx-auto"
                            >
                                Join DoTrack
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Index;

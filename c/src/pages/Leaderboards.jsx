// src/pages/Leaderboards.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabase";
import leaderboardService from "@/services/leaderboardService";

const Leaderboards = () => {
    const navigate = useNavigate();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getInitials = full_name => {
        if (!full_name) return "??";
        const names = full_name.trim().split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (
            names[0].charAt(0) + names[names.length - 1].charAt(0)
        ).toUpperCase();
    };

    const getAvatarGradient = rank => {
        const gradients = {
            1: "from-yellow-400 to-yellow-600",
            2: "from-gray-400 to-gray-600",
            3: "from-amber-400 to-amber-600"
        };
        return gradients[rank] || "from-primary to-primary/70";
    };

    const getRankDisplay = rank => {
        if (rank === 1) return "1st";
        if (rank === 2) return "2nd";
        if (rank === 3) return "3rd";
        return `${rank}th`;
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                // Fetch leaderboard data
                const data = await leaderboardService.getLeaderboard(100);
                setLeaderboardData(data);

                // Check Supabase auth session
                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (user) {
                    setIsLoggedIn(true);
                    setCurrentUserId(user.id);
                } else {
                    setIsLoggedIn(false);
                    setCurrentUserId(null);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
                setLeaderboardData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const UserAvatar = ({ user, rank }) => {
        const initials = getInitials(user.full_name);

        if (user.avatar) {
            return (
                <img
                    src={user.avatar}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                    onError={e => {
                        e.target.style.display = "none";
                        const fallback = e.target.parentElement?.querySelector(
                            ".initials-avatar"
                        );
                        if (fallback) fallback.style.display = "flex";
                    }}
                />
            );
        }

        return (
            <div
                className={`initials-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br ${getAvatarGradient(rank)} ring-2 ring-white/20`}
            >
                {initials}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-bgLight relative overflow-hidden">
            {/* Ruled lines background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-px bg-blue-300/30"
                        style={{ top: `${i * 32 + 60}px` }}
                    />
                ))}
                <div className="absolute top-0 bottom-0 left-32 w-px bg-red-400/30" />
                <div className="absolute top-20 left-0 right-0 h-px bg-red-400/30" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bgLight to-transparent" />
            </div>

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/")}
                className="fixed top-8 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-all duration-300 bg-transparent"
            >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Home</span>
            </motion.button>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 pt-24 relative z-10">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                )}

                {/* Chalkboard */}
                {!loading && (
                    <div className="relative max-w-4xl mx-auto">
                        <div className="border-[16px] border-amber-700 rounded-sm shadow-2xl">
                            <div className="border-[6px] border-amber-900 rounded-sm">
                                <div className="bg-emerald-900 px-6 py-8 relative overflow-hidden rounded-sm min-h-[500px]">
                                    {/* Chalk texture */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_20%_30%,_white_0%,_transparent_50%),_radial-gradient(ellipse_at_80%_70%,_white_0%,_transparent_50%)]" />
                                        <div className="absolute top-1/4 left-0 w-full h-12 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm rotate-3" />
                                        <div className="absolute top-2/3 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm -rotate-2" />
                                        {[...Array(30)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute bg-white rounded-full"
                                                style={{
                                                    width: `${Math.random() * 2 + 1}px`,
                                                    height: `${Math.random() * 2 + 1}px`,
                                                    top: `${Math.random() * 100}%`,
                                                    left: `${Math.random() * 100}%`,
                                                    opacity:
                                                        Math.random() * 0.15 +
                                                        0.02
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <div className="relative z-10 text-center mb-6">
                                        <h1 className="text-4xl md:text-5xl font-bold text-white font-logo tracking-wide drop-shadow-lg">
                                            Leaderboards
                                        </h1>
                                        <div className="w-24 h-0.5 bg-white/30 mx-auto mt-2" />
                                    </div>

                                    {/* Rankings */}
                                    <div className="relative z-10 max-h-[450px] overflow-y-auto custom-scrollbar">
                                        {/* Column headers */}
                                        <div className="grid grid-cols-12 gap-4 pb-3 mb-3 border-b border-white/20 sticky top-0 bg-emerald-900">
                                            <div className="col-span-3 text-white/70 text-sm font-medium">
                                                Rank
                                            </div>
                                            <div className="col-span-7 text-white/70 text-sm font-medium">
                                                Name
                                            </div>
                                            <div className="col-span-2 text-right text-white/70 text-sm font-medium">
                                                Tasks
                                            </div>
                                        </div>

                                        {/* Rows */}
                                        <div className="space-y-3">
                                            {leaderboardData.length > 0 ? (
                                                leaderboardData.map(
                                                    (user, index) => (
                                                        <motion.div
                                                            key={user.user_id}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -20
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                                delay: Math.min(
                                                                    index * 0.01,
                                                                    0.5
                                                                )
                                                            }}
                                                            className="grid grid-cols-12 gap-4 items-center py-2 border-b border-white/10"
                                                        >
                                                            {/* Rank */}
                                                            <div className="col-span-3">
                                                                <span className="text-white text-base font-medium">
                                                                    {getRankDisplay(
                                                                        user.rank
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {/* Avatar + Name */}
                                                            <div className="col-span-7 flex items-center gap-3">
                                                                <UserAvatar
                                                                    user={user}
                                                                    rank={
                                                                        user.rank
                                                                    }
                                                                />
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-white text-base">
                                                                        {
                                                                            user.full_name
                                                                        }
                                                                    </span>
                                                                    {isLoggedIn &&
                                                                        currentUserId &&
                                                                        user.user_id ===
                                                                            currentUserId && (
                                                                            <span className="text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">
                                                                                You
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>

                                                            {/* Tasks count */}
                                                            <div className="col-span-2 text-right whitespace-nowrap">
                                                                <span className="text-white font-bold text-xl">
                                                                    {
                                                                        user.total_completed
                                                                    }
                                                                </span>
                                                                <span className="text-white/70 font-bold text-xs ml-1">
                                                                    {user.total_completed ===
                                                                    1
                                                                        ? "task"
                                                                        : "tasks"}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )
                                            ) : (
                                                <div className="text-center py-12 text-white/60">
                                                    <p>No users yet — be the first!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Join Now button (guests only) */}
                                    {!isLoggedIn && leaderboardData.length > 0 && (
                                        <div className="absolute bottom-6 right-6 z-20">
                                            <button
                                                onClick={() =>
                                                    navigate("/signup")
                                                }
                                                className="group relative px-8 py-3 text-white text-xl font-bold transition-all"
                                            >
                                                <span className="relative">
                                                    Join Now!
                                                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white/60 rounded-full group-hover:bg-white/80 transition-all" />
                                                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300">
                                                        <span className="absolute inset-0 bg-white blur-[2px] rounded-full" />
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Join Now centered (guests + empty) */}
                                    {!isLoggedIn &&
                                        leaderboardData.length === 0 && (
                                            <div className="relative z-20 text-center pt-8 pb-4">
                                                <button
                                                    onClick={() =>
                                                        navigate("/signup")
                                                    }
                                                    className="group relative px-8 py-3 text-white text-xl font-bold transition-all mx-auto inline-block"
                                                >
                                                    <span className="relative">
                                                        Join Now!
                                                        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white/60 rounded-full group-hover:bg-white/80 transition-all" />
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboards;
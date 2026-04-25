// src/pages/ChallengeDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Target, Calendar, Lock } from "lucide-react";
import StickyNotesCard from "@/components/_StickyNotesCard";
import challengeService from "@/services/challengeService";

// Paper texture matching TodoListPaper
const paperStyle = {
    background: "#faf6f0",
    backgroundImage: `
        repeating-linear-gradient(
            transparent,
            transparent 31px,
            #c9d4e0 31px,
            #c9d4e0 32px
        )
    `,
    backgroundSize: "100% 32px"
};

const redMarginStyle = {
    position: "absolute",
    top: 0,
    left: "52px",
    bottom: 0,
    width: "1px",
    background: "rgba(220,80,80,0.45)",
    pointerEvents: "none"
};

const ChallengeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentDay, setCurrentDay] = useState(1);
    const [direction, setDirection] = useState("right");
    const [flipping, setFlipping] = useState(false);
    const [dayTaskState, setDayTaskState] = useState({});
    const [savingProgress, setSavingProgress] = useState(false);
    const [maxUnlockedDay, setMaxUnlockedDay] = useState(1);

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    const fetchChallenge = async () => {
        try {
            setLoading(true);
            const response = await challengeService.getChallenge(id);
            setChallenge(response.challenge);
            
            // Calculate current day based on creation date
            const createdAt = new Date(response.challenge.createdAt);
            const today = new Date();
            const daysDiff = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;
            const calculatedDay = Math.min(response.challenge.duration, Math.max(1, daysDiff));
            setCurrentDay(calculatedDay);
            setMaxUnlockedDay(calculatedDay);
            
            // Load saved progress
            if (response.challenge.progress) {
                setDayTaskState(response.challenge.progress);
            }
            
            setError("");
        } catch (err) {
            console.error("Error fetching challenge:", err);
            setError(err.message || "Failed to load challenge");
        } finally {
            setLoading(false);
        }
    };

    const handleTaskToggle = async (taskIndex) => {
        if (!challenge || savingProgress) return;
        
        // Only allow toggling tasks on the current day (the day user is viewing)
        // But they can only toggle tasks if that day is unlocked AND it's not a future day
        // Actually, they can only toggle tasks on the current day (maxUnlockedDay)
        // But we want to allow editing past days? Let's restrict to only the max unlocked day
        if (currentDay !== maxUnlockedDay) return;
        
        const newCompleted = !dayTaskState[currentDay]?.[taskIndex];
        
        // Optimistically update UI
        setDayTaskState(prev => ({
            ...prev,
            [currentDay]: {
                ...prev[currentDay],
                [taskIndex]: newCompleted
            }
        }));
        
        // Save to backend
        setSavingProgress(true);
        try {
            await challengeService.updateProgress(
                challenge.id,
                currentDay,
                taskIndex,
                newCompleted
            );
            
            // After saving, check if all tasks are completed and we can unlock next day
            const updatedTasks = {
                ...dayTaskState,
                [currentDay]: {
                    ...dayTaskState[currentDay],
                    [taskIndex]: newCompleted
                }
            };
            
            const currentDayTasks = updatedTasks[currentDay] || {};
            const completedCount = Object.values(currentDayTasks).filter(Boolean).length;
            const allCompleted = completedCount === challenge.tasks.length;
            
            // If all tasks completed and current day equals maxUnlockedDay and not last day
            if (allCompleted && currentDay === maxUnlockedDay && currentDay < challenge.duration) {
                // Unlock next day
                setMaxUnlockedDay(prev => prev + 1);
            }
        } catch (err) {
            console.error("Error saving progress:", err);
            // Revert on error
            setDayTaskState(prev => ({
                ...prev,
                [currentDay]: {
                    ...prev[currentDay],
                    [taskIndex]: !newCompleted
                }
            }));
        } finally {
            setSavingProgress(false);
        }
    };

    const goToPrev = () => {
        if (currentDay <= 1 || flipping) return;
        setFlipping(true);
        setDirection("left");
        setTimeout(() => {
            setCurrentDay(d => d - 1);
            setFlipping(false);
        }, 320);
    };

    const goToNext = () => {
        // Can only go to next day if it's unlocked (<= maxUnlockedDay)
        if (currentDay >= maxUnlockedDay || flipping) return;
        setFlipping(true);
        setDirection("right");
        setTimeout(() => {
            setCurrentDay(d => d + 1);
            setFlipping(false);
        }, 320);
    };

    const isToday = challenge && currentDay === maxUnlockedDay;
    const isPastFirst = currentDay > 1;
    const canGoNext = currentDay < maxUnlockedDay;
    const isFutureLocked = currentDay > maxUnlockedDay;

    // Get previous day's stats
    const prevDayTasks = dayTaskState[currentDay - 1] || {};
    const prevCompletedCount = Object.values(prevDayTasks).filter(Boolean).length;
    const prevMissedCount = challenge ? challenge.tasks.length - prevCompletedCount : 0;

    const tasksForDay = dayTaskState[currentDay] || {};
    const completedCount = Object.values(tasksForDay).filter(Boolean).length;
    const totalTasks = challenge?.tasks.length || 0;
    const allCompletedToday = completedCount === totalTasks && totalTasks > 0;
    
    // Check if current day is locked (future day)
    const isLocked = currentDay > maxUnlockedDay;

    if (loading) {
        return (
            <div className="min-h-screen bg-white rounded-xl p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate("/challenges")}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Loading Challenge...
                            </h1>
                        </div>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading challenge details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <div className="min-h-screen bg-white rounded-xl p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate("/challenges")}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Error
                            </h1>
                        </div>
                    </div>
                    <div className="text-center py-16">
                        <p className="text-red-600 mb-4">{error || "Challenge not found"}</p>
                        <button
                            onClick={() => navigate("/challenges")}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700"
                        >
                            Back to Challenges
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white rounded-xl p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <button
                        onClick={() => navigate("/challenges")}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {challenge.title}
                        </h1>
                    </div>
                </motion.div>

                {/* Notebook container */}
                <div className="relative" style={{ perspective: "1200px" }}>
                    {/* Notebook spine shadow */}
                    <div
                        style={{
                            position: "absolute",
                            top: 8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "24px",
                            height: "100%",
                            background: "rgba(0,0,0,0.12)",
                            filter: "blur(6px)",
                            zIndex: 1,
                            borderRadius: "4px"
                        }}
                    />

                    {/* Two-page spread */}
                    <div
                        className="relative flex rounded-lg overflow-hidden"
                        style={{
                            boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
                            minHeight: "520px"
                        }}
                    >
                        {/* LEFT PAGE - Summary */}
                        <div
                            className="flex-1 relative overflow-hidden"
                            style={{
                                ...paperStyle,
                                borderRight: "2px solid #d1c9b8",
                                boxShadow: "inset -4px 0 12px rgba(0,0,0,0.06)"
                            }}
                        >
                            <div style={redMarginStyle} />
                            
                            {/* Spiral holes */}
                            {[12, 25, 38, 50, 62, 75, 88].map((pct, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        right: "-8px",
                                        top: `${pct}%`,
                                        width: "16px",
                                        height: "16px",
                                        borderRadius: "50%",
                                        background: "#d4cbb8",
                                        border: "2px solid #b8af98",
                                        zIndex: 10,
                                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)"
                                    }}
                                />
                            ))}

                            <div className="p-5 pt-8 pl-10 relative z-10">
                                {currentDay > 1 ? (
                                    <>
                                        {/* Summary title */}
                                        <div className="mb-4">
                                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                                Summary
                                            </div>
                                            <div className="text-sm font-medium text-gray-600 mt-1">
                                                Day {String(currentDay - 1).padStart(2, "0")}
                                            </div>
                                        </div>
                                        
                                        {/* Completed tasks sticky note */}
                                        <div className="mb-3">
                                            <StickyNotesCard
                                                icon={CheckCircle2}
                                                title={`${prevCompletedCount} Completed`}
                                                description={`Tasks successfully finished on Day ${String(currentDay - 1).padStart(2, "0")}`}
                                                index={0}
                                            />
                                        </div>
                                        
                                        {/* Missed tasks sticky note */}
                                        <div>
                                            <StickyNotesCard
                                                icon={Target}
                                                title={`${prevMissedCount} Missed`}
                                                description={`Tasks that need attention from Day ${String(currentDay - 1).padStart(2, "0")}`}
                                                index={1}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 text-sm italic pt-8">
                                        <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                                        No previous day data
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT PAGE - Current day tasks */}
                        <div
                            className="flex-1 relative overflow-hidden"
                            style={{
                                ...paperStyle,
                                boxShadow: "inset 4px 0 12px rgba(0,0,0,0.04)"
                            }}
                        >
                            <div style={redMarginStyle} />
                            
                            {/* Scotch tape at top */}
                            <div className="absolute -top-3 left-5 z-30">
                                <div
                                    style={{
                                        width: "52px",
                                        height: "22px",
                                        borderRadius: "2px",
                                        background: "rgba(210,180,140,0.38)",
                                        backdropFilter: "blur(1px)",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(180,140,100,0.18)",
                                        transform: "rotate(-2deg)",
                                        backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.18) 0px,rgba(255,255,255,0.18) 3px,transparent 3px,transparent 8px)",
                                    }}
                                />
                            </div>

                            {/* Lock overlay for future days */}
                            {isLocked && (
                                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <Lock size={48} className="text-white mb-3" />
                                    <p className="text-white font-semibold text-lg">Locked</p>
                                    <p className="text-white/80 text-sm mt-1">Complete Day {maxUnlockedDay} to unlock</p>
                                </div>
                            )}

                            {/* Congratulatory sticky note (bottom right) */}
                            <AnimatePresence>
                                {allCompletedToday && currentDay === maxUnlockedDay && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, rotate: 2 }}
                                        animate={{ opacity: 1, y: 0, rotate: 2 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-4 right-4 z-20"
                                    >
                                        <StickyNotesCard
                                            isExcellent={true}
                                            description="All tasks completed today!"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Saving indicator */}
                            {savingProgress && (
                                <div className="absolute top-2 right-2 z-20 text-xs text-gray-400">
                                    Saving...
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentDay}
                                    initial={
                                        direction === "right"
                                            ? { rotateY: -90, opacity: 0 }
                                            : { rotateY: 90, opacity: 0 }
                                    }
                                    animate={{ rotateY: 0, opacity: 1 }}
                                    exit={
                                        direction === "right"
                                            ? { rotateY: 90, opacity: 0 }
                                            : { rotateY: -90, opacity: 0 }
                                    }
                                    transition={{
                                        duration: 0.32,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    style={{
                                        transformOrigin: direction === "right" ? "left center" : "right center"
                                    }}
                                    className="absolute inset-0 z-10"
                                >
                                    {/* Dashed divider */}
                                    <div className="border-t border-dashed border-primary mt-5 mx-5" />

                                    <div className="pt-5 pb-16 px-5">
                                        {/* Title row with day */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-7 flex-shrink-0" />
                                            <h2 className="text-lg font-bold text-gray-800 leading-tight text-center flex-1">
                                                Day {String(currentDay).padStart(2, "0")}
                                                {isToday && !isLocked && (
                                                    <span className="text-xs font-normal text-gray-400 ml-2">(Today)</span>
                                                )}
                                                {isLocked && (
                                                    <span className="text-xs font-normal text-gray-400 ml-2">(Locked)</span>
                                                )}
                                            </h2>
                                            <div className="w-7 flex-shrink-0" />
                                        </div>

                                        {/* Task checkboxes */}
                                        <div className="space-y-3">
                                            {challenge.tasks.map((task, i) => {
                                                const done = tasksForDay[i] || false;
                                                const canEdit = !isLocked && currentDay === maxUnlockedDay;
                                                
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`flex items-center gap-3 ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                                        onClick={() => canEdit && handleTaskToggle(i)}
                                                    >
                                                        <div
                                                            className="relative flex-shrink-0 w-5 h-5 rounded border-2 border-secondary flex items-center justify-center"
                                                            style={{ backgroundColor: "transparent" }}
                                                        >
                                                            {done && (
                                                                <motion.svg
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                                                    className="w-5 h-5 text-primary"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M4 13l5 5L20 6" />
                                                                </motion.svg>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-sm relative leading-none ${
                                                                done ? "text-gray-400" : (isLocked ? "text-gray-400" : "text-gray-700")
                                                            }`}
                                                            style={{ display: "inline-flex", alignItems: "center" }}
                                                        >
                                                            {task}
                                                            {done && (
                                                                <motion.svg
                                                                    initial={{ scaleX: 0 }}
                                                                    animate={{ scaleX: 1 }}
                                                                    transition={{ duration: 0.18 }}
                                                                    className="absolute left-0 w-full text-primary pointer-events-none"
                                                                    height="8"
                                                                    style={{
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        transformOrigin: "left center",
                                                                    }}
                                                                    preserveAspectRatio="none"
                                                                >
                                                                    <path
                                                                        d="M0,4 L8,1 L16,7 L24,1 L32,7 L40,1 L48,7 L56,1 L64,7 L72,1 L80,7 L88,1 L96,7 L104,1 L112,7 L120,1 L128,7 L136,1 L144,7 L152,1 L160,7 L168,1 L176,7 L184,1 L192,7 L200,1"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.8"
                                                                        fill="none"
                                                                        vectorEffect="non-scaling-stroke"
                                                                    />
                                                                </motion.svg>
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Navigation buttons inside the paper - dark bg overlay style */}
                    <div className="absolute inset-y-0 left-0 flex items-center z-20">
                        <button
                            onClick={goToPrev}
                            disabled={!isPastFirst || flipping}
                            className={`flex items-center justify-center w-10 h-10 rounded-r-lg transition-all ${
                                isPastFirst && !flipping
                                    ? "bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer"
                                    : "bg-gray-300/30 cursor-not-allowed"
                            }`}
                            style={{ marginLeft: "-1px" }}
                        >
                            <ChevronLeft size={20} className={isPastFirst && !flipping ? "text-white" : "text-gray-400"} />
                        </button>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center z-20">
                        <button
                            onClick={goToNext}
                            disabled={!canGoNext || flipping}
                            className={`flex items-center justify-center w-10 h-10 rounded-l-lg transition-all ${
                                canGoNext && !flipping
                                    ? "bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer"
                                    : "bg-gray-300/30 cursor-not-allowed"
                            }`}
                            style={{ marginRight: "-1px" }}
                        >
                            <ChevronRight size={20} className={canGoNext && !flipping ? "text-white" : "text-gray-400"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetails;
// src/pages/ChallengeDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Target, Calendar } from "lucide-react";
import StickyNotesCard from "@/components/_StickyNotesCard";

// Sample challenge data
const getChallengeData = id => {
    const challenges = {
        1: {
            id: 1,
            title: "30 Days of Fitness",
            tasks: [
                "Do 50 pushups",
                "Run 5km",
                "Meditate for 10 minutes",
                "Drink 3L water",
                "8 hours of sleep"
            ],
            duration: 30,
            completedTasks: 2,
            createdAt: "2024-01-01"
        },
        2: {
            id: 2,
            title: "Read 5 Books",
            tasks: [
                "Finish Atomic Habits",
                "Read Deep Work",
                "Complete The Psychology of Money",
                "Finish Project Hail Mary",
                "Read The Alchemist"
            ],
            duration: 20,
            completedTasks: 1,
            createdAt: "2024-01-15"
        },
        3: {
            id: 3,
            title: "Learn Coding",
            tasks: [
                "Complete React tutorial",
                "Build a project",
                "Learn JavaScript",
                "Study algorithms",
                "Contribute to open source"
            ],
            duration: 30,
            completedTasks: 0,
            createdAt: "2024-02-01"
        }
    };
    return challenges[id] || challenges[1];
};

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
    const challenge = getChallengeData(id);

    const todayDay = Math.min(
        challenge.duration,
        Math.max(
            1,
            Math.floor(
                (new Date() - new Date(challenge.createdAt)) /
                    (1000 * 60 * 60 * 24)
            ) + 1
        )
    );

    const [currentDay, setCurrentDay] = useState(todayDay);
    const [direction, setDirection] = useState("right");
    const [flipping, setFlipping] = useState(false);
    const [dayTaskState, setDayTaskState] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem(`challenge_${id}_tasks`);
        if (saved) {
            setDayTaskState(JSON.parse(saved));
        }
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`challenge_${id}_tasks`, JSON.stringify(dayTaskState));
    }, [id, dayTaskState]);

    const tasksForDay = dayTaskState[currentDay] || {};
    const completedCount = Object.values(tasksForDay).filter(Boolean).length;
    const totalTasks = challenge.tasks.length;
    const allCompletedToday = completedCount === totalTasks && totalTasks > 0;

    const handleTaskToggle = taskIndex => {
        setDayTaskState(prev => ({
            ...prev,
            [currentDay]: {
                ...prev[currentDay],
                [taskIndex]: !prev[currentDay]?.[taskIndex]
            }
        }));
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
        if (currentDay >= todayDay || flipping) return;
        setFlipping(true);
        setDirection("right");
        setTimeout(() => {
            setCurrentDay(d => d + 1);
            setFlipping(false);
        }, 320);
    };

    const isToday = currentDay === todayDay;
    const isPastFirst = currentDay > 1;

    // Get previous day's stats
    const prevDayTasks = dayTaskState[currentDay - 1] || {};
    const prevCompletedCount = Object.values(prevDayTasks).filter(Boolean).length;
    const prevMissedCount = totalTasks - prevCompletedCount;

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

                        {/* RIGHT PAGE - Current day tasks (matching TodoListPaper exactly) */}
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

                            {/* Congratulatory sticky note (top right) */}
                            <AnimatePresence>
                                {allCompletedToday && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, rotate: -2 }}
                                        animate={{ opacity: 1, y: 0, rotate: -2 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-4 right-4 z-20"
                                    >
                                        <StickyNotesCard
                                            icon={CheckCircle2}
                                            title="All done!"
                                            description="Great job completing today's tasks"
                                            index={2}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                                {isToday && (
                                                    <span className="text-xs font-normal text-gray-400 ml-2">(Today)</span>
                                                )}
                                            </h2>
                                            <div className="w-7 flex-shrink-0" />
                                        </div>

                                        {/* Task checkboxes - EXACT match to TodoListPaper */}
                                        <div className="space-y-3">
                                            {challenge.tasks.map((task, i) => {
                                                const done = tasksForDay[i] || false;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => handleTaskToggle(i)}
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
                                                                done ? "text-gray-400" : "text-gray-700"
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
                            disabled={isToday || flipping}
                            className={`flex items-center justify-center w-10 h-10 rounded-l-lg transition-all ${
                                !isToday && !flipping
                                    ? "bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer"
                                    : "bg-gray-300/30 cursor-not-allowed"
                            }`}
                            style={{ marginRight: "-1px" }}
                        >
                            <ChevronRight size={20} className={!isToday && !flipping ? "text-white" : "text-gray-400"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetails;
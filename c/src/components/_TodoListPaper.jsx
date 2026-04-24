// src/components/_TodoListPaper.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const TodoListPaper = ({ title, items = [], onItemToggle, className = "" }) => {
    const [checkedItems, setCheckedItems] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    // phases: "idle" | "cutting" | "falling" | "done"
    const [phase, setPhase] = useState("idle");

    const handleToggle = itemId => {
        setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
        if (onItemToggle) onItemToggle(itemId);
    };

    const handleRemove = () => {
        setMenuOpen(false);
        setPhase("cutting");
    };

    const getEarliestExpiration = () => {
        const withExpiry = items.filter(i => i.expiresIn);
        if (!withExpiry.length) return null;
        const toMins = ({ value, unit }) =>
            unit === "minutes" ? value : unit === "hours" ? value * 60 : value * 1440;
        const sorted = [...withExpiry].sort(
            (a, b) => toMins(a.expiresIn) - toMins(b.expiresIn)
        );
        const { value, unit } = sorted[0].expiresIn;
        if (unit === "minutes") return `${value}mins`;
        if (unit === "hours") return `${value}hrs`;
        if (unit === "days") return `${value} day${value > 1 ? "s" : ""}`;
        return `${value} ${unit}`;
    };

    const earliestExpiry = getEarliestExpiration();

    // CUT_Y matches the dashed border: pt-5 = 20px from top of paper
    const CUT_Y = 20;

    const isDone = phase === "done";

    return (
        <div
            className={`relative ${className}`}
            style={{ minHeight: isDone ? `${CUT_Y + 18}px` : undefined }}
        >
            {/* ── Scotch tape — top LEFT, always stays ── */}
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
                        /* subtle fiber lines to look like tape */
                        backgroundImage:
                            "repeating-linear-gradient(90deg,rgba(255,255,255,0.18) 0px,rgba(255,255,255,0.18) 3px,transparent 3px,transparent 8px)",
                    }}
                />
            </div>

            {/* ══ TOP STUB — always stays (tape holds it) ══ */}
            <div
                className="relative bg-bgLight overflow-hidden"
                style={{
                    borderRadius: "4px",
                    // Once cut, clip to show only the header portion
                    height: isDone ? `${CUT_Y}px` : undefined,
                    overflow: isDone ? "hidden" : undefined,
                }}
            >
                {/* Ruled lines */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-px bg-blue-200/40"
                            style={{ top: `${i * 32 + 96}px` }}
                        />
                    ))}
                    <div className="absolute top-0 bottom-0 left-10 w-px bg-red-300/40" />
                </div>

                {/* ── Content ── */}
                <div className="relative z-10 pt-5 pb-16 px-5">

                    {/* Dashed divider — ABOVE title */}
                    <div className="border-t border-dashed border-primary mb-3" />

                    {/* Title row — centered, menu on right */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-7 flex-shrink-0" />
                        <h2 className="text-lg font-bold text-gray-800 leading-tight text-center flex-1">
                            "{title}"
                        </h2>
                        {/* ··· menu */}
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setMenuOpen(p => !p)}
                                className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={phase !== "idle"}
                            >
                                <MoreHorizontal size={18} />
                            </button>
                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                        transition={{ duration: 0.13 }}
                                        className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-gray-100 overflow-hidden z-50"
                                        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                                    >
                                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Pencil size={13} className="text-primary" />
                                            Edit
                                        </button>
                                        <div className="h-px bg-gray-100" />
                                        <button
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            onClick={handleRemove}
                                        >
                                            <Trash2 size={13} />
                                            Remove
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Todo items — hidden after cut */}
                    {!isDone && (
                        <div className="space-y-3">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => handleToggle(item.id)}
                                >
                                    <div
                                        className="relative flex-shrink-0 w-5 h-5 rounded border-2 border-secondary flex items-center justify-center"
                                        style={{ backgroundColor: "transparent" }}
                                    >
                                        {checkedItems[item.id] && (
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
                                            checkedItems[item.id] ? "text-gray-400" : "text-gray-700"
                                        }`}
                                        style={{ display: "inline-flex", alignItems: "center" }}
                                    >
                                        {item.text}
                                        {checkedItems[item.id] && (
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
                            ))}
                        </div>
                    )}
                </div>

                {!isDone && earliestExpiry && (
                    <div className="absolute bottom-4 right-5 flex flex-col items-end z-10">
                        <span className="text-xs text-gray-500">Expires in</span>
                        <span className="text-md font-bold text-primary leading-tight">{earliestExpiry}</span>
                    </div>
                )}
            </div>

            {/* ══ CUTTING LINE — draws across left-to-right ══ */}
            <AnimatePresence>
                {phase === "cutting" && (
                    <motion.div
                        key="cut-line"
                        className="absolute left-0 z-40 pointer-events-none"
                        style={{
                            top: `${CUT_Y}px`,
                            height: "2px",
                            background:
                                "repeating-linear-gradient(90deg,#374151 0px,#374151 7px,transparent 7px,transparent 12px)",
                            width: 0,
                        }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onAnimationComplete={() => setPhase("falling")}
                    />
                )}
            </AnimatePresence>

            {/* ══ BOTTOM PIECE — falls down after cut ══ */}
            <AnimatePresence>
                {phase === "falling" && (
                    <motion.div
                        key="falling-piece"
                        className="absolute left-0 right-0 z-20 bg-bgLight overflow-hidden"
                        style={{
                            top: `${CUT_Y}px`,
                            borderRadius: "0 0 4px 4px",
                        }}
                        initial={{ y: 0, rotate: 0, opacity: 1 }}
                        animate={{ y: 300, rotate: 7, opacity: 0 }}
                        transition={{ duration: 0.65, ease: "easeIn" }}
                        onAnimationComplete={() => setPhase("done")}
                    >
                        {/* Ruled lines */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-full h-px bg-blue-200/40"
                                    style={{ top: `${i * 32}px` }}
                                />
                            ))}
                            <div className="absolute top-0 bottom-0 left-10 w-px bg-red-300/40" />
                        </div>

                        {/* Todo items clone */}
                        <div className="relative z-10 pt-4 pb-16 px-5">
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div
                                            className="flex-shrink-0 w-5 h-5 rounded border-2 border-secondary"
                                            style={{ backgroundColor: "transparent" }}
                                        />
                                        <span className={`text-sm ${checkedItems[item.id] ? "text-gray-400" : "text-gray-700"}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {earliestExpiry && (
                            <div className="absolute bottom-4 right-5 flex flex-col items-end">
                                <span className="text-xs text-gray-500">Expires in</span>
                                <span className="text-md font-bold text-primary leading-tight">{earliestExpiry}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TodoListPaper;
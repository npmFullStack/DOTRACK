// src/components/_TodoListPaper.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2, Star } from "lucide-react";

const TodoListPaper = ({
    id,
    title,
    items = [],
    expiresIn = null,
    onItemToggle,
    onEdit,
    onDelete,
    className = ""
}) => {
    const [checkedItems, setCheckedItems] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [phase, setPhase] = useState("idle");
    const [showExcellentNote, setShowExcellentNote] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const initializedRef = useRef(false);
    useEffect(() => {
        if (!initializedRef.current) {
            const initial = {};
            items.forEach(item => { initial[item.id] = item.completed || false; });
            setCheckedItems(initial);
            initializedRef.current = true;
        }
    }, [items]);

    const allCompleted = items.length > 0 && items.every(item => checkedItems[item.id]);

    useEffect(() => {
        if (allCompleted && phase === "idle") {
            setShowExcellentNote(true);
            const t = setTimeout(() => setShowExcellentNote(false), 3000);
            return () => clearTimeout(t);
        } else {
            setShowExcellentNote(false);
        }
    }, [allCompleted, phase]);

    const handleToggle = (itemId, completed) => {
        setCheckedItems(prev => ({ ...prev, [itemId]: !completed }));
        if (onItemToggle) onItemToggle(itemId, !completed);
    };

    const handleRemove = () => {
        if (isDeleting) return;
        setMenuOpen(false);
        setIsDeleting(true);
        setPhase("cutting");
    };

    const handleFallComplete = async () => {
        setPhase("done");
        if (onDelete) await onDelete();
    };

    const getEarliestExpiration = () => {
        if (!expiresIn) return null;
        const { value, unit } = expiresIn;
        if (unit === "minutes") return `${value}min${value > 1 ? "s" : ""}`;
        if (unit === "hours") return `${value}hr${value > 1 ? "s" : ""}`;
        if (unit === "days") return `${value} day${value > 1 ? "s" : ""}`;
        return `${value} ${unit}`;
    };

    const earliestExpiry = getEarliestExpiration();
    const CUT_Y = 20;
    const isDone = phase === "done";

    return (
        <div className={`relative ${className}`}>
            <div className="absolute -top-3 left-5 z-30 pointer-events-none">
                <div style={{
                    width: "52px", height: "22px", borderRadius: "2px",
                    background: "rgba(210,180,140,0.38)",
                    backdropFilter: "blur(1px)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(180,140,100,0.18)",
                    transform: "rotate(-2deg)",
                    backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.18) 0px,rgba(255,255,255,0.18) 3px,transparent 3px,transparent 8px)"
                }} />
            </div>

            {!isDone && (
                <div className="absolute top-9 right-5 z-50">
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
                                className="absolute right-0 mt-1 w-36 rounded-xl border border-gray-100 overflow-hidden"
                                style={{
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                    backgroundColor: "#ffffff",
                                    zIndex: 9999
                                }}
                            >
                                <button
                                    onClick={() => { setMenuOpen(false); if (onEdit) onEdit(id); }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors"
                                    style={{ backgroundColor: "#ffffff" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
                                >
                                    <Pencil size={13} className="text-primary" />
                                    Edit
                                </button>
                                <div className="h-px bg-gray-100" />
                                <button
                                    onClick={handleRemove}
                                    disabled={isDeleting}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors"
                                    style={{ backgroundColor: "#ffffff" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff1f2"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
                                >
                                    <Trash2 size={13} />
                                    Remove
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div
                className="relative bg-bgLight overflow-hidden"
                style={{
                    borderRadius: "4px",
                    height: phase !== "idle" ? `${CUT_Y}px` : undefined,
                }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute w-full h-px bg-blue-200/40"
                            style={{ top: `${i * 32 + 96}px` }} />
                    ))}
                    <div className="absolute top-0 bottom-0 left-10 w-px bg-red-300/40" />
                </div>

                <div className="relative z-10 pt-5 pb-16 px-5">
                    <div className="border-t border-dashed border-primary mb-3" />

                    <div className="flex items-center justify-between mb-3">
                        <div className="w-7 flex-shrink-0" />
                        <h2 className="text-lg font-bold text-gray-800 leading-tight text-center flex-1">
                            "{title}"
                        </h2>
                        <div className="w-7 flex-shrink-0" />
                    </div>

                    <div className="space-y-3">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => handleToggle(item.id, checkedItems[item.id])}
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
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        >
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M4 13l5 5L20 6" />
                                        </motion.svg>
                                    )}
                                </div>
                                <span
                                    className={`text-sm relative leading-none ${checkedItems[item.id] ? "text-gray-400" : "text-gray-700"}`}
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
                                            style={{ top: "50%", transform: "translateY(-50%)", transformOrigin: "left center" }}
                                            preserveAspectRatio="none"
                                        >
                                            <path
                                                d="M0,4 L8,1 L16,7 L24,1 L32,7 L40,1 L48,7 L56,1 L64,7 L72,1 L80,7 L88,1 L96,7 L104,1 L112,7 L120,1 L128,7 L136,1 L144,7 L152,1 L160,7 L168,1 L176,7 L184,1 L192,7 L200,1"
                                                stroke="currentColor" strokeWidth="1.8" fill="none" vectorEffect="non-scaling-stroke"
                                            />
                                        </motion.svg>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between z-10">
                    <AnimatePresence>
                        {showExcellentNote && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5 bg-yellow-100 px-2 py-1 rounded-md border border-yellow-300"
                            >
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className="fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-yellow-800">Excellent!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex-1" />
                    {earliestExpiry && (
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">Expires in</span>
                            <span className="text-md font-bold text-primary leading-tight">{earliestExpiry}</span>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {phase === "cutting" && (
                    <motion.div
                        key="cut-line"
                        className="absolute left-0 z-40 pointer-events-none"
                        style={{
                            top: `${CUT_Y}px`, height: "2px",
                            background: "repeating-linear-gradient(90deg,#374151 0px,#374151 7px,transparent 7px,transparent 12px)",
                            width: 0
                        }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onAnimationComplete={() => setPhase("falling")}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === "falling" && (
                    <motion.div
                        key="falling-piece"
                        className="absolute left-0 right-0 z-20 bg-bgLight overflow-hidden"
                        style={{ top: `${CUT_Y}px`, borderRadius: "0 0 4px 4px" }}
                        initial={{ y: 0, rotate: 0, opacity: 1 }}
                        animate={{ y: 300, rotate: 7, opacity: 0 }}
                        transition={{ duration: 0.65, ease: "easeIn" }}
                        onAnimationComplete={handleFallComplete}
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="absolute w-full h-px bg-blue-200/40"
                                    style={{ top: `${i * 32}px` }} />
                            ))}
                            <div className="absolute top-0 bottom-0 left-10 w-px bg-red-300/40" />
                        </div>
                        <div className="relative z-10 pt-4 pb-16 px-5">
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-secondary"
                                            style={{ backgroundColor: "transparent" }} />
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
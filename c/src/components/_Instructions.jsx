// src/components/_Instructions.jsx
import React, { useState } from "react";
import { Calendar, Lightbulb, ListChecks, Clock, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StickyNotesCard from "./_StickyNotesCard";

const Instructions = ({
    title = "Instructions",
    icon: Icon = Calendar,
    variant = "primary",
    items = [],
    className = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const defaultItems = [
        {
            icon: ListChecks,
            title: "Task Title",
            description:
                "Give your task a clear, descriptive name to help organize your tasks."
        },
        {
            icon: Clock,
            title: "Task Items",
            description:
                "Add individual task items that need to be completed. You can add multiple items."
        },
        {
            icon: Calendar,
            title: "Expiration Date & Time",
            description:
                "Set when this task should expire. This helps prioritize urgent tasks.",
            tips: [
                "Less than 1 hour = minutes",
                "Less than 24 hours = hours",
                "More than 24 hours = days"
            ]
        }
    ];

    const displayItems = items.length > 0 ? items : defaultItems;

    const instructionCards = [
        {
            title: "How to Create a Task",
            description: "Click the + button to start creating a new task. Give it a clear title that represents what you need to accomplish."
        },
        {
            title: "Add Subtasks",
            description: "Break down your main task into smaller, manageable subtasks. Check them off as you complete each one."
        },
        {
            title: "Set Deadlines",
            description: "Use expiration times to prioritize urgent tasks. Choose minutes, hours, or days based on urgency."
        },
        {
            title: "Stay Organized",
            description: "Your tasks will appear as sticky notes on the main board. Complete them to feel accomplished!"
        }
    ];

    return (
        <>
            {/* Desktop: Normal paper with tape and sticky notes inside */}
            <div className={`relative hidden md:block ${className}`}>
                {/* Scotch tape - top center */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30">
                    <div
                        style={{
                            width: "52px",
                            height: "22px",
                            borderRadius: "2px",
                            background: "rgba(210,180,140,0.38)",
                            backdropFilter: "blur(1px)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(180,140,100,0.18)",
                            transform: "rotate(0deg)",
                            backgroundImage:
                                "repeating-linear-gradient(90deg,rgba(255,255,255,0.18) 0px,rgba(255,255,255,0.18) 3px,transparent 3px,transparent 8px)",
                        }}
                    />
                </div>

                {/* Paper body */}
                <div className="bg-bgLight rounded-sm pt-8 pb-6 px-5 border border-gray-200">
                    {/* Ruled line details */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-full h-px bg-blue-200"
                                style={{ top: `${i * 32 + 60}px` }}
                            />
                        ))}
                        <div className="absolute top-0 bottom-0 left-8 w-px bg-red-300" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 border-b border-dashed border-primary pb-2">
                            <Icon size={20} className="text-primary" />
                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                        </div>

                        <div className="space-y-4">
                            {displayItems.map((item, index) => (
                                <StickyNotesCard
                                    key={index}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-primary">
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <Lightbulb size={14} className="text-yellow-500" />
                                Pro Tips
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                                <li>Use specific deadlines for better time management</li>
                                <li>Break large tasks into smaller subtasks</li>
                                <li>Set realistic expiration times</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Floating Help Button with drawer */}
            <div className="md:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-red-700 transition-colors"
                >
                    <HelpCircle size={22} />
                </motion.button>

                <AnimatePresence>
                    {isExpanded && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsExpanded(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-bgLight rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto"
                            >
                                {/* Drawer handle */}
                                <div className="flex justify-center pt-3 pb-2">
                                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                                </div>

                                <div className="p-5 pt-2">
                                    <div className="flex items-center gap-2 mb-4 border-b border-dashed border-primary pb-2">
                                        <Icon size={20} className="text-primary" />
                                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {instructionCards.map((card, index) => (
                                            <div key={index} className="bg-white/80 rounded-lg p-4 shadow-sm">
                                                <h4 className="font-semibold text-gray-800 mb-2">{card.title}</h4>
                                                <p className="text-sm text-gray-600">{card.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-dashed border-primary">
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                            <Lightbulb size={14} className="text-yellow-500" />
                                            Pro Tips
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                                            <li>Use specific deadlines for better time management</li>
                                            <li>Break large tasks into smaller subtasks</li>
                                            <li>Set realistic expiration times</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Instructions;
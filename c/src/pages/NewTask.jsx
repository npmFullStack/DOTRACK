// src/pages/NewTask.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    HelpCircle,
    Check,
    FileText,
    ListChecks,
    Clock,
    Loader2
} from "lucide-react";
import DateTimePicker from "@/components/_DateTimePicker";
import Instructions from "@/components/_Instructions";
import Button from "@/components/_Button";
import StickyNotesCard from "@/components/_StickyNotesCard";
import taskService from "@/services/taskService";

const NewTask = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [taskItems, setTaskItems] = useState([{ id: Date.now(), text: "" }]);
    const [expiresAt, setExpiresAt] = useState(null);
    const [errors, setErrors] = useState({});
    const [showInstructions, setShowInstructions] = useState(false);
    const [loading, setLoading] = useState(false);

    const addTaskItem = () => {
        setTaskItems([...taskItems, { id: Date.now(), text: "" }]);
    };

    const removeTaskItem = id => {
        if (taskItems.length > 1) {
            setTaskItems(taskItems.filter(item => item.id !== id));
        }
    };

    const updateTaskItem = (id, text) => {
        setTaskItems(
            taskItems.map(item => (item.id === id ? { ...item, text } : item))
        );
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Task title is required";

        const emptyItems = taskItems.filter(item => !item.text.trim());
        if (emptyItems.length > 0) {
            newErrors.taskItems = "All task items must have a description";
        }

        if (!expiresAt)
            newErrors.expiresAt = "Expiration date & time is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const items = taskItems
                .filter(item => item.text.trim())
                .map(item => item.text.trim());

            await taskService.createTask(title, items, expiresAt);
            navigate("/todo");
        } catch (error) {
            console.error("Error creating task:", error);
            setErrors({
                submit:
                    error.message || "Failed to create task. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const instructionCards = [
        {
            icon: FileText,
            title: "Task Title",
            description:
                "Give your task a clear, descriptive name to help organize your tasks easily."
        },
        {
            icon: ListChecks,
            title: "Task Items",
            description:
                "Add individual tasks that need to be completed. You can add multiple items to your list.",
            tips: [
                "Click 'Add another item' to include multiple tasks",
                "Each item can be checked off when completed"
            ]
        },
        {
            icon: Clock,
            title: "Expiration Date & Time",
            description:
                "Set when this task should expire. This helps prioritize urgent tasks.",
            tips: [
                "Less than 1 hour = minutes display",
                "Less than 24 hours = hours display",
                "More than 24 hours = days display"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 rounded-xl">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate("/todo")}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                            Create New Task
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
                            Add a new task to your todo list
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.submit && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Task Title *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FileText size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g., Today's Priorities, Shopping List"
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                            errors.title
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Items */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Task Items *
                                </label>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {taskItems.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.2 }}
                                                className="relative"
                                            >
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-move">
                                                        <GripVertical size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.text}
                                                        onChange={e =>
                                                            updateTaskItem(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={`Task ${index + 1}`}
                                                        className={`w-full pl-9 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                                            errors.taskItems &&
                                                            !item.text.trim()
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTaskItem(
                                                                item.id
                                                            )
                                                        }
                                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors ${
                                                            taskItems.length ===
                                                            1
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            taskItems.length ===
                                                            1
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={addTaskItem}
                                        className="flex items-center gap-2 text-primary hover:text-red-700 transition-colors text-sm font-medium mt-2"
                                    >
                                        <Plus size={16} />
                                        Add another item
                                    </motion.button>
                                </div>
                                {errors.taskItems && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.taskItems}
                                    </p>
                                )}
                            </div>

                            {/* Expires At */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expires In *
                                </label>
                                <DateTimePicker
                                    value={expiresAt}
                                    onChange={setExpiresAt}
                                    error={!!errors.expiresAt}
                                />
                                {errors.expiresAt && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.expiresAt}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Select the date and time when this task
                                    should expire
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 border-t border-gray-100">
                                {/* Desktop */}
                                <div className="hidden md:flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/todo")}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        icon={loading ? null : Check}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            "Create Task"
                                        )}
                                    </Button>
                                </div>

                                {/* Mobile */}
                                <div className="flex md:hidden gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/todo")}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Plus size={18} />
                                        )}
                                        {loading ? "Creating..." : "Create Task"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Instructions - Desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Instructions
                            title="How to Create a Task"
                            variant="primary"
                            className="sticky top-6"
                            items={instructionCards}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Help FAB */}
            <div className="lg:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowInstructions(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-red-700 transition-colors"
                >
                    <HelpCircle size={22} />
                </motion.button>

                <AnimatePresence>
                    {showInstructions && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowInstructions(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300
                                }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto"
                            >
                                <div className="flex justify-center pt-3 pb-2">
                                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                                </div>
                                <div className="p-5 pt-2">
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-primary">
                                        <HelpCircle
                                            size={20}
                                            className="text-primary"
                                        />
                                        <h3 className="text-lg font-bold text-gray-800">
                                            How to Create a Task
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {instructionCards.map((card, index) => (
                                            <StickyNotesCard
                                                key={index}
                                                icon={card.icon}
                                                title={card.title}
                                                description={card.description}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-dashed border-primary">
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                            <AlertCircle
                                                size={14}
                                                className="text-yellow-500"
                                            />
                                            Pro Tips
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                                            <li>
                                                Use specific deadlines for
                                                better time management
                                            </li>
                                            <li>
                                                Break large tasks into smaller
                                                subtasks
                                            </li>
                                            <li>
                                                Set realistic expiration times
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewTask;
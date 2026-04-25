// src/pages/EditChallenge.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    HelpCircle,
    Check,
    Notebook,
    Calendar,
    ListTodo,
    Palette,
    Save
} from "lucide-react";
import Button from "@/components/_Button";
import Select from "@/components/_Select";
import StickyNotesCard from "@/components/_StickyNotesCard";
import Instructions from "@/components/_Instructions";
import challengeService from "@/services/challengeService";

const colorOptions = {
    lime: { name: "Lime", value: "#d9f99d", accent: "#a3e635" },
    pink: { name: "Pink", value: "#fce7f3", accent: "#f9a8d4" },
    yellow: { name: "Yellow", value: "#fef9c3", accent: "#fde047" },
    sky: { name: "Sky", value: "#e0f2fe", accent: "#7dd3fc" },
    orange: { name: "Orange", value: "#ffedd5", accent: "#fdba74" },
    violet: { name: "Violet", value: "#ede9fe", accent: "#c4b5fd" },
    emerald: { name: "Emerald", value: "#d1fae5", accent: "#34d399" },
    rose: { name: "Rose", value: "#ffe4e6", accent: "#fb7185" },
    indigo: { name: "Indigo", value: "#e0e7ff", accent: "#818cf8" },
    amber: { name: "Amber", value: "#fef3c7", accent: "#fbbf24" }
};

const EditChallenge = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [challengeItems, setChallengeItems] = useState([]);
    const [duration, setDuration] = useState("");
    const [coverColor, setCoverColor] = useState("lime");
    const [errors, setErrors] = useState({});
    const [showInstructions, setShowInstructions] = useState(false);
    const [originalTasks, setOriginalTasks] = useState([]);

    const durationOptions = [
        { value: 5, label: "5 days" },
        { value: 10, label: "10 days" },
        { value: 20, label: "20 days" },
        { value: 30, label: "30 days" }
    ];

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    const fetchChallenge = async () => {
        try {
            setLoading(true);
            const response = await challengeService.getChallenge(id);
            const challenge = response.challenge;
            
            setTitle(challenge.title);
            setOriginalTasks(challenge.tasks);
            setChallengeItems(
                challenge.tasks.map((task, index) => ({
                    id: Date.now() + index,
                    text: task
                }))
            );
            setDuration(challenge.duration);
            setCoverColor(challenge.cover_color || "lime");
            setErrors({});
        } catch (error) {
            console.error("Error fetching challenge:", error);
            setErrors({ fetch: error.message || "Failed to load challenge" });
        } finally {
            setLoading(false);
        }
    };

    const addChallengeItem = () => {
        setChallengeItems([...challengeItems, { id: Date.now(), text: "" }]);
    };

    const removeChallengeItem = id => {
        if (challengeItems.length > 1) {
            setChallengeItems(challengeItems.filter(item => item.id !== id));
        }
    };

    const updateChallengeItem = (id, text) => {
        setChallengeItems(
            challengeItems.map(item =>
                item.id === id ? { ...item, text } : item
            )
        );
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Challenge title is required";

        const emptyItems = challengeItems.filter(item => !item.text.trim());
        if (emptyItems.length > 0) {
            newErrors.challengeItems =
                "All challenge items must have a description";
        }

        if (!duration) newErrors.duration = "Please select a duration";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const hasTasksChanged = () => {
        const currentTasks = challengeItems.filter(item => item.text.trim()).map(item => item.text.trim());
        if (currentTasks.length !== originalTasks.length) return true;
        return currentTasks.some((task, index) => task !== originalTasks[index]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        
        try {
            const tasks = challengeItems
                .filter(item => item.text.trim())
                .map(item => item.text.trim());
            
            // Check if tasks have changed - if so, we need to recreate the challenge
            // since we can't easily modify existing tasks with progress data
            if (hasTasksChanged()) {
                const confirmChange = window.confirm(
                    "Changing tasks will reset all progress for this challenge. Are you sure you want to continue?"
                );
                if (!confirmChange) {
                    setSaving(false);
                    return;
                }
                
                // Delete old challenge and create new one
                await challengeService.deleteChallenge(id);
                const response = await challengeService.createChallenge(
                    title,
                    tasks,
                    duration,
                    coverColor
                );
                console.log("Challenge recreated:", response);
            } else {
                // For simple updates like title, duration, or color, we would need an update endpoint
                // For now, we'll show a message that these features are coming
                alert("Updating title, duration, or color without changing tasks will be available soon. For now, please change tasks to update the challenge.");
                setSaving(false);
                return;
            }
            
            navigate("/challenges");
        } catch (error) {
            console.error("Error updating challenge:", error);
            setErrors({ submit: error.message || "Failed to update challenge. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const instructionCards = [
        {
            icon: Notebook,
            title: "Edit Challenge Title",
            description:
                "Update your challenge title to keep it motivating and relevant."
        },
        {
            icon: ListTodo,
            title: "Edit Challenge Tasks",
            description:
                "Modify your tasks. Note: Changing tasks will reset all progress for this challenge.",
            tips: [
                "Keep tasks specific and achievable",
                "Changing order of tasks is fine",
                "Adding or removing tasks resets progress"
            ]
        },
        {
            icon: Calendar,
            title: "Update Duration",
            description:
                "Change how many days you have to complete this challenge.",
            tips: [
                "Longer duration gives more time",
                "Shorter duration for quick wins"
            ]
        },
        {
            icon: Palette,
            title: "Change Cover Color",
            description:
                "Pick a new color for your notebook challenge cover."
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-4 sm:p-6 rounded-xl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => navigate(`/challenges/${id}`)}
                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                            Loading Challenge...
                        </h1>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading challenge details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (errors.fetch) {
        return (
            <div className="min-h-screen bg-white p-4 sm:p-6 rounded-xl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => navigate("/challenges")}
                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                            Error
                        </h1>
                    </div>
                    <div className="text-center py-16">
                        <p className="text-red-600 mb-4">{errors.fetch}</p>
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
        <div className="min-h-screen bg-white p-4 sm:p-6 rounded-xl">
            <div className="max-w-6xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate(`/challenges/${id}`)}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                            Edit Challenge
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
                            Update your challenge details
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Warning about progress reset */}
                            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <strong>Note:</strong> Changing your tasks will reset all progress for this challenge. 
                                        Title, duration, and color changes without task modifications will be available in a future update.
                                    </div>
                                </div>
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Challenge Title Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Challenge Title *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Notebook size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g., 30 Days of Fitness, Read 5 Books"
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

                            {/* Challenge Tasks Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Challenge Tasks *
                                </label>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {challengeItems.map((item, index) => (
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
                                                        <GripVertical
                                                            size={16}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.text}
                                                        onChange={e =>
                                                            updateChallengeItem(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={`Task ${index + 1}`}
                                                        className={`w-full pl-9 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                                            errors.challengeItems &&
                                                            !item.text.trim()
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeChallengeItem(
                                                                item.id
                                                            )
                                                        }
                                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors ${
                                                            challengeItems.length ===
                                                            1
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            challengeItems.length ===
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
                                        onClick={addChallengeItem}
                                        className="flex items-center gap-2 text-primary hover:text-red-700 transition-colors text-sm font-medium mt-2"
                                    >
                                        <Plus size={16} />
                                        Add another task
                                    </motion.button>
                                </div>
                                {errors.challengeItems && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.challengeItems}
                                    </p>
                                )}
                            </div>

                            {/* Challenge Duration */}
                            <div>
                                <Select
                                    label="Challenge Duration *"
                                    options={durationOptions}
                                    value={duration}
                                    onChange={setDuration}
                                    error={!!errors.duration}
                                    placeholder="Select duration"
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.duration}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Choose how many days you have to complete
                                    this challenge
                                </p>
                            </div>

                            {/* Cover Color Picker */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Cover Color
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(colorOptions).map(
                                        ([key, color]) => (
                                            <motion.button
                                                key={key}
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setCoverColor(key)
                                                }
                                                className="relative group"
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                                        coverColor === key
                                                            ? "ring-2 ring-offset-2 ring-primary shadow-lg"
                                                            : "ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-300"
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            color.value
                                                    }}
                                                />
                                                {coverColor === key && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <Check
                                                            size={14}
                                                            className="text-primary"
                                                        />
                                                    </div>
                                                )}
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {color.name}
                                                </div>
                                            </motion.button>
                                        )
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Choose a cover color for your notebook
                                    challenge
                                </p>
                            </div>

                            {/* Buttons Section */}
                            <div className="pt-4 border-t border-gray-100">
                                {/* Desktop buttons */}
                                <div className="hidden md:flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/challenges/${id}`)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        icon={Save} 
                                        onClick={handleSubmit}
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>

                                {/* Mobile buttons */}
                                <div className="flex md:hidden gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/challenges/${id}`)}
                                        disabled={saving}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Instructions Section - Desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Instructions
                            title="Edit Challenge Tips"
                            variant="primary"
                            className="sticky top-6"
                            items={instructionCards}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Floating Help Button */}
            <div className="lg:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowInstructions(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-red-700 transition-colors"
                >
                    <HelpCircle size={22} />
                </motion.button>

                {/* Mobile Instructions Drawer */}
                <AnimatePresence>
                    {showInstructions && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowInstructions(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />

                            {/* Drawer */}
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
                                {/* Drawer handle */}
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
                                            Edit Challenge Tips
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
                                            Important Note
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                                            <li>
                                                Changing tasks will reset all
                                                progress
                                            </li>
                                            <li>Review changes before saving</li>
                                            <li>
                                                Consider completing current
                                                challenge first
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

export default EditChallenge;
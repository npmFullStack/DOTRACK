// src/pages/Challenges.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import NotebookChallenge from '@/components/_NotebookChallenge';
import Button from '@/components/_Button';

const Challenges = () => {
    const navigate = useNavigate();
    const [zoomingId, setZoomingId] = useState(null);

    const [challenges] = useState([
        {
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
        {
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
        {
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
    ]);

    const handleChallengeClick = (challengeId) => {
        if (zoomingId) return;
        setZoomingId(challengeId);
        // after zoom animation completes, navigate
        setTimeout(() => {
            navigate(`/challenges/${challengeId}`);
        }, 520);
    };

    return (
        <div className="min-h-screen bg-white p-6 rounded-xl">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">
                            Challenges
                        </h1>
                        <p className="text-gray-600">
                            Set personal challenges and track your progress
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Button
                            icon={Plus}
                            onClick={() => navigate("/challenges/new")}
                        >
                            Add Challenge
                        </Button>
                    </div>
                </div>

                {/* Challenges Grid */}
                {challenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                        {challenges.map((challenge, index) => (
                            <div
                                key={challenge.id}
                                className="flex justify-center"
                            >
                                <motion.div
                                    animate={
                                        zoomingId === challenge.id
                                            ? { scale: 3.5, opacity: 0, zIndex: 50 }
                                            : zoomingId && zoomingId !== challenge.id
                                            ? { opacity: 0, scale: 0.9 }
                                            : { scale: 1, opacity: 1 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    style={{ position: "relative", zIndex: zoomingId === challenge.id ? 50 : 1 }}
                                >
                                    <NotebookChallenge
                                        title={challenge.title}
                                        tasks={challenge.tasks}
                                        duration={challenge.duration}
                                        completedTasks={challenge.completedTasks}
                                        index={index}
                                        onClick={() => handleChallengeClick(challenge.id)}
                                    />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <Target size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No Challenges Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Start your first challenge and track your progress
                        </p>
                        <Button
                            icon={Plus}
                            onClick={() => navigate("/challenges/new")}
                        >
                            Create Your First Challenge
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Mobile FAB */}
            {challenges.length > 0 && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/challenges/new")}
                    className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-red-700 transition-colors"
                >
                    <Plus size={24} />
                </motion.button>
            )}
        </div>
    );
};

export default Challenges;
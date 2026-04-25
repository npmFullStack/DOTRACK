// src/pages/Challenges.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import NotebookChallenge from '@/components/_NotebookChallenge';
import Button from '@/components/_Button';
import challengeService from '@/services/challengeService';
import createTaskImage from "@/assets/images/createTask.png";

const Challenges = () => {
    const navigate = useNavigate();
    const [zoomingId, setZoomingId] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const response = await challengeService.getChallenges();
            // Calculate completed tasks count for each challenge
            const challengesWithProgress = response.challenges.map(challenge => ({
                id: challenge.id,
                title: challenge.title,
                tasks: challenge.tasks || [],
                duration: challenge.duration,
                completedTasks: challenge.completed_tasks || 0,
                createdAt: challenge.created_at,
                coverColor: challenge.cover_color
            }));
            setChallenges(challengesWithProgress);
            setError('');
        } catch (err) {
            console.error("Error fetching challenges:", err);
            setError(err.message || "Failed to load challenges");
        } finally {
            setLoading(false);
        }
    };

    const handleChallengeClick = (challengeId) => {
        if (zoomingId) return;
        setZoomingId(challengeId);
        // after zoom animation completes, navigate
        setTimeout(() => {
            navigate(`/challenges/${challengeId}`);
        }, 520);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6 rounded-xl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">
                                Challenges
                            </h1>
                            <p className="text-gray-600">
                                Set personal challenges and track your progress
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading challenges...</div>
                    </div>
                </div>
            </div>
        );
    }

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

                    {/* Desktop Add button - only show when there are challenges */}
                    {challenges.length > 0 && (
                        <div className="hidden md:block">
                            <Button
                                icon={Plus}
                                onClick={() => navigate("/challenges/new")}
                            >
                                Add Challenge
                            </Button>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                        <button
                            onClick={fetchChallenges}
                            className="ml-3 text-red-700 underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && challenges.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-600 mb-3">
                            Create your first challenge to get started
                        </p>

                        {/* Image with width matching the button - slightly wider than button */}
                        <div className="mb-1">
                            <img
                                src={createTaskImage}
                                alt="Create Challenge"
                                className="w-auto mx-auto"
                                style={{
                                    width: "200px",
                                    maxWidth: "100%",
                                    height: "auto",
                                    display: "block"
                                }}
                            />
                        </div>

                        <Button
                            icon={Plus}
                            onClick={() => navigate("/challenges/new")}
                        >
                            Create Challenge
                        </Button>
                    </div>
                )}

                {/* Challenges Grid */}
                {!loading && challenges.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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
                )}
            </div>

            {/* Mobile FAB - only show when there are challenges */}
            {!loading && challenges.length > 0 && (
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
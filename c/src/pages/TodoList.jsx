// src/pages/TodoList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import TodoListPaper from "@/components/_TodoListPaper";
import Button from "@/components/_Button";
import todoService from "@/services/todoService";

const TodoList = () => {
    const navigate = useNavigate();
    const [todoLists, setTodoLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await todoService.getTasks();
            // Transform backend data to match component format
            const formattedTasks = response.tasks.map(task => ({
                id: task.id,
                title: task.title,
                items: task.items.map(item => ({
                    id: item.id,
                    text: item.item_text,
                    completed: item.completed === 1,
                    expiresIn: todoService.formatExpiration(task.expires_at)
                }))
            }));
            setTodoLists(formattedTasks);
            setError("");
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleItemToggle = async (listId, itemId, completed) => {
        try {
            await todoService.toggleItem(listId, itemId, !completed);
            // Update local state
            setTodoLists(prevLists =>
                prevLists.map(list =>
                    list.id === listId
                        ? {
                              ...list,
                              items: list.items.map(item =>
                                  item.id === itemId
                                      ? { ...item, completed: !completed }
                                      : item
                              )
                          }
                        : list
                )
            );
        } catch (err) {
            console.error("Error toggling item:", err);
            setError("Failed to update item status");
        }
    };

    const handleEditTask = taskId => {
        navigate(`/todo/edit/${taskId}`);
    };

    const handleDeleteTask = async taskId => {
        try {
            await todoService.deleteTask(taskId);
            // Remove task from local state
            setTodoLists(prevLists =>
                prevLists.filter(list => list.id !== taskId)
            );
        } catch (err) {
            console.error("Error deleting task:", err);
            setError("Failed to delete task");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6 rounded-xl">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary">
                                ToDo List
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Stay organized with your tasks
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading tasks...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 rounded-xl">
            <div className="max-w-6xl mx-auto">
                {/* Header row */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary">
                            ToDo List
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Stay organized with your tasks
                        </p>
                    </div>

                    {/* Desktop Add button - hidden on mobile */}
                    <div className="hidden md:block">
                        <Button
                            icon={Plus}
                            onClick={() => navigate("/todo/new")}
                        >
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                        <button
                            onClick={fetchTasks}
                            className="ml-3 text-red-700 underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && todoLists.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="text-gray-400 mb-4">
                            <Plus size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No tasks yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Create your first task to get started
                        </p>
                        <Button
                            icon={Plus}
                            onClick={() => navigate("/todo/new")}
                        >
                            Create Task
                        </Button>
                    </div>
                )}

                {/* Grid layout for todo papers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {todoLists.map(list => (
                        <TodoListPaper
                            key={list.id}
                            id={list.id}
                            title={list.title}
                            items={list.items}
                            onItemToggle={(itemId, completed) =>
                                handleItemToggle(list.id, itemId, completed)
                            }
                            onEdit={() => handleEditTask(list.id)}
                            onDelete={() =>handleDeleteTask(list.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Floating Action Button - bottom right */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/todo/new")}
                className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-red-700 transition-colors"
            >
                <Plus size={24} />
            </motion.button>
        </div>
    );
};

export default TodoList;

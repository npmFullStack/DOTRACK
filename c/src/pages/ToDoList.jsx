// src/pages/ToDoList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import TodoListPaper from "@/components/_TodoListPaper";
import Button from "@/components/_Button";

const ToDoList = () => {
    const navigate = useNavigate();

    const todoLists = [
        {
            id: 1,
            title: "Today's Priorities",
            items: [
                {
                    id: "t1",
                    text: "Finish project presentation",
                    expiresIn: { value: 24, unit: "hours" }
                },
                {
                    id: "t2",
                    text: "Review pull requests",
                    expiresIn: { value: 3, unit: "hours" }
                },
                { id: "t3", text: "Schedule team meeting", expiresIn: null },
                {
                    id: "t4",
                    text: "Update documentation",
                    expiresIn: { value: 1, unit: "days" }
                }
            ]
        },
        {
            id: 2,
            title: "Shopping List",
            items: [
                {
                    id: "s1",
                    text: "Buy groceries",
                    expiresIn: { value: 3, unit: "hours" }
                },
                {
                    id: "s2",
                    text: "Pick up dry cleaning",
                    expiresIn: { value: 5, unit: "hours" }
                },
                {
                    id: "s3",
                    text: "Order birthday gift",
                    expiresIn: { value: 2, unit: "days" }
                },
                { id: "s4", text: "Return online order", expiresIn: null }
            ]
        },
        {
            id: 3,
            title: "Weekend Plans",
            items: [
                {
                    id: "w1",
                    text: "Call mom",
                    expiresIn: { value: 1, unit: "days" }
                },
                {
                    id: "w2",
                    text: "Gym workout",
                    expiresIn: { value: 30, unit: "minutes" }
                },
                { id: "w3", text: "Read book chapter", expiresIn: null },
                {
                    id: "w4",
                    text: "Meal prep for week",
                    expiresIn: { value: 2, unit: "days" }
                }
            ]
        }
    ];

    const handleItemToggle = (listId, itemId) => {
        console.log(`Toggled item ${itemId} in list ${listId}`);
    };

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

                {/* Grid layout for todo papers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {todoLists.map(list => (
                        <TodoListPaper
                            key={list.id}
                            title={list.title}
                            items={list.items}
                            onItemToggle={itemId =>
                                handleItemToggle(list.id, itemId)
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Floating Action Button - bottom left */}
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

export default ToDoList;

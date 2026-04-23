// src/pages/Dashboard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Flame,
  Clock,
  BarChart3,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import Button from "@/components/_Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Morning meditation", completed: true, time: "09:00 AM" },
    {
      id: 2,
      title: "Review project proposal",
      completed: false,
      time: "10:30 AM",
    },
    { id: 3, title: "Team meeting", completed: false, time: "02:00 PM" },
    {
      id: 4,
      title: "Update documentation",
      completed: false,
      time: "04:00 PM",
    },
    { id: 5, title: "Evening workout", completed: false, time: "06:00 PM" },
  ]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  // Stats data
  const stats = {
    streak: 7,
    completionRate: 68,
    totalTasks: 47,
    completedTasks: 32,
    weeklyGoal: 80,
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        time: newTaskTime || "No time set",
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setNewTaskTime("");
      setShowAddTask(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-bgLight pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome back, <span className="text-primary">John!</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's your progress for today</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Flame className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-gray-800">
                {stats.streak}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Day Streak</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-gray-800">
                {stats.completionRate}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">Completion Rate</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-gray-800">
                {stats.completedTasks}/{stats.totalTasks}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Tasks Completed</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-purple-500" size={24} />
              <span className="text-2xl font-bold text-gray-800">
                {stats.weeklyGoal}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">Weekly Goal</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("today")}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === "today"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Today's Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === "upcoming"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === "completed"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-6">
                <div className="space-y-3">
                  <AnimatePresence>
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="focus:outline-none"
                          >
                            {task.completed ? (
                              <CheckCircle
                                className="text-green-500"
                                size={22}
                              />
                            ) : (
                              <Circle
                                className="text-gray-400 hover:text-primary"
                                size={22}
                              />
                            )}
                          </button>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${task.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                            >
                              {task.title}
                            </p>
                            {task.time && task.time !== "No time set" && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock size={12} className="text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {task.time}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {tasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tasks for today</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Add a task to get started
                      </p>
                    </div>
                  )}

                  {/* Add Task Button */}
                  {!showAddTask ? (
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add New Task
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-3"
                        autoFocus
                      />
                      <input
                        type="time"
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addTask}
                          className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => setShowAddTask(false)}
                          className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Progress & Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Progress Circle */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Today's Progress
              </h3>
              <div className="relative inline-block w-full">
                <div className="flex justify-center mb-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#ef4444"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - tasks.filter((t) => t.completed).length / tasks.length)}`}
                        className="progress-ring-circle transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">
                          {Math.round(
                            (tasks.filter((t) => t.completed).length /
                              tasks.length) *
                              100,
                          ) || 0}
                          %
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {tasks.filter((t) => t.completed).length} of {tasks.length}{" "}
                    tasks done
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Weekly Overview
              </h3>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, idx) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-10 text-sm text-gray-600">{day}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{
                            width: `${[65, 70, 85, 60, 75, 50, 45][idx]}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {[65, 70, 85, 60, 75, 50, 45][idx]}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Quote / Motivation */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
              <p className="text-gray-700 italic text-sm">
                "The secret of getting ahead is getting started. You're doing
                great!"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Mark Twain</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <Button
            variant="outline"
            icon={Calendar}
            onClick={() => console.log("View calendar")}
          >
            View Calendar
          </Button>
          <Button
            variant="primary"
            icon={BarChart3}
            onClick={() => console.log("View analytics")}
          >
            View Analytics
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

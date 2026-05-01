// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Index from "@/pages/Index";
import Leaderboards from "@/pages/Leaderboards";
import ComingSoon from "@/pages/ComingSoon";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import ProtectedLayout from "@/components/ProtectedLayout";

// Custom toast styles to prevent duplicates and ensure modern look
const toastOptions = {
  duration: 4000,
  style: {
    background: '#fff',
    color: '#1f2937',
    padding: '0',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  loading: {
    duration: Infinity,
  },
};

function App() {
    return (
        <BrowserRouter>
            {/* Single Toaster instance with custom styling */}
            <Toaster 
                position="top-right"
                toastOptions={toastOptions}
                containerStyle={{
                    top: 20,
                    right: 20,
                }}
                containerClassName="toast-container"
                gutter={8}
            />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/leaderboards" element={<Leaderboards />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes with layout */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* <Route path="/todo" element={<TodoList />} />
                    <Route path="/todo/new" element={<NewTask />} />
                    <Route path="/todo/edit/:id" element={<EditTask />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/new" element={<NewChallenge />} />
                    <Route path="/challenges/:id" element={<ChallengeDetails />} />
                    <Route path="/challenges/:id/edit" element={<EditChallenge />} />
                    <Route path="/settings" element={<Settings />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
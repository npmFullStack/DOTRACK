// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/_Toast"; // ← custom toaster
import Index from "@/pages/Index";
import Leaderboards from "@/pages/Leaderboards";
import ComingSoon from "@/pages/ComingSoon";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import ProtectedLayout from "@/components/ProtectedLayout";

function App() {
    return (
        <BrowserRouter>
            {/* Single custom Toaster — all config lives in _Toast.jsx */}
            <Toaster />
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
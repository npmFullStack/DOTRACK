// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ComingSoon from "@/pages/ComingSoon";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import ToDoList from "@/pages/ToDoList";
import NewTask from "@/pages/NewTask";
import Challenges from "@/pages/Challenges";
import NewChallenge from "@/pages/NewChallenge";
import ChallengeDetails from "@/pages/ChallengeDetails";
import Settings from "@/pages/Settings";
import ProtectedLayout from "@/components/ProtectedLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes with layout */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/todo" element={<ToDoList />} />
                    <Route path="/todo/new" element={<NewTask />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/new" element={<NewChallenge />} />
                    <Route
                        path="/challenges/:id"
                        element={<ChallengeDetails />}
                    />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

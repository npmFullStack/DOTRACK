// src/components/ProtectedLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import authService from "@/services/authService";
import WarningModal from "@/components/WarningModal";
import {
    LayoutDashboard,
    CheckSquare,
    ListChecks,
    Settings,
    LogOut,
    Bell,
    User,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/images/logo.svg";

const ProtectedLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            navigate("/signin");
        }
    }, [navigate]);

    // Check if mobile on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileDrawerOpen(false);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close mobile drawer on route change
    useEffect(() => {
        setIsMobileDrawerOpen(false);
    }, [location.pathname]);

    const navItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        {
            path: "/todo",
            icon: CheckSquare,
            label: "ToDo List"
        },
        {
            path: "/challenges",
            icon: ListChecks,
            label: "List Challenge"
        },
        { path: "/settings", icon: Settings, label: "Settings" }
    ];

    const handleNavigation = path => {
        navigate(path);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        authService.logout();
        setShowLogoutModal(false);
        navigate("/signin");
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleToggleSidebar = () => {
        if (isMobile) {
            setIsMobileDrawerOpen(!isMobileDrawerOpen);
        } else {
            setIsSidebarExpanded(!isSidebarExpanded);
        }
    };

    // Sidebar content to be used in both desktop and mobile
    const SidebarContent = () => (
        <>
            {/* Logo and close icon for mobile drawer - reduced padding */}
            {isMobile && isMobileDrawerOpen && (
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <img
                            src={logoSvg}
                            alt="DoTrack Logo"
                            className="h-6 w-auto"
                        />
                        <div className="font-logo text-2xl tracking-wide font-black">
                            <span className="text-primary">Do</span>
                            <span className="text-secondary">Track</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        <X size={24} className="text-primary" />
                    </button>
                </div>
            )}
            <nav className="flex-1 py-4">
                <ul className="space-y-1 px-3">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${!isSidebarExpanded && !isMobile ? "justify-center" : ""}
                    ${isActive ? "text-primary" : "text-secondary hover:text-primary hover:bg-primary/5"}
                  `}
                                    title={
                                        !isSidebarExpanded && !isMobile
                                            ? item.label
                                            : ""
                                    }
                                >
                                    <item.icon size={20} />
                                    {(isSidebarExpanded || isMobile) && (
                                        <span className="font-button font-semibold">
                                            {item.label}
                                        </span>
                                    )}
                                    {/* Active indicator line on the left */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-primary/20">
                <button
                    onClick={handleLogoutClick}
                    className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            text-red-600 hover:bg-red-50
            ${!isSidebarExpanded && !isMobile ? "justify-center" : ""}
          `}
                    title={!isSidebarExpanded && !isMobile ? "Sign Out" : ""}
                >
                    <LogOut size={20} />
                    {(isSidebarExpanded || isMobile) && (
                        <span className="font-button font-semibold">
                            Sign Out
                        </span>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md">
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={handleToggleSidebar}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                        >
                            <Menu size={24} />
                        </button>
                        {/* Logo with SVG */}
                        <img
                            src={logoSvg}
                            alt="DoTrack Logo"
                            className="h-7 w-auto"
                        />
                        <div className="font-logo text-2xl tracking-wide font-black">
                            <span className="text-primary">Do</span>
                            <span className="text-secondary">Track</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-primary/10 transition-colors text-primary relative">
                            <Bell size={22} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        {/* User icon with gray background */}
                        <button className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center transition-colors hover:bg-red-200">
                            <User size={15} className="text-primary" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside
                    className={`fixed left-0 top-0 h-full bg-white z-20 transition-all duration-300 ease-in-out ${
                        isSidebarExpanded ? "w-64" : "w-20"
                    }`}
                    style={{ paddingTop: "72px" }}
                >
                    <div className="h-full flex flex-col">
                        <SidebarContent />
                    </div>
                </aside>
            )}

            {/* Mobile Drawer Overlay */}
            {isMobile && (
                <AnimatePresence>
                    {isMobileDrawerOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />
                            <motion.aside
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 200
                                }}
                                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-40"
                            >
                                <div className="h-full flex flex-col">
                                    <SidebarContent />
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            )}

            {/* Main Content */}
            <main
                className={`transition-all duration-300 min-h-screen bg-gray-50 ${
                    !isMobile ? (isSidebarExpanded ? "ml-64" : "ml-20") : "ml-0"
                }`}
                style={{ paddingTop: "72px" }}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

            {/* Logout Warning Modal */}
            <WarningModal
                isOpen={showLogoutModal}
                title="Logout"
                image="/src/assets/images/warning.png"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </div>
    );
};

export default ProtectedLayout;
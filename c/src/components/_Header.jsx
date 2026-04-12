// src/components/_Header.jsx
import Button from "./_Button";
import { UserPlus, Download, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoSvg from "@/assets/images/logo.svg";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md border-b border-primary/20"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img
                            src={logoSvg}
                            alt="DoTrack Logo"
                            className="h-8 w-auto"
                        />
                        <div className="font-logo text-3xl tracking-wide font-black">
                            <span className="text-primary">Do</span>
                            <span className="text-secondary">Track</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="outline" icon={Download}>
                            Get the App
                        </Button>
                        <Button variant="primary" icon={UserPlus}>
                            Sign Up
                        </Button>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div className="fixed top-[72px] left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/20 md:hidden">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        <Button
                            variant="outline"
                            icon={Download}
                            className="w-full justify-center"
                        >
                            Get the App
                        </Button>
                        <Button
                            variant="primary"
                            icon={UserPlus}
                            className="w-full justify-center"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
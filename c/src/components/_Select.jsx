// src/components/_Select.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const Select = ({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select an option",
    label,
    error = false,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                </label>
            )}
            
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all
                    flex items-center justify-between gap-2
                    ${error ? "border-red-500" : "border-gray-300"}
                    ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white hover:border-primary"}
                `}
            >
                <span className={!selectedOption ? "text-gray-400" : "text-gray-700"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                        disabled ? "text-gray-400" : "text-gray-600"
                    }`}
                />
            </button>
            
            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                        {options.map((option, index) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors
                                    flex items-center justify-between gap-2
                                    ${index !== options.length - 1 ? "border-b border-gray-100" : ""}
                                    ${value === option.value ? "bg-primary/5" : ""}
                                `}
                            >
                                <span className={`text-sm ${value === option.value ? "text-primary font-medium" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {value === option.value && (
                                    <Check size={16} className="text-primary" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Select;
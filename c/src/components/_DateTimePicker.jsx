// src/components/_DateTimePicker.jsx
import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Select from "./_Select";

const DateTimePicker = ({ value, onChange, className = "", error = false }) => {
    const [selectedDate, setSelectedDate] = useState(value || null);
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [period, setPeriod] = useState("PM");
    const [tempDate, setTempDate] = useState(null);
    const pickerRef = useRef(null);

    // Initialize time from selected date
    useEffect(() => {
        if (selectedDate) {
            let hours = selectedDate.getHours();
            const mins = selectedDate.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours === 0 ? 12 : hours;
            setHour(hours.toString());
            setMinute(mins.toString().padStart(2, "0"));
            setPeriod(ampm);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (value !== selectedDate) {
            setSelectedDate(value);
        }
    }, [value]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (date) => {
        const newDate = new Date(date);
        if (hour && minute && period) {
            let hours = parseInt(hour);
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
            newDate.setHours(hours, parseInt(minute), 0, 0);
        }
        setTempDate(newDate);
    };

    const handleConfirm = () => {
        if (tempDate) {
            setSelectedDate(tempDate);
            if (onChange) onChange(tempDate);
        }
        setIsOpen(false);
    };

    const handleHourChange = (e) => {
        let val = e.target.value;
        if (val === "") {
            setHour("");
            return;
        }
        let num = parseInt(val);
        if (!isNaN(num) && num >= 1 && num <= 12) {
            setHour(num.toString());
        }
    };

    const handleMinuteChange = (e) => {
        let val = e.target.value;
        if (val === "") {
            setMinute("");
            return;
        }
        let num = parseInt(val);
        if (!isNaN(num) && num >= 0 && num <= 59) {
            setMinute(num.toString().padStart(2, "0"));
        }
    };

    const incrementHour = () => {
        let current = parseInt(hour) || 12;
        let next = current === 12 ? 1 : current + 1;
        setHour(next.toString());
    };

    const decrementHour = () => {
        let current = parseInt(hour) || 12;
        let next = current === 1 ? 12 : current - 1;
        setHour(next.toString());
    };

    const incrementMinute = () => {
        let current = parseInt(minute) || 0;
        let next = current === 59 ? 0 : current + 1;
        setMinute(next.toString().padStart(2, "0"));
    };

    const decrementMinute = () => {
        let current = parseInt(minute) || 0;
        let next = current === 0 ? 59 : current - 1;
        setMinute(next.toString().padStart(2, "0"));
    };

    const formatDisplayDate = (date) => {
        if (!date) return "";
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }
        
        // Add days of month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        
        return days;
    };

    const currentDate = tempDate || selectedDate || new Date();
    const [viewYear, setViewYear] = useState(currentDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
    const days = getDaysInMonth(new Date(viewYear, viewMonth, 1));

    const isSelectedDate = (day) => {
        if (!selectedDate) return false;
        return day && 
               day.getDate() === selectedDate.getDate() &&
               day.getMonth() === selectedDate.getMonth() &&
               day.getFullYear() === selectedDate.getFullYear();
    };

    const isToday = (day) => {
        const today = new Date();
        return day &&
               day.getDate() === today.getDate() &&
               day.getMonth() === today.getMonth() &&
               day.getFullYear() === today.getFullYear();
    };

    // Month options for Select component
    const monthOptions = [
        { value: 0, label: "January" },
        { value: 1, label: "February" },
        { value: 2, label: "March" },
        { value: 3, label: "April" },
        { value: 4, label: "May" },
        { value: 5, label: "June" },
        { value: 6, label: "July" },
        { value: 7, label: "August" },
        { value: 8, label: "September" },
        { value: 9, label: "October" },
        { value: 10, label: "November" },
        { value: 11, label: "December" }
    ];

    // Year options (5 years before and after current year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        value: currentYear - 5 + i,
        label: (currentYear - 5 + i).toString()
    }));

    // AM/PM options for Select component
    const periodOptions = [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" }
    ];

    const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
        <div className="relative" onClick={onClick} ref={ref}>
            <div className={`relative flex items-center cursor-pointer ${error ? 'border-red-500' : 'border-gray-300'} border rounded-lg hover:border-red-400 transition-colors group bg-white`}>
                <div className="absolute left-3 flex items-center gap-1 pointer-events-none">
                    <Calendar size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-gray-300">|</span>
                    <Clock size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={value || ""}
                    placeholder={placeholder || "Select date and time"}
                    readOnly
                    className="w-full pl-24 pr-10 py-2.5 bg-transparent cursor-pointer text-gray-700 focus:outline-none text-sm sm:text-base"
                />
                <ChevronDown size={18} className="absolute right-3 text-gray-400 group-hover:text-red-500 transition-colors pointer-events-none" />
            </div>
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                <CustomInput value={selectedDate ? formatDisplayDate(selectedDate) : ""} error={error} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-red-100 w-[95vw] sm:w-[520px] max-w-[95vw] sm:max-w-[90vw] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
                    {/* Header with month/year using Select component */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 sm:p-4 rounded-t-xl border-b border-red-200">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <button
                                onClick={() => {
                                    let newMonth = viewMonth - 1;
                                    let newYear = viewYear;
                                    if (newMonth < 0) {
                                        newMonth = 11;
                                        newYear--;
                                    }
                                    setViewMonth(newMonth);
                                    setViewYear(newYear);
                                }}
                                className="p-1 hover:bg-red-200 rounded-lg transition-colors shrink-0"
                            >
                                <ChevronDown size={18} className="rotate-90 text-red-600" />
                            </button>
                            
                            <div className="flex gap-2 sm:gap-3 flex-1 justify-center">
                                <Select
                                    options={monthOptions}
                                    value={viewMonth}
                                    onChange={(val) => setViewMonth(val)}
                                    className="flex-1 min-w-0"
                                />
                                <Select
                                    options={yearOptions}
                                    value={viewYear}
                                    onChange={(val) => setViewYear(val)}
                                    className="w-20 sm:w-24"
                                />
                            </div>
                            
                            <button
                                onClick={() => {
                                    let newMonth = viewMonth + 1;
                                    let newYear = viewYear;
                                    if (newMonth > 11) {
                                        newMonth = 0;
                                        newYear++;
                                    }
                                    setViewMonth(newMonth);
                                    setViewYear(newYear);
                                }}
                                className="p-1 hover:bg-red-200 rounded-lg transition-colors shrink-0"
                            >
                                <ChevronDown size={18} className="-rotate-90 text-red-600" />
                            </button>
                        </div>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-2 sm:p-3 pb-0">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                            <div key={day} className="text-center text-[11px] sm:text-xs font-medium text-gray-500 py-1 sm:py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-2 sm:p-3">
                        {days.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => day && handleDateSelect(day)}
                                disabled={!day}
                                className={`
                                    p-1.5 sm:p-2 text-xs sm:text-sm rounded-lg transition-all
                                    ${!day ? 'invisible' : ''}
                                    ${isSelectedDate(day) ? 'bg-red-500 text-white shadow-md' : ''}
                                    ${isToday(day) && !isSelectedDate(day) ? 'border-2 border-red-300 text-red-600 font-semibold' : ''}
                                    ${day && !isSelectedDate(day) ? 'hover:bg-red-50 text-gray-700' : ''}
                                `}
                            >
                                {day?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Time picker section */}
                    <div className="border-t border-red-100 p-3 sm:p-4 bg-red-50/30">
                        <label className="block text-xs sm:text-sm font-medium text-red-600 mb-2 sm:mb-3">
                            Select Time
                        </label>
                        
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {/* Time inputs row */}
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <div className="relative flex-1 max-w-[100px] sm:max-w-[120px]">
                                    <input
                                        type="number"
                                        value={hour}
                                        onChange={handleHourChange}
                                        placeholder="12"
                                        className="w-full px-3 py-2 text-center border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm sm:text-base"
                                        min="1"
                                        max="12"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button
                                            type="button"
                                            onClick={incrementHour}
                                            className="p-0.5 hover:bg-red-100 rounded"
                                        >
                                            <ChevronUp size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={decrementHour}
                                            className="p-0.5 hover:bg-red-100 rounded"
                                        >
                                            <ChevronDown size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                    </div>
                                </div>
                                
                                <span className="text-lg sm:text-xl font-medium text-red-400">:</span>
                                
                                <div className="relative flex-1 max-w-[100px] sm:max-w-[120px]">
                                    <input
                                        type="number"
                                        value={minute}
                                        onChange={handleMinuteChange}
                                        placeholder="00"
                                        className="w-full px-3 py-2 text-center border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm sm:text-base"
                                        min="0"
                                        max="59"
                                    />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button
                                            type="button"
                                            onClick={incrementMinute}
                                            className="p-0.5 hover:bg-red-100 rounded"
                                        >
                                            <ChevronUp size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={decrementMinute}
                                            className="p-0.5 hover:bg-red-100 rounded"
                                        >
                                            <ChevronDown size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex-1 max-w-[90px] sm:max-w-[100px]">
                                    <Select
                                        options={periodOptions}
                                        value={period}
                                        onChange={setPeriod}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex gap-2 sm:gap-3 pt-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-gray-600 hover:bg-red-100 rounded-lg transition-colors text-sm sm:text-base font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md text-sm sm:text-base font-medium"
                                >
                                    Set Time
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateTimePicker;
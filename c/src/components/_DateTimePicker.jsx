// src/components/_DateTimePicker.jsx
import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Select from "./_Select";

const DateTimePicker = ({ value, onChange, className = "", error = false }) => {
    const [selectedDate, setSelectedDate] = useState(value || null);
    const [isOpen, setIsOpen] = useState(false);

    // Calendar navigation state
    const initDate = value || new Date();
    const [viewYear, setViewYear] = useState(initDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initDate.getMonth());

    // The calendar-selected day (no time applied yet)
    const [pickedDay, setPickedDay] = useState(value ? new Date(value) : null);

    // Time fields — kept as plain state, applied on "Set Time"
    const [hour, setHour] = useState(() => {
        if (value) {
            let h = value.getHours() % 12;
            return (h === 0 ? 12 : h).toString();
        }
        return "12";
    });
    const [minute, setMinute] = useState(() =>
        value ? value.getMinutes().toString().padStart(2, "0") : "00"
    );
    const [period, setPeriod] = useState(() => {
        if (value) return value.getHours() >= 12 ? "PM" : "AM";
        return "PM";
    });

    const pickerRef = useRef(null);

    // Sync when parent changes value externally
    useEffect(() => {
        if (value && value !== selectedDate) {
            setSelectedDate(value);
            setPickedDay(new Date(value));
            setViewYear(value.getFullYear());
            setViewMonth(value.getMonth());
            let h = value.getHours() % 12;
            setHour((h === 0 ? 12 : h).toString());
            setMinute(value.getMinutes().toString().padStart(2, "0"));
            setPeriod(value.getHours() >= 12 ? "PM" : "AM");
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = e => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Calendar helpers ────────────────────────────────────

    const getDaysInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
        for (let i = 1; i <= lastDay.getDate(); i++)
            days.push(new Date(year, month, i));
        return days;
    };

    const days = getDaysInMonth(viewYear, viewMonth);

    const isPickedDay = day =>
        day &&
        pickedDay &&
        day.getDate() === pickedDay.getDate() &&
        day.getMonth() === pickedDay.getMonth() &&
        day.getFullYear() === pickedDay.getFullYear();

    const isToday = day => {
        const t = new Date();
        return (
            day &&
            day.getDate() === t.getDate() &&
            day.getMonth() === t.getMonth() &&
            day.getFullYear() === t.getFullYear()
        );
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // ── Time helpers ────────────────────────────────────────

    /** Build a Date combining pickedDay + current hour/minute/period fields */
    const buildDateTime = (dayBase, h, m, p) => {
        const d = new Date(dayBase);
        let hours = parseInt(h) || 12;
        if (p === "PM" && hours !== 12) hours += 12;
        if (p === "AM" && hours === 12) hours = 0;
        d.setHours(hours, parseInt(m) || 0, 0, 0);
        return d;
    };

    const handleDaySelect = day => {
        if (!day) return;
        setPickedDay(new Date(day));
    };

    const handleConfirm = () => {
        const base = pickedDay || new Date();
        const dt = buildDateTime(base, hour, minute, period);
        setSelectedDate(dt);
        if (onChange) onChange(dt);
        setIsOpen(false);
    };

    // ── Hour input ──────────────────────────────────────────
    const handleHourChange = e => {
        const val = e.target.value;
        if (val === "") { setHour(""); return; }
        const num = parseInt(val);
        if (!isNaN(num) && num >= 1 && num <= 12) setHour(num.toString());
    };

    const incrementHour = () => {
        const cur = parseInt(hour) || 12;
        setHour(cur === 12 ? "1" : (cur + 1).toString());
    };
    const decrementHour = () => {
        const cur = parseInt(hour) || 12;
        setHour(cur === 1 ? "12" : (cur - 1).toString());
    };

    // ── Minute input ────────────────────────────────────────
    const handleMinuteChange = e => {
        const val = e.target.value;
        if (val === "") { setMinute(""); return; }
        const num = parseInt(val);
        if (!isNaN(num) && num >= 0 && num <= 59)
            setMinute(num.toString().padStart(2, "0"));
    };

    const incrementMinute = () => {
        const cur = parseInt(minute) || 0;
        setMinute(cur === 59 ? "00" : (cur + 1).toString().padStart(2, "0"));
    };
    const decrementMinute = () => {
        const cur = parseInt(minute) || 0;
        setMinute(cur === 0 ? "59" : (cur - 1).toString().padStart(2, "0"));
    };

    // ── Display ─────────────────────────────────────────────
    const formatDisplay = date => {
        if (!date) return "";
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    // ── Select options ──────────────────────────────────────
    const monthOptions = [
        { value: 0, label: "January" }, { value: 1, label: "February" },
        { value: 2, label: "March" },   { value: 3, label: "April" },
        { value: 4, label: "May" },     { value: 5, label: "June" },
        { value: 6, label: "July" },    { value: 7, label: "August" },
        { value: 8, label: "September" },{ value: 9, label: "October" },
        { value: 10, label: "November" },{ value: 11, label: "December" }
    ];

    const curYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        value: curYear - 5 + i,
        label: (curYear - 5 + i).toString()
    }));

    const periodOptions = [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" }
    ];

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(o => !o)}
                className={`relative flex items-center cursor-pointer border rounded-lg hover:border-red-400 transition-colors group bg-white ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            >
                <div className="absolute left-3 flex items-center gap-1 pointer-events-none">
                    <Calendar size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-gray-300">|</span>
                    <Clock size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={selectedDate ? formatDisplay(selectedDate) : ""}
                    placeholder="Select date and time"
                    readOnly
                    className="w-full pl-24 pr-10 py-2.5 bg-transparent cursor-pointer text-gray-700 focus:outline-none text-sm sm:text-base"
                />
                <ChevronDown size={18} className="absolute right-3 text-gray-400 group-hover:text-red-500 transition-colors pointer-events-none" />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-red-100 w-[95vw] sm:w-[520px] max-w-[95vw] sm:max-w-[90vw] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">

                    {/* Month / Year header */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 sm:p-4 rounded-t-xl border-b border-red-200">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1 hover:bg-red-200 rounded-lg transition-colors shrink-0"
                            >
                                <ChevronDown size={18} className="rotate-90 text-red-600" />
                            </button>

                            <div className="flex gap-2 sm:gap-3 flex-1 justify-center">
                                <Select
                                    options={monthOptions}
                                    value={viewMonth}
                                    onChange={val => setViewMonth(Number(val))}
                                    className="flex-1 min-w-0"
                                />
                                <Select
                                    options={yearOptions}
                                    value={viewYear}
                                    onChange={val => setViewYear(Number(val))}
                                    className="w-20 sm:w-24"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1 hover:bg-red-200 rounded-lg transition-colors shrink-0"
                            >
                                <ChevronDown size={18} className="-rotate-90 text-red-600" />
                            </button>
                        </div>
                    </div>

                    {/* Weekday labels */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-2 sm:p-3 pb-0">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                            <div
                                key={d}
                                className="text-center text-[11px] sm:text-xs font-medium text-gray-500 py-1 sm:py-2"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-2 sm:p-3">
                        {days.map((day, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleDaySelect(day)}
                                disabled={!day}
                                className={`
                                    p-1.5 sm:p-2 text-xs sm:text-sm rounded-lg transition-all
                                    ${!day ? "invisible" : ""}
                                    ${isPickedDay(day) ? "bg-red-500 text-white shadow-md" : ""}
                                    ${isToday(day) && !isPickedDay(day)
                                        ? "border-2 border-red-300 text-red-600 font-semibold"
                                        : ""}
                                    ${day && !isPickedDay(day)
                                        ? "hover:bg-red-50 text-gray-700"
                                        : ""}
                                `}
                            >
                                {day?.getDate()}
                            </button>
                        ))}
                    </div>

                    {/* Time picker */}
                    <div className="border-t border-red-100 p-3 sm:p-4 bg-red-50/30">
                        <label className="block text-xs sm:text-sm font-medium text-red-600 mb-2 sm:mb-3">
                            Select Time
                        </label>

                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-center justify-center gap-2 sm:gap-3">

                                {/* Hour */}
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
                                        <button type="button" onClick={incrementHour} className="p-0.5 hover:bg-red-100 rounded">
                                            <ChevronUp size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                        <button type="button" onClick={decrementHour} className="p-0.5 hover:bg-red-100 rounded">
                                            <ChevronDown size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                    </div>
                                </div>

                                <span className="text-lg sm:text-xl font-medium text-red-400">:</span>

                                {/* Minute */}
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
                                        <button type="button" onClick={incrementMinute} className="p-0.5 hover:bg-red-100 rounded">
                                            <ChevronUp size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                        <button type="button" onClick={decrementMinute} className="p-0.5 hover:bg-red-100 rounded">
                                            <ChevronDown size={10} className="text-red-500 sm:w-3 sm:h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* AM / PM */}
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
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-gray-600 hover:bg-red-100 rounded-lg transition-colors text-sm sm:text-base font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
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
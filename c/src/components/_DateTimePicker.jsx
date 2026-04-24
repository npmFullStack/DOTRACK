// src/components/_DateTimePicker.jsx (updated)
import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = ({ value, onChange, className = "", error = false }) => {
    const [selectedDate, setSelectedDate] = useState(value || null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (value !== selectedDate) {
            setSelectedDate(value);
        }
    }, [value]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onChange) {
            onChange(date);
        }
        setIsOpen(false);
    };

    const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
        <div className="relative" onClick={onClick} ref={ref}>
            <div className={`relative flex items-center cursor-pointer ${error ? 'border-red-500' : 'border-gray-300'} border rounded-lg hover:border-primary transition-colors group`}>
                <div className="absolute left-3 flex items-center gap-1 pointer-events-none">
                    <Calendar size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-gray-300">|</span>
                    <Clock size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={value || ""}
                    placeholder={placeholder || "Select date and time"}
                    readOnly
                    className="w-full pl-24 pr-10 py-2.5 bg-transparent cursor-pointer text-gray-700 focus:outline-none"
                />
                <ChevronDown size={18} className="absolute right-3 text-gray-400 group-hover:text-primary transition-colors pointer-events-none" />
            </div>
        </div>
    ));

    CustomInput.displayName = 'CustomInput';

    return (
        <div className={`relative ${className}`}>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                customInput={<CustomInput error={error} />}
                open={isOpen}
                onClickOutside={() => setIsOpen(false)}
                onInputClick={() => setIsOpen(true)}
                popperClassName="datepicker-popper"
            />
            <style jsx>{`
                :global(.datepicker-popper .react-datepicker) {
                    font-family: inherit;
                    border-radius: 12px;
                    border: none;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
                }
                :global(.react-datepicker__header) {
                    background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
                    border-bottom: none;
                    border-radius: 12px 12px 0 0;
                    padding: 12px;
                }
                :global(.react-datepicker__current-month) {
                    color: #dc2626;
                    font-weight: 600;
                }
                :global(.react-datepicker__day-name) {
                    color: #9ca3af;
                }
                :global(.react-datepicker__day--selected) {
                    background-color: #dc2626;
                    border-radius: 8px;
                }
                :global(.react-datepicker__day--keyboard-selected) {
                    background-color: #fee2e2;
                    color: #dc2626;
                }
                :global(.react-datepicker__day:hover) {
                    background-color: #fef2f2;
                    border-radius: 8px;
                }
                :global(.react-datepicker__time-container) {
                    border-left: 1px solid #f3f4f6;
                }
                :global(.react-datepicker__time-box) {
                    border-radius: 0 12px 12px 0;
                }
                :global(.react-datepicker__time-list-item--selected) {
                    background-color: #dc2626 !important;
                }
                :global(.react-datepicker__time-list-item:hover) {
                    background-color: #fef2f2 !important;
                }
            `}</style>
        </div>
    );
};

export default DateTimePicker;
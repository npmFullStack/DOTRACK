// src/components/_StickyNotesCard.jsx
import { motion } from "framer-motion";

const colorVariants = {
    lime: {
        bg: "bg-lime-200",
        border: "border-lime-400",
        pin: "text-lime-800",
        tape: "bg-lime-100",
        text: "text-lime-900",
        textLight: "text-lime-900/90"
    },
    pink: {
        bg: "bg-pink-100",
        border: "border-pink-300",
        pin: "text-pink-800",
        tape: "bg-pink-100",
        text: "text-pink-900",
        textLight: "text-pink-900/90"
    },
    yellow: {
        bg: "bg-yellow-100",
        border: "border-yellow-300",
        pin: "text-yellow-800",
        tape: "bg-yellow-100",
        text: "text-yellow-900",
        textLight: "text-yellow-900/90"
    },
    sky: {
        bg: "bg-sky-100",
        border: "border-sky-300",
        pin: "text-sky-800",
        tape: "bg-sky-100",
        text: "text-sky-900",
        textLight: "text-sky-900/90"
    },
    orange: {
        bg: "bg-orange-100",
        border: "border-orange-300",
        pin: "text-orange-800",
        tape: "bg-orange-100",
        text: "text-orange-900",
        textLight: "text-orange-900/90"
    },
    violet: {
        bg: "bg-violet-100",
        border: "border-violet-300",
        pin: "text-violet-800",
        tape: "bg-violet-100",
        text: "text-violet-900",
        textLight: "text-violet-900/90"
    }
};

const colorKeys = ["lime", "pink", "yellow", "sky", "orange", "violet"];

const StickyNotesCard = ({ icon: Icon, title, description, index = 0 }) => {
    const colorKey = colorKeys[index % colorKeys.length];
    const colors = colorVariants[colorKey];

    const rotations = [-2.5, 1.8, -1.2, 2.2, -2.0, 1.5];
    const rotation = rotations[index % rotations.length];

    return (
        <motion.div
            className="relative flex-shrink-0"
            whileHover={{
                rotate: 0,
                scale: 1.04,
                zIndex: 20,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            initial={{ rotate: rotation }}
            animate={{ rotate: rotation }}
        >
            {/* Tape strip at top */}
            <div
                className={`absolute -top-4 left-1/2 z-10 w-10 h-6 rounded-sm opacity-75 ${colors.tape}`}
                style={{
                    transform: `translateX(-50%) rotate(${-rotation * 0.5}deg)`
                }}
            />

            {/* Sticky note body */}
            <div
                className={`relative rounded-sm pt-8 pb-6 px-5 cursor-default select-none border ${colors.bg} ${colors.border}`}
                style={{
                    minHeight: "200px",
                    width: "100%"
                }}
            >
                {/* Folded corner bottom-right */}
                <div
                    className="absolute bottom-0 right-0 w-7 h-7"
                    style={{
                        background: `linear-gradient(225deg, ${getBorderColor(colors.border)} 50%, ${getBgColor(colors.bg)} 50%)`,
                        borderRadius: "0 0 2px 0"
                    }}
                />

                {/* Icon */}
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-opacity-25 ${colors.bg}`}
                >
                    {Icon && <Icon size={20} className={colors.pin} />}
                </div>

                {/* Title */}
                <h3
                    className={`font-bold text-base mb-2 leading-tight ${colors.text}`}
                >
                    {title}
                </h3>

                {/* Description */}
                <p className={`text-sm leading-relaxed ${colors.textLight}`}>
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

// Helper functions to extract actual colors from Tailwind classes
const getBorderColor = borderClass => {
    const colors = {
        "border-lime-400": "#a3e635",
        "border-pink-300": "#f9a8d4",
        "border-yellow-300": "#fde047",
        "border-sky-300": "#7dd3fc",
        "border-orange-300": "#fdba74",
        "border-violet-300": "#c4b5fd"
    };
    return colors[borderClass] || "#e5e5e5";
};

const getBgColor = bgClass => {
    const colors = {
        "bg-lime-200": "#d9f99d",
        "bg-pink-100": "#fce7f3",
        "bg-yellow-100": "#fef9c3",
        "bg-sky-100": "#e0f2fe",
        "bg-orange-100": "#ffedd5",
        "bg-violet-100": "#ede9fe"
    };
    return colors[bgClass] || "#f5f5f5";
};

export default StickyNotesCard;

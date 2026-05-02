// src/components/_Toast.jsx
import { Toaster as HotToaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle
} from "lucide-react";
import { useCallback } from "react";

if (typeof document !== "undefined" && !document.getElementById("_toast-kf")) {
    const s = document.createElement("style");
    s.id = "_toast-kf";
    s.textContent = `
        @keyframes _tSpin  { to { transform: rotate(360deg); } }
        @keyframes _tDrain { from { width: 100%; } to { width: 0%; } }
    `;
    document.head.appendChild(s);
}

const CFG = {
    success: {
        Icon: CheckCircle2,
        accent: "#16a34a", // green-600
        border: "#dcfce7"
    },
    error: {
        Icon: AlertCircle,
        accent: "#dc2626", // red-600
        border: "#fee2e2"
    },
    warning: {
        Icon: AlertTriangle,
        accent: "#d97706", // amber-600
        border: "#fef3c7"
    },
    loading: {
        Icon: null,
        accent: "#2563eb", // blue-600
        border: "#dbeafe"
    },
    default: {
        Icon: Info,
        accent: "#6b7280", // gray-500
        border: "#e5e7eb"
    }
};

const Spinner = ({ accent }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        style={{
            animation: "_tSpin 0.8s linear infinite",
            display: "block",
            flexShrink: 0
        }}
    >
        <circle
            cx="10"
            cy="10"
            r="7.5"
            stroke={`${accent}22`}
            strokeWidth="2.5"
        />
        <path
            d="M10 2.5 A7.5 7.5 0 0 1 17.5 10"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

const ToastCard = ({
    message,
    type,
    icon: customIcon,
    onDismiss,
    duration,
    id
}) => {
    const { Icon, accent, border } = CFG[type] || CFG.default;
    const isLoading = type === "loading";

    const handleDismiss = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onDismiss && typeof onDismiss === 'function') {
            onDismiss(id);
        }
    }, [onDismiss, id]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 44px 14px 16px",
                borderRadius: "12px",
                background: "#ffffff",
                border: `1px solid ${border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02)",
                minWidth: "280px",
                maxWidth: "380px",
                pointerEvents: "auto",
                overflow: "hidden",
                backdropFilter: "blur(0px)"
            }}
        >
            {/* Icon */}
            <div
                style={{ 
                    flexShrink: 0, 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px"
                }}
            >
                {isLoading ? (
                    <Spinner accent={accent} />
                ) : (
                    customIcon || (
                        <Icon size={18} color={accent} strokeWidth={2} />
                    )
                )}
            </div>

            {/* Message */}
            <p
                style={{
                    flex: 1,
                    margin: 0,
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#1f2937",
                    lineHeight: "1.45",
                    letterSpacing: "-0.01em",
                    wordBreak: "break-word"
                }}
            >
                {message}
            </p>

            {/* Dismiss */}
            {!isLoading && (
                <button
                    onClick={handleDismiss}
                    aria-label="Close"
                    type="button"
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "12px",
                        transform: "translateY(-50%)",
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "none",
                        background: "transparent",
                        color: "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.15s ease"
                    }}
                    onMouseEnter={e =>
                        Object.assign(e.currentTarget.style, {
                            color: accent,
                            background: `${accent}10`
                        })
                    }
                    onMouseLeave={e =>
                        Object.assign(e.currentTarget.style, {
                            color: "#9ca3af",
                            background: "transparent"
                        })
                    }
                >
                    <X size={14} strokeWidth={2} />
                </button>
            )}

            {/* Drain bar */}
            {!isLoading && duration !== Infinity && duration !== 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: `${accent}14`
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            background: accent,
                            borderRadius: "0 0 0 2px",
                            animation: `_tDrain ${duration}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export const Toaster = () => (
    <HotToaster
        position="top-right"
        gutter={12}
        containerStyle={{ top: 20, right: 20, zIndex: 9999 }}
        toastOptions={{
            duration: 4000,
            success: { duration: 3000 },
            error: { duration: 5000 },
            loading: { duration: Infinity },
            style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
                maxWidth: "none"
            }
        }}
    >
        {(t) => (
            <AnimatePresence mode="wait">
                {t.visible && (
                    <ToastCard
                        key={t.id}
                        id={t.id}
                        message={typeof t.message === "string" ? t.message : ""}
                        type={t.type}
                        icon={t.icon}
                        onDismiss={t.dismiss}
                        duration={
                            t.type === "success"
                                ? 3000
                                : t.type === "error"
                                  ? 5000
                                  : t.duration
                        }
                    />
                )}
            </AnimatePresence>
        )}
    </HotToaster>
);

export default Toaster;
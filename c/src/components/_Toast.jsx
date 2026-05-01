// src/components/_Toast.jsx
import { Toaster as HotToaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastIcon = ({ type }) => {
    switch (type) {
        case 'success':
            return <CheckCircle size={20} className="text-green-500" />;
        case 'error':
            return <AlertCircle size={20} className="text-red-500" />;
        case 'warning':
            return <AlertTriangle size={20} className="text-amber-500" />;
        default:
            return <Info size={20} className="text-blue-500" />;
    }
};

const ToastContent = ({ message, type, icon, onDismiss, id }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-3 py-3 pl-4 pr-12 rounded-xl shadow-lg bg-white border border-gray-100 min-w-[320px] max-w-md pointer-events-auto"
            style={{ zIndex: 9999 }}
        >
            {/* Icon with proper left spacing - now has pl-4 on parent and this div has no extra margins */}
            <div className="flex-shrink-0">
                {icon || <ToastIcon type={type} />}
            </div>
            
            {/* Message with proper styling based on type */}
            <div className="flex-1">
                <p className={`text-sm font-medium ${
                    type === 'success' ? 'text-green-700' :
                    type === 'error' ? 'text-red-700' :
                    type === 'warning' ? 'text-amber-700' :
                    'text-blue-700'
                }`}>
                    {message}
                </p>
            </div>
            
            {/* Close button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss();
                }}
                className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close toast"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const Toaster = () => {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                    },
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        padding: 0,
                    },
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        padding: 0,
                    },
                },
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                },
            }}
        >
            {(t) => (
                <AnimatePresence mode="wait">
                    {t.visible && (
                        <ToastContent
                            key={t.id}
                            message={typeof t.message === 'string' ? t.message : ''}
                            type={t.type}
                            icon={t.icon}
                            onDismiss={() => t.dismiss()}
                            id={t.id}
                        />
                    )}
                </AnimatePresence>
            )}
        </HotToaster>
    );
};

export default Toaster;
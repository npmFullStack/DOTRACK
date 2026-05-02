// src/components/WarningModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import Button from "./_Button";
import { Loader2 } from "lucide-react";

const WarningModal = ({ isOpen, title, image, onConfirm, onCancel, loading = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - covers entire screen */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/50 z-50"
                    />
                    
                    {/* Modal Container - perfect centering */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
                        >
                            <div className="p-8 text-center">
                                {/* Warning Image */}
                                {image && (
                                    <div className="flex justify-center mb-6">
                                        <img 
                                            src={image} 
                                            alt="Warning" 
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div>
                                )}
                                
                                {/* Title */}
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                    {title}
                                </h2>
                                
                                {/* Message */}
                                <p className="text-gray-600 text-lg mb-8">
                                    Are you sure you want to sign out?
                                </p>
                                
                                {/* Buttons */}
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={onCancel}
                                        className="px-8 py-2.5 text-base"
                                        disabled={loading}
                                    >
                                        No, Stay
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={onConfirm}
                                        className="px-8 py-2.5 text-base"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={20} className="animate-spin" />
                                                <span>Logging out...</span>
                                            </div>
                                        ) : (
                                            "Sure, Logout"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WarningModal;
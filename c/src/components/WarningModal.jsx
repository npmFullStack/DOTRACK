// src/components/WarningModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import Button from "./_Button";

const WarningModal = ({ isOpen, title, image, onConfirm, onCancel }) => {
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                        >
                            <div className="p-6 text-center">
                                {/* Warning Image */}
                                {image && (
                                    <div className="flex justify-center mb-4">
                                        <img 
                                            src={image} 
                                            alt="Warning" 
                                            className="w-20 h-20 object-contain"
                                        />
                                    </div>
                                )}
                                
                                {/* Title */}
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {title}
                                </h2>
                                
                                {/* Message */}
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to sign out?
                                </p>
                                
                                {/* Buttons */}
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={onCancel}
                                        className="px-6"
                                    >
                                        No, Stay
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={onConfirm}
                                        className="px-6"
                                    >
                                        Sure, Logout
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
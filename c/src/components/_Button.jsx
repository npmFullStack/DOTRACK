// src/components/_Button.jsx
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  icon: Icon = null,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-red-700",
    secondary: "bg-secondary text-white hover:bg-gray-600",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-button font-semibold transition-all duration-200
                ${variants[variant]}
                ${className}
            `}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
};

export default Button;

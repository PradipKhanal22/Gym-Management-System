import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 uppercase tracking-wider text-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-emerald-600 hover:shadow-lg border border-transparent",
    outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white hover:shadow-lg",
    ghost: "bg-transparent text-slate-700 hover:text-primary"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
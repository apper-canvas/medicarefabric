import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary', // primary, secondary, text
  icon, // ApperIcon name
  iconSize = 20,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200";
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary text-white hover:bg-primary/90';
      break;
    case 'secondary':
      variantClasses = 'bg-surface-100 text-surface-700 hover:bg-surface-200';
      break;
    case 'text':
      variantClasses = 'text-primary hover:text-primary/80 bg-transparent';
      break;
    case 'outline':
      variantClasses = 'border border-surface-200 text-surface-700 hover:bg-surface-100';
      break;
    case 'danger':
        variantClasses = 'bg-error text-white hover:bg-error/90';
        break;
    default:
      variantClasses = 'bg-primary text-white hover:bg-primary/90';
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const Component = (whileHover || whileTap) ? motion.button : 'button';

  return (
    <Component
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={iconSize} />}
      <span>{children}</span>
    </Component>
  );
};

export default Button;
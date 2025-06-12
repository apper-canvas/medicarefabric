import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  onClick,
  motionProps, // { initial, animate, transition, whileHover, whileTap }
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg p-6 shadow-sm';
  const combinedClasses = `${baseClasses} ${className}`;

  const Component = motionProps ? motion.div : 'div';

  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with consistent animations
 * Provides Apple-like smooth page transitions
 */
const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = '' }) => {
  const animations = useAnimation();
  
  return (
    <motion.div
      className={className}
      initial={animations.pageTransition.initial}
      animate={animations.pageTransition.animate}
      exit={animations.pageTransition.exit}
      transition={animations.pageTransition.transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
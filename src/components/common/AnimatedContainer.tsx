import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Box, BoxProps } from '@mui/material';
import { useAnimation as useAnimationHook } from '../../contexts/AnimationContext';

interface AnimatedContainerProps extends BoxProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'none';
  delay?: number;
}

/**
 * A container with subtle entrance animations when it comes into view
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  sx,
  ...props
}) => {
  const { fadeIn, slideIn } = useAnimationHook();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const getAnimation = () => {
    switch (animation) {
      case 'fade':
        return {
          initial: fadeIn.initial,
          animate: inView ? fadeIn.animate : fadeIn.initial,
          transition: { 
            ...fadeIn.transition,
            delay 
          }
        };
      case 'slide':
        return {
          initial: slideIn.initial,
          animate: inView ? slideIn.animate : slideIn.initial,
          transition: { 
            ...slideIn.transition,
            delay 
          }
        };
      default:
        return {};
    }
  };

  const animationProps = animation === 'none' ? {} : getAnimation();
  
  return (
    <Box ref={ref} component={motion.div} sx={sx} {...animationProps} {...props}>
      {children}
    </Box>
  );
};

export default AnimatedContainer;
import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean;
  loaderSize?: number;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  loaderSize = 24,
  ...props
}) => {
  const animations = useAnimation();
  
  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : animations.buttonHover.scale }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      <Button
        {...props}
        disabled={disabled || loading}
        sx={{
          position: 'relative',
          minWidth: '120px',
          ...props.sx,
        }}
      >
        {loading && (
          <CircularProgress
            size={loaderSize}
            sx={{
              position: 'absolute',
              color: 'inherit',
            }}
          />
        )}
        <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
          {children}
        </span>
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
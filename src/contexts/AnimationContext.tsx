import React, { createContext, useContext, ReactNode } from 'react';

interface AnimationContextType {
  pageTransition: {
    initial: object;
    animate: object;
    exit: object;
    transition: object;
  };
  fadeIn: {
    initial: object;
    animate: object;
    transition: object;
  };
  slideIn: {
    initial: object;
    animate: object;
    transition: object;
  };
  buttonHover: {
    scale: number;
    transition: object;
  };
}

const defaultAnimations: AnimationContextType = {
  // Apple-inspired smooth page transitions
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  // Fade in animation for components
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  // Slide-in animation for components
  slideIn: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  // Button hover animation
  buttonHover: {
    scale: 1.03,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};

const AnimationContext = createContext<AnimationContextType>(defaultAnimations);

export const useAnimation = () => useContext(AnimationContext);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AnimationContext.Provider value={defaultAnimations}>
      {children}
    </AnimationContext.Provider>
  );
};
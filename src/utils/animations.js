// Smooth spring transition for a "futuristic" feel
export const transitionConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

// Fade in and slide up (Standard element entry)
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { opacity: 0, y: 20 }
};

// Container that handles Staggering children (Good for Grids)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  }
};

// Individual Card Animation (Matches the stagger)
export const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Interactive Hover Effects
export const hoverEffect = {
  scale: 1.03,
  y: -5,
  boxShadow: "0 0 20px rgba(56, 182, 255, 0.4)", // Cyber Blue Glow
  borderColor: "#38B6FF",
  transition: { duration: 0.2 }
};
/**
 * Shared animation variants for consistent animations across the application
 */

// Page transition animations
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren",
    },
  },
};

// Title animations
export const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Card animations
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Item animations for staggered children
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// List container for staggered children
export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Summary item animations
export const summaryItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
    },
  }),
};

// Button hover animations
export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

// Fade in animation
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Expand/collapse animations
export const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
};

// Toast/notification animations
export const toastVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// Selection indicator animations
export const selectionVariants = {
  unselected: { scale: 0, opacity: 0 },
  selected: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

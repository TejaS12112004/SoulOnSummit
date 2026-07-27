export const getFadeInUp = (shouldReduceMotion: boolean = false) => ({
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: shouldReduceMotion ? 0.1 : 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
});

export const getStaggerContainer = (shouldReduceMotion: boolean = false) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: shouldReduceMotion ? 0 : 0.1 
    }
  }
});

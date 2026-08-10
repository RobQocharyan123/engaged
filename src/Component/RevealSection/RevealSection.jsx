import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const RevealSection = ({ children, delay = 0 }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.16,
    margin: '0px 0px -8% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={sectionRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      animate={
        shouldReduceMotion || isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 32 }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 0.72,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default RevealSection;

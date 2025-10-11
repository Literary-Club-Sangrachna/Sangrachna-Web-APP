import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

const AnimatedSection = ({ children, className }: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }} // animate once and stay
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full min-h-[50vh] px-4 sm:px-6 md:px-12 ${className || ""}`}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

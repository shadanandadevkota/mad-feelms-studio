import { motion } from "framer-motion";

/**
 * Wraps a route's content with a fade + slight upward motion on enter/exit.
 * Use inside AnimatePresence in the router.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

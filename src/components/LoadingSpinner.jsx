import { motion } from 'framer-motion';

/**
 * `colorClass` must be a complete set of border-color utilities (never
 * constructed dynamically) so callers can override it per-context, e.g. on
 * a colored button vs. a light card, without both color sets fighting for
 * the same CSS property.
 */
export default function LoadingSpinner({
  size = 24,
  colorClass = 'border-brand-200 border-t-brand-600 dark:border-brand-900 dark:border-t-brand-400',
}) {
  return (
    <motion.span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full border-[3px] ${colorClass}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
    />
  );
}

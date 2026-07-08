import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="focus-ring flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-300 dark:border-slate-700 dark:text-slate-300"
    >
      <motion.span
        key={theme}
        initial={{ y: -16, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
      </motion.span>
    </button>
  );
}

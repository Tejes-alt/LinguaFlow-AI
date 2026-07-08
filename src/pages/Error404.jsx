import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiHome, FiFrown } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';

export default function Error404() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <PageTransition>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -16, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient-soft text-brand-500"
        >
          <FiFrown size={40} />
        </motion.div>
        <h1 className="font-display text-gradient text-7xl font-semibold">404</h1>
        <p className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">Lost in translation</p>
        <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
          This page doesn't exist in any language we support. Let's get you back.
        </p>
        <Link
          to="/"
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.03]"
        >
          <FiHome /> Back to home
        </Link>
      </section>
    </PageTransition>
  );
}

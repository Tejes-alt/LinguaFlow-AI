import { useReducedMotion } from 'framer-motion';

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();
  const motionClass = shouldReduceMotion ? '' : 'animate-blob';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/10 ${motionClass}`}
      />
      <div
        className={`absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl [animation-delay:5s] dark:bg-rose-600/10 ${motionClass}`}
      />
      <div
        className={`absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl [animation-delay:9s] dark:bg-amber-600/10 ${motionClass}`}
      />
      <div className="absolute inset-0 bg-white/40 dark:bg-ink/60" />
    </div>
  );
}

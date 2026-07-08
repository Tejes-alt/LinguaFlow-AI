import { motion, useReducedMotion } from 'framer-motion';

// Positions loosely trace a sine curve across the hero — each greeting drifts
// on its own rhythm, like words carried on a current between languages.
const GREETINGS = [
  { text: 'Hello', x: 3, y: 40 },
  { text: 'Hola', x: 15, y: 10 },
  { text: 'Bonjour', x: 28, y: 48 },
  { text: 'こんにちは', x: 42, y: 6 },
  { text: 'Ciao', x: 56, y: 44 },
  { text: 'مرحبا', x: 69, y: 12 },
  { text: 'Namaste', x: 82, y: 46 },
  { text: '안녕하세요', x: 95, y: 8 },
];

export default function GreetingWave() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-2 -z-0 h-40 select-none sm:h-56"
    >
      <svg
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-brand-400/30 dark:text-brand-300/20"
      >
        <path
          d="M -5 30 C 15 5, 35 55, 50 28 C 65 2, 85 52, 105 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </svg>
      {GREETINGS.map((greeting, i) => (
        <motion.span
          key={greeting.text}
          initial={{ opacity: 0 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: [0, -8, 0] }
          }
          transition={{
            opacity: { duration: 0.6, delay: i * 0.08 },
            y: shouldReduceMotion
              ? undefined
              : { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 },
          }}
          style={{ left: `${greeting.x}%`, top: `${greeting.y}%` }}
          className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-200/60 bg-white/70 px-3 py-1 font-mono text-xs font-medium text-brand-600 shadow-sm backdrop-blur-sm dark:border-brand-400/20 dark:bg-white/5 dark:text-brand-300"
        >
          {greeting.text}
        </motion.span>
      ))}
    </div>
  );
}

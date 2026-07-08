import { useEffect, useRef, useState } from 'react';

function useAnimatedNumber(target, duration = 1100) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const isNumber = typeof target === 'number';

  useEffect(() => {
    if (!isNumber) return;
    startTimeRef.current = null;
    let frameId;

    function step(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    }
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, isNumber]);

  return value;
}

/**
 * `gradient` must be a complete, literal Tailwind class string passed at the
 * call site (e.g. "from-blue-500 to-cyan-500") — never built dynamically —
 * so the JIT compiler can detect and generate it.
 */
export default function StatCard({ icon: Icon, label, value, gradient = 'from-brand-500 to-brand-700' }) {
  const animatedValue = useAnimatedNumber(typeof value === 'number' ? value : 0);
  const displayValue = typeof value === 'number' ? animatedValue.toLocaleString() : value;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/5">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl`} />
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
        {Icon && <Icon size={22} />}
      </div>
      <p className="font-mono text-3xl font-bold text-slate-800 dark:text-white">{displayValue}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

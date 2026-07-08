export default function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div
      className={`space-y-3 rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/70 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded-full" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}

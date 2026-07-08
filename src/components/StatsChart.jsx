import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { getLanguageName } from '../utils/languages';

const COLORS = ['#4f46e5', '#e11d48', '#f59e0b', '#0ea5e9', '#10b981', '#a855f7'];

export default function StatsChart({ history }) {
  const data = useMemo(() => {
    const counts = {};
    history.forEach((item) => {
      const lang = item.toLang || 'unknown';
      counts[lang] = (counts[lang] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([code, count]) => ({ code, name: getLanguageName(code), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [history]);

  if (data.length === 0) {
    return (
      <div className="glass flex h-64 items-center justify-center rounded-2xl text-center text-sm text-slate-400">
        Translate something and this chart will fill in with your language mix.
      </div>
    );
  }

  return (
    <div className="glass h-72 w-full rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(15,15,35,0.15)' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.code} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

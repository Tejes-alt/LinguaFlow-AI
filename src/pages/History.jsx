import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { FiSearch, FiDownload, FiFileText, FiTrash } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';
import HistoryCard from '../components/HistoryCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useHistory } from '../context/HistoryContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDebounce } from '../hooks/useDebounce';
import { exportHistoryAsCSV, exportHistoryAsPDF } from '../utils/exportUtils';

const FILTERS = ['all', 'favorites'];

export default function History() {
  const { history, clearHistory } = useHistory();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    let list = history;
    if (filter === 'favorites') list = list.filter((item) => item.isFavorite);
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (item) => item.sourceText.toLowerCase().includes(q) || item.translatedText.toLowerCase().includes(q)
      );
    }
    return list;
  }, [history, filter, debouncedQuery]);

  const handleReuse = (item) => navigate('/translator', { state: { reuse: item } });

  const handleExportCSV = () => {
    if (history.length === 0) return showToast('No history to export yet.', 'info');
    exportHistoryAsCSV(history);
    showToast('CSV export started!', 'success');
  };

  const handleExportPDF = () => {
    if (history.length === 0) return showToast('No history to export yet.', 'info');
    exportHistoryAsPDF(history);
    showToast('PDF export started!', 'success');
  };

  const handleClear = () => {
    if (window.confirm('Clear all translation history? This cannot be undone.')) {
      clearHistory();
      showToast('History cleared.', 'info');
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-semibold text-slate-800 dark:text-white sm:text-5xl">
            Translation <span className="text-gradient">History</span>
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Every translation, saved locally on your device.</p>
        </div>

        <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
            <FiSearch className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your history..."
              aria-label="Search history"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'focus-ring rounded-xl border px-4 py-2 text-sm font-medium capitalize transition',
                  filter === f
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-end gap-2">
            <button
              onClick={handleExportCSV}
              className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiFileText /> Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiDownload /> Export PDF
            </button>
            <button
              onClick={handleClear}
              className="focus-ring flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              <FiTrash /> Clear all
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            title={history.length === 0 ? 'Nothing translated yet' : 'No matches found'}
            description={
              history.length === 0
                ? "Translate something and it'll show up here, ready to search or reuse."
                : 'Try a different search term or filter.'
            }
            actionLabel={history.length === 0 ? 'Go to translator' : undefined}
            onAction={history.length === 0 ? () => navigate('/translator') : undefined}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <HistoryCard key={item.id} item={item} onReuse={handleReuse} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </PageTransition>
  );
}

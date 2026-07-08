import { motion } from 'framer-motion';
import { FiStar, FiTrash2, FiCopy, FiArrowRight } from 'react-icons/fi';
import { getLanguageFlag, getLanguageName } from '../utils/languages';
import { useHistory } from '../context/HistoryContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function HistoryCard({ item, onReuse }) {
  const { deleteEntry, toggleFavorite } = useHistory();
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(item.translatedText);
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass rounded-2xl p-5 shadow-soft"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          {getLanguageFlag(item.fromLang)} {getLanguageName(item.fromLang)}
          <FiArrowRight />
          {getLanguageFlag(item.toLang)} {getLanguageName(item.toLang)}
        </span>
        <span>{new Date(item.timestamp).toLocaleString()}</span>
      </div>

      <p className="mb-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{item.sourceText}</p>
      <p className="mb-4 line-clamp-2 font-medium text-slate-700 dark:text-slate-200">{item.translatedText}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => toggleFavorite(item.id)}
            aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="focus-ring text-slate-300 hover:text-amber-400"
          >
            <FiStar className={item.isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
          </button>
          <button onClick={handleCopy} aria-label="Copy translation" className="focus-ring text-slate-300 hover:text-brand-500">
            <FiCopy />
          </button>
          <button onClick={() => deleteEntry(item.id)} aria-label="Delete entry" className="focus-ring text-slate-300 hover:text-red-500">
            <FiTrash2 />
          </button>
        </div>
        <button onClick={() => onReuse(item)} className="focus-ring text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
          Reuse
        </button>
      </div>
    </motion.div>
  );
}

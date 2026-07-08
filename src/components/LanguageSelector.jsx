import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { FiChevronDown, FiSearch, FiStar } from 'react-icons/fi';

export default function LanguageSelector({
  label,
  value,
  onChange,
  languages,
  favorites = [],
  onToggleFavorite,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return languages;
    const q = query.toLowerCase();
    return languages.filter((lang) => lang.name.toLowerCase().includes(q) || lang.code.toLowerCase().includes(q));
  }, [languages, query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, isOpen]);

  const selected = languages.find((lang) => lang.code === value);

  function selectLanguage(lang) {
    onChange(lang.code);
    setIsOpen(false);
    setQuery('');
  }

  function handleInputKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[highlightedIndex]) selectLanguage(filtered[highlightedIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-left shadow-sm transition hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/80"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-lg">{selected?.flag}</span>
          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
            {selected?.name || 'Select language'}
          </span>
        </span>
        <FiChevronDown className={clsx('shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass absolute z-30 mt-2 w-full overflow-hidden rounded-xl shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-slate-200/50 px-3 py-2 dark:border-slate-700/50">
              <FiSearch className="shrink-0 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search languages..."
                aria-label="Search languages"
                role="combobox"
                aria-expanded={isOpen}
                aria-controls="language-listbox"
                aria-activedescendant={filtered[highlightedIndex] ? `lang-option-${filtered[highlightedIndex].code}` : undefined}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
              />
            </div>
            <div id="language-listbox" role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 && <p className="px-4 py-3 text-sm text-slate-400">No languages found.</p>}
              {filtered.map((lang, index) => (
                <div
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  role="option"
                  aria-selected={lang.code === value}
                  onClick={() => selectLanguage(lang)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={clsx(
                    'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition',
                    (lang.code === value || index === highlightedIndex) &&
                      'bg-brand-50 dark:bg-white/10',
                    lang.code === value
                      ? 'font-semibold text-brand-700 dark:text-brand-300'
                      : 'text-slate-700 dark:text-slate-200'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {onToggleFavorite && lang.code !== 'auto' && (
                    <button
                      type="button"
                      aria-label={favorites.includes(lang.code) ? 'Remove from favorites' : 'Add to favorites'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(lang.code);
                      }}
                      className="text-slate-300 hover:text-amber-400"
                    >
                      <FiStar className={favorites.includes(lang.code) ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

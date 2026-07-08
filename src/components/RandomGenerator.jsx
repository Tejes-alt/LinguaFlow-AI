import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FiCopy, FiRefreshCw, FiSave, FiRotateCcw, FiHash, FiKey, FiTrash2 } from 'react-icons/fi';
import { generateRandomString, generateUUID, calculatePasswordStrength } from '../utils/generator';
import { useToast } from '../context/ToastContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MODES = [
  { id: 'custom', label: 'Custom String', icon: FiHash },
  { id: 'password', label: 'Strong Password', icon: FiKey },
  { id: 'uuid', label: 'UUID', icon: FiRefreshCw },
];

const DEFAULT_OPTIONS = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
};

const CHAR_TOGGLES = [
  ['uppercase', 'A-Z'],
  ['lowercase', 'a-z'],
  ['numbers', '0-9'],
  ['symbols', '!@#$'],
];

export default function RandomGenerator() {
  const [mode, setMode] = useState('custom');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [result, setResult] = useState('');
  const [savedItems, setSavedItems] = useLocalStorage('linguaflow-saved-strings', []);
  const { showToast } = useToast();

  const generate = useCallback(() => {
    if (mode === 'uuid') {
      setResult(generateUUID());
    } else if (mode === 'password') {
      setResult(generateRandomString({ ...options, uppercase: true, lowercase: true, numbers: true, symbols: true }));
    } else {
      setResult(generateRandomString(options));
    }
  }, [mode, options]);

  useEffect(() => {
    generate();
    // Regenerate only when the mode changes — option tweaks wait for the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    showToast('Copied to clipboard!', 'success');
  }, [result, showToast]);

  const handleReset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setMode('custom');
  }, []);

  const handleSave = useCallback(() => {
    if (!result) return;
    setSavedItems((prev) => [{ id: Date.now(), value: result, mode, createdAt: Date.now() }, ...prev].slice(0, 50));
    showToast('Saved!', 'success');
  }, [result, mode, setSavedItems, showToast]);

  const handleDeleteSaved = (id) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const strength = mode !== 'uuid' && result ? calculatePasswordStrength(result) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass rounded-3xl p-6 shadow-soft md:p-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={clsx(
                'focus-ring flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition',
                mode === id
                  ? 'border-brand-500 bg-brand-gradient text-white shadow-glow'
                  : 'border-slate-200 bg-white/70 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
              )}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        <motion.div
          key={result}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-6 break-all rounded-2xl border border-slate-200 bg-white/70 p-6 text-center font-mono text-xl font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
        >
          {result || '—'}
        </motion.div>

        {strength && (
          <div className="mb-6">
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Strength</span>
              <span>{strength.label}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={false}
                animate={{ width: `${strength.percent}%` }}
                transition={{ duration: 0.3 }}
                className={clsx('h-full rounded-full', strength.barClass)}
              />
            </div>
          </div>
        )}

        {mode !== 'uuid' && (
          <div className="mb-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>Length</span>
                <span className="font-mono">{options.length}</span>
              </div>
              <input
                type="range"
                min={4}
                max={64}
                value={options.length}
                onChange={(e) => handleOptionChange('length', Number(e.target.value))}
                className="w-full accent-brand-500"
                aria-label="String length"
              />
            </div>

            {mode === 'custom' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CHAR_TOGGLES.map(([key, display]) => (
                  <label
                    key={key}
                    className="focus-ring flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => handleOptionChange(key, e.target.checked)}
                      className="accent-brand-500"
                    />
                    {display}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={generate}
            className="focus-ring flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow"
          >
            <FiRefreshCw /> Generate
          </motion.button>
          <button
            onClick={handleCopy}
            className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiCopy /> Copy
          </button>
          <button
            onClick={handleSave}
            className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiSave /> Save
          </button>
          <button
            onClick={handleReset}
            className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiRotateCcw /> Reset
          </button>
        </div>
      </div>

      {savedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
            Saved ({savedItems.length})
          </h3>
          <div className="space-y-2">
            {savedItems.map((item) => (
              <div key={item.id} className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                <span className="truncate font-mono text-sm text-slate-600 dark:text-slate-300">{item.value}</span>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.value);
                      showToast('Copied!', 'success');
                    }}
                    className="focus-ring text-slate-400 hover:text-brand-500"
                    aria-label="Copy saved item"
                  >
                    <FiCopy />
                  </button>
                  <button
                    onClick={() => handleDeleteSaved(item.id)}
                    className="focus-ring text-slate-400 hover:text-red-500"
                    aria-label="Delete saved item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

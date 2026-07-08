import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  FiCopy,
  FiTrash2,
  FiRepeat,
  FiVolume2,
  FiDownload,
  FiShare2,
  FiMic,
  FiClipboard,
  FiUploadCloud,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import LanguageSelector from './LanguageSelector.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import Confetti from './Confetti.jsx';
import { LANGUAGES, getLanguageName, getSpeechLocale } from '../utils/languages';
import { countWords, countCharacters } from '../utils/textStats';
import { downloadTextFile } from '../utils/exportUtils';
import { generateUUID } from '../utils/generator';
import { translateText, TranslationError } from '../services/rapidApi';
import { useHistory } from '../context/HistoryContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useSpeechRecognition, useTextToSpeech } from '../hooks/useSpeech';

const MAX_CHARACTERS = 5000;
const TARGET_LANGUAGES = LANGUAGES.filter((lang) => lang.code !== 'auto');

export default function TranslatorCard({ initialData = null }) {
  const [sourceText, setSourceText] = useState('');
  const [fromLang, setFromLang] = useState('auto');
  const [toLang, setToLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [recentLanguages, setRecentLanguages] = useLocalStorage('linguaflow-recent-languages', []);
  const [favoriteLanguages, setFavoriteLanguages] = useLocalStorage('linguaflow-favorite-languages', [
    'es',
    'fr',
    'de',
  ]);
  const fileInputRef = useRef(null);

  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { isSupported: sttSupported, isListening, startListening, stopListening } = useSpeechRecognition();
  const { isSupported: ttsSupported, isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech();

  useEffect(() => {
    if (!initialData) return;
    setSourceText(initialData.sourceText || '');
    setTranslatedText(initialData.translatedText || '');
    setFromLang(initialData.fromLang || 'auto');
    setToLang(initialData.toLang || 'es');
    setDetectedLang(initialData.detectedLang || null);
    setConfidence(initialData.confidence ?? null);
  }, [initialData]);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setError('Enter some text to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await translateText({ text: sourceText, from: fromLang, to: toLang });
      setTranslatedText(result.translatedText);
      setDetectedLang(result.detectedLang);
      setConfidence(result.confidence);
      setConfettiTrigger((t) => t + 1);

      addEntry({
        id: generateUUID(),
        sourceText,
        translatedText: result.translatedText,
        fromLang: result.detectedLang || fromLang,
        toLang,
        detectedLang: result.detectedLang,
        confidence: result.confidence,
        isFavorite: false,
        timestamp: Date.now(),
      });

      setRecentLanguages((prev) => [toLang, ...prev.filter((code) => code !== toLang)].slice(0, 5));
      showToast('Translated!', 'success');
    } catch (err) {
      const message = err instanceof TranslationError ? err.message : 'Something went wrong. Try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, fromLang, toLang, addEntry, setRecentLanguages, showToast]);

  const handleSwap = useCallback(() => {
    if (fromLang === 'auto' && !detectedLang) {
      showToast('Translate something first so there is a language to swap from.', 'info');
      return;
    }
    const newTo = fromLang === 'auto' ? detectedLang : fromLang;
    const newFrom = toLang;
    setFromLang(newFrom);
    setToLang(newTo);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setDetectedLang(null);
    setConfidence(null);
  }, [fromLang, toLang, detectedLang, sourceText, translatedText, showToast]);

  const handleCopy = useCallback(() => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    showToast('Copied to clipboard!', 'success');
  }, [translatedText, showToast]);

  const handleClear = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
    setDetectedLang(null);
    setConfidence(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (!translatedText) return;
    downloadTextFile(translatedText, `translation-${toLang}.txt`);
    showToast('Download started!', 'success');
  }, [translatedText, toLang, showToast]);

  const handleShare = useCallback(async () => {
    if (!translatedText) return;
    if (navigator.share) {
      try {
        await navigator.share({ text: translatedText, title: 'LinguaFlow AI Translation' });
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
    } else {
      navigator.clipboard.writeText(translatedText);
      showToast('Sharing is not supported here — copied instead.', 'info');
    }
  }, [translatedText, showToast]);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSourceText((prev) => (prev ? `${prev} ${text}` : text).slice(0, MAX_CHARACTERS));
    } catch {
      showToast('Clipboard access was denied by your browser.', 'error');
    }
  }, [showToast]);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) {
        showToast('Only plain .txt files are supported for upload.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setSourceText(String(e.target.result).slice(0, MAX_CHARACTERS));
      reader.readAsText(file);
    },
    [showToast]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);
      handleFile(event.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening({
      lang: getSpeechLocale(fromLang === 'auto' ? 'en' : fromLang),
      onResult: (transcript) => setSourceText((prev) => (prev ? `${prev} ${transcript}` : transcript)),
      onError: () => showToast('Could not access your microphone.', 'error'),
    });
  }, [isListening, startListening, stopListening, fromLang, showToast]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    speak(translatedText, getSpeechLocale(toLang));
  }, [isSpeaking, stopSpeaking, speak, translatedText, toLang]);

  const toggleFavoriteLanguage = useCallback(
    (code) => {
      setFavoriteLanguages((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    },
    [setFavoriteLanguages]
  );

  useKeyboardShortcut([
    { key: 'Enter', ctrlOrCmd: true, preventDefault: true, handler: handleTranslate },
    { key: 'Escape', ctrlOrCmd: false, preventDefault: false, handler: handleClear },
    {
      key: 'c',
      ctrlOrCmd: true,
      preventDefault: false,
      handler: () => {
        const selection = window.getSelection()?.toString();
        if (!selection && translatedText) handleCopy();
      },
    },
  ]);

  const quickLanguages = [...new Set([...favoriteLanguages, ...recentLanguages])].slice(0, 6);

  return (
    <div className="relative mx-auto max-w-5xl">
      <Confetti trigger={confettiTrigger} />
      <div className="glass rounded-3xl p-6 shadow-soft md:p-8">
        <div className="mb-5 grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <LanguageSelector
            label="From"
            value={fromLang}
            onChange={setFromLang}
            languages={LANGUAGES}
            favorites={favoriteLanguages}
            onToggleFavorite={toggleFavoriteLanguage}
          />
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap languages"
            className="focus-ring mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-sm transition hover:rotate-180 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-400"
          >
            <FiRepeat />
          </button>
          <LanguageSelector
            label="To"
            value={toLang}
            onChange={setToLang}
            languages={TARGET_LANGUAGES}
            favorites={favoriteLanguages}
            onToggleFavorite={toggleFavoriteLanguage}
          />
        </div>

        {quickLanguages.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {quickLanguages.map((code) => (
              <button
                key={code}
                onClick={() => setToLang(code)}
                className={clsx(
                  'focus-ring rounded-full border px-3 py-1 text-xs font-medium transition',
                  toLang === code
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                )}
              >
                {getLanguageName(code)}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Source panel */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={clsx(
              'relative rounded-2xl border-2 border-dashed p-1 transition',
              isDragging ? 'border-brand-400 bg-brand-50/50 dark:bg-brand-500/10' : 'border-transparent'
            )}
          >
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARACTERS))}
              placeholder="Type, paste, or drop a .txt file here..."
              rows={8}
              className="focus-ring w-full resize-none rounded-xl border border-slate-200 bg-white/70 p-4 text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono">
                {countCharacters(sourceText)} / {MAX_CHARACTERS} · {countWords(sourceText)} words
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handlePasteFromClipboard}
                  className="focus-ring flex items-center gap-1 hover:text-brand-500"
                  title="Paste from clipboard"
                >
                  <FiClipboard /> Paste
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring flex items-center gap-1 hover:text-brand-500"
                  title="Upload a .txt file"
                >
                  <FiUploadCloud /> Upload
                </button>
                {sttSupported && (
                  <button
                    onClick={handleMicClick}
                    className={clsx(
                      'focus-ring flex items-center gap-1 hover:text-brand-500',
                      isListening && 'animate-pulse text-red-500'
                    )}
                    title="Speak to type"
                  >
                    <FiMic /> {isListening ? 'Listening…' : 'Speak'}
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Result panel */}
          <div className="relative rounded-2xl">
            {isLoading ? (
              <SkeletonCard lines={4} className="h-full min-h-[10rem]" />
            ) : (
              <textarea
                readOnly
                value={translatedText}
                placeholder="Your translation will appear here..."
                rows={8}
                className="focus-ring w-full resize-none rounded-xl border border-slate-200 bg-white/70 p-4 text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
              />
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                {detectedLang && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                    Detected: {getLanguageName(detectedLang)}
                  </span>
                )}
                {confidence !== null && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {Math.round(confidence * 100)}% detection confidence
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {ttsSupported && (
                  <button
                    onClick={handleSpeak}
                    disabled={!translatedText}
                    className="focus-ring flex items-center gap-1 hover:text-brand-500 disabled:opacity-40"
                    title="Listen"
                  >
                    <FiVolume2 /> {isSpeaking ? 'Stop' : 'Listen'}
                  </button>
                )}
                <button
                  onClick={handleShare}
                  disabled={!translatedText}
                  className="focus-ring flex items-center gap-1 hover:text-brand-500 disabled:opacity-40"
                  title="Share"
                >
                  <FiShare2 /> Share
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!translatedText}
                  className="focus-ring flex items-center gap-1 hover:text-brand-500 disabled:opacity-40"
                  title="Download"
                >
                  <FiDownload /> Save
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="focus-ring flex items-center gap-1 hover:text-brand-500 disabled:opacity-40"
                  title="Copy"
                >
                  <FiCopy /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
            >
              <FiAlertCircle className="shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleClear}
            className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiTrash2 /> Clear
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleTranslate}
            disabled={isLoading}
            className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-brand-gradient bg-[length:200%_200%] px-6 py-3 font-semibold text-white shadow-glow transition hover:animate-gradient-shift disabled:opacity-70"
          >
            {isLoading ? <LoadingSpinner size={18} colorClass="border-white/30 border-t-white" /> : <FiCheckCircle />}
            {isLoading ? 'Translating…' : 'Translate (Ctrl + Enter)'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

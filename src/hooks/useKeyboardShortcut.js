import { useEffect, useRef } from 'react';

/**
 * Registers global keyboard shortcuts for as long as the calling component
 * is mounted.
 *
 * @param {Array<{ key: string, ctrlOrCmd?: boolean, preventDefault?: boolean, handler: (e: KeyboardEvent) => void }>} shortcuts
 *
 * The listener itself is attached once; a ref always holds the latest
 * `shortcuts` array so handlers never close over stale state, without
 * re-subscribing on every render.
 */
export function useKeyboardShortcut(shortcuts) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    function handleKeyDown(event) {
      for (const shortcut of shortcutsRef.current) {
        const { key, ctrlOrCmd = false, preventDefault = false, handler } = shortcut;
        const modifierSatisfied = ctrlOrCmd ? event.ctrlKey || event.metaKey : true;
        if (modifierSatisfied && event.key.toLowerCase() === key.toLowerCase()) {
          if (preventDefault) event.preventDefault();
          handler(event);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

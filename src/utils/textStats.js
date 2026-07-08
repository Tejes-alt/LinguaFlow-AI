export function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function countCharacters(text) {
  return text ? text.length : 0;
}

export function countSentences(text) {
  if (!text || !text.trim()) return 0;
  const matches = text.match(/[^.!?]+[.!?]+/g);
  return matches ? matches.length : 1;
}

export function estimateReadingTime(text) {
  const WORDS_PER_MINUTE = 200;
  const words = countWords(text);
  const minutes = words / WORDS_PER_MINUTE;
  return minutes < 1 ? '< 1 min read' : `${Math.ceil(minutes)} min read`;
}

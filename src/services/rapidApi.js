import axios from 'axios';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'microsoft-translator-text.p.rapidapi.com';

export class TranslationError extends Error {
  constructor(message, { code, isMissingKey = false, isRateLimit = false, isNetwork = false } = {}) {
    super(message);
    this.name = 'TranslationError';
    this.code = code;
    this.isMissingKey = isMissingKey;
    this.isRateLimit = isRateLimit;
    this.isNetwork = isNetwork;
  }
}

const client = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  timeout: 15000,
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

/**
 * Translates text using the Microsoft Translator Text API (via RapidAPI),
 * which mirrors Azure Cognitive Services Translator v3:
 *
 *   POST /translate?api-version=3.0&to=<lang>[&from=<lang>]
 *   Body: [{ Text: string }]
 *   Response: [{ detectedLanguage?: { language, score }, translations: [{ text, to }] }]
 *
 * Subscribing to a different RapidAPI translation provider instead? This is
 * the only function that needs to change — adjust the request below and the
 * mapping in the returned object to match that provider's shape.
 */
export async function translateText({ text, from = 'auto', to }) {
  if (!text || !text.trim()) {
    throw new TranslationError('Enter some text to translate.');
  }
  if (!RAPIDAPI_KEY) {
    throw new TranslationError('No RapidAPI key found. Add VITE_RAPIDAPI_KEY to your .env file.', {
      isMissingKey: true,
    });
  }

  try {
    const params = { 'api-version': '3.0', to };
    if (from && from !== 'auto') params.from = from;

    const { data } = await client.post('/translate', [{ Text: text }], { params });
    const result = data?.[0];
    const translation = result?.translations?.[0];

    if (!translation) {
      throw new TranslationError('The translation response was empty or malformed.');
    }

    return {
      translatedText: translation.text,
      toLang: translation.to,
      detectedLang: result?.detectedLanguage?.language || (from !== 'auto' ? from : null),
      confidence: result?.detectedLanguage?.score ?? null,
    };
  } catch (error) {
    if (error instanceof TranslationError) throw error;

    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new TranslationError('That RapidAPI key was rejected — double-check it in your .env file.', {
          code: status,
          isMissingKey: true,
        });
      }
      if (status === 429) {
        throw new TranslationError('Rate limit reached — wait a moment and try again.', {
          code: status,
          isRateLimit: true,
        });
      }
      throw new TranslationError(
        error.response.data?.error?.message || `Translation failed (status ${status}).`,
        { code: status }
      );
    }

    if (error.request) {
      throw new TranslationError('Network error — check your internet connection.', { isNetwork: true });
    }

    throw new TranslationError(error.message || 'Something went wrong during translation.');
  }
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function secureRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

/** Builds a random string from the requested character pools. */
export function generateRandomString({
  length = 16,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = false,
}) {
  let pool = '';
  if (uppercase) pool += CHAR_SETS.uppercase;
  if (lowercase) pool += CHAR_SETS.lowercase;
  if (numbers) pool += CHAR_SETS.numbers;
  if (symbols) pool += CHAR_SETS.symbols;

  // Never return an empty string, even if the caller unchecked every option.
  if (!pool) pool = CHAR_SETS.lowercase;

  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[secureRandomInt(pool.length)];
  }
  return result;
}

/** RFC 4122 version-4 UUID, using the native API when available. */
export function generateUUID() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = secureRandomInt(16);
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Simple heuristic strength score. `barClass` is a complete Tailwind class
 *  (never constructed dynamically) so the JIT compiler can find it. */
export function calculatePasswordStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 2) return { label: 'Weak', barClass: 'bg-red-500', percent: 25 };
  if (score <= 4) return { label: 'Medium', barClass: 'bg-amber-500', percent: 55 };
  if (score <= 5) return { label: 'Strong', barClass: 'bg-blue-500', percent: 80 };
  return { label: 'Very Strong', barClass: 'bg-emerald-500', percent: 100 };
}

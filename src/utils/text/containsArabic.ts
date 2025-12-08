/**
 * Check if a string contains Arabic characters
 * @param input - The string to check
 * @returns boolean
 */
export function containsArabic(input: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(input);
}

/**
 * Check if a string contains **only** Arabic characters (and spaces)
 * @param input - The string to check
 * @returns boolean
 */
export function isArabicOnly(input: string): boolean {
  const arabicOnlyRegex = /^[\u0600-\u06FF\s]+$/;
  return arabicOnlyRegex.test(input);
}

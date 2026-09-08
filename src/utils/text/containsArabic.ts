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

/**
 * Checks if a string contains only English letters with numbers
 * @param input - The input string
 * @returns boolean
 */
export function isArabicWithNumOnly(input: string): boolean {
  const arabicAndNumOnlyRegex = /^[\u0600-\u06FF0-9\s]+$/;
  return arabicAndNumOnlyRegex.test(input);
}

/**
 * Checks if a string contains only Arabic letters, numbers, and common punctuation
 * (dots, commas, exclamation/question marks, colons, semicolons, hyphens,
 * parentheses, and both Arabic/Latin comma & question mark variants)
 * @param input - The input string
 * @returns boolean
 */
export function isArabicWithNumAndPunctuationOnly(input: string): boolean {
  const arabicNumPunctRegex = /^[\u0600-\u06FF0-9\s.,!?:;()\-،؛؟]+$/;
  return arabicNumPunctRegex.test(input);
}

/**
 * Checks if a string contains at least one English letter (A-Z or a-z)
 * @param input - The input string
 * @returns boolean
 */
export function containsEnglish(input: string): boolean {
  const englishRegex = /[A-Za-z]/;
  return englishRegex.test(input);
}

/**
 * Checks if a string contains only English letters (and optionally spaces)
 * @param input - The input string
 * @returns boolean
 */
export function isEnglishOnly(input: string): boolean {
  const englishOnlyRegex = /^[A-Za-z\s]+$/;
  return englishOnlyRegex.test(input);
}

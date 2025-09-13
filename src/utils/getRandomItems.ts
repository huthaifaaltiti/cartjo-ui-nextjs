/*
getRandomItems returns up to numItems randomly chosen elements from arr, without repeating elements (sampling without replacement). It does that by shuffling a copy of the array and returning the first numItems elements.
*/

/*
) Line-by-line walkthrough

const shuffled = [...arr];

Creates a shallow copy of the input array using array spread.

Important: this preserves the original arr (we don’t mutate the caller’s array).

for (let i = shuffled.length - 1; i > 0; i--) { ... }

This loop implements the Fisher–Yates (Knuth) shuffle.

i starts at the last index and goes down to 1. We stop at 1 because when i === 0 there’s nothing left to swap (only a single element).

const j = Math.floor(Math.random() * (i + 1));

Math.random() returns a float in [0, 1).

Multiplying by (i + 1) produces a float in [0, i+1).

Math.floor(...) converts it to an integer in the inclusive range [0, i].

This uniformly picks an index among elements 0..i.

[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

Swaps elements at indices i and j using destructuring.

After the loop completes, shuffled is a uniformly random permutation of the original array.

return shuffled.slice(0, numItems);

Returns the first numItems elements of the shuffled array.

If numItems > shuffled.length, slice will simply return the whole shuffled array (no error).
*/
export const getRandomItems = <T>(arr: T[], numItems: number): T[] => {
  const shuffled = [...arr];

  // Fisher–Yates (Knuth) shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, numItems);
};

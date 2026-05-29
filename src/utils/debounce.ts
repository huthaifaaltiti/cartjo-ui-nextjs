export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  const debounced = (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}

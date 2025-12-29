// export function debounce<T extends (...args: unknown[]) => void>(
//   fn: T,
//   delay: number
// ) {
//   let timer: ReturnType<typeof setTimeout>;

//   return (...args: Parameters<T>) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// }

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

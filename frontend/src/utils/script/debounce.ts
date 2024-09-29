export function debounce<T>(
  func: (...args: T[]) => unknown,
  delay = 200
): typeof func {
  let timeout: Timer;
  return function (...args: T[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

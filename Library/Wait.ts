/**
 * Wait for some time.
 *
 * @param ms The time to wait for in milliseconds before the promise resolves.
 */
export function wait(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Wait for a random period before the promise resolves. Returns the number of milliseconds waited.
 *
 * @param minMilliseconds The minimum time, in milliseconds, to wait for before the promise resolves.
 * @param maxMilliseconds The maximum time, in milliseconds, to wait for before the promise resolves.
 */
export function waitRandomly(
  minMilliseconds: number,
  maxMilliseconds: number
): Promise<number> {
  minMilliseconds = Math.ceil(minMilliseconds)
  maxMilliseconds = Math.floor(maxMilliseconds)

  const ms =
    Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) +
    minMilliseconds

  return wait(ms).then(() => ms)
}

/**
 * Copy `obj` without the keys whose value is `undefined`.
 *
 * Vue materialises every declared prop on `props` (unset ones as `undefined`),
 * so spreading `props` into a child forwards dozens of empty keys that the
 * child then has to normalise in `initProps` / `setFullProps` on every mount.
 * Boolean props in this code base default to `undefined` rather than `false`,
 * so leaving an unset key out is equivalent to passing it as `undefined`.
 */
export function omitUndefined<T extends Record<string, any>>(obj: T, omitKeys: readonly string[] = []): Partial<T> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    const value = obj[key]
    if (value !== undefined && !omitKeys.includes(key)) {
      result[key] = value
    }
  }
  return result as Partial<T>
}

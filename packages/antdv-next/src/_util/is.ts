import isNonNullable from './isNonNullable'

export function isRenderable<T>(val: T): val is Exclude<NonNullable<T>, false | ''> {
  return isNonNullable(val) && (val as unknown) !== false && (val as unknown) !== ''
}

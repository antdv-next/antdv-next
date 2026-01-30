export function isValueEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b))
    return true

  // 不同类型，直接不等
  if (typeof a !== typeof b)
    return false

  // 对象 / 函数：只认同一引用
  if ((typeof a === 'object' && a !== null) || typeof a === 'function') {
    return false
  }

  // 其他原始类型已经在 Object.is 里处理过
  return false
}

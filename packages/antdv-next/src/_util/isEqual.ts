/**
 * 判断两个值是否相等（支持对象比较）
 * @param val1 第一个值
 * @param val2 第二个值
 * @returns 是否相等
 */
export function isValueEqual<T>(val1: T, val2: T): boolean {
  if (val1 === val2)
    return true
  if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
    return JSON.stringify(val1) === JSON.stringify(val2)
  }
  return false
}

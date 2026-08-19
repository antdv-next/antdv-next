/**
 * 七夕（农历七月初七）对应的公历日期表。
 * 农历转换引库不划算，维护未来几年的日期即可，到期后在此追加。
 */
export const QIXI_DATES = [
  '2024-08-10',
  '2025-08-29',
  '2026-08-18',
  '2027-08-08',
  '2028-08-26',
  '2029-08-16',
  '2030-08-05',
]

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isQixiToday(now = new Date()) {
  try {
    // 调试开关：localStorage.setItem('qixi-force', '1') 可随时预览节日态
    if (localStorage.getItem('qixi-force') === '1')
      return true
  }
  catch {}
  if (QIXI_DATES.includes(toDateKey(now)))
    return true
  // 七夕夜跨过午夜仍算节日，延续到次日凌晨 6 点
  if (now.getHours() < 6)
    return QIXI_DATES.includes(toDateKey(new Date(now.getTime() - 86400000)))
  return false
}

/** 下一个七夕（含今天），日期表覆盖不到时返回 null */
export function nextQixiDate(now = new Date()): Date | null {
  const todayKey = toDateKey(now)
  const next = QIXI_DATES.find(d => d >= todayKey)
  return next ? new Date(`${next}T00:00:00`) : null
}

/** 距下次七夕的天数，0 表示今天就是 */
export function daysUntilNextQixi(now = new Date()): number | null {
  if (isQixiToday(now))
    return 0
  const next = nextQixiDate(now)
  if (!next)
    return null
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((next.getTime() - startOfToday.getTime()) / 86400000)
}

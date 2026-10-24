/**
 * 节日彩蛋的通用日期判断。
 *
 * dates 支持两种写法：
 *   'MM-DD'       每年固定的公历日期（如程序员节 '10-24'）
 *   'YYYY-MM-DD'  逐年维护的具体日期（如七夕、春节这类农历节日）
 */
export interface Festival {
  dates: string[]
  /** 调试开关：localStorage.setItem(forceKey, '1') 可随时预览节日态 */
  forceKey: string
  /** 节日夜跨过午夜仍算节日，延续到次日凌晨的小时数，默认 6 */
  graceHours?: number
}

const DAY_MS = 86400000

function pad(n: number) {
  return `${n}`.padStart(2, '0')
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function matchDate(festival: Festival, date: Date) {
  const full = toDateKey(date)
  const monthDay = full.slice(5)
  return festival.dates.some(d => d === full || d === monthDay)
}

function isForced(festival: Festival) {
  try {
    return localStorage.getItem(festival.forceKey) === '1'
  }
  catch {
    return false
  }
}

export function isFestivalToday(festival: Festival, now = new Date()) {
  if (isForced(festival) || matchDate(festival, now))
    return true
  if (now.getHours() < (festival.graceHours ?? 6))
    return matchDate(festival, new Date(now.getTime() - DAY_MS))
  return false
}

/** 下一个节日（含今天），日期表覆盖不到时返回 null */
export function nextFestivalDate(festival: Festival, now = new Date()): Date | null {
  const todayKey = toDateKey(now)
  const candidates = festival.dates.flatMap((d) => {
    if (d.length === 10)
      return [d]
    // 'MM-DD'：今年和明年各取一次，保证总能找到下一次
    const year = now.getFullYear()
    return [`${year}-${d}`, `${year + 1}-${d}`]
  })
  const next = candidates.filter(d => d >= todayKey).sort()[0]
  return next ? new Date(`${next}T00:00:00`) : null
}

/** 距下个节日的天数，0 表示今天就是 */
export function daysUntilFestival(festival: Festival, now = new Date()): number | null {
  if (isFestivalToday(festival, now))
    return 0
  const next = nextFestivalDate(festival, now)
  if (!next)
    return null
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((next.getTime() - startOfToday.getTime()) / DAY_MS)
}

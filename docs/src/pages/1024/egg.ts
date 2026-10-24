import { TEXT_1024 } from './bitmaps'

let printed = false

/** 控制台彩蛋：打开 DevTools 的人，会先在这里看到 1024 */
export function printCoderDayConsoleEgg() {
  if (printed || typeof console === 'undefined')
    return
  printed = true
  const url = `${window.location.origin}/1024`
  const art = TEXT_1024.map(row => `  ${row.replace(/#/g, '█').replace(/\./g, ' ')}`).join('\n')

  console.log(
    '%c</> 1024 · Programmer\'s Day %c\n\n%c%s%c\n\n  0b10000000000 · 0x400 · 2¹⁰\n\n  程序员节快乐 / Happy 1024 → %c%s%c\n',
    'background: linear-gradient(120deg, #42b883, #1677ff); color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold;',
    'color: inherit;',
    'color: #42b883; line-height: 1;',
    art,
    'color: inherit;',
    'color: #1677ff; font-weight: bold;',
    url,
    'color: inherit;',
  )
}

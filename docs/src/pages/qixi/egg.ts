let printed = false

/** 控制台彩蛋：给打开 DevTools 的有心人留一条去鹊桥的路 */
export function printQixiConsoleEgg() {
  if (printed || typeof console === 'undefined')
    return
  printed = true
  const url = `${window.location.origin}/qixi`

  console.log(
    '%c✦ 七夕 · 鹊桥相会 ✦%c\n\n  牛郎星 %cAnt Design%c ⋯⋯🐦🐦🐦⋯⋯ %cVue%c 织女星\n\n  彩蛋在这里 → %c%s%c\n',
    'background: linear-gradient(120deg, #42b883, #1677ff); color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold;',
    'color: inherit;',
    'color: #1677ff; font-weight: bold;',
    'color: inherit;',
    'color: #42b883; font-weight: bold;',
    'color: inherit;',
    'color: #ff85c0; font-weight: bold;',
    url,
    'color: inherit;',
  )
}

/**
 * 1024 控制台的命令。界面仿浏览器 DevTools Console，命令写成函数调用；
 * 不带括号的写法（help、sudo rm -rf /）也认，打错了就像真控制台一样报 ReferenceError。
 */
export type Lang = 'cn' | 'en'

export type ConsoleLine
  = | { kind: 'input', text: string }
    | { kind: 'log', text: string, tone?: 'muted' | 'success' | 'warn' }
    | { kind: 'error', text: string }
    | { kind: 'pre', text: string }
    | { kind: 'links', items: { label: string, to: string }[] }

export type CommandEffect = 'clear' | 'play' | 'glitch' | 'exit' | 'celebrate'

export interface CommandResult {
  lines: ConsoleLine[]
  effect?: CommandEffect
}

export interface CommandContext {
  lang: Lang
  components: { label: string, to: string }[]
  gameRunning: boolean
}

/** Tab 补全和快捷按钮用的命令列表 */
export const COMMANDS = ['help()', 'whoami()', 'ls()', 'fortune()', 'coffee()', 'play()', 'git.blame()', 'sudo.rm(\'-rf /\')', 'clear()', 'exit()']

const HELP: Record<Lang, [string, string][]> = {
  cn: [
    ['help()', '列出所有命令'],
    ['whoami()', '我是谁'],
    ['ls()', '列出 antdv-next 的全部组件'],
    ['fortune()', '抽一条程序员箴言'],
    ['coffee()', '续命'],
    ['play()', '打虫子：30 秒内点掉矩阵里的 🐛'],
    ['git.blame()', '这行是谁写的？'],
    ['sudo.rm(\'-rf /\')', '别试'],
    ['clear()', '清空控制台'],
    ['exit()', '回到文档'],
  ],
  en: [
    ['help()', 'list all commands'],
    ['whoami()', 'who am I'],
    ['ls()', 'list every antdv-next component'],
    ['fortune()', 'draw a programmer proverb'],
    ['coffee()', 'refuel'],
    ['play()', 'bug hunt: squash the 🐛 in 30 seconds'],
    ['git.blame()', 'who wrote this line?'],
    ['sudo.rm(\'-rf /\')', 'don\'t'],
    ['clear()', 'clear the console'],
    ['exit()', 'back to the docs'],
  ],
}

const FORTUNES: Record<Lang, string[]> = {
  cn: [
    '它在我电脑上是好的。',
    '计算机科学只有两大难题：缓存失效、命名，以及差一错误。',
    '删掉的代码，是永远不会出 bug 的代码。',
    '先让它跑起来，再让它对，最后让它快。',
    '今天的 TODO，就是明天的技术债。',
    '注释写的是你想做什么，代码写的是你真正做了什么。',
    '代码里有 99 个 bug，修掉一个，再跑一遍，现在有 127 个。',
    'git push --force 之前，先深呼吸。',
    '没有测试的重构，叫重写。',
    '你写的不是代码，是写给半年后自己的一封信。',
    '周五下午不发版。',
    '遇事不决，console.log。',
    '最快的代码，是不用执行的代码。',
    '能复现的 bug，已经修好了一半。',
    '命名十分钟，编码五分钟。',
    '2¹⁰ = 1024，今天的你值得一个整数的休息。',
  ],
  en: [
    'It works on my machine.',
    'There are two hard things in CS: cache invalidation, naming things, and off-by-one errors.',
    'Deleted code is the only code with zero bugs.',
    'Make it work, make it right, make it fast — in that order.',
    'Today\'s TODO is tomorrow\'s tech debt.',
    'Comments say what you meant; code says what you did.',
    '99 bugs in the code. Fix one, run it again: 127 bugs in the code.',
    'Take a deep breath before git push --force.',
    'A refactor without tests is a rewrite.',
    'You are not writing code; you are writing a letter to yourself six months from now.',
    'Never deploy on a Friday afternoon.',
    'When in doubt, console.log.',
    'The fastest code is the code that never runs.',
    'A bug you can reproduce is a bug half fixed.',
    'Ten minutes naming, five minutes coding.',
    '2¹⁰ = 1024. Today you deserve a round-number break.',
  ],
}

const COFFEE = [
  '      ( (',
  '       ) )',
  '    ........',
  '    |      |]',
  '    \\      /',
  '     `----\'',
].join('\n')

const TEXT = {
  cn: {
    helpTitle: '可用命令：',
    helpHint: '// psst… 在矩阵外按 ↑↑↓↓←→←→BA，或者输入 konami()',
    whoami: '一位今天值得准时下班的开发者 🧑‍💻',
    lsSummary: '共 {n} 个组件，点一下去看文档：',
    coffee: 'HTTP 418 I\'m a teapot —— 不过今天破例给你冲一杯 ☕',
    blame: '是你写的，三个月前。🙂',
    sudo: 'Uncaught PermissionError: 今天是 1024，连根目录都放假了',
    play: '🐛 虫子要从矩阵里冒出来了，30 秒内尽量点掉它们！',
    playing: '游戏已经在进行中了，快去矩阵里抓虫子 🐛',
    konami: '🎉 秘籍已生效：1024 个 bit 全部点亮！',
    binary: '1024  // 0b10000000000 · 0x400 · 2¹⁰',
    bye: '下班！回到文档…',
  },
  en: {
    helpTitle: 'Available commands:',
    helpHint: '// psst… press ↑↑↓↓←→←→BA outside the console, or type konami()',
    whoami: 'a developer who deserves to log off on time today 🧑‍💻',
    lsSummary: '{n} components — click one to open its docs:',
    coffee: 'HTTP 418 I\'m a teapot — brewing you one anyway, just for today ☕',
    blame: 'It was you. Three months ago. 🙂',
    sudo: 'Uncaught PermissionError: it\'s 1024 — even / has the day off',
    play: '🐛 Bugs are about to crawl out of the grid. Squash as many as you can in 30s!',
    playing: 'A game is already running — go catch those bugs 🐛',
    konami: '🎉 Cheat code accepted: all 1024 bits are lit!',
    binary: '1024  // 0b10000000000 · 0x400 · 2¹⁰',
    bye: 'Logging off… back to the docs',
  },
}

let lastFortune = -1

function fortune(lang: Lang) {
  const list = FORTUNES[lang]
  let i = Math.floor(Math.random() * list.length)
  if (i === lastFortune)
    i = (i + 1) % list.length
  lastFortune = i
  return list[i]!
}

/** 把各种写法归一成命令名：`help`、`help()`、`help();` → `help` */
function normalize(input: string) {
  const text = input.trim().replace(/;+$/, '').trim()
  const compact = text.replace(/\s+/g, ' ')
  if (/^sudo(?:\.rm\s*\(.*\)| rm\b.*)$/.test(compact))
    return 'sudo.rm'
  if (/^git(?:\.blame\s*\(.*\)| blame\b.*)$/.test(compact))
    return 'git.blame'
  const call = compact.match(/^([\w$.]+)\s*\(.*\)$/)
  if (call)
    return call[1]!
  return compact
}

const BINARY_ALIASES = new Set(['1024', '2 ** 10', '2**10', '1 << 10', '1<<10', '0x400', '0b10000000000', 'Math.pow(2, 10)', 'Math.pow(2,10)'])

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const t = TEXT[ctx.lang]
  const raw = input.trim().replace(/;+$/, '').trim()
  if (BINARY_ALIASES.has(raw))
    return { lines: [{ kind: 'log', text: t.binary, tone: 'success' }] }

  const name = normalize(input)
  switch (name) {
    case 'help':
      return {
        lines: [
          { kind: 'log', text: t.helpTitle },
          { kind: 'pre', text: HELP[ctx.lang].map(([cmd, desc]) => `  ${cmd.padEnd(18)}${desc}`).join('\n') },
          { kind: 'log', text: t.helpHint, tone: 'muted' },
        ],
      }
    case 'whoami':
      return { lines: [{ kind: 'log', text: t.whoami }] }
    case 'ls':
      return {
        lines: [
          { kind: 'log', text: t.lsSummary.replace('{n}', String(ctx.components.length)), tone: 'muted' },
          { kind: 'links', items: ctx.components },
        ],
      }
    case 'fortune':
      return { lines: [{ kind: 'log', text: `“${fortune(ctx.lang)}”`, tone: 'success' }] }
    case 'coffee':
      return { lines: [{ kind: 'pre', text: COFFEE }, { kind: 'log', text: t.coffee, tone: 'warn' }] }
    case 'git.blame':
      return { lines: [{ kind: 'log', text: t.blame }] }
    case 'sudo.rm':
      return { lines: [{ kind: 'error', text: t.sudo }], effect: 'glitch' }
    case 'play':
      if (ctx.gameRunning)
        return { lines: [{ kind: 'log', text: t.playing, tone: 'warn' }] }
      return { lines: [{ kind: 'log', text: t.play, tone: 'success' }], effect: 'play' }
    case 'konami':
      return { lines: [{ kind: 'log', text: t.konami, tone: 'success' }], effect: 'celebrate' }
    case 'clear':
      return { lines: [], effect: 'clear' }
    case 'exit':
      return { lines: [{ kind: 'log', text: t.bye, tone: 'muted' }], effect: 'exit' }
    default: {
      // 和真控制台一样：标识符报 ReferenceError，其它的报 SyntaxError
      const ident = name.match(/^[A-Z_$][\w$]*/i)
      if (ident)
        return { lines: [{ kind: 'error', text: `Uncaught ReferenceError: ${ident[0]} is not defined` }] }
      return { lines: [{ kind: 'error', text: 'Uncaught SyntaxError: Unexpected token' }] }
    }
  }
}

/** Tab 补全：唯一匹配时补全，多个匹配时返回候选 */
export function complete(input: string): { value?: string, candidates: string[] } {
  const text = input.trim()
  if (!text)
    return { candidates: [] }
  const matches = COMMANDS.filter(cmd => cmd.startsWith(text))
  if (matches.length === 1)
    return { value: matches[0], candidates: [] }
  return { candidates: matches }
}

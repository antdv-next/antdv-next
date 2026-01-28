import { afterAll, beforeAll, vi } from 'vitest'

const originError = console.error

export function isSafeWarning(message: boolean | string, all = false) {
  const list = [
    'useLayoutEffect does nothing on the server',
    // Vue-specific safe warnings
    '[Vue warn]',
  ]

  if (all) {
    list.push('is deprecated')
  }

  return list.some(msg => String(message).includes(msg))
}

/** This function will remove safe server-side warnings. Since they're useless in tests. */
export function excludeWarning() {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation((msg, ...rest) => {
    if (isSafeWarning(msg)) {
      return
    }
    originError(msg, ...rest)
  })

  return errorSpy
}

export default function excludeAllWarning() {
  let cleanUp: () => void

  beforeAll(() => {
    cleanUp = excludeWarning().mockRestore
  })

  afterAll(() => {
    cleanUp()
  })
}

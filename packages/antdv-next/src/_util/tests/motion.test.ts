import { describe, expect, it } from 'vitest'
import initCollapseMotion from '../motion'

describe('collapse motion', () => {
  it('tolerates missing elements in transition hooks', () => {
    const motion = initCollapseMotion('ant')

    // Vue types transition hooks as `Hook<T> = T | T[]`; initCollapseMotion only sets functions.
    const hooks = [
      motion.onEnter,
      motion.onBeforeLeave,
      motion.onLeave,
      motion.onAfterEnter,
      motion.onAfterLeave,
    ] as Array<((el: any) => void) | undefined>

    expect(() => {
      hooks.forEach(hook => hook?.(null))
    }).not.toThrow()
  })
})

import { describe, expect, it } from 'vitest'
import initCollapseMotion from '../motion'

describe('collapse motion', () => {
  it('tolerates missing elements in transition hooks', () => {
    const motion = initCollapseMotion('ant')

    expect(() => {
      motion.onEnter?.(null as any)
      motion.onBeforeLeave?.(null as any)
      motion.onLeave?.(null as any)
      motion.onAfterEnter?.(null as any)
      motion.onAfterLeave?.(null as any)
    }).not.toThrow()
  })
})

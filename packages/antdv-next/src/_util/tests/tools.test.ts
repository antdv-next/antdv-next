import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { getSlotPropsFnRunWithFallback } from '../tools'

describe('getSlotPropsFnRunWithFallback', () => {
  it('prefers slot, falls back to prop on empty slot, keeps explicit null, never leaks functions', () => {
    const icon = h('span', 'I')
    const renderNull = () => null
    expect(getSlotPropsFnRunWithFallback({ icon: () => icon }, { icon: 'P' }, 'icon')).toBe(icon)
    expect(getSlotPropsFnRunWithFallback({ icon: () => [] }, { icon }, 'icon')).toBe(icon)
    expect(getSlotPropsFnRunWithFallback({ icon: () => undefined }, { icon }, 'icon')).toBe(icon)
    expect(getSlotPropsFnRunWithFallback({ icon: () => [] }, { icon: () => icon }, 'icon')).toBe(icon)
    expect(getSlotPropsFnRunWithFallback({ icon: () => null }, { icon }, 'icon')).toBeNull()
    expect(getSlotPropsFnRunWithFallback({}, { icon: renderNull }, 'icon')).toBeNull()
    expect(getSlotPropsFnRunWithFallback({ icon: () => [] }, { icon: renderNull }, 'icon')).toBeNull()
    expect(getSlotPropsFnRunWithFallback({}, {}, 'icon')).toBeUndefined()
  })
})

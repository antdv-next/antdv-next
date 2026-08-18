import { describe, expect, it } from 'vitest'
import { computed } from 'vue'
import { computeClosable } from '../hooks/useClosable'
import { mount } from '/@tests/utils'

describe('useClosable', () => {
  it('should localize the close control without overriding a custom icon label', () => {
    const [, closeIcon, , ariaProps] = computeClosable(
      computed(() => ({
        closable: true,
        closeIcon: <span aria-label="Custom icon" />,
      })),
      computed(() => null),
      undefined,
      'Localized close',
    )

    expect(ariaProps).toEqual({ 'aria-label': 'Localized close' })

    const wrapper = mount({ render: () => closeIcon })
    expect(wrapper.find('span').attributes('aria-label')).toBe('Custom icon')

    const [, , , customAriaProps] = computeClosable(
      computed(() => ({ closable: { 'aria-label': 'Custom close' } })),
      computed(() => null),
      undefined,
      'Localized close',
    )
    expect(customAriaProps).toEqual({ 'aria-label': 'Custom close' })
  })
})

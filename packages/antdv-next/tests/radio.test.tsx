import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Radio } from '../src'

describe('radio', () => {
  it('should support uncontrolled checked state', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Radio, {
      props: { onChange },
      slots: { default: () => 'Radio' },
    })

    const input = wrapper.find('input[type="radio"]')
    expect((input.element as HTMLInputElement).checked).toBe(false)

    // Simulate a user check (radio input fires `change`)
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    await nextTick()

    expect(onChange).toHaveBeenCalledTimes(1)
    // Uncontrolled: the inner state should retain the checked value
    expect((input.element as HTMLInputElement).checked).toBe(true)
  })
})

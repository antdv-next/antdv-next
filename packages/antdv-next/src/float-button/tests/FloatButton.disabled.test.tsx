import { describe, expect, it, vi } from 'vitest'
import FloatButton from '..'
import { mount } from '/@tests/utils'

describe('floatButton disabled', () => {
  it('renders without the disabled attribute by default', () => {
    const wrapper = mount(FloatButton, { props: { description: 'hi' } })
    const button = wrapper.find('button').element as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it('forwards disabled=true to the inner button element', () => {
    const wrapper = mount(FloatButton, { props: { description: 'hi', disabled: true } })
    const button = wrapper.find('button').element as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('does not fire click when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FloatButton, { props: { description: 'hi', disabled: true, onClick } })
    await wrapper.find('button').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('fires click when not disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FloatButton, { props: { description: 'hi', onClick } })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

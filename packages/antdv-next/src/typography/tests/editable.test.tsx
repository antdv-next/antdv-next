import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import Paragraph from '../Paragraph'
import { mount } from '/@tests/utils'

// Mock styleChecker
vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => true,
}))

describe('typography.Editable', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    errorSpy.mockReset()
  })

  afterAll(() => {
    errorSpy.mockRestore()
  })

  it('should trigger onStart', async () => {
    const onStart = vi.fn()
    const wrapper = mount(Paragraph, {
      props: {
        editable: { onStart },
      },
      slots: { default: () => 'Bamboo' },
    })

    await wrapper.find('.ant-typography-edit').trigger('click')
    expect(onStart).toHaveBeenCalled()
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should trigger onChange', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Paragraph, {
      props: {
        editable: { onChange },
      },
      slots: { default: () => 'Bamboo' },
    })

    await wrapper.find('.ant-typography-edit').trigger('click')
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Bamboo2')

    // Trigger Enter key (keydown + keyup required by implementation)
    await textarea.trigger('keydown', { keyCode: 13 })
    await textarea.trigger('keyup', { keyCode: 13 })

    expect(onChange).toHaveBeenCalledWith('Bamboo2')
  })
})

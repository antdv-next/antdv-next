import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import Base from '../Base'
import Paragraph from '../Paragraph'
import { mount } from '/@tests/utils'

// Mock styleChecker
vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => true,
}))

describe('typography.Editable', () => {
  const LINE_STR_COUNT = 20
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const fullStr
    = 'Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light'

  // Mock offsetHeight
  const originOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )?.get
  const mockGetBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get() {
        let html = this.innerHTML
        html = html.replace(/<[^>]*>/g, '')
        const lines = Math.ceil(html.length / LINE_STR_COUNT)
        return lines * 16
      },
    })
    mockGetBoundingClientRect.mockImplementation(function fn(this: HTMLElement) {
      let html = this.innerHTML
      html = html.replace(/<[^>]*>/g, '')
      const lines = Math.ceil(html.length / LINE_STR_COUNT)
      return { height: lines * 16 } as DOMRect
    })
  })

  afterEach(() => {
    errorSpy.mockReset()
  })

  afterAll(() => {
    errorSpy.mockRestore()
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    })
    mockGetBoundingClientRect.mockRestore()
  })

  it('should use editConfig.text over children in editing mode', async () => {
    const suffix = '--The information is very important'
    const wrapper = mount(Base, {
      props: {
        ellipsis: { rows: 1, suffix },
        component: 'p',
        editable: { text: fullStr + suffix },
      },
      slots: {
        default: () => fullStr,
      },
    })

    await wrapper.find('.ant-typography-edit').trigger('click')
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).value).toEqual(fullStr + suffix)
  })

  it('should use children as the fallback of editConfig.text in editing mode', async () => {
    const suffix = '--The information is very important'
    const wrapper = mount(Base, {
      props: {
        ellipsis: { rows: 1, suffix },
        component: 'p',
        editable: true,
      },
      slots: {
        default: () => fullStr,
      },
    })

    await wrapper.find('.ant-typography-edit').trigger('click')
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).value).toEqual(fullStr)
  })

  it('dynamic set editable', async () => {
    const wrapper = mount(Base, {
      props: {
        component: 'p',
      },
      slots: {
        default: () => 'test',
      },
    })
    expect(wrapper.find('.ant-typography-edit').exists()).toBe(false)

    await wrapper.setProps({
      editable: true,
    })
    expect(wrapper.find('.ant-typography-edit').exists()).toBe(true)
  })

  it('tabIndex of edit button', async () => {
    const wrapper = mount(Base, {
      props: {
        component: 'p',
      },
      slots: {
        default: () => 'test',
      },
    })
    expect(wrapper.find('.ant-typography-edit').exists()).toBe(false)

    await wrapper.setProps({
      editable: { tabIndex: -1 },
    })
    expect(wrapper.find('.ant-typography-edit').attributes('tabindex')).toBe('-1')
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

import { describe, expect, it, vi } from 'vitest'
import Input from '..'
import { mount } from '/@tests/utils'

const { OTP } = Input as any

describe('otp.Semantic', () => {
  it('should support classNames as functions', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-root',
      input: 'custom-input',
      separator: 'custom-separator',
    }))

    const wrapper = mount(OTP, {
      props: {
        value: '123456',
        separator: '-',
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-otp')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')

    // input
    const inputElements = wrapper.findAll('.ant-otp-input')
    expect(inputElements.length).toBeGreaterThan(0)
    inputElements.forEach((input) => {
      expect(input.classes()).toContain('custom-input')
    })

    // separator
    const separatorElements = wrapper.findAll('.ant-otp-separator')
    expect(separatorElements.length).toBeGreaterThan(0)
    separatorElements.forEach((separator) => {
      expect(separator.classes()).toContain('custom-separator')
    })
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(OTP, {
      props: {
        value: '123456',
        separator: '-',
        classes: {
          root: 'custom-root',
          input: 'custom-input',
          separator: 'custom-separator',
        },
        styles: {
          root: { padding: '10px' },
          input: { width: '40px' },
          separator: { margin: '0 8px' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-otp')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // input
    const inputElements = wrapper.findAll('.ant-otp-input')
    expect(inputElements.length).toBeGreaterThan(0)
    inputElements.forEach((input) => {
      expect(input.classes()).toContain('custom-input')
      expect(input.attributes('style')).toContain('width: 40px')
    })

    // separator
    const separatorElements = wrapper.findAll('.ant-otp-separator')
    expect(separatorElements.length).toBeGreaterThan(0)
    separatorElements.forEach((separator) => {
      expect(separator.classes()).toContain('custom-separator')
      expect(separator.attributes('style')).toContain('margin: 0px 8px')
    })
  })
})

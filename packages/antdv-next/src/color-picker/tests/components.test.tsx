import { describe, expect, it, vi } from 'vitest'
import ColorAlphaInput from '../components/ColorAlphaInput'
import ColorHexInput from '../components/ColorHexInput'
import ColorHsbInput from '../components/ColorHsbInput'
import ColorRgbInput from '../components/ColorRgbInput'
import ColorSteppers from '../components/ColorSteppers'
import { generateColor } from '../util'
import { mount } from '/@tests/utils'

describe('color-picker components', () => {
  it('ColorSteppers should render and emit change', async () => {
    const handleChange = vi.fn()
    const wrapper = mount(ColorSteppers, {
      props: {
        prefixCls: 'test',
        onChange: handleChange,
      },
    })

    const input = wrapper.find('.test-steppers input')
    expect(input.exists()).toBe(true)

    await input.setValue('1')
    await input.trigger('change')
    expect((input.element as HTMLInputElement).value).toContain('1')
    expect(handleChange).toHaveBeenCalled()
  })

  it('ColorAlphaInput should render and emit change', async () => {
    const handleChange = vi.fn()
    const wrapper = mount(ColorAlphaInput, {
      props: {
        prefixCls: 'test',
        onChange: handleChange,
      },
    })

    const input = wrapper.find('.test-alpha-input input')
    expect(input.exists()).toBe(true)

    await input.setValue('1')
    await input.trigger('change')
    expect((input.element as HTMLInputElement).value).toContain('1')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('ColorHexInput should update when external value changes', async () => {
    const wrapper = mount(ColorHexInput, {
      props: {
        prefixCls: 'test',
        value: generateColor('#ff0000'),
      },
    })

    const input = wrapper.find('.test-hex-input input')
    expect((input.element as HTMLInputElement).value.toLowerCase()).toContain('ff0000')

    await wrapper.setProps({
      value: generateColor('#00ff00'),
    })
    expect((input.element as HTMLInputElement).value.toLowerCase()).toContain('00ff00')
  })

  it('ColorHexInput should filter invalid input and only emit on valid color', async () => {
    const onChange = vi.fn()
    const wrapper = mount(ColorHexInput, {
      props: {
        prefixCls: 'test',
        onChange,
      },
    })

    const input = wrapper.find('.test-hex-input input')
    await input.setValue('ff5500')
    await input.trigger('change')
    expect((input.element as HTMLInputElement).value.toLowerCase()).toContain('ff5500')
    expect(onChange).toHaveBeenCalledTimes(1)

    await input.setValue('xyz')
    await input.trigger('change')
    expect((input.element as HTMLInputElement).value).toBe('')

    await input.setValue('ff_00_gg')
    await input.trigger('change')
    expect((input.element as HTMLInputElement).value.toLowerCase()).toContain('ff00')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('ColorHsbInput should render 3 steppers and emit change', async () => {
    const onChange = vi.fn()
    const wrapper = mount(ColorHsbInput, {
      props: {
        prefixCls: 'test',
        onChange,
      },
    })

    const inputs = wrapper.findAll('.test-hsb-input input')
    expect(inputs).toHaveLength(3)

    await inputs[0]!.setValue('139')
    await inputs[0]!.trigger('change')
    await inputs[1]!.setValue('78')
    await inputs[1]!.trigger('change')
    await inputs[2]!.setValue('39')
    await inputs[2]!.trigger('change')

    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('ColorRgbInput should render 3 steppers and emit change', async () => {
    const onChange = vi.fn()
    const wrapper = mount(ColorRgbInput, {
      props: {
        prefixCls: 'test',
        onChange,
      },
    })

    const inputs = wrapper.findAll('.test-rgb-input input')
    expect(inputs).toHaveLength(3)

    await inputs[0]!.setValue('99')
    await inputs[0]!.trigger('change')
    await inputs[1]!.setValue('21')
    await inputs[1]!.trigger('change')
    await inputs[2]!.setValue('21')
    await inputs[2]!.trigger('change')

    expect(onChange).toHaveBeenCalledTimes(3)
  })
})

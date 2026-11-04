import type { ButtonProps } from '..'
import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import Button from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import { _ButtonVariantTypes } from '../buttonHelper'
import { mount } from '/@tests/utils'

function expectClasses(el: { classes: () => string[] }, ...cls: string[]) {
  expect(el.classes()).toEqual(expect.arrayContaining(cls))
}

describe('button global variant', () => {
  it.each<[ConfigProviderProps['variant'], string]>([
    [undefined, 'outlined'],
    ['outlined', 'outlined'],
    ['filled', 'filled'],
    ['borderless', 'outlined'],
    ['underlined', 'outlined'],
  ])('resolves global variant %s to %s', (variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={variant}>
        <Button>Button</Button>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), `ant-btn-variant-${expected}`, 'ant-btn-color-default')
  })

  it.each(_ButtonVariantTypes)('preserves component variant %s and its configured color', (variant) => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled" button={{ variant, color: 'blue' }}>
        <Button>Button</Button>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), `ant-btn-variant-${variant}`, 'ant-btn-color-blue')
  })

  it.each(_ButtonVariantTypes)('keeps local color and variant %s first', (variant) => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled" button={{ variant: 'solid', color: 'red' }}>
        <Button color="green" variant={variant} type="primary" danger>
          Button
        </Button>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), `ant-btn-variant-${variant}`, 'ant-btn-color-green')
  })

  it.each(_ButtonVariantTypes)('keeps local variant %s first without an explicit color', (variant) => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled">
        <Button variant={variant}>Global</Button>
        <ConfigProvider button={{ variant: 'filled', color: 'blue' }}>
          <Button variant={variant}>Component</Button>
          <Form variant="filled">
            <Button variant={variant}>Form</Button>
          </Form>
        </ConfigProvider>
      </ConfigProvider>
    ))

    const buttons = wrapper.findAll('.ant-btn')
    expect(buttons).toHaveLength(3)
    buttons.forEach((button) => {
      expectClasses(button, `ant-btn-variant-${variant}`)
    })
  })

  it.each<[ButtonProps, string, string]>([
    [{ type: 'default' }, 'outlined', 'default'],
    [{ type: 'primary' }, 'solid', 'primary'],
    [{ type: 'dashed' }, 'dashed', 'default'],
    [{ type: 'text' }, 'text', 'default'],
    [{ type: 'link' }, 'link', 'link'],
    [{ danger: true }, 'outlined', 'dangerous'],
    [{ type: 'primary', danger: true }, 'solid', 'dangerous'],
    [{ type: 'primary', variant: 'outlined' }, 'solid', 'primary'],
    [{ type: 'dashed', variant: 'filled' }, 'dashed', 'default'],
    [{ danger: true, variant: 'filled' }, 'outlined', 'dangerous'],
  ])('preserves the type and danger priority for %j', (props, variant, color) => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled" button={{ variant: 'dashed', color: 'blue' }}>
        <Button {...props}>Button</Button>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), `ant-btn-variant-${variant}`, `ant-btn-color-${color}`)
  })

  it('preserves the default color when only button.color is configured', async () => {
    const globalVariant = ref<ConfigProviderProps['variant']>()
    const wrapper = mount(() => (
      <ConfigProvider variant={globalVariant.value} button={{ color: 'blue' }}>
        <Button>Button</Button>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), 'ant-btn-variant-outlined', 'ant-btn-color-default')

    globalVariant.value = 'filled'
    await nextTick()
    expectClasses(wrapper.find('.ant-btn'), 'ant-btn-variant-filled', 'ant-btn-color-blue')
  })

  it('preserves the solid default color and ghost behavior', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled">
        <Button variant="solid">Local</Button>
        <Button variant="solid" ghost>
          Ghost
        </Button>
      </ConfigProvider>
    ))
    const buttons = wrapper.findAll('.ant-btn')
    expectClasses(buttons[0]!, 'ant-btn-variant-solid', 'ant-btn-color-primary')
    expectClasses(buttons[1]!, 'ant-btn-variant-outlined', 'ant-btn-color-primary')
  })

  it('updates inherited variant and semantic props through nested providers', async () => {
    const variant = ref<ConfigProviderProps['variant']>('filled')
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined">
        <ConfigProvider variant={variant.value}>
          <Button classes={({ props }) => ({ root: `semantic-${props.variant}` })}>
            Button
          </Button>
        </ConfigProvider>
      </ConfigProvider>
    ))
    expectClasses(wrapper.find('.ant-btn'), 'ant-btn-variant-filled', 'semantic-filled')

    variant.value = 'outlined'
    await nextTick()
    expectClasses(wrapper.find('.ant-btn'), 'ant-btn-variant-outlined', 'semantic-outlined')
    expect(wrapper.find('.ant-btn').classes()).not.toContain('ant-btn-variant-filled')
  })

  it('uses Form variant before component configuration and keeps local props first', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined" button={{ variant: 'outlined', color: 'blue' }}>
        <Form variant="filled">
          <Button>Form</Button>
          <Button color="green" variant="solid">
            Local
          </Button>
        </Form>
      </ConfigProvider>
    ))
    const buttons = wrapper.findAll('.ant-btn')
    expectClasses(buttons[0]!, 'ant-btn-variant-filled', 'ant-btn-color-blue')
    expectClasses(buttons[1]!, 'ant-btn-variant-solid', 'ant-btn-color-green')
  })
})

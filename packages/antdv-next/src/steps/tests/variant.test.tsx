import type { StepsProps } from '..'
import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import Steps from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import Timeline from '../../timeline'
import { mount } from '/@tests/utils'

const items = [{ title: 'Create a services site' }]

function getRoot(wrapper: ReturnType<typeof mount>, selector = '.ant-steps') {
  return wrapper.find(selector).element as HTMLElement
}

describe('steps variant', () => {
  it.each<[StepsProps['variant'], StepsProps['variant'], string]>([
    [undefined, undefined, 'filled'],
    ['outlined', undefined, 'outlined'],
    [undefined, 'outlined', 'outlined'],
    ['outlined', 'filled', 'filled'],
    ['filled', 'outlined', 'outlined'],
  ])('config variant %s and prop variant %s render %s', (configVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider steps={{ variant: configVariant }}>
        <Steps variant={variant} items={items} />
      </ConfigProvider>
    ))

    expect(getRoot(wrapper).classList.contains(`ant-steps-${expected}`)).toBe(true)
  })

  it('passes the configured variant to semantic functions', () => {
    const wrapper = mount(() => (
      <ConfigProvider steps={{ variant: 'outlined' }}>
        <Steps
          items={items}
          classes={({ props }) => ({ root: `custom-${props.variant}` })}
          styles={({ props }) => ({ root: { opacity: props.variant === 'outlined' ? 0.5 : 1 } })}
        />
      </ConfigProvider>
    ))

    const root = getRoot(wrapper)
    expect(root.classList.contains('custom-outlined')).toBe(true)
    expect(root.style.opacity).toBe('0.5')
  })

  it.each<[ConfigProviderProps['variant'], StepsProps['variant'], NonNullable<StepsProps['variant']>]>([
    ['filled', undefined, 'filled'],
    ['outlined', undefined, 'outlined'],
    ['borderless', undefined, 'filled'],
    ['underlined', undefined, 'filled'],
    ['filled', 'outlined', 'outlined'],
    ['outlined', 'filled', 'filled'],
    ['borderless', 'outlined', 'outlined'],
  ])('global variant %s and prop variant %s render %s', (globalVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={globalVariant}>
        <Steps
          variant={variant}
          items={items}
          classes={({ props }) => ({ root: `custom-${props.variant}` })}
          styles={({ props }) => ({ root: { opacity: props.variant === 'filled' ? 0.5 : 1 } })}
        />
      </ConfigProvider>
    ))

    const root = getRoot(wrapper)
    expect(root.classList.contains(`ant-steps-${expected}`)).toBe(true)
    expect(root.classList.contains(`custom-${expected}`)).toBe(true)
    expect(root.style.opacity).toBe(expected === 'filled' ? '0.5' : '1')
  })

  it('prioritizes the component config over the global variant', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined" steps={{ variant: 'filled' }}>
        <Steps items={items} />
      </ConfigProvider>
    ))

    expect(getRoot(wrapper).classList.contains('ant-steps-filled')).toBe(true)
  })

  it.each<[
    ConfigProviderProps['variant'],
    StepsProps['variant'],
    StepsProps['variant'],
    NonNullable<StepsProps['variant']>,
  ]>([
    ['filled', 'outlined', undefined, 'filled'],
    ['outlined', 'filled', undefined, 'outlined'],
    ['borderless', 'outlined', undefined, 'filled'],
    ['underlined', 'outlined', undefined, 'filled'],
    ['filled', 'filled', 'outlined', 'outlined'],
    ['outlined', 'outlined', 'filled', 'filled'],
  ])(
    'form variant %s, config variant %s and prop variant %s render %s',
    (formVariant, configVariant, variant, expected) => {
      const wrapper = mount(() => (
        <ConfigProvider variant="outlined" steps={{ variant: configVariant }}>
          <Form variant={formVariant}>
            <Steps variant={variant} items={items} />
          </Form>
        </ConfigProvider>
      ))

      expect(getRoot(wrapper).classList.contains(`ant-steps-${expected}`)).toBe(true)
    },
  )

  it('does not change the variant of Timeline', () => {
    const wrapper = mount(() => (
      <ConfigProvider steps={{ variant: 'filled' }}>
        <Timeline items={[{ content: 'Create a services site' }]} />
      </ConfigProvider>
    ))

    expect(getRoot(wrapper, '.ant-timeline').classList.contains('ant-steps-outlined')).toBe(true)
  })
})

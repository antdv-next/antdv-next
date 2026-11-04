import type { TimelineProps } from '..'
import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import Timeline from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import { mount } from '/@tests/utils'

const items = [{ content: 'Create a services site' }]

function getRoot(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.ant-timeline').element as HTMLElement
}

describe('timeline variant', () => {
  it.each<[TimelineProps['variant'], TimelineProps['variant'], string]>([
    [undefined, undefined, 'outlined'],
    [undefined, 'filled', 'filled'],
    ['filled', undefined, 'filled'],
    ['filled', 'outlined', 'outlined'],
    ['outlined', 'filled', 'filled'],
  ])('config variant %s and prop variant %s render %s', (configVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider timeline={{ variant: configVariant }}>
        <Timeline variant={variant} items={items} />
      </ConfigProvider>
    ))

    expect(getRoot(wrapper).classList.contains(`ant-steps-${expected}`)).toBe(true)
  })

  it.each<[ConfigProviderProps['variant'], TimelineProps['variant'], NonNullable<TimelineProps['variant']>]>([
    ['filled', undefined, 'filled'],
    ['outlined', undefined, 'outlined'],
    ['borderless', undefined, 'outlined'],
    ['underlined', undefined, 'outlined'],
    ['filled', 'outlined', 'outlined'],
    ['outlined', 'filled', 'filled'],
    ['borderless', 'filled', 'filled'],
  ])('global variant %s and prop variant %s render %s', (globalVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={globalVariant}>
        <Timeline
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
      <ConfigProvider variant="filled" timeline={{ variant: 'outlined' }}>
        <Timeline items={items} />
      </ConfigProvider>
    ))

    expect(getRoot(wrapper).classList.contains('ant-steps-outlined')).toBe(true)
  })

  it.each<[
    ConfigProviderProps['variant'],
    TimelineProps['variant'],
    TimelineProps['variant'],
    NonNullable<TimelineProps['variant']>,
  ]>([
    ['filled', 'outlined', undefined, 'filled'],
    ['outlined', 'filled', undefined, 'outlined'],
    ['borderless', 'filled', undefined, 'outlined'],
    ['underlined', 'filled', undefined, 'outlined'],
    ['filled', 'filled', 'outlined', 'outlined'],
    ['outlined', 'outlined', 'filled', 'filled'],
  ])(
    'form variant %s, config variant %s and prop variant %s render %s',
    (formVariant, configVariant, variant, expected) => {
      const wrapper = mount(() => (
        <ConfigProvider variant="filled" timeline={{ variant: configVariant }}>
          <Form variant={formVariant}>
            <Timeline variant={variant} items={items} />
          </Form>
        </ConfigProvider>
      ))

      expect(getRoot(wrapper).classList.contains(`ant-steps-${expected}`)).toBe(true)
    },
  )

  it('passes the configured variant to semantic functions', () => {
    const wrapper = mount(() => (
      <ConfigProvider timeline={{ variant: 'filled' }}>
        <Timeline
          items={items}
          classes={({ props }) => ({ root: `custom-${props.variant}` })}
          styles={({ props }) => ({ root: { opacity: props.variant === 'filled' ? 0.5 : 1 } })}
        />
      </ConfigProvider>
    ))

    const root = getRoot(wrapper)
    expect(root.classList.contains('custom-filled')).toBe(true)
    expect(root.style.opacity).toBe('0.5')
  })
})

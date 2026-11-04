import type { DividerProps } from '..'
import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import Divider from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import { mount } from '/@tests/utils'

function getDivider(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.ant-divider').element as HTMLElement
}

function expectVariant(divider: HTMLElement, expected: string) {
  if (expected === 'solid') {
    expect(divider.classList.contains('ant-divider-dashed')).toBe(false)
    expect(divider.classList.contains('ant-divider-dotted')).toBe(false)
  }
  else {
    expect(divider.classList.contains(`ant-divider-${expected}`)).toBe(true)
  }
}

describe('divider variant', () => {
  it.each<[DividerProps['variant'], DividerProps['variant'], string]>([
    [undefined, undefined, 'solid'],
    ['dotted', undefined, 'dotted'],
    ['dashed', undefined, 'dashed'],
    ['solid', 'dotted', 'dotted'],
    ['dotted', 'solid', 'solid'],
    ['dashed', 'dotted', 'dotted'],
  ])('config variant %s and prop variant %s render %s', (configVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider divider={{ variant: configVariant }}>
        <Divider variant={variant} />
      </ConfigProvider>
    ))

    expectVariant(getDivider(wrapper), expected)
  })

  it('passes the configured variant to semantic functions', () => {
    const wrapper = mount(() => (
      <ConfigProvider divider={{ variant: 'dotted' }}>
        <Divider
          classes={({ props }) => ({ root: `custom-${props.variant}` })}
          styles={({ props }) => ({ root: { opacity: props.variant === 'dotted' ? 0.5 : 1 } })}
        />
      </ConfigProvider>
    ))

    const divider = getDivider(wrapper)
    expect(divider.classList.contains('custom-dotted')).toBe(true)
    expect(divider.style.opacity).toBe('0.5')
  })

  it.each<[
    ConfigProviderProps['variant'],
    DividerProps['variant'],
    DividerProps['variant'],
    NonNullable<DividerProps['variant']>,
  ]>([
    ['filled', undefined, undefined, 'solid'],
    ['outlined', undefined, undefined, 'solid'],
    ['borderless', undefined, undefined, 'solid'],
    ['underlined', undefined, undefined, 'solid'],
    ['filled', 'dotted', undefined, 'dotted'],
    ['outlined', 'dashed', undefined, 'dashed'],
    ['filled', 'dotted', 'solid', 'solid'],
    ['borderless', 'solid', 'dotted', 'dotted'],
  ])(
    'global variant %s, config variant %s and prop variant %s render %s',
    (globalVariant, configVariant, variant, expected) => {
      const wrapper = mount(() => (
        <ConfigProvider variant={globalVariant} divider={{ variant: configVariant }}>
          <Divider
            variant={variant}
            classes={({ props }) => ({ root: `custom-${props.variant}` })}
            styles={({ props }) => ({ root: { opacity: props.variant === 'solid' ? 1 : 0.5 } })}
          />
        </ConfigProvider>
      ))
      const divider = getDivider(wrapper)

      expect(divider.classList.contains(`custom-${expected}`)).toBe(true)
      expect(divider.style.opacity).toBe(expected === 'solid' ? '1' : '0.5')
      for (const cls of ['filled', 'outlined', 'borderless', 'underlined']) {
        expect(divider.classList.contains(`ant-divider-${cls}`)).toBe(false)
      }
      expectVariant(divider, expected)
    },
  )

  it.each<[ConfigProviderProps['variant'], DividerProps['variant'], NonNullable<DividerProps['variant']>]>([
    ['filled', undefined, 'solid'],
    ['outlined', undefined, 'solid'],
    ['borderless', undefined, 'solid'],
    ['underlined', undefined, 'solid'],
    ['filled', 'dotted', 'dotted'],
    ['outlined', 'dashed', 'dashed'],
  ])('form variant %s and prop variant %s render %s', (formVariant, variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined" divider={{ variant: 'dotted' }}>
        <Form variant={formVariant}>
          <Divider
            variant={variant}
            classes={({ props }) => ({ root: `custom-${props.variant}` })}
          />
        </Form>
      </ConfigProvider>
    ))
    const divider = getDivider(wrapper)

    expect(divider.classList.contains(`custom-${expected}`)).toBe(true)
    expectVariant(divider, expected)
  })

  it('preserves the legacy dashed prop with a top-level variant', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled">
        <Divider dashed />
      </ConfigProvider>
    ))

    expect(getDivider(wrapper).classList.contains('ant-divider-dashed')).toBe(true)
  })
})

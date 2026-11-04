import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import { defineComponent, toRef } from 'vue'
import ConfigProvider from '../../config-provider'
import useVariant from '../hooks/useVariant'
import { mount } from '/@tests/utils'

const variants = ['outlined', 'filled', 'dashed'] as const
type TestVariant = (typeof variants)[number]

const Demo = defineComponent<{
  variant?: TestVariant | ConfigProviderProps['variant']
  defaultVariant?: TestVariant
}>(
  (props) => {
    const [mergedVariant, enableVariantCls, isVariantConfigured] = useVariant(
      'input',
      toRef(props, 'variant'),
      {
        variants,
        defaultVariant: props.defaultVariant ?? 'outlined',
      },
    )
    return () => (
      <div
        data-variant={mergedVariant.value}
        data-enabled={String(enableVariantCls.value)}
        data-configured={String(isVariantConfigured.value)}
      />
    )
  },
  { props: ['variant', 'defaultVariant'] },
)

describe('useVariant', () => {
  it.each(variants)('supports %s in a list containing more than two variants', (variant) => {
    const wrapper = mount(Demo, { props: { variant } })
    const el = wrapper.element as HTMLElement

    expect(el.getAttribute('data-variant')).toBe(variant)
    expect(el.getAttribute('data-enabled')).toBe('true')
    expect(el.getAttribute('data-configured')).toBe('true')
  })

  it.each<[ConfigProviderProps['variant'], TestVariant]>([
    ['filled', 'filled'],
    ['outlined', 'outlined'],
    ['borderless', 'dashed'],
    ['underlined', 'dashed'],
  ])('resolves global variant %s to %s', (variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={variant}>
        <Demo defaultVariant="dashed" />
      </ConfigProvider>
    ))
    const el = wrapper.find('div').element as HTMLElement

    expect(el.getAttribute('data-variant')).toBe(expected)
    expect(el.getAttribute('data-enabled')).toBe('true')
    expect(el.getAttribute('data-configured')).toBe('true')
  })

  it('uses the supplied default without treating it as an explicit configuration', () => {
    const wrapper = mount(Demo, { props: { defaultVariant: 'dashed' } })
    const el = wrapper.element as HTMLElement

    expect(el.getAttribute('data-variant')).toBe('dashed')
    expect(el.getAttribute('data-enabled')).toBe('true')
    expect(el.getAttribute('data-configured')).toBe('false')
  })

  it.each(['borderless', 'underlined'] as const)(
    'narrows unsupported input %s to a supported value',
    (variant) => {
      const wrapper = mount(Demo, { props: { variant } })
      const el = wrapper.element as HTMLElement

      expect(el.getAttribute('data-variant')).toBe('outlined')
      expect(el.getAttribute('data-enabled')).toBe('true')
    },
  )

  it('preserves the legacy bordered argument', () => {
    const LegacyDemo = defineComponent(() => {
      const [variant, enabled, configured] = useVariant('input', undefined, false)
      return () => (
        <div
          data-variant={variant.value}
          data-enabled={String(enabled.value)}
          data-configured={String(configured.value)}
        />
      )
    })
    const wrapper = mount(LegacyDemo)
    const el = wrapper.element as HTMLElement

    expect(el.getAttribute('data-variant')).toBe('borderless')
    expect(el.getAttribute('data-enabled')).toBe('true')
    expect(el.getAttribute('data-configured')).toBe('true')
  })

  it('preserves the fallback component argument', () => {
    const LegacyDemo = defineComponent(() => {
      const [variant] = useVariant('inputSearch', undefined, undefined, 'input')
      return () => <div data-variant={variant.value} />
    })
    const wrapper = mount(() => (
      <ConfigProvider variant="borderless" input={{ variant: 'filled' }}>
        <LegacyDemo />
      </ConfigProvider>
    ))

    expect(wrapper.find('div').attributes('data-variant')).toBe('filled')
  })
})

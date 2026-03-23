import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import useStyleRegister, { extract } from '../src/hooks/useStyleRegister'
import { ATTR_MARK } from '../src/StyleContext'
import { mountWithStyleProvider } from './utils'

describe('useStyleRegister', () => {
  beforeEach(() => {
    document
      .querySelectorAll(`style[${ATTR_MARK}]`)
      .forEach(style => style.parentNode?.removeChild(style))
  })

  it('injects style into DOM when running on client', async () => {
    const theme = {} as any
    const token = { _tokenKey: 'test-token' }

    const TestComponent = defineComponent({
      setup() {
        const info = ref({
          theme,
          token,
          path: ['.box'],
        })
        useStyleRegister(info, () => ({
          '.box': {
            color: 'red',
          },
        }))

        return () => h('div', { class: 'box' }, 'content')
      },
    })

    const wrapper = mountWithStyleProvider(TestComponent)

    await nextTick()

    const styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    const matched = styles.find(style => style.innerHTML.includes('.box') && style.innerHTML.includes('color:red'))

    expect(matched).toBeTruthy()
    wrapper.unmount()
  })

  it('injects style into DOM on initial client mount before microtask flush', () => {
    const theme = {} as any
    const token = { _tokenKey: 'sync-token' }

    const TestComponent = defineComponent({
      setup() {
        const info = ref({
          theme,
          token,
          path: ['.sync-box'],
        })
        useStyleRegister(info, () => ({
          '.sync-box': {
            color: 'green',
          },
        }))

        return () => h('div', { class: 'sync-box' }, 'content')
      },
    })

    const wrapper = mountWithStyleProvider(TestComponent)

    const styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    const matched = styles.find(style => style.innerHTML.includes('.sync-box') && style.innerHTML.includes('color:green'))

    expect(matched).toBeTruthy()
    wrapper.unmount()
  })

  it('does not inject styles when mocked as server', async () => {
    const theme = {} as any
    const token = { _tokenKey: 'server-token' }

    const TestComponent = defineComponent({
      setup() {
        const info = ref({
          theme,
          token,
          path: ['.server'],
        })
        useStyleRegister(info, () => ({
          '.server': {
            color: 'blue',
          },
        }))

        return () => h('div', { class: 'server' }, 'content')
      },
    })

    const wrapper = mountWithStyleProvider(TestComponent, {
      mock: 'server',
      ssrInline: true,
    })

    await nextTick()

    // No style should be injected to document head in server mode
    expect(document.querySelector(`style[${ATTR_MARK}]`)).toBeNull()

    wrapper.unmount()
  })

  it('extract returns serialized style string with effect cache tracking', () => {
    const cacheValue: any = [
      '.box{color:red;}',
      'style-id',
      {
        'global': '.global{color:green;}',
        '@layer foo': '.layer{display:block;}',
      },
      false,
      10,
    ]

    const effectStyles: Record<string, boolean> = {}
    const result = extract(cacheValue, effectStyles)

    expect(result).toBeTruthy()
    expect(result?.[0]).toBe(10)
    expect(result?.[1]).toBe('style-id')
    expect(result?.[2]).toContain('.box{color:red;}')
    expect(result?.[2]).toContain('_effect-global')
    expect(result?.[2]).toContain('_effect-@layer foo')
    expect(effectStyles.global).toBe(true)
    expect(effectStyles['@layer foo']).toBe(true)
  })
})

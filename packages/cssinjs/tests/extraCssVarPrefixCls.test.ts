import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { genStyleUtils } from '../src/cssinjs-utils'
import { mountWithStyleProvider } from './utils'

interface TestTokenMap {
  TestComponent: {
    colorPrimary?: string
    fontSize?: number
  }
}

describe('extraCssVarPrefixCls', () => {
  const token = {
    _tokenKey: 'test-token',
    colorPrimary: '#1890ff',
    fontSize: 14,
    TestComponent: {
      colorPrimary: '#ff0000',
      fontSize: 16,
    },
  }

  const mockConfig = {
    usePrefix: vi.fn(() => ref({
      rootPrefixCls: 'ant',
      iconPrefixCls: 'anticon',
    })),
    useToken: vi.fn(() => ({
      theme: ref({ id: 'test' }),
      realToken: ref(token),
      hashId: ref('css-dev-only-do-not-override-abc123'),
      token: ref(token),
      cssVar: ref({
        prefix: 'ant',
        key: 'test',
      }),
      zeroRuntime: ref(false),
    })),
    useCSP: vi.fn(() => ref({ nonce: 'nonce' })),
    getResetStyles: vi.fn(() => []),
    layer: {
      name: 'test',
      dependencies: ['parent'],
    },
  } as any

  const { genStyleHooks } = genStyleUtils<TestTokenMap, any, any>(mockConfig)

  function getTotalStyle() {
    return Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent)
      .join('\n')
  }

  beforeEach(() => {
    document.head.innerHTML = ''
  })

  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('should inject CSS vars for extraCssVarPrefixCls', async () => {
    const useStyle = genStyleHooks(
      'TestComponent',
      token => ({
        [`${token.componentCls}`]: {
          color: token.colorPrimary,
          fontSize: token.fontSize,
        },
      }),
      () => ({
        colorPrimary: '#ff0000',
        fontSize: 16,
      }),
      {
        extraCssVarPrefixCls: ['custom-a', 'custom-b'],
      },
    )

    const TestComponent = defineComponent(() => {
      const [hashId, cssVarCls] = useStyle(ref('test-prefix'))
      return () => h('div', { class: [hashId.value, cssVarCls.value] }, hashId.value)
    })

    const wrapper = mountWithStyleProvider(TestComponent)
    await nextTick()

    const totalStyle = getTotalStyle()
    expect(totalStyle).toContain('.test-prefix')
    expect(totalStyle).toContain('.custom-a')
    expect(totalStyle).toContain('.custom-b')

    wrapper.unmount()
  })

  it('should support function type for extraCssVarPrefixCls', async () => {
    const useStyle = genStyleHooks(
      'TestComponent',
      token => ({
        [`${token.componentCls}`]: {
          color: token.colorPrimary,
          fontSize: token.fontSize,
        },
      }),
      () => ({
        colorPrimary: '#ff0000',
        fontSize: 16,
      }),
      {
        extraCssVarPrefixCls: ({ prefixCls, rootCls }) => [
          `${prefixCls}-container`,
          `${rootCls}-wrapper`,
        ],
      },
    )

    const TestComponent = defineComponent(() => {
      const [hashId, cssVarCls] = useStyle(ref('custom-list'), ref('custom'))
      return () => h('div', { class: [hashId.value, cssVarCls.value] }, hashId.value)
    })

    const wrapper = mountWithStyleProvider(TestComponent)
    await nextTick()

    const totalStyle = getTotalStyle()
    expect(totalStyle).toContain('.custom-list-container')
    expect(totalStyle).toContain('.custom-wrapper')

    wrapper.unmount()
  })

  it('should re-resolve function type when prefixCls changes', async () => {
    const useStyle = genStyleHooks(
      'TestComponent',
      () => ({}),
      () => ({
        colorPrimary: '#ff0000',
        fontSize: 16,
      }),
      {
        extraCssVarPrefixCls: ({ prefixCls }) => [`${prefixCls}-container`],
      },
    )

    const prefixCls = ref('first')
    const TestComponent = defineComponent(() => {
      useStyle(prefixCls)
      return () => null
    })

    const wrapper = mountWithStyleProvider(TestComponent)
    await nextTick()
    expect(getTotalStyle()).toContain('.first-container')

    prefixCls.value = 'second'
    await nextTick()
    expect(getTotalStyle()).toContain('.second-container')

    wrapper.unmount()
  })
})

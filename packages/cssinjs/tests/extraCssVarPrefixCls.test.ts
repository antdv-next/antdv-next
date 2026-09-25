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
})

import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import ConfigProvider from '..'
import theme from '../../theme'
import { mount } from '/@tests/utils'

const TokenProbe = defineComponent(() => {
  const { token } = theme.useToken()

  return () => <div style={{ color: token.value.colorPrimary }}>token-probe</div>
})

describe('config-provider nonce', () => {
  it('should pass CSP nonce to theme cache token styles', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider csp={{ nonce: 'nonce-test' }} theme={{ token: { colorPrimary: '#1677ff' } }}>
            <TokenProbe />
          </ConfigProvider>
        )
      },
    })

    await nextTick()

    expect(document.head.querySelector('style[nonce="nonce-test"]')).not.toBeNull()

    wrapper.unmount()
  })
})

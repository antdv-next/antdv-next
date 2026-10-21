import { describe, expect, it } from 'vitest'
import Card from '..'
import ConfigProvider from '../../config-provider'
import { TypographyTitle } from '../../typography'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59613
describe.each(['ant', 'custom'])('card head typography title with %s prefix', (prefixCls) => {
  it.each([
    ['medium', false],
    ['small', false],
    ['medium', true],
    ['small', true],
  ] as const)('should reset margins for size=%s and tabs=%s', (size, withTabs) => {
    const wrapper = mount(() => (
      <ConfigProvider prefixCls={prefixCls} theme={{ hashed: true }}>
        <Card
          size={size}
          title={<TypographyTitle level={4}>Card title</TypographyTitle>}
          tabList={withTabs ? [{ key: 'tab', label: 'Tab' }] : undefined}
        />
      </ConfigProvider>
    ), { attachTo: document.body })

    // jsdom does not resolve the typography margin-bottom CSS variable, so the
    // reset is asserted through margin-top, which only the card head rule sets.
    expect(getComputedStyle(wrapper.find('h4').element).marginTop).toBe('0px')
    wrapper.unmount()
  })
})

/** @vitest-environment jsdom */

import { createCache, StyleProvider } from '@antdv-next/cssinjs'
import { SmileOutlined } from '@antdv-next/icons'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import ConfigProvider from '..'
import { mount } from '/@tests/utils'

// The icon reset CSS from @antdv-next/icons is injected via `updateCSS` inside an
// async onMounted, marked with `vc-util-key="@ant-design-icons"`. That marker lets
// us assert on the icon-package injection specifically, ignoring the cssinjs reset
// (`data-css-hash`) that ConfigProvider always emits.
const ICON_STYLE_SELECTOR = 'style[vc-util-key="@ant-design-icons"]'

async function flush() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

// https://github.com/ant-design/ant-design/pull/58517
describe('configProvider theme.zeroRuntime', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('skips runtime icon style injection when theme.zeroRuntime is true', async () => {
    const wrapper = mount(
      () => h(ConfigProvider, { theme: { zeroRuntime: true } }, { default: () => h(SmileOutlined) }),
      { attachTo: document.body },
    )
    await flush()
    expect(document.head.querySelector(ICON_STYLE_SELECTOR)).toBeFalsy()
    wrapper.unmount()
  })

  it('injects runtime icon style when zeroRuntime is not enabled', async () => {
    const wrapper = mount(
      () => h(ConfigProvider, null, { default: () => h(SmileOutlined) }),
      { attachTo: document.body },
    )
    await flush()
    expect(document.head.querySelector(ICON_STYLE_SELECTOR)).toBeTruthy()
    wrapper.unmount()
  })

  // https://github.com/ant-design/ant-design/pull/58559
  it('does not rewrite icon runtime style when cssinjs layer is enabled', async () => {
    const wrapper = mount(
      () => h(
        StyleProvider,
        { layer: true, cache: createCache() },
        { default: () => h(ConfigProvider, null, { default: () => h(SmileOutlined) }) },
      ),
      { attachTo: document.body },
    )
    await flush()
    // Layer mode forces zeroRuntime so the icon package must not inject its
    // own runtime style (which would live outside `@layer antd` and win the
    // cascade over layered antd styles).
    expect(document.head.querySelector(ICON_STYLE_SELECTOR)).toBeFalsy()
    // The icon styles are served by cssinjs inside the antd layer instead.
    expect(
      Array.from(document.querySelectorAll('style')).some(
        style => style.innerHTML.includes('@layer antd') && style.innerHTML.includes('.anticon'),
      ),
    ).toBeTruthy()
    wrapper.unmount()
  })
})

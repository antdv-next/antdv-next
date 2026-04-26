import type { Locale } from '../../locale'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '..'
import Pagination from '../../pagination'
import { mount } from '/@tests/utils'

describe('config-provider locale', () => {
  it('unwraps nested default locale objects from ESM/CJS interop', () => {
    const mockLocale = {
      locale: 'test-locale',
      Pagination: { items_per_page: '/ test page' },
    } as Locale

    const wrapper = mount(ConfigProvider, {
      props: {
        locale: { default: mockLocale } as any,
      },
      slots: {
        default: () => <Pagination total={50} showSizeChanger />,
      },
    })

    expect(wrapper.text()).toContain('/ test page')
    expect(wrapper.text()).not.toContain('/ page')
  })
})

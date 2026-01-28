import type { Component } from 'vue'
import MockDate from 'mockdate'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ConfigProvider from '../../packages/antdv-next/src/config-provider'
import { mount } from '../utils'

/**
 * Test that a component renders correctly in RTL direction.
 * Vue equivalent of ant-design's rtlTest.
 */
function rtlTest(Comp: Component, mockDate = false) {
  describe('rtl render', () => {
    it('component should be rendered correctly in RTL direction', () => {
      if (mockDate) {
        MockDate.set(new Date('2000-09-28').getTime())
      }
      const wrapper = mount({
        render() {
          return h(ConfigProvider, { direction: 'rtl' }, {
            default: () => h(Comp as any),
          })
        },
      })
      expect(wrapper.element).toMatchSnapshot()
      if (mockDate) {
        MockDate.reset()
      }
    })
  })
}

export default rtlTest

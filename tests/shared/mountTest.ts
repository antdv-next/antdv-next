import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { mount } from '../utils'

/**
 * Test that a component can be mounted, re-rendered, and unmounted without errors.
 * Vue equivalent of ant-design's mountTest.
 */
export default function mountTest(Comp: Component) {
  describe('mount and unmount', () => {
    it('component could be updated and unmounted without errors', async () => {
      const wrapper = mount({
        render() {
          return h(Comp as any)
        },
      })

      expect(() => {
        wrapper.vm.$forceUpdate()
        wrapper.unmount()
      }).not.toThrow()
    })
  })
}

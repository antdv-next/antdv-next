import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import BackTop from '../BackTop'
import { mount } from '/@tests/utils'

describe('backTop shared vnode', () => {
  it('should not mount a shared icon vnode passed by user', async () => {
    const sharedIcon = h('span', { class: 'back-top-shared-icon' })
    const wrapper = mount(BackTop, {
      props: { icon: sharedIcon, visibilityHeight: 0 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.back-top-shared-icon')).not.toBeNull()
    expect((sharedIcon as any).el).toBeNull()
    expect((sharedIcon as any).component).toBeFalsy()
    wrapper.unmount()
  })
})

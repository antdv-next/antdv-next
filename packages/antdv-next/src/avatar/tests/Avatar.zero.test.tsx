import { describe, expect, it } from 'vitest'
import Avatar from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59153
describe('avatar numeric zero icon', () => {
  it('treats `icon={0}` as a renderable icon', () => {
    const wrapper = mount(Avatar, {
      props: { icon: 0, size: 40 },
    })
    const avatar = wrapper.find('.ant-avatar')
    expect(avatar.classes()).toContain('ant-avatar-icon')
    expect(avatar.text()).toBe('0')
    // icon avatars use half the size as font size instead of the 18px default
    expect(avatar.attributes('style')).toContain('font-size: 20px')
  })

  it('does not treat an empty string icon as renderable', () => {
    const wrapper = mount(Avatar, {
      props: { icon: '', size: 40 },
    })
    expect(wrapper.find('.ant-avatar').classes()).not.toContain('ant-avatar-icon')
  })
})

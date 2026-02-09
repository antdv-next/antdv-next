import { UserOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Avatar from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount } from '../../../../../tests/utils'

describe('avatar', () => {
  rtlTest(() => h(Avatar, null, { default: () => 'test' }))

  it('should render default avatar', () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'U',
      },
    })
    expect(wrapper.find('.ant-avatar').exists()).toBe(true)
    expect(wrapper.find('.ant-avatar-circle').exists()).toBe(true)
  })

  it('should render square shape', () => {
    const wrapper = mount(Avatar, {
      props: {
        shape: 'square',
      },
      slots: {
        default: () => 'U',
      },
    })
    expect(wrapper.find('.ant-avatar-square').exists()).toBe(true)
  })

  it('should render different sizes', () => {
    const sizes = ['large', 'small', 'default'] as const
    sizes.forEach((size) => {
      const wrapper = mount(Avatar, {
        props: { size },
        slots: { default: () => 'U' },
      })
      if (size === 'large') {
        expect(wrapper.find('.ant-avatar-lg').exists()).toBe(true)
      }
      else if (size === 'small') {
        expect(wrapper.find('.ant-avatar-sm').exists()).toBe(true)
      }
      else {
        expect(wrapper.find('.ant-avatar-lg').exists()).toBe(false)
        expect(wrapper.find('.ant-avatar-sm').exists()).toBe(false)
      }
    })
  })

  it('should render with responsive object size', () => {
    const wrapper = mount(Avatar, {
      props: { size: { xs: 24, sm: 32, md: 40, lg: 64 } },
      slots: { default: () => 'U' },
    })
    expect(wrapper.find('.ant-avatar').exists()).toBe(true)
  })

  it('should render with custom number size', () => {
    const wrapper = mount(Avatar, {
      props: { size: 64 },
      slots: { default: () => 'U' },
    })
    const style = wrapper.find('.ant-avatar').attributes('style')
    expect(style).toContain('width: 64px')
    expect(style).toContain('height: 64px')
  })

  it('should render image when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
      },
    })
    expect(wrapper.find('.ant-avatar-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/avatar.png')
  })

  it('should pass alt attribute to img', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        alt: 'user avatar',
      },
    })
    expect(wrapper.find('img').attributes('alt')).toBe('user avatar')
  })

  it('should pass srcSet attribute to img', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        srcSet: 'https://example.com/avatar@2x.png 2x',
      },
    })
    expect(wrapper.find('img').attributes('srcset')).toBe('https://example.com/avatar@2x.png 2x')
  })

  it('should pass crossOrigin attribute to img', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        crossOrigin: 'anonymous',
      },
    })
    expect(wrapper.find('img').attributes('crossorigin')).toBe('anonymous')
  })

  it('should pass draggable attribute to img', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        draggable: false,
      },
    })
    expect(wrapper.find('img').attributes('draggable')).toBe('false')
  })

  it('should call onError when image load fails', async () => {
    const onError = vi.fn()
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/invalid.png',
        onError,
      },
    })
    await wrapper.find('img').trigger('error')
    expect(onError).toHaveBeenCalled()
  })

  it('should fallback when src is removed', async () => {
    const src = ref<string | undefined>('https://example.com/avatar.png')
    const wrapper = mount(() => (
      <Avatar src={src.value}>Fallback</Avatar>
    ))
    expect(wrapper.find('img').exists()).toBe(true)

    src.value = undefined
    await nextTick()
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Fallback')
  })

  it('should not fallback when onError returns false', async () => {
    const onError = vi.fn(() => false)
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/invalid.png',
        onError,
      },
    })
    await wrapper.find('img').trigger('error')
    expect(onError).toHaveBeenCalled()
    // img should still exist because fallback is prevented
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should render icon', () => {
    const wrapper = mount(Avatar, {
      props: {
        icon: h(UserOutlined),
      },
    })
    expect(wrapper.find('.ant-avatar-icon').exists()).toBe(true)
    expect(wrapper.find('.anticon-user').exists()).toBe(true)
  })

  it('should render icon slot', () => {
    const wrapper = mount(Avatar, {
      slots: {
        icon: () => h(UserOutlined),
      },
    })
    expect(wrapper.find('.anticon-user').exists()).toBe(true)
  })

  it('should render text children with auto-scaling', () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'TestUser',
      },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-avatar-string').exists()).toBe(true)
    expect(wrapper.text()).toContain('TestUser')
    wrapper.unmount()
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Avatar data-test="test-id">U</Avatar>
    ))
    expect(wrapper.find('[data-test="test-id"]').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Avatar src="https://example.com/avatar.png" size="large" shape="circle" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match icon snapshot', () => {
    const wrapper = mount(() => (
      <Avatar icon={h(UserOutlined)} size="large" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('avatar.Group', () => {
  it('should render group', () => {
    const wrapper = mount(() => (
      <Avatar.Group>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
      </Avatar.Group>
    ))
    expect(wrapper.find('.ant-avatar-group').exists()).toBe(true)
    expect(wrapper.findAll('.ant-avatar').length).toBe(3)
  })

  it('should pass size to children', () => {
    const wrapper = mount(() => (
      <Avatar.Group size="small">
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>
    ))
    const avatars = wrapper.findAll('.ant-avatar')
    avatars.forEach((avatar) => {
      expect(avatar.classes()).toContain('ant-avatar-sm')
    })
  })

  it('should pass shape to children', () => {
    const wrapper = mount(() => (
      <Avatar.Group shape="square">
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>
    ))
    const avatars = wrapper.findAll('.ant-avatar')
    avatars.forEach((avatar) => {
      expect(avatar.classes()).toContain('ant-avatar-square')
    })
  })

  it('should show max count with popover', () => {
    const wrapper = mount(() => (
      <Avatar.Group max={{ count: 2 }}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
        <Avatar>D</Avatar>
      </Avatar.Group>
    ))
    // 2 visible + 1 "+2" avatar
    const avatars = wrapper.findAll('.ant-avatar')
    expect(avatars.length).toBe(3)
    expect(avatars[2].text()).toBe('+2')
  })

  it('should match group snapshot', () => {
    const wrapper = mount(() => (
      <Avatar.Group size="large" shape="square">
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

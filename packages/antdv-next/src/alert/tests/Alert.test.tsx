import { SmileOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Alert from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('alert', () => {
  rtlTest(() => h(Alert, null, { message: () => 'test' }))

  it('should render title correctly', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Title Text',
        type: 'success',
      },
    })
    expect(wrapper.find('.ant-alert-title').text()).toBe('Title Text')
  })

  it('should render description correctly', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Success Text',
        description: 'Success Description',
        type: 'success',
      },
    })

    expect(wrapper.find('.ant-alert-description').text()).toBe('Success Description')
  })

  it('should render type correctly', () => {
    const types = ['success', 'info', 'warning', 'error'] as const
    types.forEach((type) => {
      const wrapper = mount(Alert, {
        props: {
          message: 'Text',
          type,
        },
      })
      expect(wrapper.find(`.ant-alert-${type}`).exists()).toBe(true)
    })
  })

  it('should show icon', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Success Text',
        type: 'success',
        showIcon: true,
      },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true)
  })

  it('should allow custom icon', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Success Text',
        icon: h(SmileOutlined),
        showIcon: true,
      },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })

  it('should be closable', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        message: 'Success Text',
        closable: true,
        onClose,
      },
    })
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(true)
    await wrapper.find('.ant-alert-close-icon').trigger('click')
    expect(onClose).toHaveBeenCalled()
  })

  it('should allow custom close icon', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Success Text',
        closable: { closeIcon: h(SmileOutlined) },
      },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })

  it('should support banner mode', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Banner Text',
        banner: true,
      },
    })
    expect(wrapper.find('.ant-alert-banner').exists()).toBe(true)
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true) // Banner defaults to showIcon: true
  })

  it('should support action slot', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Text',
      },
      slots: {
        action: () => h('button', 'Action'),
      },
    })
    expect(wrapper.find('.ant-alert-actions').text()).toBe('Action')
  })

  it('should support title slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        title: () => 'Title Slot',
        description: () => 'Description Slot',
      },
    })
    expect(wrapper.find('.ant-alert-title').text()).toBe('Title Slot')
    expect(wrapper.find('.ant-alert-description').text()).toBe('Description Slot')
  })
})

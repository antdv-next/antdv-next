import { SmileOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Alert from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Popconfirm from '../../popconfirm'
import Tooltip from '../../tooltip'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('alert', () => {
  rtlTest(() => h(Alert, null, { title: () => 'test' }))

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
        title: 'Success Text',
        description: 'Success Description',
        type: 'success',
      },
    })
    expect(wrapper.find('.ant-alert-description').text()).toBe('Success Description')
  })

  it('should render numeric 0 for title, description and action', () => {
    const wrapper = mount(Alert, {
      props: { title: 0, description: 0, action: 0 },
    })
    expect(wrapper.find('.ant-alert-title').text()).toBe('0')
    expect(wrapper.find('.ant-alert-description').text()).toBe('0')
    expect(wrapper.find('.ant-alert-actions').text()).toBe('0')
    expect(wrapper.find('.ant-alert-with-description').exists()).toBe(true)
  })

  it('should render type correctly', () => {
    const types = ['success', 'info', 'warning', 'error'] as const
    types.forEach((type) => {
      const wrapper = mount(Alert, {
        props: {
          title: 'Text',
          type,
        },
      })
      expect(wrapper.find(`.ant-alert-${type}`).exists()).toBe(true)
    })
  })

  it('should show icon', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        type: 'success',
        showIcon: true,
      },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true)
  })

  it('should allow custom icon', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        icon: h(SmileOutlined),
        showIcon: true,
      },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })

  it('should allow custom icon via slot', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        showIcon: true,
      },
      slots: {
        icon: () => h(SmileOutlined),
      },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })

  it('icon slot should take priority over icon prop', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        icon: h('span', { class: 'icon-from-prop' }, 'prop'),
        showIcon: true,
      },
      slots: {
        icon: () => h('span', { class: 'icon-from-slot' }, 'slot'),
      },
    })
    expect(wrapper.find('.icon-from-slot').exists()).toBe(true)
    expect(wrapper.find('.icon-from-prop').exists()).toBe(false)
  })

  it('should be closable', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
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
        title: 'Success Text',
        closable: { closeIcon: h(SmileOutlined) },
      },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })

  it('should use global closeIcon from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider alert={{ closeIcon: h('span', { class: 'global-close-icon' }, 'G') }}>
        <Alert title="Success Text" closable />
      </ConfigProvider>
    ))

    expect(wrapper.find('.global-close-icon').exists()).toBe(true)
  })

  it('should use global closable.closeIcon from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider alert={{ closable: { closeIcon: h('span', { class: 'global-closable-icon' }, 'C') } }}>
        <Alert title="Success Text" />
      </ConfigProvider>
    ))

    expect(wrapper.find('.global-closable-icon').exists()).toBe(true)
  })

  it('should use the default close icon when closeIcon is true', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        closable: true,
        closeIcon: true,
      },
    })

    expect(wrapper.find('.ant-alert-close-icon .anticon-close').exists()).toBe(true)
  })

  it('should call closable.onClose with priority over onClose', async () => {
    const closableOnClose = vi.fn()
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        closable: { onClose: closableOnClose },
        onClose,
      },
    })

    await wrapper.find('.ant-alert-close-icon').trigger('click')
    expect(closableOnClose).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should only pass aria and data props from closable to close button', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Success Text',
        closable: {
          'aria-label': 'Close',
          'data-test': 'close',
          disabled: true,
        } as any,
      },
    })

    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.attributes('aria-label')).toBe('Close')
    expect(closeButton.attributes('data-test')).toBe('close')
    expect(closeButton.attributes('disabled')).toBeUndefined()
  })

  it('should expose nativeElement', () => {
    const wrapper = mount(Alert, { props: { title: 'Success Text' } })
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.find('.ant-alert').element)
  })

  it('should support banner mode', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Banner Text',
        banner: true,
      },
    })
    expect(wrapper.find('.ant-alert-banner').exists()).toBe(true)
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true) // Banner defaults to showIcon: true
  })

  it('should support action slot', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Text',
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

  it('should support deprecated message prop and slot', () => {
    const propWrapper = mount(Alert, { props: { message: 'Message Text' } })
    expect(propWrapper.find('.ant-alert-title').text()).toBe('Message Text')

    const slotWrapper = mount(Alert, { slots: { message: () => 'Message Slot' } })
    expect(slotWrapper.find('.ant-alert-title').text()).toBe('Message Slot')

    const priorityWrapper = mount(Alert, { props: { title: 'Title Text', message: 'Message Text' } })
    expect(priorityWrapper.find('.ant-alert-title').text()).toBe('Title Text')
  })

  it('should show close button and could be closed', async () => {
    const onClose = vi.fn()
    const wrapper = mount(() => (
      <Alert
        title="Warning Text Warning Text Warning Text Warning Text Warning Text Warning TextWarning Text"
        type="warning"
        closable={true}
        onClose={onClose}
      />
    ))
    await wrapper.find('.ant-alert-close-icon').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('custom action', () => {
    const wrapper = mount(() => (
      <Alert
        title="Success Tips"
        type="success"
        showIcon={true}
        closable={true}
        v-slots={{
          action: () => <Button size="small" type="text">UNDO</Button>,
        }}
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should sets data attributes on alert when pass attributes to props', () => {
    const wrapper = mount(() => (
      <Alert
        data-test="test-id"
        data-id="12345"
        aria-describedby="some-label"
        title={null}
      />
    ))
    const alert = wrapper.find('[role="alert"]')
    expect(alert.attributes('data-test')).toBe('test-id')
    expect(alert.attributes('data-id')).toBe('12345')
    expect(alert.attributes('aria-describedby')).toBe('some-label')
  })

  it('sets role attribute on input', () => {
    const wrapper = mount(() => (
      <Alert
        role="status"
        title={null}
      />
    ))
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('could be used with Tooltip', async () => {
    const wrapper = mount(() => (
      <Tooltip title="xxx" mouseEnterDelay={0}>
        <Alert
          title="Warning Text"
          type="warning"
        />
      </Tooltip>
    ), { attachTo: document.body })

    await wrapper.find('.ant-alert').trigger('mouseenter')
    expect(wrapper.find('.ant-alert').exists()).toBe(true)
  })

  it('could be used with Popconfirm', async () => {
    const wrapper = mount(() => (
      <Popconfirm title="xxx">
        <Alert
          title="Warning Text"
          type="warning"
        />
      </Popconfirm>
    ), { attachTo: document.body })
    await wrapper.find('.ant-alert').trigger('click')
    expect(wrapper.find('.ant-alert').exists()).toBe(true)
  })

  it('could accept none react element icon', () => {
    const wrapper = mount(() => (
      <Alert
        title="Success Tips"
        type="success"
        showIcon={true}
        icon={<span>icon</span>}
      />
    ))
    expect(wrapper.text()).toContain('Success Tips')
    expect(wrapper.text()).toContain('icon')
  })

  it('should not render title div when no title', () => {
    const wrapper = mount(() => (
      <Alert
        description="description"
      />
    ))
    expect(wrapper.find('.ant-alert-title').exists()).toBe(false)
  })

  it('close button should be hidden when closeIcon setting to null or false', async () => {
    const closeIcon = ref<any>(null)
    const wrapper = mount(() => <Alert closeIcon={closeIcon.value} />)
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)

    closeIcon.value = false
    await nextTick()
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)

    closeIcon.value = true
    await nextTick()
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(true)

    closeIcon.value = undefined
    await nextTick()
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)
  })

  it('close button should be support aria-* by closable', async () => {
    const closable = ref<{ 'aria-label'?: string } | undefined>(undefined)
    const closeIcon = ref<string | undefined>(undefined)
    const wrapper = mount(() => <Alert closable={closable.value} closeIcon={closeIcon.value} />)
    expect(wrapper.find('[aria-label]').exists()).toBe(false)

    closable.value = { 'aria-label': 'Close' }
    closeIcon.value = 'CloseIcon'
    await nextTick()
    expect(wrapper.find('[aria-label="Close"]').exists()).toBe(true)
  })

  it('should show close button when closable is configured by object only', async () => {
    const onClose = vi.fn()
    const wrapper = mount(() => (
      <Alert
        title="Warning Text"
        type="warning"
        closable={{ 'aria-label': 'Dismiss' }}
        onClose={onClose}
      />
    ))

    const closeButton = wrapper.find('[aria-label="Dismiss"]')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('close button should be support custom icon by closable', async () => {
    const closable = ref<{ closeIcon?: string } | undefined>(undefined)
    const wrapper = mount(() => <Alert closable={closable.value} />)
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)

    closable.value = { closeIcon: 'CloseBtn' }
    await nextTick()
    expect(wrapper.find('.ant-alert-close-icon').text()).toBe('CloseBtn')
  })

  it('should support id and ref', () => {
    const wrapper = mount(() => <Alert id="test-id" />)
    expect(wrapper.find('#test-id').exists()).toBe(true)
  })

  it('should apply custom styles to Alert', () => {
    const customClassNames = {
      root: 'custom-root',
      icon: 'custom-icon',
      section: 'custom-section',
      title: 'custom-title',
      description: 'custom-description',
      actions: 'custom-actions',
      close: 'custom-close',
    }

    const customStyles = {
      root: { color: 'rgb(255, 0, 0)' },
      icon: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    }

    const wrapper = mount(() => (
      <Alert
        closable={true}
        styles={customStyles}
        classes={customClassNames}
        title="Info Text"
        showIcon={true}
        description="Info Description"
        type="info"
        action="Action"
      />
    ))

    expect(wrapper.html()).toContain('custom-root')
    expect(wrapper.html()).toContain('custom-icon')
    expect(wrapper.find('.ant-alert').classes()).toContain('custom-root')
  })

  it('should support custom success icon', () => {
    const wrapper = mount(
      <ConfigProvider alert={{ successIcon: 'foobar' }}>
        <Alert title="Success Tips" type="success" showIcon />
      </ConfigProvider>,
    )

    expect(wrapper.find('.ant-alert').text()).toContain('foobar')
  })
})

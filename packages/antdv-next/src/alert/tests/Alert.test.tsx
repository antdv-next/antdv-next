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

  it('should show close button and could be closed', async () => {
    const onClose = vi.fn()
    const wrapper = mount(() => (
      <Alert
        message="Warning Text Warning Text Warning Text Warning Text Warning Text Warning TextWarning Text"
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
        message="Success Tips"
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
        message={null}
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
        message={null}
      />
    ))
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('could be used with Tooltip', async () => {
    const wrapper = mount(() => (
      <Tooltip title="xxx" mouseEnterDelay={0}>
        <Alert
          message="Warning Text"
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
          message="Warning Text"
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

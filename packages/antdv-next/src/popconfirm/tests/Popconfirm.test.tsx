import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Popconfirm from '..'
import { mount } from '/@tests/utils'

describe('popconfirm', () => {
  // ========================= Basic =========================
  it('renders trigger element', () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Are you sure?' },
      slots: {
        default: () => <button>Delete</button>,
      },
    })
    expect(wrapper.find('button').text()).toBe('Delete')
  })

  it('opens on click by default', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?' },
      slots: {
        default: () => <button>Click</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const popup = document.querySelector('.ant-popconfirm')
    expect(popup).toBeTruthy()
    wrapper.unmount()
  })

  it('shows title in popup', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Delete this item?' },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const title = document.querySelector('.ant-popconfirm-title')
    expect(title?.textContent).toBe('Delete this item?')
    wrapper.unmount()
  })

  it('shows description in popup', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', description: 'This action cannot be undone.' },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const desc = document.querySelector('.ant-popconfirm-description')
    expect(desc?.textContent).toBe('This action cannot be undone.')
    wrapper.unmount()
  })

  // ========================= Buttons =========================
  it('renders OK and Cancel buttons', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?' },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    expect(buttons.length).toBe(2)
    wrapper.unmount()
  })

  it('supports custom okText and cancelText', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', okText: 'Yes', cancelText: 'No' },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    expect(buttons[0]?.textContent).toBe('No')
    expect(buttons[1]?.textContent).toBe('Yes')
    wrapper.unmount()
  })

  it('hides cancel button when showCancel is false', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', showCancel: false },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    // Only the OK button
    expect(buttons.length).toBe(1)
    wrapper.unmount()
  })

  // ========================= Events =========================
  it('emits confirm on OK click', async () => {
    const onConfirm = vi.fn()
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', onConfirm },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    const okButton = buttons[buttons.length - 1] as HTMLElement
    okButton.click()
    await nextTick()
    expect(onConfirm).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('emits cancel on Cancel click', async () => {
    const onCancel = vi.fn()
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?' },
      attrs: { onCancel },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    const cancelButton = buttons[0] as HTMLElement
    cancelButton.click()
    await nextTick()
    expect(onCancel).toHaveBeenCalled()
    wrapper.unmount()
  })

  // ========================= Disabled =========================
  it('does not open when disabled', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', disabled: true },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const popup = document.querySelector('.ant-popconfirm')
    // Should not be visible
    expect(popup?.classList.contains('ant-zoom-big-appear-active') ?? false).toBe(false)
    wrapper.unmount()
  })

  // ========================= Controlled =========================
  it('supports controlled open', async () => {
    const open = ref(false)
    const wrapper = mount({
      render() {
        return (
          <Popconfirm title="Sure?" open={open.value}>
            <button>Del</button>
          </Popconfirm>
        )
      },
    }, { attachTo: document.body })

    let popup = document.querySelector('.ant-popconfirm')
    // Initially not visible (open=false)
    expect(popup?.classList.contains('ant-zoom-big-appear-active') ?? false).toBe(false)

    open.value = true
    await nextTick()
    await nextTick()
    popup = document.querySelector('.ant-popconfirm')
    expect(popup).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Icon =========================
  it('shows default icon', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?' },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const icon = document.querySelector('.ant-popconfirm-message-icon .anticon')
    expect(icon).toBeTruthy()
    wrapper.unmount()
  })

  it('supports custom icon via prop', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', icon: <span class="custom-icon">!</span> },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const icon = document.querySelector('.ant-popconfirm-message-icon .custom-icon')
    expect(icon).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Slots =========================
  it('supports title slot', async () => {
    const wrapper = mount(Popconfirm, {
      props: {},
      slots: {
        default: () => <button>Del</button>,
        title: () => <span class="slot-title">Slot Title</span>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const title = document.querySelector('.ant-popconfirm-title .slot-title')
    expect(title?.textContent).toBe('Slot Title')
    wrapper.unmount()
  })

  it('supports description slot', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?' },
      slots: {
        default: () => <button>Del</button>,
        description: () => <span class="slot-desc">Slot Description</span>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const desc = document.querySelector('.ant-popconfirm-description .slot-desc')
    expect(desc?.textContent).toBe('Slot Description')
    wrapper.unmount()
  })

  // ========================= okButtonProps / cancelButtonProps =========================
  it('supports okButtonProps', async () => {
    const wrapper = mount(Popconfirm, {
      props: {
        title: 'Sure?',
        okButtonProps: { danger: true },
      },
      slots: {
        default: () => <button>Del</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    const okButton = buttons[buttons.length - 1]
    expect(okButton?.classList.contains('ant-btn-color-dangerous')).toBe(true)
    wrapper.unmount()
  })

  // ========================= Placement =========================
  it('supports placement prop', () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', placement: 'bottom' },
      slots: {
        default: () => <button>Del</button>,
      },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  // ========================= Snapshot =========================
  it('matches snapshot', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Are you sure?', description: 'This cannot be undone.' },
      slots: {
        default: () => <button>Delete</button>,
      },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()
    const popup = document.querySelector('.ant-popconfirm-inner-content')
    expect(popup?.innerHTML).toMatchSnapshot()
    wrapper.unmount()
  })
})

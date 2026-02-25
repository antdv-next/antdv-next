import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Drawer from '..'
import { mount } from '/@tests/utils'

describe('drawer', () => {
  // ========================= Basic =========================
  it('renders when open', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Test Drawer' },
      slots: { default: () => <p>Content</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer')
    expect(drawer).toBeTruthy()
    wrapper.unmount()
  })

  it('does not render content when closed', () => {
    const wrapper = mount(Drawer, {
      props: { open: false, title: 'Hidden' },
      slots: { default: () => <p>Content</p> },
      attachTo: document.body,
    })
    const body = document.querySelector('.ant-drawer-body')
    expect(body).toBeNull()
    wrapper.unmount()
  })

  it('shows title', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'My Drawer' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const title = document.querySelector('.ant-drawer-title')
    expect(title?.textContent).toBe('My Drawer')
    wrapper.unmount()
  })

  it('shows body content', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: { default: () => <p class="body-text">Hello</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const body = document.querySelector('.ant-drawer-body .body-text')
    expect(body?.textContent).toBe('Hello')
    wrapper.unmount()
  })

  // ========================= Title / Extra / Footer =========================
  it('renders title slot', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      slots: {
        default: () => <p>Body</p>,
        title: () => <span class="slot-title">Slot Title</span>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const title = document.querySelector('.ant-drawer-title .slot-title')
    expect(title?.textContent).toBe('Slot Title')
    wrapper.unmount()
  })

  it('renders extra content', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: {
        default: () => <p>Body</p>,
        extra: () => <span class="extra-content">Extra</span>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const extra = document.querySelector('.ant-drawer-extra .extra-content')
    expect(extra?.textContent).toBe('Extra')
    wrapper.unmount()
  })

  it('renders footer', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', footer: 'Footer Text' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const footer = document.querySelector('.ant-drawer-footer')
    expect(footer?.textContent).toBe('Footer Text')
    wrapper.unmount()
  })

  it('renders footer slot', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: {
        default: () => <p>Body</p>,
        footer: () => <button>Submit</button>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const footer = document.querySelector('.ant-drawer-footer button')
    expect(footer?.textContent).toBe('Submit')
    wrapper.unmount()
  })

  it('does not render header when no title and closable is false', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, closable: false },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const header = document.querySelector('.ant-drawer-header')
    expect(header).toBeNull()
    wrapper.unmount()
  })

  it('does not render footer when no footer prop or slot', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const footer = document.querySelector('.ant-drawer-footer')
    expect(footer).toBeNull()
    wrapper.unmount()
  })

  // ========================= Closable =========================
  it('shows close button by default', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.ant-drawer-close')
    expect(closeBtn).toBeTruthy()
    wrapper.unmount()
  })

  it('hides close button when closable is false', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', closable: false },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.ant-drawer-close')
    expect(closeBtn).toBeNull()
    wrapper.unmount()
  })

  it('emits close on close button click', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      attrs: { onClose },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.ant-drawer-close') as HTMLElement
    closeBtn?.click()
    await nextTick()
    expect(onClose).toHaveBeenCalled()
    wrapper.unmount()
  })

  // ========================= Placement =========================
  it('supports right placement by default', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer-right')
    expect(drawer).toBeTruthy()
    wrapper.unmount()
  })

  it('supports left placement', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', placement: 'left' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer-left')
    expect(drawer).toBeTruthy()
    wrapper.unmount()
  })

  it('supports top placement', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', placement: 'top' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer-top')
    expect(drawer).toBeTruthy()
    wrapper.unmount()
  })

  it('supports bottom placement', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', placement: 'bottom' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer-bottom')
    expect(drawer).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Size =========================
  it('uses default size (378px)', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', size: 'default' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const contentWrapper = document.querySelector('.ant-drawer-content-wrapper') as HTMLElement
    expect(contentWrapper?.style.width).toBe('378px')
    wrapper.unmount()
  })

  it('uses large size (736px)', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', size: 'large' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const contentWrapper = document.querySelector('.ant-drawer-content-wrapper') as HTMLElement
    expect(contentWrapper?.style.width).toBe('736px')
    wrapper.unmount()
  })

  it('supports number size', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', size: 500 },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const contentWrapper = document.querySelector('.ant-drawer-content-wrapper') as HTMLElement
    expect(contentWrapper?.style.width).toBe('500px')
    wrapper.unmount()
  })

  it('supports string number size', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', size: '600' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const contentWrapper = document.querySelector('.ant-drawer-content-wrapper') as HTMLElement
    expect(contentWrapper?.style.width).toBe('600px')
    wrapper.unmount()
  })

  it('supports percentage size string', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', size: '50%' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const contentWrapper = document.querySelector('.ant-drawer-content-wrapper') as HTMLElement
    expect(contentWrapper?.style.width).toBe('50%')
    wrapper.unmount()
  })

  // ========================= Mask =========================
  it('shows mask by default', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const mask = document.querySelector('.ant-drawer-mask')
    expect(mask).toBeTruthy()
    wrapper.unmount()
  })

  it('hides mask when mask is false', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', mask: false },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const drawer = document.querySelector('.ant-drawer')
    expect(drawer?.classList.contains('no-mask')).toBe(true)
    wrapper.unmount()
  })

  // ========================= Controlled =========================
  it('supports controlled open', async () => {
    const open = ref(false)
    const wrapper = mount({
      render() {
        return (
          <Drawer open={open.value} title="Drawer">
            <p>Body</p>
          </Drawer>
        )
      },
    }, { attachTo: document.body })

    let body = document.querySelector('.ant-drawer-body')
    expect(body).toBeNull()

    open.value = true
    await nextTick()
    await nextTick()
    body = document.querySelector('.ant-drawer-body')
    expect(body).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Loading =========================
  it('shows skeleton when loading', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', loading: true },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const skeleton = document.querySelector('.ant-drawer-body-skeleton')
    expect(skeleton).toBeTruthy()
    // Should not render default slot content
    const bodyText = document.querySelector('.ant-drawer-body p')
    expect(bodyText).toBeNull()
    wrapper.unmount()
  })

  it('shows content when not loading', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', loading: false },
      slots: { default: () => <p class="real-content">Real Content</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const skeleton = document.querySelector('.ant-drawer-body-skeleton')
    expect(skeleton).toBeNull()
    const content = document.querySelector('.ant-drawer-body .real-content')
    expect(content?.textContent).toBe('Real Content')
    wrapper.unmount()
  })

  // ========================= Close icon =========================
  it('supports custom closeIcon slot', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer' },
      slots: {
        default: () => <p>Body</p>,
        closeIcon: () => <span class="custom-close">X</span>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const icon = document.querySelector('.ant-drawer-close .custom-close')
    expect(icon?.textContent).toBe('X')
    wrapper.unmount()
  })

  // ========================= Closable placement =========================
  it('supports closable placement end', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Drawer', closable: { placement: 'end' } },
      slots: { default: () => <p>Body</p> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.ant-drawer-close-end')
    expect(closeBtn).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Snapshot =========================
  it('matches snapshot', async () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Snapshot Drawer',
        footer: 'Footer',
      },
      slots: {
        default: () => <p>Drawer Content</p>,
        extra: () => <span>Extra</span>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const section = document.querySelector('.ant-drawer-section')
    expect(section?.innerHTML).toMatchSnapshot()
    wrapper.unmount()
  })
})

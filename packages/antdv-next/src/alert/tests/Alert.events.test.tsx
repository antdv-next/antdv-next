import { describe, expect, it, vi } from 'vitest'
import Alert from '..'
import { mount } from '/@tests/utils'

describe('alert events', () => {
  it('should trigger click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: 'Title Text',
        onClick,
      },
    })
    await wrapper.find('.ant-alert').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should trigger mouseenter and mouseleave events', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: 'Title Text',
        onMouseenter,
        onMouseleave,
      },
    })
    const root = wrapper.find('.ant-alert')
    await root.trigger('mouseenter')
    await root.trigger('mouseleave')
    expect(onMouseenter).toHaveBeenCalledTimes(1)
    expect(onMouseleave).toHaveBeenCalledTimes(1)
  })

  it('should not trigger click twice when the close icon is clicked', async () => {
    const onClick = vi.fn()
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: {
        title: 'Title Text',
        closable: true,
        onClick,
        onClose,
      },
    })
    await wrapper.find('.ant-alert-close-icon').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

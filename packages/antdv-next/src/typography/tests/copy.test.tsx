import { SmileOutlined } from '@antdv-next/icons'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Base from '../Base'
import { flushPromises, mount, waitFakeTimer } from '/@tests/utils'

// Mock copy
const copyMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../../_util/copy', () => ({
  default: (...args: any[]) => copyMock(...args),
}))

describe('typography copy', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    errorSpy.mockReset()
    copyMock.mockReset()
    vi.useRealTimers()
  })

  it('basic copy', async () => {
    // vi.useFakeTimers() // Disable fake timers to see if it helps
    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: true,
      },
      slots: {
        default: () => 'test copy',
      },
    })

    const copyBtn = wrapper.find('.ant-typography-copy')
    expect(copyBtn.exists()).toBe(true)

    await copyBtn.trigger('click')

    // Wait for async copy to resolve
    await flushPromises()
    await nextTick()

    expect(copyMock).toHaveBeenCalledWith('test copy', {})

    console.log(wrapper.html())

    // Check if icon changed to check
    expect(wrapper.find('.anticon-check').exists()).toBe(true)
  })

  it('customize copy text', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: { text: 'bamboo' },
      },
      slots: { default: () => 'test' },
    })

    await wrapper.find('.ant-typography-copy').trigger('click')
    await waitFakeTimer()
    expect(copyMock).toHaveBeenCalledWith('bamboo', {})
  })

  it('onCopy callback', async () => {
    vi.useFakeTimers()
    const onCopy = vi.fn()
    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: { onCopy },
      },
      slots: { default: () => 'test' },
    })

    await wrapper.find('.ant-typography-copy').trigger('click')
    await waitFakeTimer()
    expect(onCopy).toHaveBeenCalled()
  })

  it('custom icon', async () => {
    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: { icon: h(SmileOutlined) },
      },
      slots: { default: () => 'test' },
    })
    expect(wrapper.find('.anticon-smile').exists()).toBe(true)
  })
})

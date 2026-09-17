import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Anchor from '..'

const { scrollToMock } = vi.hoisted(() => ({
  scrollToMock: vi.fn(),
}))

vi.mock('../../_util/scrollTo', () => ({
  default: scrollToMock,
}))

function createTargets() {
  const targets = document.createElement('div')
  targets.innerHTML = '<div id="section-a">A</div><div id="section-b">B</div>'
  document.body.appendChild(targets)
  return targets
}

describe('anchor scroll cancellation', () => {
  beforeEach(() => {
    scrollToMock.mockReset()
  })

  it('cancels the previous animation when clicking a different link', async () => {
    const cancelFirst = vi.fn()
    const cancelSecond = vi.fn()
    scrollToMock.mockReturnValueOnce(cancelFirst).mockReturnValueOnce(cancelSecond)
    const targets = createTargets()
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [
          { key: 'a', href: '#section-a', title: 'A' },
          { key: 'b', href: '#section-b', title: 'B' },
        ],
      },
      attachTo: document.body,
    })

    await wrapper.find('a[href="#section-a"]').trigger('click')
    await wrapper.find('a[href="#section-b"]').trigger('click')

    expect(scrollToMock).toHaveBeenCalledTimes(2)
    expect(cancelFirst).toHaveBeenCalledTimes(1)
    expect(cancelSecond).not.toHaveBeenCalled()

    wrapper.unmount()
    targets.remove()
  })

  it('does not restart the animation when clicking the active link again', async () => {
    const cancel = vi.fn()
    scrollToMock.mockReturnValue(cancel)
    const targets = createTargets()
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items: [{ key: 'a', href: '#section-a', title: 'A' }],
      },
      attachTo: document.body,
    })
    const link = wrapper.find('a[href="#section-a"]')

    await link.trigger('click')
    await link.trigger('click')

    expect(scrollToMock).toHaveBeenCalledTimes(1)
    expect(cancel).not.toHaveBeenCalled()

    wrapper.unmount()
    targets.remove()
  })
})

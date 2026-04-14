import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import Base from '../Base'
import { mount } from '/@tests/utils'

vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => true,
}))

const { isEleEllipsis } = vi.hoisted(() => ({
  isEleEllipsis: vi.fn(() => true),
}))

vi.mock('../Base/util', async () => {
  const actual = await vi.importActual<typeof import('../Base/util')>('../Base/util')
  return {
    ...actual,
    isEleEllipsis,
  }
})

describe('typography native ellipsis measure', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    isEleEllipsis.mockClear()
  })

  it('skips native measurement when ellipsis tooltip title is absent', async () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    const IntersectionObserverMock = vi.fn(() => ({
      observe,
      disconnect,
    }))

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock as any)

    mount(Base, {
      props: {
        ellipsis: true,
        component: 'p',
      },
      slots: {
        default: () => 'Bamboo is Little Light',
      },
    })

    await nextTick()
    await nextTick()

    expect(isEleEllipsis).not.toHaveBeenCalled()
    expect(IntersectionObserverMock).not.toHaveBeenCalled()
  })
})

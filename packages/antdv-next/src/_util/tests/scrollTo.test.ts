import { describe, expect, it, vi } from 'vitest'
import scrollTo from '../scrollTo'

describe('scrollTo', () => {
  it('should scroll immediately and call callback when duration is not positive', () => {
    const callback = vi.fn()
    const div = document.createElement('div')
    const cancel = scrollTo(1000, {
      callback,
      duration: 0,
      getContainer: () => div,
    })

    expect(div.scrollTop).toBe(1000)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(() => cancel()).not.toThrow()
    expect(cancel()).toBeUndefined()
  })
})

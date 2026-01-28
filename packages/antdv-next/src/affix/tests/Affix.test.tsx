import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import mountTest from '../../../../../tests/shared/mountTest'
import {
  assertsExist,
  mount,
  renderComposable,
  resetMockDate,
  setMockDate,
  sleep,
  waitFakeTimer,
} from '../../../../../tests/utils'

// A simple test component to verify the test infrastructure works
const SimpleComponent = defineComponent({
  name: 'SimpleComponent',
  setup() {
    const count = ref(0)
    return () => h('div', { class: 'simple' }, `count: ${count.value}`)
  },
})

describe('test Infrastructure Verification', () => {
  mountTest(SimpleComponent)

  it('mount helper works with Vue components', () => {
    const wrapper = mount(SimpleComponent)
    expect(wrapper.text()).toBe('count: 0')
    expect(wrapper.find('.simple').exists()).toBe(true)
  })

  it('renderComposable works with Vue composables', () => {
    const useCounter = () => {
      const count = ref(0)
      const increment = () => count.value++
      return { count, increment }
    }

    const { result } = renderComposable(() => useCounter())
    expect(result.value.count.value).toBe(0)
    result.value.increment()
    expect(result.value.count.value).toBe(1)
  })

  it('mockDate utilities work', () => {
    setMockDate('2020-01-01T00:00:00.000')
    expect(new Date().getFullYear()).toBe(2020)
    resetMockDate()
    expect(new Date().getFullYear()).not.toBe(2020)
  })

  it('sleep utility works', async () => {
    const start = Date.now()
    await sleep(0)
    // sleep(0) should resolve almost immediately
    expect(Date.now() - start).toBeLessThan(100)
  })

  it('waitFakeTimer utility works', async () => {
    vi.useFakeTimers()
    let resolved = false
    setTimeout(() => {
      resolved = true
    }, 5000)
    await waitFakeTimer(1000, 10)
    expect(resolved).toBe(true)
    vi.useRealTimers()
  })

  it('assertsExist works', () => {
    const value: string | undefined = 'hello'
    assertsExist(value)
    expect(value.length).toBe(5)
  })

  it('dOM matchers from @testing-library/jest-dom work', () => {
    const wrapper = mount(SimpleComponent, { attachTo: document.body })
    expect(wrapper.element).toBeInTheDocument()
    expect(wrapper.element).toHaveTextContent('count: 0')
    wrapper.unmount()
  })
})

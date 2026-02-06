import type { Component } from 'vue'
// @ts-expect-error this is an internal util
import { _rs as onResize } from '@v-c/resize-observer/dist/utils/observerUtil'
import { flushPromises, mount } from '@vue/test-utils'
import MockDate from 'mockdate'
import { expect, vi } from 'vitest'
import { defineComponent, h, nextTick, shallowRef } from 'vue'

export function assertsExist<T>(item?: T): asserts item is T {
  expect(item).not.toBeUndefined()
  expect(item).not.toBeNull()
}

export function setMockDate(dateString = '2017-09-18T03:30:07.795') {
  MockDate.set(dateString)
}

export function resetMockDate() {
  MockDate.reset()
}

const globalTimeout = global.setTimeout

export async function sleep(timeout = 0) {
  await new Promise(resolve => globalTimeout(resolve, timeout))
  await nextTick()
}

/**
 * Mount a Vue component for testing.
 * Returns the @vue/test-utils wrapper.
 */
export function mountComponent<T extends Component>(
  Comp: T,
  options: Record<string, any> = {},
) {
  return mount(Comp as any, options)
}

/**
 * Test a Vue composable function.
 * Equivalent to React's renderHook.
 *
 * Uses shallowRef to avoid auto-unwrapping nested refs in the composable return value.
 *
 * @example
 * ```ts
 * const { result } = renderComposable(() => useCounter())
 * expect(result.value.count.value).toBe(0)
 * ```
 */
export function renderComposable<T>(composable: () => T): { result: { value: T }, wrapper: ReturnType<typeof mount> } {
  const result = shallowRef<T>() as { value: T }

  const TestComponent = defineComponent({
    setup() {
      result.value = composable()
      return () => h('div')
    },
  })

  const wrapper = mount(TestComponent)

  return { result, wrapper }
}

/**
 * Trigger resize observer on target element.
 */
export function triggerResize(target: Element) {
  const originGetBoundingClientRect = target.getBoundingClientRect

  target.getBoundingClientRect = () => ({ width: 510, height: 903 }) as DOMRect

  onResize?.([{ target } as ResizeObserverEntry])

  target.getBoundingClientRect = originGetBoundingClientRect
}

/**
 * Wait for fake timers to advance. Will wait `advanceTime * times` ms.
 *
 * @param advanceTime Default 1000
 * @param times Default 20
 */
export async function waitFakeTimer(advanceTime = 1000, times = 20) {
  for (let i = 0; i < times; i += 1) {
    if (advanceTime > 0) {
      vi.advanceTimersByTime(advanceTime)
    }
    else {
      vi.runAllTimers()
    }
    await nextTick()
    await flushPromises()
  }
}

export async function waitFor(callback: () => void | Promise<void>, timeout = 1000) {
  let elapsed = 0
  const interval = 50
  while (elapsed < timeout) {
    try {
      await callback()
      return
    }
    catch {
      await vi.advanceTimersByTimeAsync(interval)
      elapsed += interval
    }
  }
  await callback()
}

// Re-export commonly used utilities from @vue/test-utils
export { config, DOMWrapper, enableAutoUnmount, flushPromises, mount, shallowMount, VueWrapper } from '@vue/test-utils'

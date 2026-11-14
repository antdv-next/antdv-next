import type { Ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { useZIndex } from '../hooks/useZIndex'
import { mount } from '/@tests/utils'

function mountZIndex(customZIndex: Ref<number | undefined>) {
  let result: ReturnType<typeof useZIndex> | undefined

  const Demo = defineComponent(() => {
    result = useZIndex('SelectLike', customZIndex)
    return () => <div />
  })

  const wrapper = mount(Demo)
  return { result: result!, wrapper }
}

describe('useZIndex', () => {
  it('falls back to the calculated z-index when customZIndex becomes undefined', async () => {
    const customZIndex = ref<number | undefined>(500)
    const { result, wrapper } = mountZIndex(customZIndex)

    expect(result[0].value).toBe(500)
    expect(result[1].value).toBe(500)

    customZIndex.value = undefined
    await nextTick()

    expect(result[0].value).toBeUndefined()
    expect(result[1].value).toBe(50)

    wrapper.unmount()
  })

  it('applies a custom z-index to the context when customZIndex becomes defined', async () => {
    const customZIndex = ref<number | undefined>(undefined)
    const { result, wrapper } = mountZIndex(customZIndex)

    expect(result[0].value).toBeUndefined()
    expect(result[1].value).toBe(50)

    customZIndex.value = 500
    await nextTick()

    expect(result[0].value).toBe(500)
    expect(result[1].value).toBe(500)

    wrapper.unmount()
  })
})

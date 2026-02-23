import type { PanelProps } from '../interface'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import useSizes from '../hooks/useSizes'
import { renderComposable } from '/@tests/utils'

function getSizesResult(items: PanelProps[], containerSize = 1000) {
  const itemsRef = ref(items)
  const containerSizeRef = ref(containerSize)
  return renderComposable(() => useSizes(itemsRef, containerSizeRef)).result.value
}

describe('useSizes', () => {
  it('case 1: mixed size, min, max values', () => {
    const [, postPxSizes] = getSizesResult([
      {
        size: 100,
        min: 100,
        max: 200,
      },
      {
        min: 100,
        max: 200,
      },
      {
        min: '20%',
      },
    ])

    expect(postPxSizes.value).toEqual([100, 200, 700])
  })

  it('case 2: all items with min values', () => {
    const [, postPxSizes] = getSizesResult([
      {
        min: 300,
      },
      {
        min: 100,
        max: 200,
      },
      {
        min: 600,
      },
    ])

    expect(postPxSizes.value).toEqual([300, 100, 600])
  })

  it('case 3: items with min and max values', () => {
    const [, postPxSizes] = getSizesResult([
      { min: 100, max: 200 },
      { min: 100, max: 200 },
      { min: 400 },
    ])

    expect(postPxSizes.value).toEqual([200, 200, 600])
  })

  it('case 4: impossible case, just average fill', () => {
    const [, postPxSizes] = getSizesResult([
      { min: 600, max: 300 },
      { min: 400, max: 200 },
      { min: 600, max: 300 },
    ])

    expect(postPxSizes.value).toEqual([1000 / 3, 1000 / 3, 1000 / 3])
  })

  it('should average if size total is not 100%', () => {
    const [sizes] = getSizesResult([
      {
        size: '20%',
      },
      {
        size: '30%',
      },
    ])

    expect(sizes.value).toEqual([400, 600])
  })

  it('should correct when all size is 0', () => {
    const [, postPxSizes] = getSizesResult([
      {
        size: 0,
      },
      {
        size: 0,
      },
    ])

    expect(postPxSizes.value).toEqual([500, 500])
  })
})

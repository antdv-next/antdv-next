import type { MasonryProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Masonry from '..'
import { mount, triggerResize, waitFakeTimer } from '/@tests/utils'

function createItems(heights: number[]) {
  return heights.map((height, index) => ({
    key: `item-${index}`,
    data: height,
  }))
}

const defaultItems = createItems([100, 200])

function mountMasonry(props: Partial<MasonryProps> = {}) {
  return mount(Masonry, {
    props: {
      columns: 2,
      items: defaultItems,
      itemRender: ({ data }: any) => (
        <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
          content
        </div>
      ),
      ...props,
    },
  })
}

async function resizeMasonry() {
  const el = document.body.querySelector('.ant-masonry')
  if (el) {
    triggerResize(el)
  }
  await waitFakeTimer()
}

describe('masonry.semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    await waitFakeTimer()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Note: In the Masonry component, mergedClassNames is used for both root and item,
  // but mergedStyles is only used for item (root style only uses contextStyles).
  // Tests are written to match the actual component behavior.

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: MasonryProps }) => {
      if (info.props.columns === 2) {
        return { root: 'two-col-root', item: 'two-col-item' }
      }
      return { root: 'other-root', item: 'other-item' }
    })

    const stylesFn = vi.fn((info: { props: MasonryProps }) => {
      if (info.props.columns === 2) {
        return { item: { color: 'rgb(255, 0, 0)' } }
      }
      return { item: { color: 'rgb(0, 0, 255)' } }
    })

    const wrapper = mountMasonry({
      columns: 2,
      classes: classNamesFn,
      styles: stylesFn,
    })
    await resizeMasonry()

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-masonry')
    expect(root.classes()).toContain('two-col-root')

    const item = wrapper.find('.ant-masonry-item')
    expect(item.classes()).toContain('two-col-item')
    expect(item.attributes('style')).toContain('color: rgb(255, 0, 0)')

    // Update columns - function should re-evaluate
    await wrapper.setProps({ columns: 3 })
    await resizeMasonry()

    const updatedRoot = wrapper.find('.ant-masonry')
    expect(updatedRoot.classes()).toContain('other-root')

    const updatedItem = wrapper.find('.ant-masonry-item')
    expect(updatedItem.classes()).toContain('other-item')
    expect(updatedItem.attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  it('should apply object classNames and styles to all semantic elements', async () => {
    const wrapper = mountMasonry({
      classes: { root: 'custom-root', item: 'custom-item' },
      styles: {
        item: { margin: '5px' },
      },
    })
    await resizeMasonry()

    // root - classes only (mergedStyles.root not used on root element)
    const root = wrapper.find('.ant-masonry')
    expect(root.classes()).toContain('custom-root')

    // item - both classes and styles
    const item = wrapper.find('.ant-masonry-item')
    expect(item.classes()).toContain('custom-item')
    expect(item.attributes('style')).toContain('margin: 5px')
  })

  it('should not break when items are empty (no item semantic elements)', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'fn-root',
      item: 'fn-item',
    }))

    const wrapper = mountMasonry({
      items: [],
      classes: classNamesFn,
    })
    await resizeMasonry()

    expect(classNamesFn).toHaveBeenCalled()

    // root should still get the class
    expect(wrapper.find('.ant-masonry').classes()).toContain('fn-root')

    // no items rendered
    expect(wrapper.find('.ant-masonry-item').exists()).toBe(false)
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: MasonryProps }) => ({
      root: info.props.fresh ? 'fresh-root' : 'stale-root',
    }))

    const wrapper = mountMasonry({
      fresh: false,
      classes: classNamesFn,
    })
    await resizeMasonry()

    expect(wrapper.find('.ant-masonry').classes()).toContain('stale-root')

    await wrapper.setProps({ fresh: true })
    await resizeMasonry()

    expect(wrapper.find('.ant-masonry').classes()).toContain('fresh-root')
  })
})

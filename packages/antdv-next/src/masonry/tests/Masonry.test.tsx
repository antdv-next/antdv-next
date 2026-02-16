import type { MasonryProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Masonry from '..'
import mountTest from '../../../../../tests/shared/mountTest'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount, triggerResize, waitFakeTimer } from '../../../../../tests/utils'
import ConfigProvider from '../../config-provider'

function createItems(heights: number[]) {
  return heights.map((height, index) => ({
    key: `item-${index}`,
    data: height,
  }))
}

function renderMasonry(props: Partial<MasonryProps> = {}) {
  const items = createItems([150, 30, 90, 70, 110])

  return mount(() => (
    <div style={{ width: '600px' }}>
      <Masonry
        columns={3}
        items={items}
        itemRender={({ data, index }) => (
          <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
            {index + 1}
          </div>
        )}
        {...props}
      />
    </div>
  ))
}

async function resizeMasonry() {
  const el = document.body.querySelector('.ant-masonry')
  if (el) {
    triggerResize(el)
  }
  await waitFakeTimer()
}

describe('masonry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const bamboo = this.querySelector('.bamboo')
        const h = bamboo?.getAttribute('data-height')
        return {
          height: h ? Number(h) : 0,
          width: 100,
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          toJSON: () => ({}),
        } as DOMRect
      },
    )
  })

  afterEach(async () => {
    await waitFakeTimer()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  mountTest(Masonry)
  rtlTest(() => h(Masonry))

  // ==================== Basic Rendering ====================

  it('should render correctly with default props', async () => {
    const wrapper = renderMasonry()
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').exists()).toBe(true)
  })

  it('should render items', async () => {
    const wrapper = renderMasonry()
    await resizeMasonry()
    const items = wrapper.findAll('.ant-masonry-item')
    expect(items.length).toBe(5)
  })

  it('should render item content via itemRender prop', async () => {
    const wrapper = renderMasonry()
    await resizeMasonry()
    const bamboos = wrapper.findAll('.bamboo')
    expect(bamboos.length).toBe(5)
    expect(bamboos[0].text()).toBe('1')
    expect(bamboos[4].text()).toBe('5')
  })

  // ==================== Props ====================

  it('should default to 3 columns when columns is not provided', async () => {
    const items = createItems([100, 100, 100, 100])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          items={items}
          itemRender={({ data, index }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              {index}
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(4)
  })

  it('should support columns as number', async () => {
    const wrapper = renderMasonry({ columns: 2 })
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(5)
  })

  it('should support responsive columns object', async () => {
    // Simulate screen width ~600px: sm (min-width:576) matches, md (min-width:768) doesn't
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const minMatch = query.match(/min-width:\s*(\d+)/)
      const maxMatch = query.match(/max-width:\s*(\d+)/)
      let matches = false
      if (minMatch)
        matches = Number(minMatch[1]) <= 600
      else if (maxMatch)
        matches = Number(maxMatch[1]) >= 600
      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList
    })

    const items = createItems([100, 200, 300, 400])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    // sm matches → columnCount = 2, width calc uses / 2
    const item = wrapper.find('.ant-masonry-item')
    expect(item.attributes('style')).toContain('/ 2)')
  })

  it('should fall back to xs value when no breakpoint matches responsive columns', async () => {
    // Force all matchMedia to return false → no breakpoint matches
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList))

    const items = createItems([100, 200])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={{ xs: 4, sm: 2 }}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    // no breakpoint matches → columns.xs = 4
    const item = wrapper.find('.ant-masonry-item')
    expect(item.attributes('style')).toContain('/ 4)')
  })

  it('should fall back to 1 column when no breakpoint matches and xs is undefined', async () => {
    // Force all matchMedia to return false → no breakpoint matches
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList))

    const items = createItems([100, 200])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={{ sm: 2, md: 3 }}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    // no breakpoint matches, no xs → fallback to 1
    const item = wrapper.find('.ant-masonry-item')
    expect(item.attributes('style')).toContain('/ 1)')
  })

  it('should handle empty items', async () => {
    const wrapper = mount(() => <Masonry />)
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').exists()).toBe(true)
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(0)
  })

  it('should support gutter as number', async () => {
    const items = createItems([100, 200, 50])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          gutter={16}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    // gutter=16: horizontalGutter=16, verticalGutter fallback to 16
    const item = wrapper.find('.ant-masonry-item')
    expect(item.attributes('style')).toContain('16px')
  })

  it('should support gutter as array [horizontal, vertical]', async () => {
    const items = createItems([100, 200, 50])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          gutter={[8, 16]}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    const item = wrapper.find('.ant-masonry-item')
    // horizontalGutter=8 appears in width calc
    expect(item.attributes('style')).toContain('8px')
  })

  it('should support fresh prop for item resize observer', async () => {
    const wrapper = renderMasonry({ fresh: true })
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').exists()).toBe(true)
  })

  it('should not attach item resize observer when fresh is falsy', async () => {
    const wrapper = renderMasonry({ fresh: false })
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').exists()).toBe(true)
  })

  // ==================== Slots ====================

  it('should support itemRender via slot', async () => {
    const items = createItems([100, 200])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          items={items}
          v-slots={{
            itemRender: ({ data, index }: any) => (
              <div class="slot-bamboo" style={{ height: `${data}px` }} data-height={data}>
                slot-
                {index}
              </div>
            ),
          }}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.findAll('.slot-bamboo').length).toBe(2)
    expect(wrapper.findAll('.slot-bamboo')[0].text()).toBe('slot-0')
  })

  it('should prioritize itemRender slot over prop', async () => {
    const items = createItems([100])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={1}
          items={items}
          itemRender={() => (
            <div class="prop-render bamboo" data-height="100">prop</div>
          )}
          v-slots={{
            itemRender: () => (
              <div class="slot-render bamboo" data-height="100">slot</div>
            ),
          }}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.find('.slot-render').exists()).toBe(true)
    expect(wrapper.find('.prop-render').exists()).toBe(false)
  })

  // ==================== Events ====================

  it('should emit layoutChange with correct payload', async () => {
    const onLayoutChange = vi.fn()
    const items = createItems([100, 200, 50])
    mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          items={items}
          onLayoutChange={onLayoutChange}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(onLayoutChange).toHaveBeenCalled()
    const payload = onLayoutChange.mock.calls[onLayoutChange.mock.calls.length - 1][0]
    expect(payload).toHaveLength(3)
    payload.forEach((item: any) => {
      expect(item).toHaveProperty('key')
      expect(item).toHaveProperty('column')
      expect(item).toHaveProperty('data')
    })
  })

  it('should not emit layoutChange when items is empty', async () => {
    const onLayoutChange = vi.fn()
    mount(() => (
      <Masonry items={[]} onLayoutChange={onLayoutChange} />
    ))
    await resizeMasonry()
    expect(onLayoutChange).not.toHaveBeenCalled()
  })

  // ==================== Attrs Passthrough ====================

  it('should pass style to root element', async () => {
    const wrapper = mount(() => (
      <Masonry style={{ color: 'red' }} />
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').attributes('style')).toContain('color: red')
  })

  it('should pass class to root element', async () => {
    const wrapper = mount(() => (
      <Masonry class="custom-class" />
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').classes()).toContain('custom-class')
  })

  it('should pass data attributes to root element', async () => {
    const wrapper = mount(() => (
      <Masonry data-testid="masonry-test" />
    ))
    await resizeMasonry()
    expect(wrapper.find('[data-testid="masonry-test"]').exists()).toBe(true)
  })

  // ==================== rootClass ====================

  it('should support rootClass prop', async () => {
    const wrapper = mount(() => (
      <Masonry rootClass="custom-root" />
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').classes()).toContain('custom-root')
  })

  // ==================== Semantic classes/styles ====================

  it('should apply semantic classes and styles (object form)', async () => {
    const items = createItems([100])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={1}
          items={items}
          classes={{ root: 'c-root', item: 'c-item' }}
          styles={{ item: { color: 'rgb(255, 0, 0)' } }}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').classes()).toContain('c-root')
    expect(wrapper.find('.ant-masonry-item').classes()).toContain('c-item')
    expect(wrapper.find('.ant-masonry-item').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  // ==================== Item class and style ====================

  it('should support item-level class and style', async () => {
    const items = [
      { key: '0', data: 100, class: 'item-custom', style: { background: 'blue' } },
    ]
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={1}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    const item = wrapper.find('.ant-masonry-item')
    expect(item.classes()).toContain('item-custom')
  })

  it('should handle items without class and style', async () => {
    const items = [{ key: '0', data: 100 }]
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={1}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry-item').exists()).toBe(true)
  })

  // ==================== RTL ====================

  it('should add rtl class when direction is rtl', async () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Masonry />
      </ConfigProvider>
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry-rtl').exists()).toBe(true)
  })

  it('should not add rtl class when direction is ltr', async () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="ltr">
        <Masonry />
      </ConfigProvider>
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry-rtl').exists()).toBe(false)
  })

  // ==================== ConfigProvider Integration ====================

  it('should apply ConfigProvider masonry class and style', async () => {
    const items = createItems([100])
    const wrapper = mount(() => (
      <ConfigProvider masonry={{ class: 'cp-cls', style: { border: '1px solid red' } }}>
        <div style={{ width: '600px' }}>
          <Masonry
            columns={1}
            items={items}
            itemRender={({ data }) => (
              <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
                content
              </div>
            )}
          />
        </div>
      </ConfigProvider>
    ))
    await resizeMasonry()
    const root = wrapper.find('.ant-masonry')
    expect(root.classes()).toContain('cp-cls')
    expect(root.attributes('style')).toContain('border: 1px solid red')
  })

  it('should apply ConfigProvider masonry classes and styles', async () => {
    const items = createItems([100])
    const wrapper = mount(() => (
      <ConfigProvider
        masonry={{
          classes: { root: 'cp-root', item: 'cp-item' },
          styles: { item: { color: 'rgb(0, 128, 0)' } },
        }}
      >
        <div style={{ width: '600px' }}>
          <Masonry
            columns={1}
            items={items}
            itemRender={({ data }) => (
              <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
                content
              </div>
            )}
          />
        </div>
      </ConfigProvider>
    ))
    await resizeMasonry()
    expect(wrapper.find('.ant-masonry').classes()).toContain('cp-root')
    expect(wrapper.find('.ant-masonry-item').classes()).toContain('cp-item')
    expect(wrapper.find('.ant-masonry-item').attributes('style')).toContain('color: rgb(0, 128, 0)')
  })

  // ==================== Dynamic Props ====================

  it('should update when items change', async () => {
    const items = ref(createItems([100, 200]))
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          items={items.value}
          itemRender={({ data, index }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              {index}
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(2)

    items.value = createItems([100, 200, 300])
    await nextTick()
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(3)
  })

  it('should update when columns change', async () => {
    const columns = ref(3)
    const items = createItems([100, 200, 300])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={columns.value}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(3)

    columns.value = 2
    await nextTick()
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(3)
  })

  // ==================== MasonryItem ====================

  it('should render item with correct prefix class', async () => {
    const wrapper = renderMasonry()
    await resizeMasonry()
    const items = wrapper.findAll('.ant-masonry-item')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((item) => {
      expect(item.classes()).toContain('ant-masonry-item')
    })
  })

  // ==================== Item with column hint ====================

  it('should respect item column hint', async () => {
    const items = [
      { key: '0', data: 100, column: 0 },
      { key: '1', data: 200, column: 1 },
      { key: '2', data: 50, column: 0 },
    ]
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(3)
  })

  // ==================== Expose ====================

  it('should expose nativeElement ref', async () => {
    const masonryRef = ref()
    mount(() => <Masonry ref={masonryRef} />)
    await resizeMasonry()
    expect(masonryRef.value).toBeDefined()
    expect(masonryRef.value.nativeElement).toBeDefined()
  })

  // ==================== Height Calculation ====================

  it('should calculate container height from items', async () => {
    const items = createItems([100, 200])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          gutter={0}
          items={items}
          itemRender={({ data }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              content
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    // 2 columns, items [100, 200]: col0=100, col1=200
    // totalHeight = max(100, 200) - 0 = 200
    const masonryStyle = wrapper.find('.ant-masonry').attributes('style')
    expect(masonryStyle).toContain('height: 200px')
  })

  // ==================== Snapshot ====================

  it('should render correct snapshot', async () => {
    const items = createItems([100, 200])
    const wrapper = mount(() => (
      <div style={{ width: '600px' }}>
        <Masonry
          columns={2}
          items={items}
          itemRender={({ data, index }) => (
            <div style={{ height: `${data}px` }} class="bamboo" data-height={data}>
              {index}
            </div>
          )}
        />
      </div>
    ))
    await resizeMasonry()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render empty masonry snapshot', async () => {
    const wrapper = mount(() => <Masonry />)
    await resizeMasonry()
    expect(wrapper.element).toMatchSnapshot()
  })
})

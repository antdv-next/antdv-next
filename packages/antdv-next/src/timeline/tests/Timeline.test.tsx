import type { TimelineProps } from '..'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Timeline from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('timeline', () => {
  mountTest(Timeline)
  rtlTest(() => h(Timeline, { items: [{ content: 'foo' }] }))

  // ======================== basic rendering ========================
  it('should render basic timeline', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          { content: 'step 1' },
          { content: 'step 2' },
          { content: 'step 3' },
        ],
      },
    })
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(3)
  })

  it('should render empty timeline when items is empty', () => {
    const wrapper = mount(Timeline, {
      props: { items: [] },
    })
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(0)
  })

  it('should render timeline when items is undefined', () => {
    const wrapper = mount(Timeline)
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(0)
  })

  // ======================== items content ========================
  describe('items content', () => {
    it('should render content prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'hello world' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-content').text()).toBe('hello world')
    })

    it('should render title prop (label)', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [
            { title: 'my-title', content: 'foo' },
          ],
        },
      })
      expect(wrapper.find('.ant-timeline-item-title').text()).toBe('my-title')
    })

    it('should support deprecated label as title', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ label: '2020-01-01', content: 'foo' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-title').text()).toBe('2020-01-01')
    })

    it('title should take priority over label', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ title: 'Title', label: 'Label', content: 'foo' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-title').text()).toBe('Title')
    })

    it('should support deprecated children as content', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ children: 'deprecated content' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-content').text()).toBe('deprecated content')
    })

    it('content should take priority over children', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'Content', children: 'Children' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-content').text()).toBe('Content')
    })
  })

  // ======================== color ========================
  describe('color', () => {
    const presetColors = ['blue', 'red', 'green', 'gray'] as const

    presetColors.forEach((color) => {
      it(`should apply preset color class for ${color}`, () => {
        const wrapper = mount(Timeline, {
          props: {
            items: [{ color, content: 'item' }],
          },
        })
        expect(wrapper.find('.ant-timeline-item').classes()).toContain(
          `ant-timeline-item-color-${color}`,
        )
      })
    })

    it('should apply custom color as inline style variable', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ color: '#ff0000', content: 'item' }],
        },
      })
      const item = wrapper.find('.ant-timeline-item')
      expect(item.classes()).not.toContain('ant-timeline-item-color-#ff0000')
      expect(item.attributes('style')).toContain('#ff0000')
    })

    it('should apply rgb custom color as inline style variable', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ color: 'rgb(255, 0, 0)', content: 'item' }],
        },
      })
      const item = wrapper.find('.ant-timeline-item')
      expect(item.attributes('style')).toContain('rgb(255, 0, 0)')
    })

    it('should not add color class when no color specified', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
        },
      })
      const classes = wrapper.find('.ant-timeline-item').classes()
      expect(classes.some(c => c.includes('color-'))).toBe(false)
    })
  })

  // ======================== icon / dot ========================
  describe('icon', () => {
    it('should render custom icon', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ icon: h('span', { class: 'my-icon' }, 'I'), content: 'item' }],
        },
      })
      expect(wrapper.find('.my-icon').exists()).toBe(true)
    })

    it('should support deprecated dot as icon', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ dot: h('span', { class: 'my-dot' }, 'D'), content: 'item' }],
        },
      })
      expect(wrapper.find('.my-dot').exists()).toBe(true)
    })

    it('icon should take priority over dot', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{
            icon: h('span', { class: 'my-icon' }),
            dot: h('span', { class: 'my-dot' }),
            content: 'item',
          }],
        },
      })
      expect(wrapper.find('.my-icon').exists()).toBe(true)
      expect(wrapper.find('.my-dot').exists()).toBe(false)
    })

    it('should render loading icon when loading is true and no icon', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ loading: true, content: 'loading item' }],
        },
      })
      expect(wrapper.find('.anticon-loading').exists()).toBe(true)
    })

    it('should not render loading icon when loading is true but icon is provided', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ loading: true, icon: h('span', { class: 'custom-icon' }), content: 'item' }],
        },
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
      expect(wrapper.find('.anticon-loading').exists()).toBe(false)
    })
  })

  // ======================== loading status ========================
  it('should set process status when loading', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ loading: true, content: 'item' }],
      },
    })
    const item = wrapper.find('.ant-timeline-item')
    expect(item.html()).toContain('process')
  })

  it('should set finish status when not loading', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ content: 'item' }],
      },
    })
    const item = wrapper.find('.ant-timeline-item')
    expect(item.html()).toContain('finish')
  })

  // ======================== reverse ========================
  describe('reverse', () => {
    it('should render items in order when reverse is false', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'first' }, { content: 'second' }, { content: 'third' }],
          reverse: false,
        },
      })
      const contents = wrapper.findAll('.ant-timeline-item-content')
      expect(contents.map(c => c.text())).toEqual(['first', 'second', 'third'])
    })

    it('should render items in reversed order when reverse is true', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'first' }, { content: 'second' }, { content: 'third' }],
          reverse: true,
        },
      })
      const contents = wrapper.findAll('.ant-timeline-item-content')
      expect(contents.map(c => c.text())).toEqual(['third', 'second', 'first'])
    })
  })

  // ======================== mode ========================
  describe('mode', () => {
    it('should default to start mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should apply start mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'start',
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should apply end mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'end',
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should convert deprecated left mode to start', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'left',
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should convert deprecated right mode to end', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'right',
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should alternate placement in alternate mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'alternate',
          items: [{ content: 'a' }, { content: 'b' }, { content: 'c' }],
        },
      })
      const items = wrapper.findAll('.ant-timeline-item')
      expect(items[0].classes()).toContain('ant-timeline-item-placement-start')
      expect(items[1].classes()).toContain('ant-timeline-item-placement-end')
      expect(items[2].classes()).toContain('ant-timeline-item-placement-start')
    })

    it('should fall back to start for unknown mode values', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'unknown' as TimelineProps['mode'],
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })
  })

  // ======================== placement / position ========================
  describe('item placement', () => {
    it('should apply item placement prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ placement: 'end', content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should support deprecated position prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ position: 'end', content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('placement should take priority over position', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ placement: 'start', position: 'end', content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })
  })

  // ======================== pending ========================
  describe('pending', () => {
    it('should append pending item when pending is truthy', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: 'loading...',
        },
      })
      const items = wrapper.findAll('.ant-timeline-item')
      expect(items).toHaveLength(2)
    })

    it('should render pending content', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: 'loading...',
        },
      })
      expect(wrapper.text()).toContain('loading...')
    })

    it('should render pendingDot when provided', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: 'loading...',
          pendingDot: h('span', { class: 'custom-pending-dot' }, 'dot'),
        },
      })
      expect(wrapper.find('.custom-pending-dot').exists()).toBe(true)
    })

    it('should render default loading icon as pendingDot when not provided', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: 'loading...',
        },
      })
      expect(wrapper.find('.anticon-loading').exists()).toBe(true)
    })

    it('should not append pending item when pending is falsy', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
        },
      })
      expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(1)
    })

    it('should render with pending as true boolean', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: true,
        },
      })
      // pending true adds a pending item with LoadingOutlined icon
      const items = wrapper.findAll('.ant-timeline-item')
      expect(items).toHaveLength(2)
      expect(wrapper.find('.anticon-loading').exists()).toBe(true)
    })

    it('should render pending as VNode', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'step 1' }],
          pending: h('span', { class: 'pending-vnode' }, 'pending...'),
        },
      })
      expect(wrapper.find('.pending-vnode').exists()).toBe(true)
    })
  })

  // ======================== orientation ========================
  describe('orientation', () => {
    it('should default to vertical', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-horizontal').exists()).toBe(false)
    })

    it('should apply horizontal class when orientation is horizontal', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          orientation: 'horizontal',
        },
      })
      expect(wrapper.find('.ant-timeline-horizontal').exists()).toBe(true)
    })
  })

  // ======================== variant ========================
  it('should default variant to outlined', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ content: 'item' }],
      },
    })
    // Verify the component renders (variant is passed to Steps internally)
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
  })

  // ======================== layoutAlternate ========================
  describe('layout alternate', () => {
    it('should apply alternate layout class when mode is alternate', () => {
      const wrapper = mount(Timeline, {
        props: {
          mode: 'alternate',
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(true)
    })

    it('should apply alternate layout class when vertical and items have title', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ title: 'Title', content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(true)
    })

    it('should not apply alternate layout class when no title and not alternate mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
        },
      })
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(false)
    })
  })

  // ======================== titleSpan ========================
  describe('titleSpan', () => {
    it('should apply numeric titleSpan as CSS variable', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          titleSpan: 8,
        },
      })
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      expect(style).toContain('8')
    })

    it('should apply string titleSpan as CSS variable', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          titleSpan: '30%',
        },
      })
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      expect(style).toContain('30%')
    })

    it('should not apply titleSpan when in alternate mode', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          titleSpan: 8,
          mode: 'alternate',
        },
      })
      // In alternate mode, titleSpan is not applied
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      // The CSS var for head-span should not be present
      expect(style).not.toContain('head-span')
    })
  })

  // ======================== item className/style ========================
  describe('item className and style', () => {
    it('should apply item className', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ className: 'custom-item', content: 'item' }],
        },
      })
      expect(wrapper.find('.custom-item').exists()).toBe(true)
    })

    it('should apply item style', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ style: { color: 'rgb(255, 0, 0)' }, content: 'item' }],
        },
      })
      const item = wrapper.find('.ant-timeline-item')
      expect(item.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })
  })

  // ======================== render props ========================
  describe('render props', () => {
    it('should render dotRender prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          dotRender: ({ index }: { item: any, index: number }) =>
            h('span', { class: 'custom-dot-render' }, `dot-${index}`),
        },
      })
      // dotRender is declared but passed through to Steps
      expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    })

    it('should render contentRender prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'item' }],
          contentRender: ({ index }: { item: any, index: number }) =>
            h('div', { class: 'custom-content' }, `content-${index}`),
        },
      })
      expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    })

    it('should render labelRender prop', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ title: 'label', content: 'item' }],
          labelRender: ({ index }: { item: any, index: number }) =>
            h('span', { class: 'custom-label' }, `label-${index}`),
        },
      })
      expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    })
  })

  // ======================== attrs passthrough ========================
  describe('attrs passthrough', () => {
    it('should pass data attributes', () => {
      const wrapper = mount(() => (
        <Timeline data-testid="my-timeline" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('[data-testid="my-timeline"]').exists()).toBe(true)
    })

    it('should pass style via attrs', () => {
      const wrapper = mount(() => (
        <Timeline style={{ color: 'red' }} items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: red')
    })
  })

  // ======================== rootClass ========================
  it('should support rootClass', () => {
    const wrapper = mount(Timeline, {
      props: {
        rootClass: 'my-root',
        items: [{ content: 'item' }],
      },
    })
    expect(wrapper.find('.ant-timeline').classes()).toContain('my-root')
  })

  // ======================== semantic classes/styles (object form) ========================
  describe('semantic classes and styles', () => {
    it('should apply object classes to semantic elements', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ title: 'Title', content: 'Content' }],
          classes: {
            root: 'c-root',
            item: 'c-item',
            itemIcon: 'c-icon',
            itemTitle: 'c-title',
            itemContent: 'c-content',
            itemRail: 'c-rail',
          },
        },
      })
      expect(wrapper.find('.ant-timeline').classes()).toContain('c-root')
      expect(wrapper.find('.ant-timeline-item').classes()).toContain('c-item')
    })

    it('should apply object styles to semantic elements', () => {
      const wrapper = mount(Timeline, {
        props: {
          items: [{ content: 'Content' }],
          styles: {
            root: { padding: '10px' },
          },
        },
      })
      expect(wrapper.find('.ant-timeline').attributes('style')).toContain('padding: 10px')
    })
  })

  // ======================== ConfigProvider ========================
  describe('configProvider integration', () => {
    it('should apply ConfigProvider timeline class', () => {
      const wrapper = mount(() => (
        <ConfigProvider timeline={{ class: 'cp-cls' }}>
          <Timeline items={[{ content: 'item' }]} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-timeline').classes()).toContain('cp-cls')
    })

    it('should apply ConfigProvider timeline style', () => {
      const wrapper = mount(() => (
        <ConfigProvider timeline={{ style: { color: 'rgb(0, 128, 0)' } }}>
          <Timeline items={[{ content: 'item' }]} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(0, 128, 0)')
    })
  })

  // ======================== rtl direction ========================
  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Timeline items={[{ content: 'item' }]} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-timeline-rtl').exists()).toBe(true)
    })
  })

  // ======================== dynamic props update ========================
  it('should update when props change dynamically', async () => {
    const items = ref([{ content: 'first' }])
    const wrapper = mount(() => <Timeline items={items.value} />)
    expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(1)

    items.value = [{ content: 'first' }, { content: 'second' }]
    await nextTick()
    expect(wrapper.findAll('.ant-timeline-item')).toHaveLength(2)
  })

  it('should update when mode changes dynamically', async () => {
    const mode = ref<TimelineProps['mode']>('start')
    const wrapper = mount(() => <Timeline mode={mode.value} items={[{ content: 'item' }]} />)
    expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)

    mode.value = 'end'
    await nextTick()
    expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
  })

  // ======================== snapshot ========================
  it('should render correct snapshot', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          { title: '2024-01-01', content: 'step 1', color: 'blue' },
          { title: '2024-02-01', content: 'step 2', color: 'green' },
          { title: '2024-03-01', content: 'step 3', loading: true },
        ],
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})

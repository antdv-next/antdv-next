import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Timeline from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('timeline', () => {
  mountTest(Timeline)
  rtlTest(() => h(Timeline))

  // ============================ Basic Rendering ============================
  it('should render correctly with items', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { content: 'foo' },
          { content: 'bar' },
          { content: 'baz' },
        ]}
      />
    ))
    expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(3)
  })

  it('should render as ol element', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item' }]} />
    ))
    expect(wrapper.find('ol.ant-timeline').exists()).toBe(true)
  })

  it('should render empty timeline without items', () => {
    const wrapper = mount(() => <Timeline />)
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(0)
  })

  // ============================ Title & Content ============================
  it('should render title and content', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { title: '2024-01-01', content: 'Created' },
        ]}
      />
    ))
    expect(wrapper.find('.ant-timeline-item-title').text()).toBe('2024-01-01')
    expect(wrapper.find('.ant-timeline-item-content').text()).toBe('Created')
  })

  it('should support deprecated label as title fallback', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { label: 'label-text', children: 'child-text' },
        ]}
      />
    ))
    expect(wrapper.find('.ant-timeline-item-title').text()).toBe('label-text')
    expect(wrapper.find('.ant-timeline-item-content').text()).toBe('child-text')
  })

  it('should prefer title over label', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { title: 'title-text', label: 'label-text' },
        ]}
      />
    ))
    expect(wrapper.find('.ant-timeline-item-title').text()).toBe('title-text')
  })

  it('should prefer content over children', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { content: 'content-text', children: 'child-text' },
        ]}
      />
    ))
    expect(wrapper.find('.ant-timeline-item-content').text()).toBe('content-text')
  })

  // ============================ Reverse ============================
  describe('reverse', () => {
    const getTextContents = (wrapper: ReturnType<typeof mount>) =>
      wrapper.findAll('.ant-timeline-item-content').map(el => el.text())

    it('should render items in order when reverse is false', () => {
      const wrapper = mount(() => (
        <Timeline
          reverse={false}
          items={[
            { content: 'foo' },
            { content: 'bar' },
            { content: 'baz' },
          ]}
        />
      ))
      expect(getTextContents(wrapper)).toEqual(['foo', 'bar', 'baz'])
    })

    it('should render items in reverse order when reverse is true', () => {
      const wrapper = mount(() => (
        <Timeline
          reverse
          items={[
            { content: 'foo' },
            { content: 'bar' },
            { content: 'baz' },
          ]}
        />
      ))
      expect(getTextContents(wrapper)).toEqual(['baz', 'bar', 'foo'])
    })
  })

  // ============================ Mode ============================
  describe('mode', () => {
    it('should default to start mode', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should support mode="start"', () => {
      const wrapper = mount(() => (
        <Timeline mode="start" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should support mode="end"', () => {
      const wrapper = mount(() => (
        <Timeline mode="end" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should alternate placement in alternate mode', () => {
      const wrapper = mount(() => (
        <Timeline
          mode="alternate"
          items={[
            { content: 'first' },
            { content: 'second' },
            { content: 'third' },
          ]}
        />
      ))
      const items = wrapper.findAll('li.ant-timeline-item')
      expect(items[0].classes()).toContain('ant-timeline-item-placement-start')
      expect(items[1].classes()).toContain('ant-timeline-item-placement-end')
      expect(items[2].classes()).toContain('ant-timeline-item-placement-start')
    })

    it('should support deprecated mode="left" as start', () => {
      const wrapper = mount(() => (
        <Timeline mode="left" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should support deprecated mode="right" as end', () => {
      const wrapper = mount(() => (
        <Timeline mode="right" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })
  })

  // ============================ Placement ============================
  describe('placement', () => {
    it('should support item placement="end"', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item', placement: 'end' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should support item placement="start"', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item', placement: 'start' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
    })

    it('should support deprecated item position', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item', position: 'end' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should prioritize placement over position', () => {
      const wrapper = mount(() => (
        <Timeline
          items={[{ content: 'item', placement: 'start', position: 'end' }]}
        />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(false)
    })
  })

  // ============================ Color ============================
  describe('color', () => {
    const presetColors = ['blue', 'red', 'green', 'gray'] as const

    presetColors.forEach((color) => {
      it(`should add preset color class for ${color}`, () => {
        const wrapper = mount(() => (
          <Timeline items={[{ content: 'item', color }]} />
        ))
        expect(wrapper.find('.ant-timeline-item').classes()).toContain(
          `ant-timeline-item-color-${color}`,
        )
      })
    })

    it('should apply custom color as CSS variable', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item', color: '#ff0000' }]} />
      ))
      const item = wrapper.find('li.ant-timeline-item')
      expect(item.classes()).not.toContain('ant-timeline-item-color-#ff0000')
      expect(item.attributes('style')).toBeTruthy()
    })

    it('should apply custom rgb color as CSS variable', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item', color: 'rgb(255, 0, 0)' }]} />
      ))
      const item = wrapper.find('li.ant-timeline-item')
      expect(item.classes()).not.toContain('ant-timeline-item-color-rgb(255, 0, 0)')
    })
  })

  // ============================ Pending ============================
  describe('pending', () => {
    it('should add pending item when pending is truthy', () => {
      const wrapper = mount(() => (
        <Timeline
          pending="Loading..."
          items={[
            { content: 'foo' },
            { content: 'bar' },
          ]}
        />
      ))
      expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(3)
    })

    it('should not add pending item when pending is falsy', () => {
      const wrapper = mount(() => (
        <Timeline
          items={[
            { content: 'foo' },
            { content: 'bar' },
          ]}
        />
      ))
      expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(2)
    })

    it('should render custom pendingDot when pending is truthy', () => {
      const wrapper = mount(() => (
        <Timeline
          pending="Loading..."
          pendingDot={<span class="custom-dot">dot</span>}
          items={[{ content: 'foo' }]}
        />
      ))
      expect(wrapper.find('.custom-dot').exists()).toBe(true)
    })

    it('should not render pendingDot when pending is falsy', () => {
      const wrapper = mount(() => (
        <Timeline
          pendingDot={<span class="custom-dot">dot</span>}
          items={[{ content: 'foo' }]}
        />
      ))
      expect(wrapper.find('.custom-dot').exists()).toBe(false)
    })

    // Note: pending/pendingDot slots are declared in TimelineSlots type
    // but not consumed by @v-c/steps. Only props.pending works.
  })

  // ============================ Loading ============================
  it('should apply process status when loading is true', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item', loading: true }]} />
    ))
    const item = wrapper.find('li.ant-timeline-item')
    expect(item.classes()).toContain('ant-steps-item-process')
  })

  it('should apply finish status when loading is false', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item', loading: false }]} />
    ))
    const item = wrapper.find('li.ant-timeline-item')
    expect(item.classes()).toContain('ant-steps-item-finish')
  })

  // ============================ Icon ============================
  it('should render custom icon', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[{ content: 'item', icon: <span class="custom-icon">icon</span> }]}
      />
    ))
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('should support deprecated dot as icon fallback', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[{ content: 'item', dot: <span class="custom-dot-icon">dot</span> }]}
      />
    ))
    expect(wrapper.find('.custom-dot-icon').exists()).toBe(true)
  })

  it('should prefer icon over dot', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[{
          content: 'item',
          icon: <span class="icon-el">icon</span>,
          dot: <span class="dot-el">dot</span>,
        }]}
      />
    ))
    expect(wrapper.find('.icon-el').exists()).toBe(true)
    expect(wrapper.find('.dot-el').exists()).toBe(false)
  })

  it('should render LoadingOutlined when loading without icon', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item', loading: true }]} />
    ))
    expect(wrapper.find('.anticon-loading').exists()).toBe(true)
  })

  it('should not render LoadingOutlined when loading with custom icon', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[{ content: 'item', loading: true, icon: <span class="my-icon" /> }]}
      />
    ))
    expect(wrapper.find('.my-icon').exists()).toBe(true)
    expect(wrapper.find('.anticon-loading').exists()).toBe(false)
  })

  // ============================ Orientation ============================
  describe('orientation', () => {
    it('should default to vertical', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-horizontal').exists()).toBe(false)
    })

    it('should support horizontal orientation', () => {
      const wrapper = mount(() => (
        <Timeline orientation="horizontal" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-horizontal').exists()).toBe(true)
    })
  })

  // ============================ Layout Alternate ============================
  describe('layout alternate class', () => {
    it('should add layout-alternate class when mode is alternate', () => {
      const wrapper = mount(() => (
        <Timeline mode="alternate" items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(true)
    })

    it('should add layout-alternate class when vertical item has title', () => {
      const wrapper = mount(() => (
        <Timeline
          items={[{ content: 'item', title: 'title' }]}
        />
      ))
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(true)
    })

    it('should not add layout-alternate class when no title and not alternate', () => {
      const wrapper = mount(() => (
        <Timeline items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-layout-alternate').exists()).toBe(false)
    })
  })

  // ============================ titleSpan ============================
  describe('titleSpan', () => {
    it('should apply number titleSpan as css variable', () => {
      const wrapper = mount(() => (
        <Timeline titleSpan={8} items={[{ content: 'item' }]} />
      ))
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      expect(style).toContain('8')
    })

    it('should apply string titleSpan as css variable', () => {
      const wrapper = mount(() => (
        <Timeline titleSpan="30%" items={[{ content: 'item' }]} />
      ))
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      expect(style).toContain('30%')
    })

    it('should not apply titleSpan in alternate mode', () => {
      const wrapper = mount(() => (
        <Timeline mode="alternate" titleSpan={8} items={[{ content: 'item' }]} />
      ))
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      // In alternate mode, titleSpan should not add the head-span variable
      expect(style).not.toContain('head-span')
    })
  })

  // ============================ Item className & style ============================
  it('should apply item className', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item', className: 'custom-item' }]} />
    ))
    expect(wrapper.find('.custom-item').exists()).toBe(true)
  })

  it('should apply item style', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[{ content: 'item', style: { backgroundColor: 'red' } }]}
      />
    ))
    const item = wrapper.find('li.ant-timeline-item')
    expect(item.attributes('style')).toContain('background-color: red')
  })

  // ============================ Variant ============================
  it('should default variant to outlined', () => {
    const wrapper = mount(() => (
      <Timeline items={[{ content: 'item' }]} />
    ))
    // Steps renders with variant, verify no error and renders
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
  })

  // ============================ Attrs passthrough ============================
  it('should pass style to root element', () => {
    const wrapper = mount(() => (
      <Timeline
        style={{ color: 'red' }}
        items={[{ content: 'item' }]}
      />
    ))
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: red')
  })

  it('should pass class to root element', () => {
    const wrapper = mount(() => (
      <Timeline class="custom-timeline" items={[{ content: 'item' }]} />
    ))
    expect(wrapper.find('.ant-timeline').classes()).toContain('custom-timeline')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Timeline data-testid="timeline" items={[{ content: 'item' }]} />
    ))
    expect(wrapper.find('[data-testid="timeline"]').exists()).toBe(true)
  })

  // ============================ ConfigProvider ============================
  describe('configProvider integration', () => {
    it('should apply configProvider timeline style', () => {
      const wrapper = mount(() => (
        <ConfigProvider
          timeline={{ style: { color: 'rgb(0, 128, 0)' } }}
        >
          <Timeline items={[{ content: 'item' }]} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-timeline').attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    it('should apply configProvider timeline class', () => {
      const wrapper = mount(() => (
        <ConfigProvider
          timeline={{ class: 'cp-timeline' }}
        >
          <Timeline items={[{ content: 'item' }]} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-timeline').classes()).toContain('cp-timeline')
    })

    it('should merge configProvider style with attrs style', () => {
      const wrapper = mount(() => (
        <ConfigProvider
          timeline={{ style: { backgroundColor: 'rgb(0, 0, 255)' } }}
        >
          <Timeline
            style={{ color: 'rgb(255, 0, 0)' }}
            items={[{ content: 'item' }]}
          />
        </ConfigProvider>
      ))
      const style = wrapper.find('.ant-timeline').attributes('style') || ''
      expect(style).toContain('background-color: rgb(0, 0, 255)')
      expect(style).toContain('color: rgb(255, 0, 0)')
    })
  })

  // ============================ RTL ============================
  it('should have rtl class when direction is rtl', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Timeline items={[{ content: 'item' }]} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-timeline-rtl').exists()).toBe(true)
  })

  // Note: dotRender/labelRender/contentRender slots are declared in TimelineSlots
  // but not consumed by @v-c/steps. These slots are not testable at this level.

  // ============================ Dynamic Props ============================
  describe('dynamic props', () => {
    it('should update when items change', async () => {
      const items = ref([{ content: 'one' }])
      const wrapper = mount(() => (
        <Timeline items={items.value} />
      ))
      expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(1)

      items.value = [{ content: 'one' }, { content: 'two' }]
      await nextTick()
      expect(wrapper.findAll('li.ant-timeline-item')).toHaveLength(2)
    })

    it('should update when mode changes', async () => {
      const mode = ref<'start' | 'end'>('start')
      const wrapper = mount(() => (
        <Timeline mode={mode.value} items={[{ content: 'item' }]} />
      ))
      expect(wrapper.find('.ant-timeline-item-placement-start').exists()).toBe(true)

      mode.value = 'end'
      await nextTick()
      expect(wrapper.find('.ant-timeline-item-placement-end').exists()).toBe(true)
    })

    it('should update when reverse changes', async () => {
      const reverse = ref(false)
      const wrapper = mount(() => (
        <Timeline
          reverse={reverse.value}
          items={[
            { content: 'first' },
            { content: 'last' },
          ]}
        />
      ))
      const getTexts = () => wrapper.findAll('.ant-timeline-item-content').map(el => el.text())
      expect(getTexts()).toEqual(['first', 'last'])

      reverse.value = true
      await nextTick()
      expect(getTexts()).toEqual(['last', 'first'])
    })
  })

  // ============================ Snapshot ============================
  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Timeline
        items={[
          { title: '2024-01-01', content: 'Created', color: 'green' },
          { title: '2024-01-02', content: 'In progress', color: 'blue' },
          { title: '2024-01-03', content: 'Pending', loading: true },
        ]}
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})

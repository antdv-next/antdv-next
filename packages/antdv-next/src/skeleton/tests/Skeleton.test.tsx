import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Skeleton from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('skeleton', () => {
  mountTest(Skeleton)
  rtlTest(() => h(Skeleton))

  // ==================== Basic Rendering ====================

  it('should render skeleton by default (loading undefined)', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    // default: title=true, paragraph=true, avatar=false
    expect(wrapper.find('.ant-skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-paragraph').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-header').exists()).toBe(false)
  })

  it('should render skeleton when loading=true', () => {
    const wrapper = mount(Skeleton, { props: { loading: true } })
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
  })

  it('should render children when loading=false', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: () => h('div', { class: 'content' }, 'loaded') },
    })
    expect(wrapper.find('.ant-skeleton').exists()).toBe(false)
    expect(wrapper.find('.content').text()).toBe('loaded')
  })

  it('should return null when loading=false and no children', () => {
    const wrapper = mount(Skeleton, { props: { loading: false } })
    expect(wrapper.html()).toBe('')
  })

  it('should display children with falsy value 0', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: () => '0' },
    })
    expect(wrapper.text()).toBe('0')
  })

  // ==================== active ====================

  it('should render active class', () => {
    const wrapper = mount(Skeleton, { props: { active: true } })
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
  })

  it('should not render active class when not set', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(false)
  })

  // ==================== round ====================

  it('should render round class', () => {
    const wrapper = mount(Skeleton, { props: { round: true } })
    expect(wrapper.find('.ant-skeleton-round').exists()).toBe(true)
  })

  // ==================== avatar ====================

  describe('avatar', () => {
    it('should render avatar when avatar=true', () => {
      const wrapper = mount(Skeleton, { props: { avatar: true } })
      expect(wrapper.find('.ant-skeleton-header').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-with-avatar').exists()).toBe(true)
    })

    it('should not render avatar when avatar=false', () => {
      const wrapper = mount(Skeleton, { props: { avatar: false } })
      expect(wrapper.find('.ant-skeleton-header').exists()).toBe(false)
      expect(wrapper.find('.ant-skeleton-with-avatar').exists()).toBe(false)
    })

    it('should render square avatar when hasTitle && !hasParagraph', () => {
      const wrapper = mount(Skeleton, {
        props: { avatar: true, title: true, paragraph: false },
      })
      expect(wrapper.find('.ant-skeleton-avatar-square').exists()).toBe(true)
    })

    it('should render circle avatar by default', () => {
      const wrapper = mount(Skeleton, {
        props: { avatar: true, title: true, paragraph: true },
      })
      expect(wrapper.find('.ant-skeleton-avatar-circle').exists()).toBe(true)
    })

    it('should accept avatar object props', () => {
      const wrapper = mount(Skeleton, {
        props: { avatar: { size: 'small', shape: 'square' } },
      })
      expect(wrapper.find('.ant-skeleton-avatar-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-avatar-square').exists()).toBe(true)
    })

    it('should render avatar with numeric size', () => {
      const wrapper = mount(Skeleton, {
        props: { avatar: { size: 48 } },
      })
      // Element renders <span> with inline size style
      const el = wrapper.find('.ant-skeleton-avatar')
      expect(el.attributes('style')).toContain('line-height: 48px')
    })
  })

  // ==================== title ====================

  describe('title', () => {
    it('should render title by default', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.find('.ant-skeleton-title').exists()).toBe(true)
    })

    it('should not render title when title=false', () => {
      const wrapper = mount(Skeleton, { props: { title: false } })
      expect(wrapper.find('.ant-skeleton-title').exists()).toBe(false)
    })

    it('should accept title width', () => {
      const wrapper = mount(Skeleton, {
        props: { title: { width: '93%' } },
      })
      expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('width: 93%')
    })

    it('should have default width 38% when no avatar and has paragraph', () => {
      // getTitleBasicProps: !hasAvatar && hasParagraph → width: '38%'
      const wrapper = mount(Skeleton, {
        props: { avatar: false, title: true, paragraph: true },
      })
      expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('width: 38%')
    })

    it('should have default width 50% when has avatar and paragraph', () => {
      // getTitleBasicProps: hasAvatar && hasParagraph → width: '50%'
      const wrapper = mount(Skeleton, {
        props: { avatar: true, title: true, paragraph: true },
      })
      expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('width: 50%')
    })

    it('should have no default width when has avatar but no paragraph', () => {
      // getTitleBasicProps: hasAvatar && !hasParagraph → {}
      const wrapper = mount(Skeleton, {
        props: { avatar: true, title: true, paragraph: false },
      })
      const style = wrapper.find('.ant-skeleton-title').attributes('style') || ''
      expect(style).not.toContain('width')
    })
  })

  // ==================== paragraph ====================

  describe('paragraph', () => {
    it('should render paragraph by default', () => {
      const wrapper = mount(Skeleton)
      expect(wrapper.find('.ant-skeleton-paragraph').exists()).toBe(true)
    })

    it('should not render paragraph when paragraph=false', () => {
      const wrapper = mount(Skeleton, { props: { paragraph: false } })
      expect(wrapper.find('.ant-skeleton-paragraph').exists()).toBe(false)
    })

    it('should render custom rows', () => {
      const wrapper = mount(Skeleton, {
        props: { paragraph: { rows: 5 } },
      })
      expect(wrapper.findAll('.ant-skeleton-paragraph > li').length).toBe(5)
    })

    it('should render width on last row (string)', () => {
      const wrapper = mount(Skeleton, {
        props: { paragraph: { width: '80%' } },
      })
      const rows = wrapper.findAll('.ant-skeleton-paragraph > li')
      const lastRow = rows[rows.length - 1]
      expect(lastRow.attributes('style')).toContain('width: 80%')
    })

    it('should render width array', () => {
      const wrapper = mount(Skeleton, {
        props: { paragraph: { width: ['28%', '93%'], rows: 2 } },
      })
      const rows = wrapper.findAll('.ant-skeleton-paragraph > li')
      expect(rows[0].attributes('style')).toContain('width: 28%')
      expect(rows[1].attributes('style')).toContain('width: 93%')
    })

    it('should default to 3 rows when no avatar and has title', () => {
      // getParagraphBasicProps: !hasAvatar && hasTitle → rows: 3
      const wrapper = mount(Skeleton, {
        props: { avatar: false, title: true, paragraph: true },
      })
      expect(wrapper.findAll('.ant-skeleton-paragraph > li').length).toBe(3)
    })

    it('should default to 2 rows when has avatar', () => {
      // getParagraphBasicProps: hasAvatar → rows: 2
      const wrapper = mount(Skeleton, {
        props: { avatar: true, title: true, paragraph: true },
      })
      expect(wrapper.findAll('.ant-skeleton-paragraph > li').length).toBe(2)
    })

    it('should default width 61% when no avatar or no title', () => {
      // getParagraphBasicProps: !hasAvatar || !hasTitle → width: '61%'
      const wrapper = mount(Skeleton, {
        props: { avatar: false, title: true, paragraph: true },
      })
      const rows = wrapper.findAll('.ant-skeleton-paragraph > li')
      const lastRow = rows[rows.length - 1]
      expect(lastRow.attributes('style')).toContain('width: 61%')
    })
  })

  // ==================== without avatar and paragraph ====================

  it('should render only title when avatar=false, paragraph=false', () => {
    const wrapper = mount(Skeleton, {
      props: { avatar: false, paragraph: false },
    })
    expect(wrapper.find('.ant-skeleton-title').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-paragraph').exists()).toBe(false)
    expect(wrapper.find('.ant-skeleton-header').exists()).toBe(false)
  })

  it('should render nothing visible when title=false, paragraph=false, avatar=false', () => {
    const wrapper = mount(Skeleton, {
      props: { avatar: false, title: false, paragraph: false },
    })
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-header').exists()).toBe(false)
    expect(wrapper.find('.ant-skeleton-section').exists()).toBe(false)
  })

  // ==================== attrs passthrough ====================

  it('should pass style to root', () => {
    const wrapper = mount(() => <Skeleton style={{ background: 'blue' }} />)
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('background: blue')
  })

  it('should pass data-* attributes', () => {
    const wrapper = mount(() => <Skeleton data-testid="skeleton" />)
    expect(wrapper.find('[data-testid="skeleton"]').exists()).toBe(true)
  })

  // ==================== rootClass ====================

  it('should support rootClass', () => {
    const wrapper = mount(Skeleton, { props: { rootClass: 'my-skeleton' } })
    expect(wrapper.find('.ant-skeleton').classes()).toContain('my-skeleton')
  })

  // ==================== semantic classes/styles (object form, basic) ====================

  it('should apply semantic classes and styles', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: true,
        classes: {
          root: 'c-root',
          header: 'c-header',
          section: 'c-section',
          avatar: 'c-avatar',
          title: 'c-title',
          paragraph: 'c-paragraph',
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
        },
      },
    })
    expect(wrapper.find('.ant-skeleton').classes()).toContain('c-root')
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find('.ant-skeleton-header').classes()).toContain('c-header')
    expect(wrapper.find('.ant-skeleton-section').classes()).toContain('c-section')
    expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('c-avatar')
    expect(wrapper.find('.ant-skeleton-title').classes()).toContain('c-title')
    expect(wrapper.find('.ant-skeleton-paragraph').classes()).toContain('c-paragraph')
  })

  // ==================== ConfigProvider ====================

  it('should support ConfigProvider skeleton config', () => {
    const wrapper = mount(() => (
      <ConfigProvider
        skeleton={{
          classes: { root: 'cp-root' },
          styles: { root: { color: 'rgb(0, 128, 0)' } },
        }}
      >
        <Skeleton />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-skeleton').classes()).toContain('cp-root')
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('color: rgb(0, 128, 0)')
  })

  // ==================== rtl ====================

  it('should support rtl direction', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Skeleton />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-skeleton-rtl').exists()).toBe(true)
  })

  // ==================== dynamic props ====================

  it('should toggle between skeleton and children', async () => {
    const loading = ref(true)
    const wrapper = mount(() => (
      <Skeleton loading={loading.value}>
        <div class="real-content">Content</div>
      </Skeleton>
    ))
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    expect(wrapper.find('.real-content').exists()).toBe(false)

    loading.value = false
    await nextTick()
    expect(wrapper.find('.ant-skeleton').exists()).toBe(false)
    expect(wrapper.find('.real-content').text()).toBe('Content')
  })

  it('should update active prop dynamically', async () => {
    const active = ref(false)
    const wrapper = mount(() => <Skeleton active={active.value} />)
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(false)

    active.value = true
    await nextTick()
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
  })

  // ==================== Skeleton.Button ====================

  describe('skeleton.Button', () => {
    it('should render button skeleton', () => {
      const wrapper = mount(Skeleton.Button)
      expect(wrapper.find('.ant-skeleton-button').exists()).toBe(true)
    })

    it('should render active class', () => {
      const wrapper = mount(Skeleton.Button, { props: { active: true } })
      expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
    })

    it('should render block class', () => {
      const wrapper = mount(Skeleton.Button, { props: { block: true } })
      expect(wrapper.find('.ant-skeleton-block').exists()).toBe(true)
    })

    it('should render size classes', () => {
      const small = mount(Skeleton.Button, { props: { size: 'small' } })
      expect(small.find('.ant-skeleton-button-sm').exists()).toBe(true)

      const large = mount(Skeleton.Button, { props: { size: 'large' } })
      expect(large.find('.ant-skeleton-button-lg').exists()).toBe(true)

      const medium = mount(Skeleton.Button, { props: { size: 'medium' } })
      expect(medium.find('.ant-skeleton-button-sm').exists()).toBe(false)
      expect(medium.find('.ant-skeleton-button-lg').exists()).toBe(false)
    })

    it('should render shape classes', () => {
      const circle = mount(Skeleton.Button, { props: { shape: 'circle' } })
      expect(circle.find('.ant-skeleton-button-circle').exists()).toBe(true)

      const round = mount(Skeleton.Button, { props: { shape: 'round' } })
      expect(round.find('.ant-skeleton-button-round').exists()).toBe(true)

      const square = mount(Skeleton.Button, { props: { shape: 'square' } })
      expect(square.find('.ant-skeleton-button-square').exists()).toBe(true)
    })

    it('should pass rootClass', () => {
      const wrapper = mount(Skeleton.Button, { props: { rootClass: 'my-btn' } })
      expect(wrapper.find('.ant-skeleton').classes()).toContain('my-btn')
    })

    it('should pass attrs.class to root', () => {
      const wrapper = mount(() => <Skeleton.Button class="custom-btn" />)
      expect(wrapper.find('.ant-skeleton').classes()).toContain('custom-btn')
    })
  })

  // ==================== Skeleton.Avatar ====================

  describe('skeleton.Avatar', () => {
    it('should render avatar skeleton', () => {
      const wrapper = mount(Skeleton.Avatar)
      expect(wrapper.find('.ant-skeleton-avatar').exists()).toBe(true)
    })

    it('should render active class', () => {
      const wrapper = mount(Skeleton.Avatar, { props: { active: true } })
      expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
    })

    it('should render size classes', () => {
      const small = mount(Skeleton.Avatar, { props: { size: 'small' } })
      expect(small.find('.ant-skeleton-avatar-sm').exists()).toBe(true)

      const large = mount(Skeleton.Avatar, { props: { size: 'large' } })
      expect(large.find('.ant-skeleton-avatar-lg').exists()).toBe(true)

      const medium = mount(Skeleton.Avatar, { props: { size: 'medium' } })
      expect(medium.find('.ant-skeleton-avatar-sm').exists()).toBe(false)
      expect(medium.find('.ant-skeleton-avatar-lg').exists()).toBe(false)
    })

    it('should render numeric size as inline style', () => {
      const wrapper = mount(Skeleton.Avatar, { props: { size: 20 } })
      const el = wrapper.find('.ant-skeleton-avatar')
      expect(el.attributes('style')).toContain('line-height: 20px')
    })

    it('should render shape classes', () => {
      const circle = mount(Skeleton.Avatar, { props: { shape: 'circle' } })
      expect(circle.find('.ant-skeleton-avatar-circle').exists()).toBe(true)

      const square = mount(Skeleton.Avatar, { props: { shape: 'square' } })
      expect(square.find('.ant-skeleton-avatar-square').exists()).toBe(true)
    })

    it('should pass rootClass', () => {
      const wrapper = mount(Skeleton.Avatar, { props: { rootClass: 'my-avatar' } })
      expect(wrapper.find('.ant-skeleton').classes()).toContain('my-avatar')
    })
  })

  // ==================== Skeleton.Input ====================

  describe('skeleton.Input', () => {
    it('should render input skeleton', () => {
      const wrapper = mount(Skeleton.Input)
      expect(wrapper.find('.ant-skeleton-input').exists()).toBe(true)
    })

    it('should render active class', () => {
      const wrapper = mount(Skeleton.Input, { props: { active: true } })
      expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
    })

    it('should render block class', () => {
      const wrapper = mount(Skeleton.Input, { props: { block: true } })
      expect(wrapper.find('.ant-skeleton-block').exists()).toBe(true)
    })

    it('should render size classes', () => {
      const small = mount(Skeleton.Input, { props: { size: 'small' } })
      expect(small.find('.ant-skeleton-input-sm').exists()).toBe(true)

      const large = mount(Skeleton.Input, { props: { size: 'large' } })
      expect(large.find('.ant-skeleton-input-lg').exists()).toBe(true)

      const medium = mount(Skeleton.Input, { props: { size: 'medium' } })
      expect(medium.find('.ant-skeleton-input-sm').exists()).toBe(false)
      expect(medium.find('.ant-skeleton-input-lg').exists()).toBe(false)
    })

    it('should pass rootClass', () => {
      const wrapper = mount(Skeleton.Input, { props: { rootClass: 'my-input' } })
      expect(wrapper.find('.ant-skeleton').classes()).toContain('my-input')
    })
  })

  // ==================== Skeleton.Image ====================

  describe('componentSize from ConfigProvider', () => {
    it('should apply componentSize to skeleton elements', async () => {
      const componentSize = ref<'small' | 'large'>('small')
      const wrapper = mount(() => (
        <ConfigProvider componentSize={componentSize.value}>
          <div>
            <Skeleton.Avatar />
            <Skeleton.Button />
            <Skeleton.Input />
          </div>
        </ConfigProvider>
      ))

      expect(wrapper.find('.ant-skeleton-avatar-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-button-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-input-sm').exists()).toBe(true)

      componentSize.value = 'large'
      await nextTick()

      expect(wrapper.find('.ant-skeleton-avatar-lg').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-button-lg').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-input-lg').exists()).toBe(true)
    })

    it('should let explicit size override componentSize', () => {
      const wrapper = mount(() => (
        <ConfigProvider componentSize="large">
          <div>
            <Skeleton.Avatar size="small" />
            <Skeleton.Button size="small" />
            <Skeleton.Input size="small" />
          </div>
        </ConfigProvider>
      ))

      expect(wrapper.find('.ant-skeleton-avatar-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-button-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-input-sm').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-avatar-lg').exists()).toBe(false)
      expect(wrapper.find('.ant-skeleton-button-lg').exists()).toBe(false)
      expect(wrapper.find('.ant-skeleton-input-lg').exists()).toBe(false)
    })
  })

  describe('ConfigProvider inheritance for skeleton sub components', () => {
    it.each([
      ['Skeleton.Button', () => <Skeleton.Button data-testid="skeleton-button" />],
      ['Skeleton.Avatar', () => <Skeleton.Avatar data-testid="skeleton-avatar" />],
      ['Skeleton.Input', () => <Skeleton.Input data-testid="skeleton-input" />],
      ['Skeleton.Node', () => <Skeleton.Node data-testid="skeleton-node">node</Skeleton.Node>],
      ['Skeleton.Image', () => <Skeleton.Image data-testid="skeleton-image" />],
    ])('should apply ConfigProvider skeleton class and style to %s', (_, renderNode) => {
      const wrapper = mount(() => (
        <ConfigProvider
          skeleton={{
            class: 'cp-skeleton-root',
            style: { border: '1px solid red' },
          }}
        >
          {renderNode()}
        </ConfigProvider>
      ))

      const root = wrapper.find('[data-testid]')
      expect(root.classes()).toContain('cp-skeleton-root')
      expect(root.attributes('style')).toContain('border: 1px solid red')
    })
  })

  describe('skeleton.Image', () => {
    it('should render image skeleton with svg', () => {
      const wrapper = mount(Skeleton.Image)
      expect(wrapper.find('.ant-skeleton-image').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-image-svg').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-image-path').exists()).toBe(true)
    })

    it('should not render ant-skeleton-node when using Image', () => {
      const wrapper = mount(Skeleton.Image)
      expect(wrapper.find('.ant-skeleton-node').exists()).toBe(false)
    })

    it('should pass attrs.class to root', () => {
      const wrapper = mount(() => <Skeleton.Image class="custom-image" />)
      expect(wrapper.find('.ant-skeleton').classes()).toContain('custom-image')
    })
  })

  // ==================== Skeleton.Node ====================

  describe('skeleton.Node', () => {
    it('should render node skeleton with default class', () => {
      const wrapper = mount(Skeleton.Node)
      expect(wrapper.find('.ant-skeleton-node').exists()).toBe(true)
      expect(wrapper.find('.ant-skeleton-image').exists()).toBe(false)
    })

    it('should render active class', () => {
      const wrapper = mount(Skeleton.Node, { props: { active: true } })
      expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
    })

    it('should render custom children via slot', () => {
      const wrapper = mount(Skeleton.Node, {
        slots: { default: () => h('span', { class: 'custom' }, 'Node') },
      })
      expect(wrapper.find('.custom').text()).toBe('Node')
    })

    it('should pass attrs.class to root', () => {
      const wrapper = mount(() => <Skeleton.Node class="custom-node" />)
      expect(wrapper.find('.ant-skeleton').classes()).toContain('custom-node')
      expect(wrapper.find('.ant-skeleton-node').classes()).not.toContain('custom-node')
    })

    it('should pass rootClass', () => {
      const wrapper = mount(Skeleton.Node, { props: { rootClass: 'my-node' } })
      expect(wrapper.find('.ant-skeleton').classes()).toContain('my-node')
    })

    it('should pass style to inner node div', () => {
      const wrapper = mount(() => <Skeleton.Node style={{ background: 'red' }} />)
      expect(wrapper.find('.ant-skeleton-node').attributes('style')).toContain('background: red')
    })
  })

  // ==================== snapshot ====================

  it('should match snapshot with all features', () => {
    const wrapper = mount(() => (
      <Skeleton avatar active round paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }} />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})

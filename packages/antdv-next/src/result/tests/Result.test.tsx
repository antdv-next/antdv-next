import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Result from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('result', () => {
  mountTest(Result)
  rtlTest(() => h(Result))

  it('should render default result with info status', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.ant-result').exists()).toBe(true)
    expect(wrapper.find('.ant-result-info').exists()).toBe(true)
    expect(wrapper.find('.ant-result-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-result-title').exists()).toBe(true)
  })

  describe('status', () => {
    it.each([
      ['success', '.ant-result-success'],
      ['error', '.ant-result-error'],
      ['info', '.ant-result-info'],
      ['warning', '.ant-result-warning'],
    ] as const)('should render %s status with correct class', (status, expectedClass) => {
      const wrapper = mount(Result, { props: { status } })
      expect(wrapper.find(expectedClass).exists()).toBe(true)
      expect(wrapper.find('.ant-result-image').exists()).toBe(false)
    })

    it.each([
      [403, '.ant-result-403'],
      [404, '.ant-result-404'],
      [500, '.ant-result-500'],
    ] as const)('should render %s exception status with image class', (status, expectedClass) => {
      const wrapper = mount(Result, { props: { status } })
      expect(wrapper.find(expectedClass).exists()).toBe(true)
      expect(wrapper.find('.ant-result-image').exists()).toBe(true)
    })

    it('should render exception status as string', () => {
      const wrapper = mount(Result, { props: { status: '404' as any } })
      expect(wrapper.find('.ant-result-404').exists()).toBe(true)
      expect(wrapper.find('.ant-result-image').exists()).toBe(true)
    })
  })

  describe('icon', () => {
    it('should render default icon for each status', () => {
      const wrapper = mount(Result, { props: { status: 'success' } })
      expect(wrapper.find('.ant-result-icon svg').exists()).toBe(true)
    })

    it('should render SVG image for exception statuses', () => {
      const wrapper = mount(Result, { props: { status: 404 } })
      expect(wrapper.find('.ant-result-image svg').exists()).toBe(true)
    })

    it('should render custom icon via prop', () => {
      const wrapper = mount(Result, {
        props: { icon: h('span', { class: 'custom-icon' }, 'icon') },
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render custom icon via slot', () => {
      const wrapper = mount(Result, {
        slots: { icon: () => <span class="slot-icon">icon</span> },
      })
      expect(wrapper.find('.slot-icon').exists()).toBe(true)
    })

    it('icon slot should take priority over prop', () => {
      const wrapper = mount(Result, {
        props: { icon: h('span', { class: 'prop-icon' }) },
        slots: { icon: () => <span class="slot-icon">icon</span> },
      })
      expect(wrapper.find('.slot-icon').exists()).toBe(true)
      expect(wrapper.find('.prop-icon').exists()).toBe(false)
    })

    it('should hide icon when icon is null', () => {
      const wrapper = mount(Result, {
        props: { icon: null as any },
      })
      expect(wrapper.find('.ant-result-icon').exists()).toBe(false)
    })

    it('should hide icon when icon is false', () => {
      const wrapper = mount(Result, {
        props: { icon: false as any },
      })
      expect(wrapper.find('.ant-result-icon').exists()).toBe(false)
    })

    it('should still render exception SVG even with icon=null for exception status', () => {
      const wrapper = mount(Result, {
        props: { status: 404, icon: null as any },
      })
      // Exception statuses always render SVG, ignoring icon prop
      expect(wrapper.find('.ant-result-image svg').exists()).toBe(true)
    })
  })

  describe('title', () => {
    it('should render title via prop', () => {
      const wrapper = mount(Result, {
        props: { title: 'Test Title' },
      })
      expect(wrapper.find('.ant-result-title').text()).toBe('Test Title')
    })

    it('should render title via slot', () => {
      const wrapper = mount(Result, {
        slots: { title: () => 'Slot Title' },
      })
      expect(wrapper.find('.ant-result-title').text()).toBe('Slot Title')
    })

    it('title slot should take priority over prop', () => {
      const wrapper = mount(Result, {
        props: { title: 'Prop Title' },
        slots: { title: () => 'Slot Title' },
      })
      expect(wrapper.find('.ant-result-title').text()).toBe('Slot Title')
    })
  })

  describe('subTitle', () => {
    it('should render subTitle via prop', () => {
      const wrapper = mount(Result, {
        props: { subTitle: 'Sub Title' },
      })
      expect(wrapper.find('.ant-result-subtitle').text()).toBe('Sub Title')
    })

    it('should render subTitle via slot', () => {
      const wrapper = mount(Result, {
        slots: { subTitle: () => 'Slot Sub Title' },
      })
      expect(wrapper.find('.ant-result-subtitle').text()).toBe('Slot Sub Title')
    })

    it('subTitle slot should take priority over prop', () => {
      const wrapper = mount(Result, {
        props: { subTitle: 'Prop Sub' },
        slots: { subTitle: () => 'Slot Sub' },
      })
      expect(wrapper.find('.ant-result-subtitle').text()).toBe('Slot Sub')
    })

    it('should not render subTitle when not provided', () => {
      const wrapper = mount(Result)
      expect(wrapper.find('.ant-result-subtitle').exists()).toBe(false)
    })
  })

  describe('extra', () => {
    it('should render extra via prop', () => {
      const wrapper = mount(Result, {
        props: { extra: h('button', 'Go Back') },
      })
      expect(wrapper.find('.ant-result-extra').exists()).toBe(true)
      expect(wrapper.find('.ant-result-extra button').text()).toBe('Go Back')
    })

    it('should render extra via slot', () => {
      const wrapper = mount(Result, {
        slots: { extra: () => <button>Action</button> },
      })
      expect(wrapper.find('.ant-result-extra button').text()).toBe('Action')
    })

    it('should not render extra when not provided', () => {
      const wrapper = mount(Result)
      expect(wrapper.find('.ant-result-extra').exists()).toBe(false)
    })
  })

  describe('body (default slot)', () => {
    it('should render body when default slot has content', () => {
      const wrapper = mount(Result, {
        slots: { default: () => <div class="body-content">Content</div> },
      })
      expect(wrapper.find('.ant-result-body').exists()).toBe(true)
      expect(wrapper.find('.body-content').exists()).toBe(true)
    })

    it('should not render body when no default slot', () => {
      const wrapper = mount(Result)
      expect(wrapper.find('.ant-result-body').exists()).toBe(false)
    })

    it('should not render body when default slot content is empty', () => {
      const wrapper = mount(Result, {
        slots: { default: () => [null, undefined, ''] },
      })
      expect(wrapper.find('.ant-result-body').exists()).toBe(false)
    })
  })

  describe('semantic classes and styles', () => {
    it('should apply classes to all semantic elements', () => {
      const wrapper = mount(Result, {
        props: {
          title: 'Title',
          subTitle: 'Sub',
          classes: {
            root: 'c-root',
            icon: 'c-icon',
            title: 'c-title',
            subTitle: 'c-sub',
            extra: 'c-extra',
            body: 'c-body',
          },
          extra: h('button', 'Action'),
        },
        slots: { default: () => <div>Body</div> },
      })
      expect(wrapper.find('.ant-result').classes()).toContain('c-root')
      expect(wrapper.find('.ant-result-icon').classes()).toContain('c-icon')
      expect(wrapper.find('.ant-result-title').classes()).toContain('c-title')
      expect(wrapper.find('.ant-result-subtitle').classes()).toContain('c-sub')
      expect(wrapper.find('.ant-result-extra').classes()).toContain('c-extra')
      expect(wrapper.find('.ant-result-body').classes()).toContain('c-body')
    })

    it('should apply styles to all semantic elements', () => {
      const wrapper = mount(Result, {
        props: {
          title: 'Title',
          subTitle: 'Sub',
          styles: {
            root: { padding: '10px' },
            icon: { height: '20px' },
            title: { color: 'rgb(255, 0, 0)' },
            subTitle: { fontSize: '12px' },
            extra: { marginTop: '30px' },
            body: { background: 'rgb(0, 0, 255)' },
          },
          extra: h('button', 'Action'),
        },
        slots: { default: () => <div>Body</div> },
      })
      expect(wrapper.find('.ant-result').attributes('style')).toContain('padding: 10px')
      expect(wrapper.find('.ant-result-icon').attributes('style')).toContain('height: 20px')
      expect(wrapper.find('.ant-result-title').attributes('style')).toContain('color: rgb(255, 0, 0)')
      expect(wrapper.find('.ant-result-subtitle').attributes('style')).toContain('font-size: 12px')
      expect(wrapper.find('.ant-result-extra').attributes('style')).toContain('margin-top: 30px')
      expect(wrapper.find('.ant-result-body').attributes('style')).toContain('background: rgb(0, 0, 255)')
    })
  })

  it('should support rootClass', () => {
    const wrapper = mount(Result, {
      props: { rootClass: 'my-root' },
    })
    expect(wrapper.find('.ant-result').classes()).toContain('my-root')
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => (
      <Result style={{ color: 'red' }} />
    ))
    expect(wrapper.find('.ant-result').attributes('style')).toContain('color: red')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Result data-testid="my-result" />
    ))
    expect(wrapper.find('[data-testid="my-result"]').exists()).toBe(true)
  })

  it('should pass aria attributes', () => {
    const wrapper = mount(() => (
      <Result aria-label="result" />
    ))
    expect(wrapper.find('[aria-label="result"]').exists()).toBe(true)
  })

  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Result />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-result-rtl').exists()).toBe(true)
    })

    it('should render correct snapshot in rtl', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Result status="success" title="Success" />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-result').element).toMatchSnapshot()
    })
  })

  it('should update when props change dynamically', async () => {
    const status = ref<'success' | 'error'>('success')
    const wrapper = mount(() => <Result status={status.value} title="Test" />)
    expect(wrapper.find('.ant-result-success').exists()).toBe(true)

    status.value = 'error'
    await nextTick()
    expect(wrapper.find('.ant-result-error').exists()).toBe(true)
    expect(wrapper.find('.ant-result-success').exists()).toBe(false)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Result
        status="success"
        title="Success"
        subTitle="Order submitted"
        extra={<button>Go Home</button>}
      >
        <div>Detail content</div>
      </Result>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('static properties', () => {
    it('should have PRESENTED_IMAGE_403', () => {
      expect(Result.PRESENTED_IMAGE_403).toBeDefined()
    })

    it('should have PRESENTED_IMAGE_404', () => {
      expect(Result.PRESENTED_IMAGE_404).toBeDefined()
    })

    it('should have PRESENTED_IMAGE_500', () => {
      expect(Result.PRESENTED_IMAGE_500).toBeDefined()
    })
  })
})

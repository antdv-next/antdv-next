import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Steps from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('steps', () => {
  mountTest(Steps)
  rtlTest(() => h(Steps, { items: [{ title: 'Step 1' }, { title: 'Step 2' }] }))

  it('should render default steps', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ],
      },
    })
    expect(wrapper.find('.ant-steps').exists()).toBe(true)
    expect(wrapper.findAll('.ant-steps-item').length).toBe(3)
  })

  it('should render steps with current index', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ],
      },
    })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[0]!.classes()).toContain('ant-steps-item-finish')
    expect(items[1]!.classes()).toContain('ant-steps-item-process')
    expect(items[2]!.classes()).toContain('ant-steps-item-wait')
  })

  it('should render different types', () => {
    const types = ['default', 'navigation', 'inline', 'panel', 'dot'] as const
    types.forEach((type) => {
      const wrapper = mount(Steps, {
        props: {
          type,
          items: [{ title: 'Step 1' }, { title: 'Step 2' }],
        },
      })
      if (type === 'default') {
        expect(wrapper.find('.ant-steps').exists()).toBe(true)
      }
      else if (type === 'dot' || type === 'inline') {
        expect(wrapper.find('.ant-steps-dot').exists()).toBe(true)
      }
      else {
        expect(wrapper.find(`.ant-steps-${type}`).exists()).toBe(true)
      }
    })
  })

  it('should render variant', () => {
    const variants = ['filled', 'outlined'] as const
    variants.forEach((variant) => {
      const wrapper = mount(Steps, {
        props: {
          variant,
          items: [{ title: 'Step 1' }],
        },
      })
      expect(wrapper.find(`.ant-steps-${variant}`).exists()).toBe(true)
    })
  })

  it('should render horizontal orientation', () => {
    const wrapper = mount(Steps, {
      props: {
        orientation: 'horizontal',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-horizontal').exists()).toBe(true)
  })

  it('should render vertical orientation', () => {
    const wrapper = mount(Steps, {
      props: {
        orientation: 'vertical',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-vertical').exists()).toBe(true)
  })

  it('should support direction prop (deprecated)', () => {
    const wrapper = mount(Steps, {
      props: {
        direction: 'vertical',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-vertical').exists()).toBe(true)
  })

  it('should render different sizes', () => {
    const sizes = ['default', 'small'] as const
    sizes.forEach((size) => {
      const wrapper = mount(Steps, {
        props: {
          size,
          items: [{ title: 'Step 1' }],
        },
      })
      if (size === 'small') {
        expect(wrapper.find('.ant-steps-small').exists()).toBe(true)
      }
      else {
        expect(wrapper.find('.ant-steps-small').exists()).toBe(false)
      }
    })
  })

  it('should support ellipsis', () => {
    const wrapper = mount(Steps, {
      props: {
        ellipsis: true,
        items: [{ title: 'Very Long Step Title That Should Be Ellipsized' }],
      },
    })
    expect(wrapper.find('.ant-steps-ellipsis').exists()).toBe(true)
  })

  it('should render item with different status', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', status: 'finish' },
          { title: 'Step 2', status: 'process' },
          { title: 'Step 3', status: 'wait' },
          { title: 'Step 4', status: 'error' },
        ],
      },
    })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[0]!.classes()).toContain('ant-steps-item-finish')
    expect(items[1]!.classes()).toContain('ant-steps-item-process')
    expect(items[2]!.classes()).toContain('ant-steps-item-wait')
    expect(items[3]!.classes()).toContain('ant-steps-item-error')
  })

  it('should render item with content', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', content: 'Step 1 description' },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item-title').text()).toBe('Step 1')
    expect(wrapper.find('.ant-steps-item-content').text()).toBe('Step 1 description')
  })

  it('should render item with subTitle', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', subTitle: 'Optional' },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item-subtitle').text()).toBe('Optional')
  })

  it('should render disabled item', () => {
    const onClick = vi.fn()
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', disabled: true, onClick },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item-disabled').exists()).toBe(true)
  })

  it('should render with percent', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        percent: 60,
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-with-progress').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should not render percent in inline type', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'inline',
        current: 1,
        percent: 60,
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
        ],
      },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('should support offset in inline type', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'inline',
        offset: 2,
        items: [{ title: 'Step 1' }],
      },
    })
    const style = wrapper.find('.ant-steps').attributes('style')
    expect(style).toContain('--ant-cmp-steps-items-offset')
  })

  it('should trigger onChange when item is clicked', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        onChange,
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
        ],
      },
    })
    await wrapper.findAll('.ant-steps-item')[1]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should trigger update:current event', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [
          { title: 'Step 1' },
          { title: 'Step 2' },
        ],
      },
    })
    await wrapper.findAll('.ant-steps-item')[1]!.trigger('click')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
  })

  it('should not trigger onChange when disabled', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Steps, {
      props: {
        onChange,
        items: [
          { title: 'Step 1', disabled: true },
        ],
      },
    })
    await wrapper.find('.ant-steps-item').trigger('click')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should trigger item onClick', async () => {
    const itemClick = vi.fn()
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', onClick: itemClick },
        ],
      },
    })
    await wrapper.find('.ant-steps-item').trigger('click')
    expect(itemClick).toHaveBeenCalled()
  })

  it('should support rootClass', () => {
    const wrapper = mount(Steps, {
      props: {
        rootClass: 'custom-steps',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps').classes()).toContain('custom-steps')
  })

  it('should support semantic classes', () => {
    const wrapper = mount(Steps, {
      props: {
        classes: {
          root: 'custom-root',
          item: 'custom-item',
          itemIcon: 'custom-icon',
        },
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps').classes()).toContain('custom-root')
    expect(wrapper.find('.ant-steps-item').classes()).toContain('custom-item')
    expect(wrapper.find('.ant-steps-item-icon').classes()).toContain('custom-icon')
  })

  it('should support semantic styles', () => {
    const wrapper = mount(Steps, {
      props: {
        styles: {
          root: { padding: '20px' },
          item: { margin: '10px' },
        },
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps').attributes('style')).toContain('padding: 20px')
    expect(wrapper.find('.ant-steps-item').attributes('style')).toContain('margin: 10px')
  })

  it('should support item classes and styles', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          {
            title: 'Step 1',
            class: 'custom-step-class',
            style: { color: 'red' },
          },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item').classes()).toContain('custom-step-class')
    expect(wrapper.find('.ant-steps-item').attributes('style')).toContain('color: red')
  })

  it('should support custom iconRender', () => {
    const iconRender = vi.fn(({ info }) => {
      return h('span', { class: 'custom-icon' }, `Icon ${info.index + 1}`)
    })
    const wrapper = mount(Steps, {
      props: {
        iconRender,
        items: [{ title: 'Step 1' }],
      },
    })
    expect(iconRender).toHaveBeenCalled()
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('Icon 1')
  })

  it('should support iconRender slot', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [{ title: 'Step 1' }],
      },
      slots: {
        iconRender: ({ info }: any) => h('span', { class: 'slot-icon' }, `${info.index}`),
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
  })

  it('should support custom icon in item', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: 'Step 1', icon: h('span', { class: 'item-icon' }, '★') },
        ],
      },
    })
    expect(wrapper.find('.item-icon').exists()).toBe(true)
    expect(wrapper.find('.item-icon').text()).toBe('★')
  })

  it('should support progressDot (deprecated)', () => {
    const wrapper = mount(Steps, {
      props: {
        progressDot: true,
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-dot').exists()).toBe(true)
  })

  it('should support progressDot as function (deprecated)', () => {
    const progressDot = vi.fn(({ iconDot }) => {
      return h('div', { class: 'custom-dot' }, [iconDot])
    })
    const wrapper = mount(Steps, {
      props: {
        progressDot,
        items: [{ title: 'Step 1' }],
      },
    })
    expect(progressDot).toHaveBeenCalled()
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
  })

  it('should render tooltip in inline mode', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'inline',
        items: [
          { title: 'Step 1', content: 'This is step 1' },
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item').exists()).toBe(true)
  })

  it('should render panel type with arrow', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'panel',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-panel').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-panel-arrow').exists()).toBe(true)
  })

  it('should panel type always horizontal', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'panel',
        direction: 'vertical',
        items: [{ title: 'Step 1' }],
      },
    })
    expect(wrapper.find('.ant-steps-horizontal').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-vertical').exists()).toBe(false)
  })

  it('should support size from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="small">
        <Steps items={[{ title: 'Step 1' }]} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-steps-small').exists()).toBe(true)
  })

  it('should support rtl from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Steps items={[{ title: 'Step 1' }]} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-steps-rtl').exists()).toBe(true)
  })

  it('should update when current changes', async () => {
    const current = ref(0)
    const wrapper = mount(() => (
      <Steps
        current={current.value}
        items={[
          { title: 'Step 1' },
          { title: 'Step 2' },
        ]}
      />
    ))

    expect(wrapper.findAll('.ant-steps-item')[0]!.classes()).toContain('ant-steps-item-process')

    current.value = 1
    await nextTick()

    expect(wrapper.findAll('.ant-steps-item')[0]!.classes()).toContain('ant-steps-item-finish')
    expect(wrapper.findAll('.ant-steps-item')[1]!.classes()).toContain('ant-steps-item-process')
  })

  it('should match snapshot with default config', () => {
    const wrapper = mount(() => (
      <Steps
        items={[
          { title: 'Step 1', content: 'Description 1' },
          { title: 'Step 2', content: 'Description 2' },
          { title: 'Step 3', content: 'Description 3' },
        ]}
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with navigation type', () => {
    const wrapper = mount(() => (
      <Steps
        type="navigation"
        current={1}
        items={[
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ]}
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with dot type', () => {
    const wrapper = mount(() => (
      <Steps
        type="dot"
        current={1}
        items={[
          { title: 'Step 1', content: 'Description 1' },
          { title: 'Step 2', content: 'Description 2' },
        ]}
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with progress', () => {
    const wrapper = mount(() => (
      <Steps
        current={1}
        percent={60}
        items={[
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ]}
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Cascader, { CascaderPanel } from '..'
import ConfigProvider from '../../config-provider'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          { value: 'zhonghuamen', label: 'Zhong Hua Men' },
        ],
      },
    ],
  },
]

describe('cascader', () => {
  rtlTest(() => h(Cascader, { options }))

  it('should render correctly', () => {
    const wrapper = mount(Cascader, {
      props: { options },
    })
    expect(wrapper.find('.ant-select').exists()).toBe(true)
    expect(wrapper.find('.ant-cascader').exists()).toBe(true)
    expect(wrapper.find('.ant-select-single').exists()).toBe(true)
  })

  it('should support placeholder', () => {
    const wrapper = mount(Cascader, {
      props: { options, placeholder: 'Please select' },
    })
    expect(wrapper.find('.ant-select-placeholder').text()).toBe('Please select')
  })

  it('should support disabled', () => {
    const wrapper = mount(Cascader, {
      props: { options, disabled: true },
    })
    expect(wrapper.find('.ant-select-disabled').exists()).toBe(true)
  })

  it('should support size large', () => {
    const wrapper = mount(Cascader, {
      props: { options, size: 'large' },
    })
    expect(wrapper.find('.ant-select-lg').exists()).toBe(true)
  })

  it('should support size small', () => {
    const wrapper = mount(Cascader, {
      props: { options, size: 'small' },
    })
    expect(wrapper.find('.ant-select-sm').exists()).toBe(true)
  })

  it('should support status error', () => {
    const wrapper = mount(Cascader, {
      props: { options, status: 'error' },
    })
    expect(wrapper.find('.ant-select-status-error').exists()).toBe(true)
  })

  it('should support status warning', () => {
    const wrapper = mount(Cascader, {
      props: { options, status: 'warning' },
    })
    expect(wrapper.find('.ant-select-status-warning').exists()).toBe(true)
  })

  it('should support variant outlined by default', () => {
    const wrapper = mount(Cascader, {
      props: { options },
    })
    expect(wrapper.find('.ant-select-outlined').exists()).toBe(true)
  })

  it('should support variant filled', () => {
    const wrapper = mount(Cascader, {
      props: { options, variant: 'filled' },
    })
    expect(wrapper.find('.ant-select-filled').exists()).toBe(true)
  })

  it('should support variant borderless', () => {
    const wrapper = mount(Cascader, {
      props: { options, variant: 'borderless' },
    })
    expect(wrapper.find('.ant-select-borderless').exists()).toBe(true)
  })

  // ============ Dropdown tests ============

  it('should render dropdown with open prop', async () => {
    const wrapper = mount(Cascader, {
      props: { options, open: true },
      attachTo: document.body,
    })
    await nextTick()

    const dropdown = document.querySelector('.ant-cascader-dropdown')
    expect(dropdown).toBeTruthy()

    const menuItems = document.querySelectorAll('.ant-cascader-menu-item')
    expect(menuItems.length).toBeGreaterThan(0)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should render options in dropdown', async () => {
    const wrapper = mount(Cascader, {
      props: { options, open: true },
      attachTo: document.body,
    })
    await nextTick()

    const menuItems = document.querySelectorAll('.ant-cascader-menu-item')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0].textContent).toContain('Zhejiang')
    expect(menuItems[1].textContent).toContain('Jiangsu')

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  // ============ Value & events tests ============

  it('should support defaultValue', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
      },
    })
    // Single select shows value in selection content area
    const text = wrapper.find('.ant-select').text()
    expect(text).toContain('West Lake')
  })

  it('should emit update:value when selection changes', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(Cascader, {
      props: {
        options,
        open: true,
        changeOnSelect: true,
        'onUpdate:value': onUpdateValue,
      },
      attachTo: document.body,
    })

    await nextTick()
    const menuItems = document.querySelectorAll('.ant-cascader-menu-item')
    ;(menuItems[0] as HTMLElement).click()
    await nextTick()

    expect(onUpdateValue).toHaveBeenCalledWith(['zhejiang'])

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should emit change event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Cascader, {
      props: {
        options,
        open: true,
        changeOnSelect: true,
        onChange,
      },
      attachTo: document.body,
    })
    await nextTick()

    const menuItems = document.querySelectorAll('.ant-cascader-menu-item')
    ;(menuItems[0] as HTMLElement).click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should emit openChange event', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Cascader, {
      props: {
        options,
        onOpenChange,
      },
    })

    await wrapper.find('.ant-select').trigger('mousedown')
    await nextTick()

    expect(onOpenChange).toHaveBeenCalled()
  })

  // ============ allowClear tests ============

  it('should support allowClear by default', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        value: ['zhejiang', 'hangzhou', 'xihu'],
      },
    })
    expect(wrapper.find('.ant-select-clear').exists()).toBe(true)
  })

  it('should hide clear when allowClear is false', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        value: ['zhejiang', 'hangzhou', 'xihu'],
        allowClear: false,
      },
    })
    expect(wrapper.find('.ant-select-clear').exists()).toBe(false)
  })

  // ============ Multiple mode tests ============

  it('should support multiple mode', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        multiple: true,
      },
    })
    expect(wrapper.find('.ant-select-multiple').exists()).toBe(true)
  })

  it('should render tags in multiple mode', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        multiple: true,
        value: [['zhejiang', 'hangzhou', 'xihu']],
      },
    })
    const items = wrapper.findAll('.ant-select-selection-item')
    expect(items.length).toBeGreaterThan(0)
  })

  // ============ RTL tests ============

  it('should render rtl class', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Cascader, { options }),
      },
    })
    expect(wrapper.find('.ant-select-rtl').exists()).toBe(true)
  })

  it('should render rtl dropdown class', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Cascader, { options, open: true }),
      },
      attachTo: document.body,
    })
    await nextTick()

    const dropdown = document.querySelector('.ant-cascader-dropdown-rtl')
    expect(dropdown).toBeTruthy()

    await nextTick()
    await nextTick()
    wrapper.unmount()
  })

  // ============ Expose tests ============

  it('should expose focus and blur methods', () => {
    const wrapper = mount(Cascader, {
      props: { options },
    })
    expect(typeof wrapper.vm.focus).toBe('function')
    expect(typeof wrapper.vm.blur).toBe('function')
  })

  // ============ CascaderPanel tests ============

  it('should render CascaderPanel', () => {
    const wrapper = mount(CascaderPanel, {
      props: { options },
    })
    expect(wrapper.find('.ant-cascader-panel').exists()).toBe(true)
  })

  it('should render CascaderPanel with options', () => {
    const wrapper = mount(CascaderPanel, {
      props: { options },
    })
    const menuItems = wrapper.findAll('.ant-cascader-menu-item')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0].text()).toContain('Zhejiang')
  })

  it('should support CascaderPanel multiple mode', () => {
    const wrapper = mount(CascaderPanel, {
      props: { options, multiple: true },
    })
    expect(wrapper.find('.ant-cascader-panel').exists()).toBe(true)
    expect(wrapper.find('.ant-cascader-checkbox').exists()).toBe(true)
  })

  it('should support Cascader.Panel static property', () => {
    expect(Cascader.Panel).toBe(CascaderPanel)
  })

  it('should support Cascader.SHOW_PARENT and SHOW_CHILD', () => {
    expect(Cascader.SHOW_PARENT).toBeDefined()
    expect(Cascader.SHOW_CHILD).toBeDefined()
  })

  // ============ Snapshots ============

  it('should match snapshot - basic', () => {
    const wrapper = mount(() => (
      <Cascader options={options} placeholder="Please select" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with value', () => {
    const wrapper = mount(() => (
      <Cascader
        options={options}
        value={['zhejiang', 'hangzhou', 'xihu']}
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - disabled', () => {
    const wrapper = mount(() => (
      <Cascader options={options} disabled />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - multiple', () => {
    const wrapper = mount(() => (
      <Cascader
        options={options}
        multiple
        value={[['zhejiang', 'hangzhou', 'xihu']]}
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

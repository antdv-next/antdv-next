import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Select from '..'
import { resetWarned } from '../../_util/warning'
import ConfigProvider from '../../config-provider'
import Form, { FormItem } from '../../form'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59185
describe('select suffix', () => {
  const getSuffix = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-suffix')

  it('should support deprecated suffixIcon prop', () => {
    const wrapper = mount(() => <Select suffixIcon="foobar" />)
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should support suffix prop', () => {
    const wrapper = mount(() => <Select suffix="foobar" />)
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should support suffix slot with priority over prop', () => {
    const wrapper = mount(() => (
      <Select suffix="prop" v-slots={{ suffix: () => <span class="slot-suffix">slot</span> }} />
    ))
    expect(getSuffix(wrapper).find('.slot-suffix').exists()).toBe(true)
    expect(getSuffix(wrapper).text()).toBe('slot')
  })

  it('should prefer suffix prop over suffixIcon prop', () => {
    const wrapper = mount(() => <Select suffix="foobar" suffixIcon={null} />)
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should support function suffix prop and slot', async () => {
    const open = ref(false)
    const wrapper = mount(defineComponent(() => () => (
      <div>
        <Select class="prop-select" open={open.value} suffix={({ open }: { open: boolean }) => (open ? 'opened' : 'closed')} />
        <Select class="slot-select" open={open.value} v-slots={{ suffix: ({ open }: { open: boolean }) => (open ? 'opened' : 'closed') }} />
      </div>
    )), { attachTo: document.body })
    expect(wrapper.find('.prop-select .ant-select-suffix').text()).toBe('closed')
    expect(wrapper.find('.slot-select .ant-select-suffix').text()).toBe('closed')

    open.value = true
    await nextTick()
    expect(wrapper.find('.prop-select .ant-select-suffix').text()).toBe('opened')
    expect(wrapper.find('.slot-select .ant-select-suffix').text()).toBe('opened')
    wrapper.unmount()
  })

  it('should not render suffix when function returns undefined', () => {
    const wrapper = mount(() => <Select suffix={() => undefined} />)
    expect(getSuffix(wrapper).exists()).toBe(false)
    expect(wrapper.find('.ant-select').classes()).not.toContain('ant-select-show-arrow')
  })

  it('should keep showArrow compatibility with null suffix', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <Select showArrow suffix={null} />)
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Select] `showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffix` to null.',
    )
    expect(wrapper.find('.ant-select-show-arrow').exists()).toBe(true)
    errSpy.mockRestore()
  })

  it.each([
    ['custom', 'foobar'],
    ['null', null],
  ])('should keep feedback icon with %s suffix', (_, suffix) => {
    const wrapper = mount(() => (
      <Form>
        <FormItem hasFeedback validateStatus="error">
          <Select suffix={suffix} />
        </FormItem>
      </Form>
    ))
    expect(wrapper.find('.ant-form-item-feedback-icon-error').exists()).toBe(true)
  })

  it('should support suffixIcon in config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider select={{ suffixIcon: 'foobar' }}>
        <Select />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should support suffix in config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider select={{ suffix: 'foobar' }}>
        <Select />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should prefer suffix over suffixIcon in config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider select={{ suffix: 'foobar', suffixIcon: 'legacy' }}>
        <Select />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('foobar')
  })

  it('should prefer suffixIcon prop over config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider select={{ suffixIcon: 'foobar' }}>
        <Select suffixIcon="bamboo" />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('bamboo')
  })

  // https://github.com/ant-design/ant-design/pull/59709
  it('should hide the default decorative icons from assistive technologies', async () => {
    const props = ref<Record<string, any>>({})
    const wrapper = mount(defineComponent(() => () => <Select {...props.value} />), { attachTo: document.body })
    expect(wrapper.find('.anticon-down').attributes('aria-hidden')).toBe('true')

    props.value = { loading: true }
    await nextTick()
    expect(wrapper.find('.anticon-loading').attributes('aria-hidden')).toBe('true')

    props.value = { showSearch: true, open: true }
    await nextTick()
    expect(wrapper.find('.anticon-search').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('should warn when using deprecated suffixIcon prop', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(() => <Select suffixIcon="foobar" />)
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Select] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    errSpy.mockRestore()
  })
})

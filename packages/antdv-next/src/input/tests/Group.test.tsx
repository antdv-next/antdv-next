import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Input, { InputGroup } from '..'
import { resetWarned } from '../../_util/warning'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Form, { FormItem } from '../../form'
import InputNumber from '../../input-number'
import mountTest from '/@tests/shared/mountTest'
import { mount } from '/@tests/utils'

describe('input.Group', () => {
  mountTest(InputGroup)

  it('should be exposed as Input.Group', () => {
    expect(Input.Group).toBe(InputGroup)
  })

  it('should render children inside Space.Compact', () => {
    const wrapper = mount(() => (
      <InputGroup>
        <Input class="first" />
        <Input class="second" />
      </InputGroup>
    ))
    const root = wrapper.find('.ant-input-group')
    expect(root.exists()).toBe(true)
    expect(root.classes()).toContain('ant-space-compact')
    expect(root.findAll('input')).toHaveLength(2)
    expect(wrapper.find('.first').classes()).toContain('ant-input-compact-first-item')
    expect(wrapper.find('.second').classes()).toContain('ant-input-compact-last-item')
  })

  it('should render nothing without children', () => {
    const wrapper = mount(() => <InputGroup />)
    expect(wrapper.find('.ant-input-group').exists()).toBe(false)
  })

  it('should support size and compact', () => {
    const wrapper = mount(() => (
      <InputGroup size="large" compact>
        <Input />
      </InputGroup>
    ))
    const root = wrapper.find('.ant-input-group')
    expect(root.classes()).toContain('ant-input-group-lg')
    expect(root.classes()).toContain('ant-input-group-compact')
    // Same as antd: the group size is applied by style, not forwarded to children.
    expect(wrapper.find('input').classes()).not.toContain('ant-input-lg')
  })

  it('should not add compact class by default', () => {
    const wrapper = mount(() => (
      <InputGroup size="small">
        <Input />
      </InputGroup>
    ))
    const root = wrapper.find('.ant-input-group')
    expect(root.classes()).toContain('ant-input-group-sm')
    expect(root.classes()).not.toContain('ant-input-group-compact')
  })

  it('should update classes when props and attrs change', async () => {
    const size = ref<'large' | 'small'>('large')
    const cls = ref('custom-a')
    const wrapper = mount(() => (
      <InputGroup size={size.value} class={cls.value}>
        <Input />
      </InputGroup>
    ))
    const root = () => wrapper.find('.ant-input-group')
    expect(root().classes()).toEqual(expect.arrayContaining(['ant-input-group-lg', 'custom-a']))

    size.value = 'small'
    cls.value = 'custom-b'
    await nextTick()
    expect(root().classes()).toEqual(expect.arrayContaining(['ant-input-group-sm', 'custom-b']))
    expect(root().classes()).not.toContain('ant-input-group-lg')
    expect(root().classes()).not.toContain('custom-a')
  })

  it('should pass class, style, rootClass and listeners to the root element', async () => {
    const onMouseenter = vi.fn()
    const wrapper = mount(() => (
      <InputGroup class="user-cls" rootClass="root-cls" style={{ width: '300px' }} onMouseenter={onMouseenter}>
        <Input />
      </InputGroup>
    ))
    const root = wrapper.find('.ant-input-group')
    expect(root.classes()).toEqual(expect.arrayContaining(['user-cls', 'root-cls']))
    expect((root.element as HTMLElement).style.width).toBe('300px')
    await root.trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledTimes(1)
  })

  it('should support rtl', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <InputGroup>
          <Input />
        </InputGroup>
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-input-group').classes()).toContain('ant-input-group-rtl')
  })

  it('should support prefixCls from props and ConfigProvider', () => {
    const wrapper = mount(() => (
      <div>
        <InputGroup prefixCls="custom-group" class="by-prop">
          <Input />
        </InputGroup>
        <ConfigProvider prefixCls="foo">
          <InputGroup class="by-config">
            <Input />
          </InputGroup>
        </ConfigProvider>
      </div>
    ))
    expect(wrapper.find('.by-prop').classes()).toContain('custom-group')
    expect(wrapper.find('.by-prop').classes()).not.toContain('ant-input-group')
    expect(wrapper.find('.by-config').classes()).toContain('foo-input-group')
    expect(wrapper.find('.by-config input').classes()).toContain('foo-input')
  })

  it('should keep Form.Item status but not mark children as the Form.Item input', async () => {
    const wrapper = mount(() => (
      <Form>
        <FormItem validateStatus="error">
          <InputNumber class="outside" />
        </FormItem>
        <FormItem validateStatus="error">
          <InputGroup>
            <InputNumber class="inside" />
          </InputGroup>
        </FormItem>
      </Form>
    ))
    await nextTick()
    expect(wrapper.find('.outside').classes()).toContain('ant-input-number-in-form-item')
    expect(wrapper.find('.inside').classes()).not.toContain('ant-input-number-in-form-item')
    expect(wrapper.find('.inside').classes()).toContain('ant-input-number-status-error')
  })

  it('should warn deprecated', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount(() => <InputGroup />)
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Input.Group] `Input.Group` is deprecated. Please use `Space.Compact` instead.',
    )
    errSpy.mockRestore()
  })
})

describe('input.Group style', () => {
  it('should register group styles with the input prefix', async () => {
    const cache = createCache()
    const app = createSSRApp({
      render: () =>
        h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'input-group-test' } } }, {
          default: () =>
            h(StyleProvider, { cache, mock: 'server' }, {
              // No Input inside, so the group itself must inject the group styles.
              default: () => h(InputGroup, { size: 'large' }, { default: () => [h(Button, null, () => 'a')] }),
            }),
        }),
    })
    await renderToString(app)
    const styleText = extractStyle(cache, { plain: true, types: 'style' })

    expect(styleText).toContain('.ant-input-group-lg .ant-input')
    expect(styleText).not.toContain('.ant-input-group-group')
  })
})

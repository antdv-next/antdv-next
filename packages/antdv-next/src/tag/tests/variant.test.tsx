import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Tag from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import { mount } from '/@tests/utils'

describe('tag global variant', () => {
  it.each<[ConfigProviderProps['variant'], string]>([
    [undefined, 'filled'],
    ['outlined', 'outlined'],
    ['filled', 'filled'],
    ['borderless', 'filled'],
    ['underlined', 'filled'],
  ])('resolves global variant %s to %s', (variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={variant}>
        <Tag>Tag</Tag>
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-tag').classes()).toContain(`ant-tag-${expected}`)
  })

  it.each(['filled', 'solid', 'outlined'] as const)(
    'keeps component variant %s above the global variant',
    (variant) => {
      const wrapper = mount(() => (
        <ConfigProvider variant="outlined" tag={{ variant }}>
          <Tag>Tag</Tag>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-tag').classes()).toContain(`ant-tag-${variant}`)
    },
  )

  it('preserves local props and legacy color and bordered priority', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined" tag={{ variant: 'outlined' }}>
        <Tag variant="filled">Local</Tag>
        <Tag color="green-inverse">Inverse</Tag>
        <Tag bordered={false}>Bordered</Tag>
      </ConfigProvider>
    ))
    const tags = wrapper.findAll('.ant-tag')
    expect(tags[0]!.classes()).toContain('ant-tag-filled')
    expect(tags[1]!.classes()).toEqual(expect.arrayContaining(['ant-tag-solid', 'ant-tag-green']))
    expect(tags[2]!.classes()).toContain('ant-tag-filled')
    errorSpy.mockRestore()
  })

  it('updates inherited variant and semantic props through nested providers', async () => {
    const variant = ref<ConfigProviderProps['variant']>('outlined')
    const wrapper = mount(() => (
      <ConfigProvider variant="filled">
        <ConfigProvider variant={variant.value}>
          <Tag classes={({ props }) => ({ root: `semantic-${props.variant}` })}>Tag</Tag>
        </ConfigProvider>
      </ConfigProvider>
    ))
    let classes = wrapper.find('.ant-tag').classes()
    expect(classes).toEqual(expect.arrayContaining(['ant-tag-outlined', 'semantic-outlined']))

    variant.value = 'filled'
    await nextTick()
    classes = wrapper.find('.ant-tag').classes()
    expect(classes).toEqual(expect.arrayContaining(['ant-tag-filled', 'semantic-filled']))
    expect(classes).not.toContain('ant-tag-outlined')
  })

  it('uses Form variant before component configuration and keeps local props first', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined" tag={{ variant: 'outlined' }}>
        <Form variant="filled">
          <Tag>Form</Tag>
          <Tag variant="solid">Local</Tag>
        </Form>
      </ConfigProvider>
    ))
    const tags = wrapper.findAll('.ant-tag')
    expect(tags[0]!.classes()).toContain('ant-tag-filled')
    expect(tags[1]!.classes()).toContain('ant-tag-solid')
  })
})

import type { ConfigProviderProps } from '../../config-provider'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import Alert from '..'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import { mount } from '/@tests/utils'

describe('alert global variant', () => {
  it.each<[ConfigProviderProps['variant'], string]>([
    [undefined, 'outlined'],
    ['outlined', 'outlined'],
    ['filled', 'filled'],
    ['borderless', 'outlined'],
    ['underlined', 'outlined'],
  ])('resolves global variant %s to %s', (variant, expected) => {
    const wrapper = mount(() => (
      <ConfigProvider variant={variant}>
        <Alert title="Info" />
      </ConfigProvider>
    ))

    expect(wrapper.find('.ant-alert').classes()).toContain(`ant-alert-${expected}`)
  })

  it('preserves component configuration and local prop priority', async () => {
    const local = ref<'filled' | undefined>()
    const wrapper = mount(() => (
      <ConfigProvider variant="filled" alert={{ variant: 'outlined' }}>
        <Alert title="Info" variant={local.value} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-outlined')

    local.value = 'filled'
    await nextTick()
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-filled')
  })

  it('updates global variant through nested providers and semantic props', async () => {
    const variant = ref<ConfigProviderProps['variant']>('filled')
    const wrapper = mount(() => (
      <ConfigProvider variant="outlined">
        <ConfigProvider variant={variant.value}>
          <Alert title="Info" classes={({ props }) => ({ root: `semantic-${props.variant}` })} />
        </ConfigProvider>
      </ConfigProvider>
    ))
    let classes = wrapper.find('.ant-alert').classes()
    expect(classes).toContain('ant-alert-filled')
    expect(classes).toContain('semantic-filled')

    variant.value = 'outlined'
    await nextTick()
    classes = wrapper.find('.ant-alert').classes()
    expect(classes).toContain('ant-alert-outlined')
    expect(classes).toContain('semantic-outlined')
    expect(classes).not.toContain('ant-alert-filled')
  })

  it('uses Form variant before component configuration and keeps local props first', () => {
    const wrapper = mount(() => (
      <ConfigProvider variant="filled" alert={{ variant: 'filled' }}>
        <Form variant="outlined">
          <Alert title="Info" />
          <Alert title="Info" variant="filled" />
        </Form>
      </ConfigProvider>
    ))
    const alerts = wrapper.findAll('.ant-alert')
    expect(alerts[0]!.classes()).toContain('ant-alert-outlined')
    expect(alerts[1]!.classes()).toContain('ant-alert-filled')
  })
})

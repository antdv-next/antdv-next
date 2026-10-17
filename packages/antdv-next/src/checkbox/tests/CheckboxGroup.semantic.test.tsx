import { describe, expect, it } from 'vitest'
import Checkbox, { CheckboxGroup } from '..'
import ConfigProvider from '../../config-provider'
import { semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59059
describe('Checkbox.Group semantic', () => {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Pear', value: 'pear' },
  ]

  it('support classes and styles as objects', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        options={options}
        classes={{
          root: 'custom-group-root',
          item: 'custom-group-item',
          itemIcon: 'custom-group-item-icon',
          itemLabel: 'custom-group-item-label',
        }}
        styles={{
          root: { backgroundColor: 'rgb(0, 255, 0)' },
          item: { color: 'rgb(255, 0, 0)' },
          itemIcon: { borderColor: 'rgb(0, 0, 255)' },
          itemLabel: { fontWeight: 'bold' },
        }}
      />
    ))

    const group = wrapper.find('.ant-checkbox-group')
    expect(group.classes()).toContain('custom-group-root')
    expect((group.element as HTMLElement).style.backgroundColor).toBe('rgb(0, 255, 0)')

    const items = wrapper.findAll('.ant-checkbox-wrapper')
    expect(items).toHaveLength(2)
    items.forEach((item) => {
      expect(item.classes()).toContain('custom-group-item')
      expect((item.element as HTMLElement).style.color).toBe('rgb(255, 0, 0)')
    })
    wrapper.findAll('.ant-checkbox').forEach((icon) => {
      expect(icon.classes()).toContain('custom-group-item-icon')
      expect((icon.element as HTMLElement).style.borderColor).toBe('rgb(0, 0, 255)')
    })
    wrapper.findAll('.ant-checkbox-label').forEach((label) => {
      expect(label.classes()).toContain('custom-group-item-label')
      expect((label.element as HTMLElement).style.fontWeight).toBe('bold')
    })
  })

  it('should apply semantic classes to children', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        classes={{
          root: 'custom-group-root',
          item: 'custom-group-item',
          itemIcon: 'custom-group-item-icon',
          itemLabel: 'custom-group-item-label',
        }}
      >
        <Checkbox value="A">A</Checkbox>
      </CheckboxGroup>
    ))

    expect(wrapper.find('.ant-checkbox-group').classes()).toContain('custom-group-root')
    expect(wrapper.find('.ant-checkbox-wrapper').classes()).toContain('custom-group-item')
    expect(wrapper.find('.ant-checkbox').classes()).toContain('custom-group-item-icon')
    expect(wrapper.find('.ant-checkbox-label').classes()).toContain('custom-group-item-label')
  })

  it('support classes and styles as functions with merged props', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        options={options}
        classes={(info: any) => ({
          root: info.props.disabled ? 'group-disabled' : 'group-enabled',
          item: `item-${info.props.value?.length ?? 'none'}`,
        })}
        styles={(info: any) => ({
          root: { padding: info.props.disabled ? '4px' : '8px' },
          itemLabel: { fontWeight: info.props.disabled ? 'normal' : 'bold' },
        })}
      />
    ))

    const group = wrapper.find('.ant-checkbox-group')
    expect(group.classes()).toContain('group-enabled')
    expect((group.element as HTMLElement).style.padding).toBe('8px')
    wrapper.findAll('.ant-checkbox-label').forEach((label) => {
      expect((label.element as HTMLElement).style.fontWeight).toBe('bold')
    })
  })

  it('should provide componentDisabled to semantic functions', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentDisabled>
        <CheckboxGroup
          options={options}
          classes={({ props }: any) => ({
            root: props.disabled ? 'group-disabled' : 'group-enabled',
          })}
        />
      </ConfigProvider>
    ))

    expect(wrapper.find('.ant-checkbox-group').classes()).toContain('group-disabled')
  })

  it('should allow option style to override group item styles', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        styles={{
          item: { color: 'rgb(255, 0, 0)', backgroundColor: 'rgb(0, 255, 0)' },
        }}
        options={[
          { label: 'Apple', value: 'apple', style: { color: 'rgb(0, 0, 255)' } },
          { label: 'Pear', value: 'pear' },
        ]}
      />
    ))

    const items = wrapper.findAll('.ant-checkbox-wrapper').map(item => item.element as HTMLElement)
    expect(items[0]!.style.color).toBe('rgb(0, 0, 255)')
    expect(items[0]!.style.backgroundColor).toBe('rgb(0, 255, 0)')
    expect(items[1]!.style.color).toBe('rgb(255, 0, 0)')
    expect(items[1]!.style.backgroundColor).toBe('rgb(0, 255, 0)')
  })

  it('should allow item styles to override group item styles', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        styles={{
          item: { color: 'rgb(255, 0, 0)' },
          itemIcon: { borderColor: 'rgb(0, 255, 0)' },
        }}
      >
        <Checkbox value="A" styles={{ root: { color: 'rgb(0, 0, 255)' } }}>
          A
        </Checkbox>
        <Checkbox value="B">B</Checkbox>
      </CheckboxGroup>
    ))

    const items = wrapper.findAll('.ant-checkbox-wrapper').map(item => item.element as HTMLElement)
    const icons = wrapper.findAll('.ant-checkbox').map(icon => icon.element as HTMLElement)
    expect(items[0]!.style.color).toBe('rgb(0, 0, 255)')
    expect(items[1]!.style.color).toBe('rgb(255, 0, 0)')
    expect(icons[0]!.style.borderColor).toBe('rgb(0, 255, 0)')
    expect(icons[1]!.style.borderColor).toBe('rgb(0, 255, 0)')
  })

  it('should follow root style priority', () => {
    const wrapper = mount(() => (
      <CheckboxGroup
        options={options}
        styles={semanticRootStylePriority.styles}
        style={semanticRootStylePriority.style}
      />
    ))

    const group = wrapper.find('.ant-checkbox-group').element as HTMLElement
    expect(group.style.backgroundColor).toBe(semanticRootStylePriority.style.backgroundColor)
    expect(group.style.marginTop).toBe(semanticRootStylePriority.styles.root.marginTop)
  })
})

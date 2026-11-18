import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@antdv-next/icons'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import Menu from '..'
import { mount } from '/@tests/utils'

const items = [
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: MailOutlined,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: AppstoreOutlined,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: SettingOutlined,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
] as any

describe('menu slot render', () => {
  it('prefers the expandIcon slot and falls back to the prop when removed', async () => {
    const showSlot = ref(true)
    const label = ref('Slot')
    const wrapper = mount(() => (
      <Menu
        mode="inline"
        items={items}
        expandIcon={() => <span class="prop-expand-icon">Prop</span>}
        v-slots={showSlot.value ? { expandIcon: () => <span class="slot-expand-icon">{label.value}</span> } : {}}
      />
    ))

    expect(wrapper.find('.slot-expand-icon').text()).toBe('Slot')
    expect(wrapper.find('.prop-expand-icon').exists()).toBe(false)

    label.value = 'Updated slot'
    await nextTick()
    expect(wrapper.find('.slot-expand-icon').text()).toBe('Updated slot')

    showSlot.value = false
    await nextTick()
    expect(wrapper.find('.slot-expand-icon').exists()).toBe(false)
    expect(wrapper.find('.prop-expand-icon').text()).toBe('Prop')
  })

  it('supports labelRender slot', () => {
    const wrapper = mount(() => (
      <Menu
        style={{ width: '256px' }}
        defaultOpenKeys={['sub1']}
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        v-slots={{
          labelRender: (item: any) => (
            <span class="menu-label-render">
              Label:
              {' '}
              {item.label}
            </span>
          ),
        }}
      />
    ))

    expect(wrapper.find('.menu-label-render').exists()).toBe(true)
    expect(wrapper.text()).toContain('Label: Navigation One')
    expect(wrapper.text()).toContain('Label: Option 1')
  })

  it('supports extraRender slot', () => {
    const wrapper = mount(() => (
      <Menu
        style={{ width: '256px' }}
        defaultOpenKeys={['sub1']}
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        v-slots={{
          extraRender: (item: any) => item?.key
            ? (
                <span class="menu-extra-render">
                  Extra:
                  {' '}
                  {item.key}
                </span>
              )
            : null,
        }}
      />
    ))

    expect(wrapper.find('.menu-extra-render').exists()).toBe(true)
    expect(wrapper.text()).toContain('Extra: 1')
    expect(wrapper.find('.ant-menu-item-extra').exists()).toBe(true)
  })

  it('supports iconRender slot', () => {
    const wrapper = mount(() => (
      <Menu
        style={{ width: '256px' }}
        defaultOpenKeys={['sub1']}
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        v-slots={{
          iconRender: (item: any) => item?.key ? <span class="menu-icon-render">{item.key}</span> : null,
        }}
      />
    ))

    expect(wrapper.find('.menu-icon-render').exists()).toBe(true)
    expect(wrapper.text()).toContain('sub1')
    expect(wrapper.find('.ant-menu-item-icon').exists()).toBe(true)
  })
})

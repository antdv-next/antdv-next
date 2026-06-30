import type { MenuProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Menu, { MenuItem } from '..'
import { mount } from '/@tests/utils'

async function flushMenu() {
  await Promise.resolve()
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

// https://github.com/ant-design/ant-design/pull/58197
describe('menu itemData in callbacks', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('passes itemData in click info (items mode)', async () => {
    const onClick = vi.fn()
    const items: NonNullable<MenuProps['items']> = [
      { key: '1', label: 'Menu 1', extra: 'extra' },
      { key: '2', label: 'Menu 2' },
    ]
    const wrapper = mount(Menu, { props: { items, onClick } })
    await flushMenu()

    await wrapper.findAll('.ant-menu-item')[0]!.trigger('click')
    await flushMenu()

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        key: '1',
        itemData: expect.objectContaining({ key: '1', extra: 'extra' }),
      }),
    )
  })

  it('passes itemData in select/deselect info (items mode)', async () => {
    const onSelect = vi.fn()
    const onDeselect = vi.fn()
    const items: NonNullable<MenuProps['items']> = [
      { key: '1', label: 'Menu 1' },
      { key: '2', label: 'Menu 2' },
    ]
    const wrapper = mount(Menu, {
      props: { items, selectable: true, multiple: true, onSelect, onDeselect },
    })
    await flushMenu()

    const first = () => wrapper.findAll('.ant-menu-item')[0]!
    await first().trigger('click')
    await flushMenu()
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: '1', itemData: expect.objectContaining({ key: '1' }) }),
    )

    await first().trigger('click')
    await flushMenu()
    expect(onDeselect).toHaveBeenCalledWith(
      expect.objectContaining({ key: '1', itemData: expect.objectContaining({ key: '1' }) }),
    )
  })

  it('passes itemData in click info (children mode)', async () => {
    const onClick = vi.fn()
    const wrapper = mount(() => (
      <Menu onClick={onClick}>
        <MenuItem key="1">Menu 1</MenuItem>
      </Menu>
    ))
    await flushMenu()

    await wrapper.find('.ant-menu-item').trigger('click')
    await flushMenu()

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        key: '1',
        itemData: expect.objectContaining({ key: '1' }),
      }),
    )
  })
})

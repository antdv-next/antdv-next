import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Transfer from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

const listProps = {
  dataSource: [
    { key: 'a', title: 'a', disabled: true },
    { key: 'b', title: 'b' },
    { key: 'c', title: 'c' },
    { key: 'd', title: 'd' },
    { key: 'e', title: 'e' },
  ],
  selectedKeys: ['b'],
  targetKeys: [],
  pagination: { pageSize: 4 },
}

async function openDropdown(trigger: Element) {
  trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
  await waitFakeTimer(0, 1)
  await nextTick()
}

function clickItem(index: number) {
  const items = Array.from(document.querySelectorAll('li.ant-dropdown-menu-item'))
  items[index]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

describe('transfer.Dropdown', () => {
  it('select all', async () => {
    vi.useFakeTimers()

    const onSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      attachTo: document.body,
      props: {
        ...listProps,
        onSelectChange,
      },
    })

    const trigger = wrapper.element.querySelector('.ant-dropdown-trigger')
    expect(trigger).toBeTruthy()

    await openDropdown(trigger!)
    clickItem(0)

    expect(onSelectChange).toHaveBeenCalledWith(['b', 'c', 'd', 'e'], [])

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('select current page', async () => {
    vi.useFakeTimers()

    const onSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      attachTo: document.body,
      props: {
        ...listProps,
        onSelectChange,
      },
    })

    const trigger = wrapper.element.querySelector('.ant-dropdown-trigger')
    expect(trigger).toBeTruthy()

    await openDropdown(trigger!)
    clickItem(1)

    expect(onSelectChange).toHaveBeenCalledWith(['b', 'c', 'd'], [])

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('should hide checkbox and dropdown icon when showSelectAll={false}', () => {
    const wrapper = mount(Transfer, {
      props: {
        ...listProps,
        showSelectAll: false,
      },
    })

    expect(wrapper.element.querySelector('.ant-dropdown-trigger')).toBeFalsy()
    expect(
      wrapper.element.querySelector('.ant-transfer-list-header .ant-transfer-list-checkbox'),
    ).toBeFalsy()
  })

  describe('select invert', () => {
    it('with pagination', async () => {
      vi.useFakeTimers()

      const onSelectChange = vi.fn()
      const wrapper = mount(Transfer, {
        attachTo: document.body,
        props: {
          ...listProps,
          selectedKeys: undefined,
          onSelectChange,
        },
      })

      const trigger = wrapper.element.querySelector('.ant-dropdown-trigger')
      expect(trigger).toBeTruthy()

      await openDropdown(trigger!)
      clickItem(0)
      expect(onSelectChange).toHaveBeenCalledWith(['b', 'c', 'd', 'e'], [])

      await openDropdown(trigger!)
      clickItem(2)

      expect(onSelectChange).toHaveBeenCalledWith(['e'], [])

      wrapper.unmount()
      vi.useRealTimers()
    })

    it('without pagination', async () => {
      vi.useFakeTimers()

      const onSelectChange = vi.fn()
      const wrapper = mount(Transfer, {
        attachTo: document.body,
        props: {
          ...listProps,
          pagination: undefined,
          onSelectChange,
        },
      })

      const trigger = wrapper.element.querySelector('.ant-dropdown-trigger')
      expect(trigger).toBeTruthy()

      await openDropdown(trigger!)
      clickItem(1)

      expect(onSelectChange).toHaveBeenCalledWith(['c', 'd', 'e'], [])

      wrapper.unmount()
      vi.useRealTimers()
    })
  })

  describe('oneWay to remove', () => {
    [
      { name: 'with pagination', props: listProps },
      { name: 'without pagination', props: { ...listProps, pagination: undefined } },
    ].forEach(({ name, props }) => {
      it(name, async () => {
        vi.useFakeTimers()

        const onChange = vi.fn()
        const wrapper = mount(Transfer, {
          attachTo: document.body,
          props: {
            ...props,
            targetKeys: ['b', 'c'],
            oneWay: true,
            onChange,
          },
        })

        const triggers = wrapper.element.querySelectorAll('.ant-dropdown-trigger')
        expect(triggers).toHaveLength(2)

        await openDropdown(triggers[1]!)
        clickItem(0)

        expect(onChange).toHaveBeenCalledWith([], 'left', ['b', 'c'])

        wrapper.unmount()
        vi.useRealTimers()
      })
    })
  })
})

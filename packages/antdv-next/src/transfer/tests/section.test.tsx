import type { KeyWiseTransferItem, TransferListBodyProps, TransferListProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Section from '../Section'
import { mountComponent } from '/@tests/utils'

const noop = vi.fn()

const listCommonProps: TransferListProps<KeyWiseTransferItem> = {
  prefixCls: 'ant-transfer',
  classes: {},
  styles: {},
  titleText: 'source',
  dataSource: [
    { key: 'a', title: 'a' },
    { key: 'b', title: 'b' },
    { key: 'c', title: 'c', disabled: true },
  ],
  filterOption: undefined,
  checkedKeys: ['a'],
  handleFilter: noop,
  onItemSelect: noop,
  onItemSelectAll: noop,
  handleClear: noop,
  render: item => item.title,
  showSearch: false,
  onScroll: noop,
  disabled: false,
  direction: 'left',
  showSelectAll: true,
  selectAllLabel: undefined,
  pagination: false,
  notFoundContent: 'Not Found',
  searchPlaceholder: 'Search here',
  itemUnit: 'item',
  itemsUnit: 'items',
  remove: 'Remove',
  selectAll: 'Select all data',
  deselectAll: 'Deselect all data',
  selectCurrent: 'Select current page',
  selectInvert: 'Invert current page',
  removeAll: 'Remove all data',
  removeCurrent: 'Remove current page',
}

const listProps = {
  ...listCommonProps,
  dataSource: undefined as unknown as KeyWiseTransferItem[],
}

const emptyListProps: TransferListProps<KeyWiseTransferItem> = {
  ...listCommonProps,
  dataSource: [],
}

describe('transfer.Section', () => {
  it('should render correctly', () => {
    const wrapper = mountComponent(Section, {
      props: listCommonProps,
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should check top Checkbox while all available items are checked', () => {
    const wrapper = mountComponent(Section, {
      props: {
        ...listCommonProps,
        checkedKeys: ['a', 'b'],
      },
    })

    const checkbox = wrapper.find<HTMLInputElement>('.ant-transfer-list-header input[type="checkbox"]')
    expect(checkbox.element.checked).toBeTruthy()
  })

  it('should render correctly when dataSource is not exists', () => {
    expect(() => {
      mountComponent(Section, {
        props: listProps,
      })
    }).not.toThrow()
  })

  it('checkbox should disabled when dataSource is empty', () => {
    const wrapper = mountComponent(Section, {
      props: emptyListProps,
    })

    expect(wrapper.find('label.ant-checkbox-wrapper').classes()).toContain('ant-checkbox-wrapper-disabled')
    expect(wrapper.find('span.ant-checkbox').classes()).toContain('ant-checkbox-disabled')
  })

  it('checkbox should not disabled when dataSource not is empty', () => {
    const wrapper = mountComponent(Section, {
      props: listCommonProps,
    })

    expect(wrapper.find('label.ant-checkbox-wrapper').classes()).not.toContain('ant-checkbox-wrapper-disabled')
    expect(wrapper.find('span.ant-checkbox').classes()).not.toContain('ant-checkbox-disabled')
  })

  it('should disabled all select checkbox when each item of dataSource is disabled', () => {
    const allDisabledListProps: TransferListProps<KeyWiseTransferItem> = {
      ...listCommonProps,
      dataSource: listCommonProps.dataSource.map(item => ({ ...item, disabled: true })),
    }

    const wrapper = mountComponent(Section, {
      props: allDisabledListProps,
    })

    expect(wrapper.find('label.ant-checkbox-wrapper').classes()).toContain('ant-checkbox-wrapper-disabled')
    expect(wrapper.find('span.ant-checkbox').classes()).toContain('ant-checkbox-disabled')
  })

  it('support custom dropdown Icon', () => {
    const wrapper = mountComponent(Section, {
      props: {
        ...listCommonProps,
        selectionsIcon: <span class="test-dropdown-icon">test</span>,
      },
    })

    expect(
      wrapper.find('.ant-transfer-section .ant-transfer-list-header .test-dropdown-icon').exists(),
    ).toBeTruthy()
  })

  it('onItemSelect should be called correctly', async () => {
    const onItemSelect = vi.fn()

    const wrapper = mountComponent(Section, {
      props: {
        ...listCommonProps,
        onItemSelect,
        renderList: (props: TransferListBodyProps<KeyWiseTransferItem>) => (
          <div
            class="custom-list-body"
            onClick={(e) => {
              props.onItemSelect('a', false, e as unknown as MouseEvent)
            }}
          >
            custom list body
          </div>
        ),
      },
    })

    await wrapper.find('.custom-list-body').trigger('click')

    expect(onItemSelect).toHaveBeenCalledWith('a', false)
  })
})

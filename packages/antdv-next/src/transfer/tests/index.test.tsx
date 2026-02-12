import type { SelectAllLabel, TransferEmits, TransferProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import Transfer from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Form, { FormItem } from '../../form'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount, waitFakeTimer } from '/@tests/utils'

const listCommonProps: {
  dataSource: { key: string, title: string, disabled?: boolean }[]
  selectedKeys?: string[]
  targetKeys?: string[]
} = {
  dataSource: [
    { key: 'a', title: 'a' },
    { key: 'b', title: 'b' },
    { key: 'c', title: 'c', disabled: true },
  ],
  selectedKeys: ['a'],
  targetKeys: ['b'],
}

const listDisabledProps = {
  dataSource: [
    { key: 'a', title: 'a', disabled: true },
    { key: 'b', title: 'b' },
  ],
  selectedKeys: ['a', 'b'],
  targetKeys: [],
}

const searchTransferProps = {
  dataSource: [
    {
      key: '0',
      title: 'content1',
      description: 'description of content1',
      chosen: false,
    },
    {
      key: '1',
      title: 'content2',
      description: 'description of content2',
      chosen: false,
    },
    {
      key: '2',
      title: 'content3',
      description: 'description of content3',
      chosen: false,
    },
    {
      key: '3',
      title: 'content4',
      description: 'description of content4',
      chosen: false,
    },
    {
      key: '4',
      title: 'content5',
      description: 'description of content5',
      chosen: false,
    },
    {
      key: '5',
      title: 'content6',
      description: 'description of content6',
      chosen: false,
    },
  ],
  selectedKeys: [],
  targetKeys: ['3', '4'],
}

function generateData(n = 20) {
  const data: Array<{ key: string, title: string, description: string, chosen: boolean }> = []
  for (let i = 0; i < n; i++) {
    data.push({
      key: `${i}`,
      title: `content${i}`,
      description: `description of content${i}`,
      chosen: false,
    })
  }
  return data
}

function ButtonRender({ onClick }: { onClick: () => void }) {
  return (
    <Button type="link" onClick={onClick}>
      Custom Button
    </Button>
  )
}

async function setInputValue(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await nextTick()
}

function getTransferItemByTitle(wrapper: ReturnType<typeof mount>, title: string) {
  return wrapper.element.querySelector(`.ant-transfer-list-content-item[title="${title}"]`) as HTMLElement | null
}

function clickElement(element: Element | null | undefined, eventInit: MouseEventInit = {}) {
  if (!element) {
    return
  }

  if (Object.keys(eventInit).length === 0) {
    ;(element as HTMLElement).click()
    return
  }

  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...eventInit }))
}

describe('transfer', () => {
  mountTest(Transfer)
  rtlTest(Transfer)

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render correctly', () => {
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should move selected keys to corresponding list', () => {
    const handleChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onChange: handleChange,
      },
    })

    clickElement(wrapper.element.querySelector('.ant-transfer-actions button'))

    expect(handleChange).toHaveBeenCalledWith(['a', 'b'], 'right', ['a'])
  })

  it('should move selected keys to left list', () => {
    const handleChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        selectedKeys: ['a'],
        targetKeys: ['a'],
        onChange: handleChange,
      },
    })

    const actionButtons = wrapper.element.querySelectorAll('.ant-transfer-actions button')
    clickElement(actionButtons[1])

    expect(handleChange).toHaveBeenCalledWith([], 'left', ['a'])
  })

  it('should move selected keys expect disabled to corresponding list', () => {
    const handleChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listDisabledProps,
        onChange: handleChange,
      },
    })

    clickElement(wrapper.element.querySelector('.ant-transfer-actions button'))

    expect(handleChange).toHaveBeenCalledWith(['b'], 'right', ['b'])
  })

  it('should uncheck checkbox when click on checked item', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'a'))

    expect(handleSelectChange).toHaveBeenLastCalledWith([], [])
  })

  it('should check checkbox when click on unchecked item', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'b'))

    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b'])
  })

  it('multiple select/deselect by hold down the shift key', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [
          { key: 'a', title: 'a' },
          { key: 'b', title: 'b' },
          { key: 'c', title: 'c' },
        ],
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'a'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], [])

    clickElement(getTransferItemByTitle(wrapper, 'c'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a', 'b', 'c'], [])

    clickElement(getTransferItemByTitle(wrapper, 'b'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], [])
  })

  it('multiple select targetKeys by hold down the shift key', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [
          { key: 'a', title: 'a' },
          { key: 'b', title: 'b' },
          { key: 'c', title: 'c' },
        ],
        targetKeys: ['a', 'b', 'c'],
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'a'))
    expect(handleSelectChange).toHaveBeenLastCalledWith([], ['a'])

    clickElement(getTransferItemByTitle(wrapper, 'c'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith([], ['a', 'b', 'c'])

    clickElement(getTransferItemByTitle(wrapper, 'b'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith([], ['a'])
  })

  it('reset last select key after deselect', async () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [
          { key: 'a', title: 'a' },
          { key: 'b', title: 'b' },
          { key: 'c', title: 'c' },
          { key: 'd', title: 'd' },
        ],
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'a'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], [])
    await nextTick()

    clickElement(getTransferItemByTitle(wrapper, 'c'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a', 'b', 'c'], [])
    await nextTick()

    clickElement(getTransferItemByTitle(wrapper, 'c'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a', 'b'], [])
    await nextTick()

    clickElement(getTransferItemByTitle(wrapper, 'd'), { shiftKey: true })
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a', 'b', 'd'], [])
  })

  it('should not check checkbox when component disabled', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        disabled: true,
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'a'))

    expect(handleSelectChange).not.toHaveBeenCalled()
  })

  it('should not check checkbox when click on disabled item', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'c'))

    expect(handleSelectChange).not.toHaveBeenCalled()
  })

  it('should check all item when click on check all', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onSelectChange: handleSelectChange,
      },
    })

    const headers = wrapper.element.querySelectorAll('.ant-transfer-list-header')
    const input = headers[1]?.querySelector('input[type="checkbox"]') as HTMLInputElement | null
    if (input) {
      input.checked = true
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    expect(handleSelectChange).toHaveBeenCalledWith(['a'], ['b'])
  })

  it('should uncheck all item when click on uncheck all', () => {
    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onSelectChange: handleSelectChange,
      },
    })

    const headers = wrapper.element.querySelectorAll('.ant-transfer-list-header')
    const input = headers[0]?.querySelector('input[type="checkbox"]') as HTMLInputElement | null
    if (input) {
      input.checked = false
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    expect(handleSelectChange).toHaveBeenCalledWith([], [])
  })

  it('should call `filterOption` when use input in search box', async () => {
    const filterOption: TransferProps<any>['filterOption'] = (inputValue, option) =>
      inputValue === option.title

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        showSearch: true,
        filterOption,
        render: item => item.title,
      },
    })

    const sections = wrapper.element.querySelectorAll('.ant-transfer-section')
    const input = sections[0]?.querySelector('input[type="text"]') as HTMLInputElement
    await setInputValue(input, 'a')

    expect(
      sections[0]?.querySelectorAll('.ant-transfer-list-content input[type="checkbox"]'),
    ).toHaveLength(1)
  })

  it('should display the correct count of items when filter by input', async () => {
    const filterOption: TransferProps<any>['filterOption'] = (inputValue, option) =>
      option.description.includes(inputValue)

    const wrapper = mount(Transfer, {
      props: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: item => item.title,
      },
    })

    const sections = wrapper.element.querySelectorAll('.ant-transfer-section')
    const input = sections[0]?.querySelector('input[type="text"]') as HTMLInputElement
    await setInputValue(input, 'content2')

    expect(wrapper.text()).toContain('1 item')
  })

  it('should display the correct locale', () => {
    const emptyProps = { dataSource: [], selectedKeys: [], targetKeys: [] }
    const locale = { itemUnit: 'Person', notFoundContent: 'Nothing', searchPlaceholder: 'Search' }

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        ...emptyProps,
        showSearch: true,
        locale,
      },
    })

    const selectedLabels = wrapper.element.querySelectorAll('.ant-transfer-list-header-selected')
    expect(selectedLabels).toHaveLength(2)
    expect(selectedLabels[0]?.textContent).toContain('0 Person')
    expect(selectedLabels[1]?.textContent).toContain('0 Person')

    const inputs = wrapper.element.querySelectorAll('input[placeholder="Search"]')
    expect(inputs).toHaveLength(2)

    const notFound = Array.from(wrapper.element.querySelectorAll('.ant-transfer-list-body-not-found') as HTMLElement[])
      .filter(node => node.textContent?.includes('Nothing'))
    expect(notFound).toHaveLength(2)
  })

  it('should display the correct locale and ignore old API', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const emptyProps = { dataSource: [], selectedKeys: [], targetKeys: [] }
    const locale = { notFoundContent: 'old1', searchPlaceholder: 'old2' }
    const newLocaleProp = { notFoundContent: 'new1', searchPlaceholder: 'new2' }

    const wrapper = mount(
      {
        render: () => (
          <Transfer
            {...listCommonProps}
            {...emptyProps}
            {...(locale as any)}
            locale={newLocaleProp}
            showSearch
          />
        ),
      },
    )

    const inputs = wrapper.element.querySelectorAll('input[placeholder="new2"]')
    expect(inputs).toHaveLength(2)

    const notFound = Array.from(wrapper.element.querySelectorAll('.ant-transfer-list-body-not-found') as HTMLElement[])
      .filter(node => node.textContent?.includes('new1'))
    expect(notFound).toHaveLength(2)

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      'Warning: [antd: Transfer] `notFoundContent` and `searchPlaceholder` will be removed, please use `locale` instead.',
    )

    consoleErrorSpy.mockRestore()
  })

  it('should display the correct items unit', () => {
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        locale: {
          itemsUnit: 'People',
        },
      },
    })

    expect(wrapper.text()).toContain('1/2 People')
  })

  it('should display the correct notFoundContent', () => {
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [],
        locale: {
          notFoundContent: ['No Source', 'No Target'],
        },
      },
    })

    expect(wrapper.text()).toContain('No Source')
    expect(wrapper.text()).toContain('No Target')
  })

  it('should just check the filtered item when click on check all after search by input', async () => {
    const filterOption: TransferProps<any>['filterOption'] = (inputValue, option) =>
      option.description.includes(inputValue)

    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: item => item.title,
        onSelectChange: handleSelectChange,
      },
    })

    const sections = wrapper.element.querySelectorAll('.ant-transfer-section')
    const input = sections[0]?.querySelector('input[type="text"]') as HTMLInputElement
    await setInputValue(input, 'content2')

    clickElement(getTransferItemByTitle(wrapper, 'content2'))

    expect(handleSelectChange).toHaveBeenCalledWith(['1'], [])
  })

  it('should transfer just the filtered item after search by input', async () => {
    const filterOption: TransferProps<any>['filterOption'] = (inputValue, option) =>
      option.description.includes(inputValue)

    const handleChange = vi.fn()

    const TransferDemo = defineComponent(() => {
      const selectedKeys = ref<Array<string | number>>(searchTransferProps.selectedKeys)

      const handleSelectChange: TransferEmits['selectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
      ) => {
        selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys]
      }

      return () => (
        <Transfer
          {...searchTransferProps}
          showSearch
          filterOption={filterOption}
          render={item => item.title}
          onSelectChange={handleSelectChange}
          onChange={handleChange}
          selectedKeys={selectedKeys.value as string[]}
        />
      )
    })

    const wrapper = mount(TransferDemo)

    const leftSearch = wrapper.element.querySelector('.ant-transfer-list-search input') as HTMLInputElement
    await setInputValue(leftSearch, 'content2')

    clickElement(getTransferItemByTitle(wrapper, 'content2'))
    await nextTick()
    clickElement(wrapper.element.querySelector('.ant-transfer-actions button'))

    expect(handleChange).toHaveBeenCalledWith(['1', '3', '4'], 'right', ['1'])
  })

  it('should check correctly when there is a search text', async () => {
    const newProps = { ...listCommonProps }
    delete newProps.targetKeys
    delete newProps.selectedKeys

    const handleSelectChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...newProps,
        showSearch: true,
        onSelectChange: handleSelectChange,
        render: item => item.title,
      },
    })

    clickElement(getTransferItemByTitle(wrapper, 'b'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], [])

    const sections = wrapper.element.querySelectorAll('.ant-transfer-section')
    const input = sections[0]?.querySelector('input[type="text"]') as HTMLInputElement
    await setInputValue(input, 'a')

    clickElement(getTransferItemByTitle(wrapper, 'a'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b', 'a'], [])
    await nextTick()

    clickElement(getTransferItemByTitle(wrapper, 'a'))
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], [])
  })

  it('should show sorted targetKey', () => {
    const sortedTargetKeyProps = {
      dataSource: [
        { key: 'a', title: 'a' },
        { key: 'b', title: 'b' },
        { key: 'c', title: 'c' },
      ],
      targetKeys: ['c', 'b'],
      lazy: false,
    }

    const wrapper = mount(
      {
        render: () => <Transfer {...(sortedTargetKeyProps as any)} render={item => item.title} />,
      },
    )

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should apply custom styles when their props are provided', () => {
    const style = { padding: '10px' }
    const leftStyle = { padding: '20px' }
    const rightStyle = { padding: '30px' }
    const operationStyle = { padding: '40px' }

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        listStyle: ({ direction }) => (direction === 'left' ? leftStyle : rightStyle),
        operationStyle,
      },
      attrs: {
        style,
      },
    })

    const root = wrapper.find('.ant-transfer').element as HTMLElement
    const sections = wrapper.element.querySelectorAll('.ant-transfer-section') as HTMLElement[]
    const operation = wrapper.element.querySelector('.ant-transfer-actions') as HTMLElement[]

    expect(root).toHaveStyle({ padding: '10px' })
    expect(sections[0]).toHaveStyle({ padding: '20px' })
    expect(sections[1]).toHaveStyle({ padding: '30px' })
    expect(operation).toHaveStyle({ padding: '40px' })
  })

  it('should apply custom classes and styles to Transfer', () => {
    const customClasses = {
      root: 'custom-transfer-root',
      section: 'custom-transfer-section',
      header: 'custom-transfer-header',
      actions: 'custom-transfer-actions',
    }

    const customStyles = {
      root: { color: 'rgb(255, 0, 0)' },
      section: { color: 'rgb(0, 0, 255)' },
      header: { color: 'rgb(255, 255, 0)' },
      actions: { color: 'rgb(0, 128, 0)' },
    }

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        classes: customClasses,
        styles: customStyles,
        render: item => item.title,
      },
    })

    const rootElement = wrapper.find('.ant-transfer').element as HTMLElement
    const sectionElements = wrapper.element.querySelectorAll('.ant-transfer-section') as HTMLElement[]
    const headerElements = wrapper.element.querySelectorAll('.ant-transfer-list-header') as HTMLElement[]
    const actionsElement = wrapper.element.querySelector('.ant-transfer-actions') as HTMLElement[]

    expect(rootElement).toHaveClass(customClasses.root)
    expect(sectionElements[0]).toHaveClass(customClasses.section)
    expect(sectionElements[1]).toHaveClass(customClasses.section)
    expect(headerElements[0]).toHaveClass(customClasses.header)
    expect(headerElements[1]).toHaveClass(customClasses.header)
    expect(actionsElement).toHaveClass(customClasses.actions)

    expect(rootElement).toHaveStyle({ color: customStyles.root.color })
    expect(sectionElements[0]).toHaveStyle({ color: customStyles.section.color })
    expect(sectionElements[1]).toHaveStyle({ color: customStyles.section.color })
    expect(headerElements[0]).toHaveStyle({ color: customStyles.header.color })
    expect(headerElements[1]).toHaveStyle({ color: customStyles.header.color })
    expect(actionsElement).toHaveStyle({ color: customStyles.actions.color })
  })

  it('should support classes and styles as functions', async () => {
    const classesFn: TransferProps['classes'] = (info) => {
      if (info.props.disabled) {
        return { root: 'disabled-transfer' }
      }
      return { root: 'enabled-transfer' }
    }

    const stylesFn: TransferProps['styles'] = (info) => {
      if (info.props.showSearch) {
        return { root: { padding: '10px' } }
      }
      return { root: { margin: '10px' } }
    }

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        disabled: true,
        classes: classesFn,
        styles: stylesFn,
        render: item => item.title,
      },
    })

    const rootElement = wrapper.find('.ant-transfer').element as HTMLElement
    expect(rootElement).toHaveClass('disabled-transfer')
    expect(rootElement).toHaveStyle({ margin: '10px' })

    await wrapper.setProps({
      disabled: false,
      showSearch: true,
    })

    expect(rootElement).toHaveClass('enabled-transfer')
    expect(rootElement).toHaveStyle({ padding: '10px' })
  })

  it('should support onScroll', () => {
    const onScroll = vi.fn()

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onScroll,
      },
    })

    const lists = wrapper.element.querySelectorAll('.ant-transfer-list-content')

    lists[0]?.dispatchEvent(new Event('scroll', { bubbles: true }))
    expect(onScroll).toHaveBeenLastCalledWith('left', expect.anything())

    lists[1]?.dispatchEvent(new Event('scroll', { bubbles: true }))
    expect(onScroll).toHaveBeenLastCalledWith('right', expect.anything())
  })

  it('support rowKey', () => {
    const onSelectChange = vi.fn()

    const Demo = defineComponent(() => {
      const selectedKeys = ref<Array<string | number>>([])

      return () => (
        <Transfer
          {...listCommonProps}
          selectedKeys={selectedKeys.value as string[]}
          rowKey={record => `key_${record.key}`}
          onSelectChange={(sourceSelectedKeys: Array<string | number>) => {
            onSelectChange(sourceSelectedKeys)
            selectedKeys.value = [...sourceSelectedKeys]
          }}
        />
      )
    })

    const wrapper = mount(Demo)

    clickElement(wrapper.element.querySelector('.ant-transfer-list-content input'))

    expect(onSelectChange).toHaveBeenCalledWith(['key_a'])
    expect(
      (wrapper.element.querySelector('.ant-transfer-list-content input') as HTMLInputElement).checked,
    ).toBeTruthy()
  })

  it('should support render value and label in item', () => {
    const wrapper = mount(Transfer, {
      props: {
        dataSource: [{ key: 'a', title: 'title' }],
        render: record => ({
          value: `${record.title} value`,
          label: 'label',
        }),
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render correct checkbox label when checkboxLabel is defined', () => {
    const selectAllLabels = ['Checkbox Label']

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        selectAllLabels,
      },
    })

    expect(wrapper.text()).toContain('Checkbox Label')
  })

  it('should render correct checkbox label when checkboxLabel is a function', () => {
    const selectAllLabels: SelectAllLabel[] = [
      ({ selectedCount, totalCount }: { selectedCount: number, totalCount: number }) => (
        <span>
          {selectedCount}
          {' '}
          of
          {' '}
          {totalCount}
        </span>
      ),
    ]

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        selectAllLabels,
      },
    })

    expect(wrapper.text()).toContain('1 of 2')
  })

  it('should disable transfer operation button when some items are set to selected but also disabled', () => {
    const dataSource = listDisabledProps.dataSource.map(item => ({
      ...item,
      disabled: true,
    }))

    const wrapper = mount(Transfer, {
      props: {
        ...listDisabledProps,
        dataSource,
      },
    })

    expect(
      wrapper.element.querySelectorAll('.ant-transfer-actions button').item(0),
    ).toBeDisabled()
  })

  describe('pagination', () => {
    it('boolean', async () => {
      const wrapper = mount(Transfer, {
        props: {
          ...listDisabledProps,
          pagination: true,
        },
      })

      await nextTick()
      expect(wrapper.element.querySelector('[title="1/1"]')).toBeTruthy()
    })

    it('object', async () => {
      const wrapper = mount(Transfer, {
        props: {
          ...listDisabledProps,
          pagination: { pageSize: 1 },
        },
      })

      expect(
        wrapper.element
          .querySelectorAll('.ant-transfer-section')
          .item(0)
          ?.querySelectorAll('.ant-transfer-list-content-item'),
      ).toHaveLength(1)

      await nextTick()
      expect(wrapper.element.querySelector('[title="1/2"]')).toBeTruthy()
    })

    it('not exceed max size', async () => {
      const wrapper = mount(Transfer, {
        props: {
          ...listDisabledProps,
          pagination: { pageSize: 1 },
        },
      })

      clickElement(wrapper.element.querySelector('.ant-pagination-next .ant-pagination-item-link'))
      await nextTick()
      expect(wrapper.element.querySelector('[title="2/2"]')).toBeTruthy()

      await wrapper.setProps({
        targetKeys: ['b', 'c'],
      })
      await nextTick()

      expect(wrapper.element.querySelectorAll('[title="1/1"]')).toHaveLength(2)
    })

    it('should support change pageSize', async () => {
      const dataSource = generateData()

      const wrapper = mount(Transfer, {
        props: {
          dataSource,
          pagination: { showSizeChanger: true, simple: false },
        },
      })

      expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item').length).toBe(10)

      await wrapper.setProps({
        pagination: { showSizeChanger: true, simple: false, pageSize: 20 },
      })

      expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item').length).toBe(20)
    })

    it('should be used first when pagination has pageSize', async () => {
      const dataSource = generateData(30)

      const wrapper = mount(Transfer, {
        attachTo: document.body,
        props: {
          dataSource,
          pagination: { showSizeChanger: true, simple: false, pageSize: 20 },
        },
      })

      clickElement(wrapper.element.querySelector('.ant-select'))
      await nextTick()
      clickElement(document.querySelectorAll('.ant-select-item-option')[2])
      await nextTick()

      expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item').length).toBe(20)
    })
  })

  it('remove by click icon', () => {
    const onChange = vi.fn()
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        onChange,
        oneWay: true,
      },
    })

    clickElement(wrapper.element.querySelectorAll('.ant-transfer-list-content-item-remove')[0])

    expect(onChange).toHaveBeenCalledWith([], 'left', ['b'])
  })

  it('control mode select all should not throw warning', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const App = defineComponent(() => {
      const selectedKeys = ref<TransferProps['selectedKeys']>([])

      const onSelectChange: TransferEmits['selectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
      ) => {
        selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys]
      }

      return () => (
        <Transfer
          dataSource={[{ key: 'a', title: 'a' }]}
          selectedKeys={selectedKeys.value}
          onSelectChange={onSelectChange}
        />
      )
    })

    const wrapper = mount(App)

    clickElement(wrapper.element.querySelector('.ant-transfer-list-header input[type="checkbox"]'))

    expect(errSpy).not.toHaveBeenCalled()

    errSpy.mockRestore()
  })

  it('it checks correctly after changing the dataSource', async () => {
    vi.useFakeTimers()

    const mockData = Array.from({ length: 10 }).map((_, i) => ({
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
    }))

    const initialTargetKeys = mockData
      .filter(item => Number(item.key) > 4)
      .map(item => item.key)

    const defaultCheckedKeys = ['1', '2']
    const handleSelectChange = vi.fn()

    const App = defineComponent(() => {
      const targetKeys = ref<TransferProps['targetKeys']>(initialTargetKeys)
      const selectedKeys = ref<TransferProps['targetKeys']>([])
      const dataSource = ref(mockData)

      const onChange: TransferEmits['change'] = (nextTargetKeys) => {
        targetKeys.value = nextTargetKeys
      }

      return () => (
        <>
          <Button
            class="update-btn"
            onClick={() => {
              selectedKeys.value = defaultCheckedKeys
              dataSource.value = []
              dataSource.value = [...mockData]
            }}
          >
            update
          </Button>
          <Transfer
            dataSource={dataSource.value}
            titles={['Source', 'Target']}
            targetKeys={targetKeys.value}
            selectedKeys={selectedKeys.value}
            onChange={onChange}
            onSelectChange={handleSelectChange}
            render={item => item.title}
          />
        </>
      )
    })

    const wrapper = mount(App)

    clickElement(wrapper.element.querySelector('.update-btn'))
    await waitFakeTimer()

    const items = wrapper.element.querySelectorAll('.ant-transfer-list-content-item')
    defaultCheckedKeys.forEach((itemKey) => {
      expect(
        items.item(Number(itemKey))?.querySelector('input[type="checkbox"]'),
      ).toBeChecked()
    })

    vi.useRealTimers()
  })

  it('showSearch with single object', () => {
    const emptyProps = { dataSource: [], selectedKeys: [], targetKeys: [] }
    const locale = { itemUnit: 'Person', notFoundContent: 'Nothing' }

    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        ...emptyProps,
        showSearch: { placeholder: 'Search placeholder', defaultValue: 'values' },
        locale,
      },
    })

    const searchInputs = wrapper.element.querySelectorAll('.ant-transfer-list-search input')
    expect(searchInputs).toHaveLength(2)

    searchInputs.forEach((input: HTMLInputElement) => {
      expect(input.getAttribute('placeholder')).toBe('Search placeholder')
      expect(input.value).toBe('values')
    })
  })

  it('should be no class name for the selected state, when transfer is disabled', () => {
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        disabled: true,
      },
    })

    expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item-checked')).toHaveLength(0)
  })

  describe('form disabled', () => {
    it('should support Form disabled', () => {
      const wrapper = mount({
        render: () => (
          <Form disabled>
            <FormItem name="transfer1" label="禁用">
              <Transfer {...listCommonProps} />
            </FormItem>
          </Form>
        ),
      })

      expect(wrapper.element.querySelector('.ant-transfer.ant-transfer-disabled')).toBeTruthy()
    })

    it('set Transfer enabled when ConfigProvider componentDisabled is false', () => {
      const wrapper = mount({
        render: () => (
          <Form disabled>
            <ConfigProvider componentDisabled={false}>
              <FormItem name="transfer1" label="启用">
                <Transfer {...listCommonProps} />
              </FormItem>
            </ConfigProvider>
            <FormItem name="transfer2" label="禁用">
              <Transfer {...listCommonProps} />
            </FormItem>
          </Form>
        ),
      })

      const transfers = wrapper.element.querySelectorAll('.ant-transfer')
      expect(transfers[0]).not.toHaveClass('ant-transfer-disabled')
      expect(transfers[1]).toHaveClass('ant-transfer-disabled')
    })

    it('prioritize using the disabled property of the Transfer component', async () => {
      const componentDisabled = ref(true)
      const transferDisabled = ref(true)

      const App = defineComponent(() => {
        const mockData = Array.from({ length: 20 }).map((_, i) => ({
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          disabled: i <= 5,
        }))

        const initialTargetKeys = mockData
          .filter(item => Number(item.key) > 10)
          .map(item => item.key)

        const targetKeys = ref<TransferProps['targetKeys']>(initialTargetKeys)
        const selectedKeys = ref<TransferProps['targetKeys']>([])

        return () => (
          <>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              disabled={componentDisabled.value}
              style={{ maxWidth: '600px' }}
            >
              <FormItem label="Transfer">
                <Transfer
                  dataSource={mockData}
                  titles={['Source', 'Target']}
                  targetKeys={targetKeys.value}
                  selectedKeys={selectedKeys.value}
                  disabled={transferDisabled.value}
                  render={item => item.title}
                />
              </FormItem>
            </Form>
          </>
        )
      })

      const wrapper = mount(App)
      const transfer = wrapper.element.querySelector('.ant-transfer')
      expect(transfer).toHaveClass('ant-transfer-disabled')

      transferDisabled.value = false
      await nextTick()
      expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item-disabled')).toHaveLength(6)

      componentDisabled.value = false
      await nextTick()
      expect(wrapper.element.querySelectorAll('.ant-transfer-list-content-item-disabled')).toHaveLength(6)

      transferDisabled.value = true
      await nextTick()
      expect(transfer).toHaveClass('ant-transfer-disabled')
    })
  })
})

describe('transfer immutable data', () => {
  it('dataSource is frozen', () => {
    const mockData = [Object.freeze({ id: '0', title: 'title', description: 'description' })]

    const wrapper = mount(Transfer, {
      props: {
        rowKey: item => item.id,
        dataSource: mockData,
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('prevent error when reset data in some cases', async () => {
    const App = defineComponent(() => {
      const mockData = ref<any[]>([])
      const targetKeys = ref<TransferProps['targetKeys']>([])

      const getMock = () => {
        const tempTargetKeys: Array<string | number> = []
        const tempMockData: any[] = []

        for (let i = 0; i < 2; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: i % 2 === 0,
          }

          if (data.chosen) {
            tempTargetKeys.push(data.key)
          }

          tempMockData.push(data)
        }

        mockData.value = tempMockData
        targetKeys.value = tempTargetKeys
      }

      onMounted(() => {
        getMock()
      })

      const handleChange: TransferEmits['change'] = (newTargetKeys) => {
        targetKeys.value = newTargetKeys
      }

      return () => (
        <Transfer
          dataSource={mockData.value}
          targetKeys={targetKeys.value}
          onChange={handleChange}
          render={item => `test-${item}`}
          footer={() => <ButtonRender onClick={getMock} />}
        />
      )
    })

    const wrapper = mount(App)
    await nextTick()

    const leftInput = wrapper.element
      .querySelectorAll('.ant-transfer-section')[0]
      ?.querySelector('.ant-transfer-list-content-item input[type="checkbox"]')
    clickElement(leftInput)
    await nextTick()
    clickElement(wrapper.element.querySelector('.ant-transfer-actions .ant-btn'))
    await nextTick()

    expect(wrapper.element.querySelectorAll('.ant-transfer-section')[1]).toBeTruthy()
    expect(
      wrapper.element
        .querySelectorAll('.ant-transfer-section')[1]
        ?.querySelectorAll('.ant-transfer-list-content-item')
        .length,
    ).toBe(2)

    const rightSectionItems = wrapper.element
      .querySelectorAll('.ant-transfer-section')[1]
      ?.querySelectorAll('.ant-transfer-list-content-item')
    clickElement(rightSectionItems?.[0] as Element | undefined)
    clickElement(rightSectionItems?.[1] as Element | undefined)
    await nextTick()

    expect(wrapper.element.querySelectorAll('.ant-transfer-list-header-selected')[1]).toContainHTML('2/2')

    clickElement(wrapper.element.querySelector('.ant-transfer-list-footer .ant-btn'))
    await nextTick()

    expect(wrapper.element.querySelectorAll('.ant-transfer-list-header-selected')[1]).toContainHTML('1/1')
  })
})

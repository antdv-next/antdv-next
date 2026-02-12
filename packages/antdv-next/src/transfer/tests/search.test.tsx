import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Transfer from '..'
import Search from '../search'
import { mount } from '/@tests/utils'

describe('transfer.Search', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  const dataSource = [
    { key: 'a', title: 'a', description: 'a' },
    { key: 'b', title: 'b', description: 'b' },
    { key: 'c', title: 'c', description: 'c' },
  ]

  const setInputValue = async (input: HTMLInputElement, value: string) => {
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
  }

  afterEach(() => {
    errorSpy.mockReset()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    errorSpy.mockRestore()
  })

  it('should show cross icon when input value exists', async () => {
    const wrapper = mount(Search, {
      props: {
        value: '',
      },
    })

    expect(wrapper.element).toMatchSnapshot()

    await wrapper.setProps({ value: 'a' })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('onSearch', async () => {
    const onSearch = vi.fn()

    const wrapper = mount(Transfer, {
      attachTo: document.body,
      props: {
        dataSource,
        selectedKeys: [],
        targetKeys: [],
        render: item => item.title,
        onSearch,
        showSearch: true,
      },
    })

    const inputs = wrapper.findAll('.ant-input')
    expect(inputs.length).toBeGreaterThan(0)

    await setInputValue(inputs[0]!.element as HTMLInputElement, 'a')

    expect(onSearch).toHaveBeenCalledWith('left', 'a')

    onSearch.mockReset()

    const clearIcons = document.querySelectorAll('.ant-input-clear-icon')
    clearIcons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(onSearch).toHaveBeenCalledWith('left', '')

    wrapper.unmount()
  })

  it('legacy props#onSearchChange does not work anymore', async () => {
    const onSearchChange = vi.fn()

    const wrapper = mount(Transfer, {
      props: {
        showSearch: true,
        render: (item: { title: string }) => item.title,
        dataSource,

        ...({ onSearchChange } as any),
      },
    })

    const input = wrapper.find('input.ant-input')
    await setInputValue(input.element as HTMLInputElement, 'a')

    expect(errorSpy).not.toHaveBeenCalled()
    expect(onSearchChange).not.toHaveBeenCalled()
  })

  it('typing space should trigger filterOption', async () => {
    const filterOption = vi.fn(() => true)

    const wrapper = mount(Transfer, {
      props: {
        filterOption,
        dataSource,
        showSearch: true,
      },
    })

    const input = wrapper.find('input.ant-input')
    await setInputValue(input.element as HTMLInputElement, ' ')

    expect(filterOption).toHaveBeenCalledTimes(dataSource.length)
  })

  it('the filterOption parameter is correct when use input in search box', async () => {
    const filterOption = vi.fn(() => true)

    const wrapper = mount(Transfer, {
      props: {
        filterOption,
        dataSource,
        targetKeys: ['b'],
        showSearch: true,
      },
    })

    const sections = wrapper.findAll('.ant-transfer-section')
    const leftInput = sections[0]?.find('input.ant-input')
    const rightInput = sections[1]?.find('input.ant-input')

    await setInputValue(leftInput!.element as HTMLInputElement, 'a')

    expect(filterOption).toHaveBeenNthCalledWith(
      1,
      'a',
      { key: 'a', title: 'a', description: 'a' },
      'left',
    )
    expect(filterOption).toHaveBeenLastCalledWith(
      'a',
      { key: 'c', title: 'c', description: 'c' },
      'left',
    )

    filterOption.mockReset()

    await setInputValue(rightInput!.element as HTMLInputElement, 'b')

    expect(filterOption).toHaveBeenCalledWith(
      'b',
      { key: 'b', title: 'b', description: 'b' },
      'right',
    )
  })
})

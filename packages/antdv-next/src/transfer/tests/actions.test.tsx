import { describe, expect, it, vi } from 'vitest'
import Transfer from '..'
import Button from '../../button'
import { mount } from '/@tests/utils'

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

describe('transfer.Actions', () => {
  it('should handle custom button click correctly via actions', async () => {
    const handleChange = vi.fn()
    const customButtonClick = vi.fn()

    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          oneWay
          onChange={handleChange}
          actions={[
            <Button key="custom" type="link" onClick={customButtonClick}>
              Custom Button
            </Button>,
          ]}
        />
      ),
    })

    const customButton = Array.from(wrapper.element.querySelectorAll('button') as HTMLButtonElement[])
      .find(button => button.textContent?.includes('Custom Button'))
    expect(customButton).toBeTruthy()

    customButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(customButtonClick).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalled()
  })

  it('should accept multiple actions >= 3', () => {
    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          actions={[
            <Button key="test">test</Button>,
            <Button key="test2">test2</Button>,
            <Button key="test3">test3</Button>,
          ]}
        />
      ),
    })

    expect(wrapper.text()).toContain('test')
    expect(wrapper.text()).toContain('test2')
    expect(wrapper.text()).toContain('test3')
  })

  it('should accept multiple actions >= 2 when it is oneWay', () => {
    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          oneWay
          actions={[
            <Button key="test">test</Button>,
            <Button key="test2">test2</Button>,
          ]}
        />
      ),
    })

    expect(wrapper.text()).toContain('test')
    expect(wrapper.text()).toContain('test2')
  })

  it('should accept operations for compatibility', () => {
    const wrapper = mount(Transfer, {
      props: {
        ...listCommonProps,
        operations: ['to right', 'to left'],
      },
    })

    expect(wrapper.text()).toContain('to right')
    expect(wrapper.text()).toContain('to left')
  })
})

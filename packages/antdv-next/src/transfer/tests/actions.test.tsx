import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import Transfer from '..'
import Button from '../../button'
import { mount } from '/@tests/utils'

const CustomLink = defineComponent<
  { disabled?: boolean },
  { click: (event: MouseEvent) => void }
>(
  (props, { emit }) => {
    return () => (
      <a
        href="#target"
        aria-disabled={props.disabled ? 'true' : undefined}
        onClick={event => emit('click', event)}
      >
        Custom Link
      </a>
    )
  },
  {
    name: 'CustomLink',
    props: ['disabled'] as any,
    emits: ['click'],
  },
)

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

  it('should preserve disabled state of custom actions', () => {
    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          oneWay
          actions={[<CustomLink key="test" disabled />]}
        />
      ),
    })

    const link = Array.from(wrapper.element.querySelectorAll('a') as unknown as HTMLAnchorElement[])
      .find(a => a.textContent?.includes('Custom Link'))
    expect(link).toBeTruthy()
    expect(link?.getAttribute('aria-disabled')).toBe('true')
  })

  it('should prevent default behavior of disabled custom actions', () => {
    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          oneWay
          actions={[<CustomLink key="test" disabled />]}
        />
      ),
    })

    const link = Array.from(wrapper.element.querySelectorAll('a') as unknown as HTMLAnchorElement[])
      .find(a => a.textContent?.includes('Custom Link'))!
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should prevent click handlers of disabled custom actions', () => {
    const handleChange = vi.fn()
    const customActionClick = vi.fn()

    const wrapper = mount({
      render: () => (
        <Transfer
          {...listCommonProps}
          onChange={handleChange}
          oneWay
          actions={[<CustomLink key="test" disabled onClick={customActionClick} />]}
        />
      ),
    })

    const link = Array.from(wrapper.element.querySelectorAll('a') as unknown as HTMLAnchorElement[])
      .find(a => a.textContent?.includes('Custom Link'))!
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(customActionClick).not.toHaveBeenCalled()
    expect(handleChange).not.toHaveBeenCalled()
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

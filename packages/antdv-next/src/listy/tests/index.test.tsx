import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import Listy from '..'
import ConfigProvider from '../../config-provider'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

interface DataItem {
  id: number
  title: string
}

const items: DataItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  title: `Item ${index}`,
}))

function renderListy(props = {}) {
  return (
    <Listy
      height={200}
      items={items}
      rowKey={item => item.id}
      itemRender={item => item.title}
      {...props}
    />
  )
}

describe('Listy', () => {
  mount(() => renderListy())
  rtlTest(() => renderListy())

  it('renders the root element', () => {
    const wrapper = mount(() => renderListy())
    expect(wrapper.find('.ant-listy').exists()).toBe(true)
  })

  it('exposes scrollTo via ref', () => {
    const listyRef = ref() as any
    mount(() => (
      <Listy
        ref={listyRef}
        height={200}
        items={items}
        rowKey="id"
        itemRender={(item: DataItem) => item.title}
      />
    ))

    expect(typeof listyRef.value.scrollTo).toBe('function')
    expect(() => listyRef.value.scrollTo({ key: 5, align: 'top' } as any)).not.toThrow()
  })

  it('disables virtual scrolling when ConfigProvider virtual is false', () => {
    const wrapper = mount(() => (
      <ConfigProvider virtual={false}>
        {renderListy()}
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-listy-holder').exists()).toBe(false)
    expect(wrapper.findAll('.ant-listy-item').length).toBe(items.length)
  })

  it('lets component virtual override ConfigProvider virtual', () => {
    const wrapper = mount(() => (
      <ConfigProvider virtual={false}>
        {renderListy({ virtual: true })}
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-listy-holder').exists()).toBe(true)
  })

  it('applies semantic classes and styles', () => {
    const wrapper = mount(() =>
      renderListy({
        classes: { root: 'custom-root', item: 'custom-item' },
        styles: { root: { background: 'rgb(255, 0, 0)' } },
      }),
    )
    const root = wrapper.find('.ant-listy')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('background: rgb(255, 0, 0)')
    expect(wrapper.find('.custom-item').exists()).toBe(true)
  })

  it('wraps each itemRender result in a single item element', () => {
    const wrapper = mount(() =>
      renderListy({
        itemRender: (item: DataItem) => <span class="custom-content">{item.title}</span>,
      }),
    )
    const renderedItems = wrapper.findAll('.ant-listy-item')
    expect(renderedItems.length).toBe(items.length)
    renderedItems.forEach((item) => {
      expect(item.element.children.length).toBe(1)
      const child = item.element.firstElementChild!
      expect(child.classList.contains('custom-content')).toBe(true)
      expect(child.parentElement).toBe(item.element)
    })
  })
})

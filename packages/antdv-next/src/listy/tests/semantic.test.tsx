import type { ListyProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Listy from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

interface User {
  id: number
  name: string
  group: string
}

const users: User[] = [
  { id: 0, name: 'Olivia', group: 'Design' },
  { id: 1, name: 'Liam', group: 'Design' },
  { id: 2, name: 'Emma', group: 'Engineering' },
  { id: 3, name: 'Noah', group: 'Engineering' },
]

function renderListy(props = {}) {
  return (
    <Listy
      height={200}
      items={users}
      rowKey="id"
      group={{ key: user => user.group, title: group => group }}
      itemRender={user => user.name}
      {...props}
    />
  )
}

describe('Listy.Semantic', () => {
  it('should apply classes and styles to each semantic node', () => {
    const wrapper = mount(() =>
      renderListy({
        classes: { root: 'custom-root', item: 'custom-item', groupHeader: 'custom-header' },
        styles: {
          root: { backgroundColor: 'rgb(255, 0, 0)' },
          item: { color: 'rgb(0, 128, 0)' },
          groupHeader: { color: 'rgb(0, 0, 255)' },
        },
      }),
    )

    const root = wrapper.find('.ant-listy').element as HTMLElement
    expect(root.classList.contains('custom-root')).toBe(true)
    expect(root.style.backgroundColor).toBe('rgb(255, 0, 0)')

    const items = wrapper.findAll('.ant-listy-item')
    expect(items.length).toBeGreaterThan(0)
    items.forEach((item) => {
      expect(item.classes()).toContain('custom-item')
      expect(item.attributes('style')).toContain('color: rgb(0, 128, 0)')
    })

    const header = wrapper.find('.ant-listy-group-header')
    expect(header.classes()).toContain('custom-header')
    expect(header.attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  it('should merge ConfigProvider listy config with component props', () => {
    const wrapper = mount(() => (
      <ConfigProvider
        listy={{
          class: 'context-root',
          classes: { item: 'context-item' },
          styles: { item: { padding: '2px', color: 'rgb(1, 2, 3)' } },
        }}
      >
        {renderListy({
          classes: { item: 'own-item' },
          styles: { item: { color: 'rgb(4, 5, 6)' } },
        })}
      </ConfigProvider>
    ))

    expect(wrapper.find('.ant-listy').classes()).toContain('context-root')

    const item = wrapper.find('.ant-listy-item')
    expect(item.classes()).toContain('context-item')
    expect(item.classes()).toContain('own-item')
    expect(item.attributes('style')).toContain('color: rgb(4, 5, 6)')
    expect(item.attributes('style')).toContain('padding: 2px')
  })

  it('should support function form classes and styles', () => {
    const classesFn1 = vi.fn((info: { props: ListyProps }) => {
      if (info.props.sticky) {
        return { item: 'context-sticky' }
      }
      return { item: 'context-fn' }
    })
    const classesFn2 = vi.fn((info: { props: ListyProps }) => {
      if (info.props.height === 200) {
        return { item: 'own-fn' }
      }
      return { item: 'own-other' }
    })
    const stylesFn = vi.fn(() => {
      return { item: { color: 'rgb(7, 8, 9)' } }
    })
    const wrapper = mount(() => (
      <ConfigProvider
        listy={{
          classes: classesFn1,
        }}
      >
        <Listy
          height={200}
          items={users}
          rowKey={(item: User) => item.id}
          itemRender={(user: User) => user.name}
          classes={classesFn2}
          styles={stylesFn}
        />
      </ConfigProvider>
    ))

    const item = wrapper.find('.ant-listy-item')
    expect(item.classes()).toContain('context-fn')
    expect(item.classes()).toContain('own-fn')
    expect(item.attributes('style')).toContain('color: rgb(7, 8, 9)')
  })

  it('should follow root style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider
        listy={{
          styles: semanticRootStylePriority.contextStyles,
          style: semanticRootStylePriority.contextStyle,
        }}
      >
        {renderListy({
          styles: semanticRootStylePriority.styles,
          style: semanticRootStylePriority.style,
        })}
      </ConfigProvider>
    ))
    expectSemanticRootStylePriority(wrapper.find('.ant-listy').element)
  })

  it('should pass ConfigProvider direction down to vc-listy', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        {renderListy()}
      </ConfigProvider>
    ))

    const root = wrapper.find('.ant-listy')
    expect(root.classes()).toContain('ant-listy-rtl')
    expect(root.attributes('dir')).toBe('rtl')
  })
})

import type { Tab, TabsProps } from '..'
import { afterEach, describe, expect, it } from 'vitest'
import Tabs from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const defaultItems: Tab[] = [
  { key: '1', label: 'Tab 1', content: 'Content 1' },
  { key: '2', label: 'Tab 2', content: 'Content 2' },
  { key: '3', label: 'Tab 3', content: 'Content 3' },
]

describe('tabs.semantic', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ========================= Object classes & styles =========================
  describe('object classes and styles', () => {
    it('supports classes and styles as objects', () => {
      const wrapper = mount(Tabs, {
        props: {
          items: defaultItems,
          defaultActiveKey: '1',
          classes: {
            root: 'custom-root',
            item: 'custom-item',
            indicator: 'custom-indicator',
            header: 'custom-header',
            content: 'custom-content',
          },
          styles: {
            root: { color: 'red' },
            item: { color: 'blue' },
            indicator: { color: 'yellow' },
            header: { color: 'green' },
            content: { color: 'purple' },
          },
        } as any,
        attachTo: document.body,
      })

      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('custom-root')).toBe(true)
      expect((root as HTMLElement)?.style.color).toBe('red')

      const item = document.querySelector('.ant-tabs-tab')
      expect(item?.classList.contains('custom-item')).toBe(true)
      expect((item as HTMLElement)?.style.color).toBe('blue')

      const indicator = document.querySelector('.ant-tabs-ink-bar')
      expect(indicator?.classList.contains('custom-indicator')).toBe(true)
      expect((indicator as HTMLElement)?.style.color).toBe('yellow')

      const header = document.querySelector('.ant-tabs-nav')
      expect(header?.classList.contains('custom-header')).toBe(true)
      expect((header as HTMLElement)?.style.color).toBe('green')

      const content = document.querySelector('.ant-tabs-tabpane')
      expect(content?.classList.contains('custom-content')).toBe(true)
      expect((content as HTMLElement)?.style.color).toBe('purple')

      wrapper.unmount()
    })
  })

  // ========================= Function classes & styles =========================
  describe('function classes and styles', () => {
    it('supports classes as function', () => {
      const classesFn = (info: { props: TabsProps }) => {
        if (info.props.type === 'card') {
          return { root: 'card-root' }
        }
        return { root: 'line-root' }
      }

      const wrapper = mount(Tabs, {
        props: {
          items: defaultItems,
          type: 'card',
          classes: classesFn,
        } as any,
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('card-root')).toBe(true)
      wrapper.unmount()
    })

    it('supports styles as function', () => {
      const stylesFn = (info: { props: TabsProps }) => {
        if (info.props.centered) {
          return { root: { backgroundColor: 'red' } }
        }
        return { root: { backgroundColor: 'green' } }
      }

      const wrapper = mount(Tabs, {
        props: {
          items: defaultItems,
          centered: true,
          styles: stylesFn,
        } as any,
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs') as HTMLElement
      expect(root?.style.backgroundColor).toBe('red')
      wrapper.unmount()
    })
  })

  // ========================= ConfigProvider merging =========================
  describe('configProvider merging', () => {
    it('merges classes from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{
              classes: { root: 'provider-root', item: 'provider-item' },
            }}
            >
              <Tabs items={defaultItems} classes={{ root: 'comp-root' }} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('provider-root')).toBe(true)
      expect(root?.classList.contains('comp-root')).toBe(true)

      const item = document.querySelector('.ant-tabs-tab')
      expect(item?.classList.contains('provider-item')).toBe(true)

      wrapper.unmount()
    })

    it('merges styles from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{
              styles: { root: { padding: '10px' }, header: { color: 'green' } },
            }}
            >
              <Tabs items={defaultItems} styles={{ root: { margin: '5px' } }} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-tabs') as HTMLElement
      expect(root?.style.padding).toBe('10px')
      expect(root?.style.margin).toBe('5px')

      const header = document.querySelector('.ant-tabs-nav') as HTMLElement
      expect(header?.style.color).toBe('green')

      wrapper.unmount()
    })

    it('merges class from ConfigProvider tabs config', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{ class: 'provider-cls' }}>
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('provider-cls')).toBe(true)
      wrapper.unmount()
    })

    it('merges style from ConfigProvider tabs config', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{ style: { border: '1px solid red' } }}>
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-tabs') as HTMLElement
      expect(root?.style.border).toBe('1px solid red')
      wrapper.unmount()
    })
  })
})

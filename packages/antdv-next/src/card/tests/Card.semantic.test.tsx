import type { CardProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Card from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('card semantic DOM', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        extra: 'Extra',
        cover: h('img', { src: 'test.jpg', alt: 'cover' }),
        actions: [h('span', 'Action')],
        classes: {
          root: 'custom-root',
          header: 'custom-header',
          body: 'custom-body',
          extra: 'custom-extra',
          title: 'custom-title',
          actions: 'custom-actions',
          cover: 'custom-cover',
        },
        styles: {
          root: { margin: '10px' },
          header: { padding: '20px' },
          body: { padding: '15px' },
          extra: { color: 'red' },
          title: { fontSize: '18px' },
          actions: { borderTop: '1px solid blue' },
          cover: { overflow: 'hidden' },
        },
      },
      slots: { default: () => 'content' },
    })

    // root
    const root = wrapper.find('.ant-card')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('margin: 10px')

    // header
    const header = wrapper.find('.ant-card-head')
    expect(header.classes()).toContain('custom-header')
    expect(header.attributes('style')).toContain('padding: 20px')

    // title
    const title = wrapper.find('.ant-card-head-title')
    expect(title.classes()).toContain('custom-title')
    expect(title.attributes('style')).toContain('font-size: 18px')

    // extra
    const extra = wrapper.find('.ant-card-extra')
    expect(extra.classes()).toContain('custom-extra')
    expect(extra.attributes('style')).toContain('color: red')

    // body
    const body = wrapper.find('.ant-card-body')
    expect(body.classes()).toContain('custom-body')
    expect(body.attributes('style')).toContain('padding: 15px')

    // cover
    const cover = wrapper.find('.ant-card-cover')
    expect(cover.classes()).toContain('custom-cover')
    expect(cover.attributes('style')).toContain('overflow: hidden')

    // actions
    const actions = wrapper.find('.ant-card-actions')
    expect(actions.classes()).toContain('custom-actions')
    expect(actions.attributes('style')).toContain('border-top: 1px solid blue')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: CardProps }) => {
      if (info.props.size === 'small') {
        return { root: 'fn-small', body: 'fn-body-small' }
      }
      return { root: 'fn-default', body: 'fn-body-default' }
    })

    const stylesFn = vi.fn((info: { props: CardProps }) => {
      if (info.props.size === 'small') {
        return { root: { padding: '5px' } }
      }
      return { root: { padding: '20px' } }
    })

    const wrapper = mount(Card, {
      props: {
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => 'content' },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-card')
    expect(root.classes()).toContain('fn-default')
    expect(root.attributes('style')).toContain('padding: 20px')

    const body = wrapper.find('.ant-card-body')
    expect(body.classes()).toContain('fn-body-default')

    // Test reactivity
    await wrapper.setProps({ size: 'small' })

    expect(root.classes()).toContain('fn-small')
    expect(root.attributes('style')).toContain('padding: 5px')
    expect(body.classes()).toContain('fn-body-small')
  })

  it('should merge context and component classNames and styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        card: {
          classes: {
            root: 'context-root',
            header: 'context-header',
            body: 'context-body',
            title: 'context-title',
            extra: 'context-extra',
            cover: 'context-cover',
            actions: 'context-actions',
          },
          styles: {
            root: { margin: '10px' },
            header: { borderBottom: '2px solid red' },
            body: { color: 'blue' },
            title: { fontWeight: 'bold' },
            extra: { fontSize: '12px' },
            cover: { borderRadius: '4px' },
            actions: { padding: '8px' },
          },
        },
      },
      slots: {
        default: () => (
          <Card
            title="Title"
            extra="Extra"
            cover={h('img', { src: 'test.jpg' })}
            actions={[h('span', 'Action')]}
            classes={{
              root: 'component-root',
              header: 'component-header',
              body: 'component-body',
              title: 'component-title',
              extra: 'component-extra',
              cover: 'component-cover',
              actions: 'component-actions',
            }}
            styles={{
              root: { padding: '5px' },
              header: { padding: '16px' },
              body: { fontSize: '14px' },
              title: { color: 'black' },
              extra: { textAlign: 'right' },
              cover: { overflow: 'hidden' },
              actions: { background: 'white' },
            }}
          >
            Test
          </Card>
        ),
      },
    })

    // root
    const root = wrapper.find('.ant-card')
    expect(root.classes()).toContain('context-root')
    expect(root.classes()).toContain('component-root')
    expect(root.attributes('style')).toContain('margin: 10px')
    expect(root.attributes('style')).toContain('padding: 5px')

    // header
    const header = wrapper.find('.ant-card-head')
    expect(header.classes()).toContain('context-header')
    expect(header.classes()).toContain('component-header')
    expect(header.attributes('style')).toContain('border-bottom: 2px solid red')
    expect(header.attributes('style')).toContain('padding: 16px')

    // body
    const body = wrapper.find('.ant-card-body')
    expect(body.classes()).toContain('context-body')
    expect(body.classes()).toContain('component-body')
    expect(body.attributes('style')).toContain('color: blue')
    expect(body.attributes('style')).toContain('font-size: 14px')

    // title
    const title = wrapper.find('.ant-card-head-title')
    expect(title.classes()).toContain('context-title')
    expect(title.classes()).toContain('component-title')
    expect(title.attributes('style')).toContain('font-weight: bold')
    expect(title.attributes('style')).toContain('color: black')

    // extra
    const extra = wrapper.find('.ant-card-extra')
    expect(extra.classes()).toContain('context-extra')
    expect(extra.classes()).toContain('component-extra')
    expect(extra.attributes('style')).toContain('font-size: 12px')
    expect(extra.attributes('style')).toContain('text-align: right')

    // cover
    const cover = wrapper.find('.ant-card-cover')
    expect(cover.classes()).toContain('context-cover')
    expect(cover.classes()).toContain('component-cover')
    expect(cover.attributes('style')).toContain('border-radius: 4px')
    expect(cover.attributes('style')).toContain('overflow: hidden')

    // actions
    const actions = wrapper.find('.ant-card-actions')
    expect(actions.classes()).toContain('context-actions')
    expect(actions.classes()).toContain('component-actions')
    expect(actions.attributes('style')).toContain('padding: 8px')
    expect(actions.attributes('style')).toContain('background: white')
  })
})

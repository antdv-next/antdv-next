import type { SplitterProps } from '..'
import type { PanelProps } from '../interface'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Splitter, { SplitterPanel } from '..'
import { mount, triggerResize } from '/@tests/utils'

const SplitterDemo = defineComponent<{ items?: PanelProps[] } & SplitterProps>((props) => {
  return () => {
    const items = props.items ?? [{}, {}]
    return (
      <Splitter {...props}>
        {items.map((item, idx) => {
          const key = `panel-${idx}`
          return <SplitterPanel key={key} {...item} />
        })}
      </Splitter>
    )
  }
})

async function resizeSplitter(wrapper: ReturnType<typeof mount>) {
  const splitter = wrapper.element.querySelector('.ant-splitter') as HTMLElement
  triggerResize(splitter)
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

describe('splitter.Semantic', () => {
  it('should support classes as function', async () => {
    const classesFn = vi.fn(({ props }: { props: SplitterProps }) => ({
      root: `custom-root-${props.orientation}`,
      panel: 'custom-panel',
      dragger: 'custom-dragger',
    }))

    const wrapper = mount(SplitterDemo, {
      props: {
        orientation: 'horizontal',
        classes: classesFn,
        items: [{}, {}],
      },
    })

    await resizeSplitter(wrapper)

    expect(classesFn).toHaveBeenCalledWith({
      props: expect.objectContaining({
        orientation: 'horizontal',
      }),
    })

    expect(wrapper.find('.ant-splitter').classes()).toContain('custom-root-horizontal')

    wrapper.findAll('.ant-splitter-panel').forEach((panel) => {
      expect(panel.classes()).toContain('custom-panel')
    })

    expect(wrapper.find('.ant-splitter-bar-dragger').classes()).toContain('custom-dragger')
  })

  it('should support styles as function', async () => {
    const stylesFn = vi.fn(({ props }: { props: SplitterProps }) => ({
      root: {
        backgroundColor:
          props.orientation === 'horizontal' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)',
      },
      panel: { padding: '10px' },
      dragger: { width: '8px' },
    }))

    const wrapper = mount(SplitterDemo, {
      props: {
        orientation: 'vertical',
        styles: stylesFn,
        items: [{}, {}],
      },
    })

    await resizeSplitter(wrapper)

    expect(stylesFn).toHaveBeenCalledWith({
      props: expect.objectContaining({
        orientation: 'vertical',
      }),
    })

    expect(wrapper.find('.ant-splitter').element).toHaveStyle({
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
    })

    wrapper.findAll('.ant-splitter-panel').forEach((panel) => {
      expect(panel.element).toHaveStyle({ padding: '10px' })
    })

    expect(wrapper.find('.ant-splitter-bar-dragger').element).toHaveStyle({ width: '8px' })
  })

  it('should support both function and object classes/styles', async () => {
    const classesFn = vi.fn(() => ({
      root: 'fn-root',
      panel: 'fn-panel',
    }))

    const stylesFn = vi.fn(() => ({
      root: { color: 'rgb(255, 0, 0)' },
      panel: { margin: '5px' },
    }))

    const wrapper = mount(SplitterDemo, {
      props: {
        classes: classesFn,
        styles: stylesFn,
        items: [{}, {}],
      },
    })

    await resizeSplitter(wrapper)

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const splitter = wrapper.find('.ant-splitter')
    expect(splitter.classes()).toContain('fn-root')
    expect(splitter.attributes('style')).toContain('color: rgb(255, 0, 0)')

    wrapper.findAll('.ant-splitter-panel').forEach((panel) => {
      expect(panel.classes()).toContain('fn-panel')
      expect(panel.attributes('style')).toContain('margin: 5px')
    })
  })

  it('should support nested dragger classes as function', async () => {
    const classesFn = vi.fn(() => ({
      dragger: {
        default: 'custom-dragger-default',
        active: 'custom-dragger-active',
      },
    }))

    const wrapper = mount(SplitterDemo, {
      props: {
        classes: classesFn,
        items: [{}, {}],
      },
    })

    await resizeSplitter(wrapper)

    expect(classesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-splitter-bar-dragger').classes()).toContain('custom-dragger-default')
  })
})

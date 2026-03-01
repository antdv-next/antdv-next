import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Tour from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

async function flushTour() {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('tour semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('should apply semantic classes as object', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        classes: {
          section: 'c-section',
          header: 'c-header',
          title: 'c-title',
          description: 'c-description',
          cover: 'c-cover',
          footer: 'c-footer',
          actions: 'c-actions',
          indicators: 'c-indicators',
          indicator: 'c-indicator',
        },
        steps: [
          {
            title: 'Title',
            description: 'Description',
            cover: h('img', { alt: 'cover' }),
          },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    expect(document.querySelector('.ant-tour-section')?.classList.contains('c-section')).toBe(true)
    expect(document.querySelector('.ant-tour-header')?.classList.contains('c-header')).toBe(true)
    expect(document.querySelector('.ant-tour-title')?.classList.contains('c-title')).toBe(true)
    expect(document.querySelector('.ant-tour-description')?.classList.contains('c-description')).toBe(true)
    expect(document.querySelector('.ant-tour-cover')?.classList.contains('c-cover')).toBe(true)
    expect(document.querySelector('.ant-tour-footer')?.classList.contains('c-footer')).toBe(true)
    expect(document.querySelector('.ant-tour-actions')?.classList.contains('c-actions')).toBe(true)
    expect(document.querySelector('.ant-tour-indicators')?.classList.contains('c-indicators')).toBe(true)
    expect(document.querySelector('.ant-tour-indicator')?.classList.contains('c-indicator')).toBe(true)
  })

  it('should apply semantic styles as object', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        styles: {
          section: { margin: '5px' },
          header: { backgroundColor: 'rgb(128, 128, 128)' },
          title: { fontSize: '20px' },
          description: { fontStyle: 'italic' },
          cover: { color: 'rgb(255, 0, 0)' },
          footer: { borderTop: '1px solid rgb(0, 0, 0)' },
          actions: { color: 'rgb(0, 0, 255)' },
          indicators: { color: 'rgb(255, 255, 0)' },
          indicator: { color: 'rgb(0, 128, 0)' },
        },
        steps: [
          {
            title: 'Title',
            description: 'Description',
            cover: h('img', { alt: 'cover' }),
          },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    const section = document.querySelector<HTMLElement>('.ant-tour-section')
    const header = document.querySelector<HTMLElement>('.ant-tour-header')
    const title = document.querySelector<HTMLElement>('.ant-tour-title')
    const description = document.querySelector<HTMLElement>('.ant-tour-description')
    const cover = document.querySelector<HTMLElement>('.ant-tour-cover')
    const footer = document.querySelector<HTMLElement>('.ant-tour-footer')
    const actions = document.querySelector<HTMLElement>('.ant-tour-actions')
    const indicators = document.querySelector<HTMLElement>('.ant-tour-indicators')
    const indicator = document.querySelector<HTMLElement>('.ant-tour-indicator')

    expect(section?.style.margin).toBe('5px')
    expect(header?.style.backgroundColor).toBe('rgb(128, 128, 128)')
    expect(title?.style.fontSize).toBe('20px')
    expect(description?.style.fontStyle).toBe('italic')
    expect(cover?.style.color).toBe('rgb(255, 0, 0)')
    expect(footer?.style.borderTop).toBe('1px solid rgb(0, 0, 0)')
    expect(actions?.style.color).toBe('rgb(0, 0, 255)')
    expect(indicators?.style.color).toBe('rgb(255, 255, 0)')
    expect(indicator?.style.color).toBe('rgb(0, 128, 0)')
  })

  it('should apply semantic classes as function', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'primary',
        classes: ((info: any) => ({
          section: info?.props?.type === 'primary' ? 'primary-section' : 'default-section',
          title: 'fn-title',
          description: 'fn-description',
          footer: info?.props?.type === 'primary' ? 'primary-footer' : 'default-footer',
        })) as any,
        steps: [
          { title: 'Title', description: 'Desc' },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    expect(document.querySelector('.ant-tour-section')?.classList.contains('primary-section')).toBe(true)
    expect(document.querySelector('.ant-tour-title')?.classList.contains('fn-title')).toBe(true)
    expect(document.querySelector('.ant-tour-description')?.classList.contains('fn-description')).toBe(true)
    expect(document.querySelector('.ant-tour-footer')?.classList.contains('primary-footer')).toBe(true)
  })

  it('should apply semantic styles as function', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'primary',
        styles: ((info: any) => ({
          section: { margin: info?.props?.type === 'primary' ? '10px' : '5px' },
          title: { fontSize: '24px' },
        })) as any,
        steps: [
          { title: 'Title', description: 'Desc' },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    const section = document.querySelector<HTMLElement>('.ant-tour-section')
    const title = document.querySelector<HTMLElement>('.ant-tour-title')

    expect(section?.style.margin).toBe('10px')
    expect(title?.style.fontSize).toBe('24px')
  })

  it('should merge ConfigProvider and component semantic classes', async () => {
    mount(() => (
      <ConfigProvider tour={{
        classes: {
          section: 'ctx-section',
          title: 'ctx-title',
          footer: 'ctx-footer',
        },
        styles: {
          section: { padding: '8px' },
          title: { fontWeight: 'bold' },
        },
      }}
      >
        <Tour
          open
          classes={{
            section: 'comp-section',
            description: 'comp-desc',
          }}
          styles={{
            section: { margin: '4px' },
            description: { color: 'rgb(100, 100, 100)' },
          }}
          steps={[
            { title: 'Merge Test', description: 'Check merging' },
            { title: 'Step 2' },
          ]}
        />
      </ConfigProvider>
    ), { attachTo: document.body })
    await flushTour()

    const section = document.querySelector<HTMLElement>('.ant-tour-section')

    // Both context and component classes should be present
    expect(section?.classList.contains('ctx-section')).toBe(true)
    expect(section?.classList.contains('comp-section')).toBe(true)

    // Title only has context class
    expect(document.querySelector('.ant-tour-title')?.classList.contains('ctx-title')).toBe(true)

    // Description only has component class
    expect(document.querySelector('.ant-tour-description')?.classList.contains('comp-desc')).toBe(true)

    // Both context and component styles should be present
    expect(section?.style.padding).toBe('8px')
    expect(section?.style.margin).toBe('4px')
  })

  it('should apply step-level semantic styles', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Step with styles',
            description: 'Desc',
            styles: {
              header: { backgroundColor: 'rgb(200, 200, 200)' },
              title: { fontSize: '18px' },
            },
          },
        ],
      },
    })
    await flushTour()

    const header = document.querySelector<HTMLElement>('.ant-tour-header')
    const title = document.querySelector<HTMLElement>('.ant-tour-title')

    expect(header?.style.backgroundColor).toBe('rgb(200, 200, 200)')
    expect(title?.style.fontSize).toBe('18px')
  })

  it('should apply step-level semantic classes', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Step with classes',
            description: 'Desc',
            classes: {
              header: 'step-header',
              title: 'step-title',
              description: 'step-desc',
            },
          },
        ],
      },
    })
    await flushTour()

    expect(document.querySelector('.ant-tour-header')?.classList.contains('step-header')).toBe(true)
    expect(document.querySelector('.ant-tour-title')?.classList.contains('step-title')).toBe(true)
    expect(document.querySelector('.ant-tour-description')?.classList.contains('step-desc')).toBe(true)
  })
})

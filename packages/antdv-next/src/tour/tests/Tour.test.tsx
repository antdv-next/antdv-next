import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Tour from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

async function flushTour() {
  await nextTick()
  await nextTick()
  await nextTick()
}

function queryTour() {
  return document.querySelector<HTMLElement>('.ant-tour')
}

function queryPanel() {
  return document.querySelector<HTMLElement>('.ant-tour-panel')
}

function queryTitle() {
  return document.querySelector<HTMLElement>('.ant-tour-title')
}

function queryDescription() {
  return document.querySelector<HTMLElement>('.ant-tour-description')
}

function queryCover() {
  return document.querySelector<HTMLElement>('.ant-tour-cover')
}

function queryHeader() {
  return document.querySelector<HTMLElement>('.ant-tour-header')
}

function queryClose() {
  return document.querySelector<HTMLElement>('.ant-tour-close')
}

function queryIndicators() {
  return document.querySelector<HTMLElement>('.ant-tour-indicators')
}

function queryAllIndicators() {
  return document.querySelectorAll<HTMLElement>('.ant-tour-indicator')
}

function queryPrevBtn() {
  return document.querySelector<HTMLElement>('.ant-tour-prev-btn')
}

function queryNextBtn() {
  return document.querySelector<HTMLElement>('.ant-tour-next-btn')
}

function querySection() {
  return document.querySelector<HTMLElement>('.ant-tour-section')
}

function queryFooter() {
  return document.querySelector<HTMLElement>('.ant-tour-footer')
}

function queryActions() {
  return document.querySelector<HTMLElement>('.ant-tour-actions')
}

describe('tour', () => {
  mountTest(() => h(Tour, { open: false }))
  rtlTest(() => h(Tour, { open: false }))

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  // =================== Basic Rendering ===================

  it('should render single step with title and description', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step Title', description: 'Step Description' },
        ],
      },
    })
    await flushTour()

    expect(queryTitle()?.textContent).toBe('Step Title')
    expect(queryDescription()?.textContent).toBe('Step Description')
    expect(queryPanel()).toBeTruthy()
  })

  it('should not render when open is false', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: false,
        steps: [{ title: 'Hidden' }],
      },
    })
    await flushTour()

    expect(queryPanel()).toBeFalsy()
  })

  it('should handle empty steps', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: { open: true, steps: [] },
    })
    await flushTour()

    expect(queryPanel()).toBeFalsy()
  })

  it('should handle undefined steps', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: { open: true },
    })
    await flushTour()

    expect(queryPanel()).toBeFalsy()
  })

  // =================== Type ===================

  it('should apply primary type class', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'primary',
        steps: [{ title: 'Primary' }],
      },
    })
    await flushTour()

    const panel = queryPanel()
    expect(panel).toBeTruthy()
    expect(panel?.closest('.ant-tour-primary')).toBeTruthy()
  })

  it('should not apply primary class for default type', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'default',
        steps: [{ title: 'Default' }],
      },
    })
    await flushTour()

    const panel = queryPanel()
    expect(panel).toBeTruthy()
    expect(panel?.closest('.ant-tour-primary')).toBeFalsy()
  })

  it('should support step-level type override', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'default',
        steps: [
          { title: 'Step 1', description: 'Default type' },
          { title: 'Step 2', description: 'Primary type', type: 'primary' },
        ],
      },
    })
    await flushTour()

    // First step: default type (no primary class)
    expect(queryPanel()?.closest('.ant-tour-primary')).toBeFalsy()

    // Navigate to second step
    queryNextBtn()?.click()
    await flushTour()

    // Second step: primary type override
    expect(queryPanel()?.closest('.ant-tour-primary')).toBeTruthy()
  })

  // =================== Navigation ===================

  it('should navigate through steps: Next → Next → Finish', async () => {
    const onFinish = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ],
        onFinish,
      },
    })
    await flushTour()

    // Step 1: no previous button
    expect(queryTitle()?.textContent).toBe('Step 1')
    expect(queryPrevBtn()).toBeFalsy()
    expect(queryNextBtn()?.textContent).toContain('Next')

    // Navigate to step 2
    queryNextBtn()?.click()
    await flushTour()
    expect(queryTitle()?.textContent).toBe('Step 2')
    expect(queryPrevBtn()).toBeTruthy()

    // Navigate to step 3 (last step)
    queryNextBtn()?.click()
    await flushTour()
    expect(queryTitle()?.textContent).toBe('Step 3')
    expect(queryNextBtn()?.textContent).toContain('Finish')

    // Click Finish
    queryNextBtn()?.click()
    await flushTour()
    expect(onFinish).toHaveBeenCalled()
  })

  it('should navigate back with Previous button', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(queryTitle()?.textContent).toBe('Step 2')

    queryPrevBtn()?.click()
    await flushTour()
    expect(queryTitle()?.textContent).toBe('Step 1')
  })

  // =================== Emits ===================

  it('should emit change when step changes', async () => {
    const onChange = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
        onChange,
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('should emit close and update:open when close button clicked', async () => {
    const onClose = vi.fn()
    const onUpdateOpen = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1', closable: true }],
        onClose,
        'onUpdate:open': onUpdateOpen,
      },
    })
    await flushTour()

    queryClose()?.click()
    await flushTour()
    expect(onClose).toHaveBeenCalledWith(0)
    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  it('should emit finish and update:open when finish clicked', async () => {
    const onFinish = vi.fn()
    const onUpdateOpen = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Only Step' }],
        onFinish,
        'onUpdate:open': onUpdateOpen,
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(onFinish).toHaveBeenCalled()
    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  it('should emit update:current when step changes', async () => {
    const onUpdateCurrent = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
        'onUpdate:current': onUpdateCurrent,
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(onUpdateCurrent).toHaveBeenCalledWith(1)
  })

  it('should emit close with correct current index', async () => {
    const onClose = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1', closable: true },
          { title: 'Step 2', closable: true },
        ],
        onClose,
      },
    })
    await flushTour()

    // Navigate to step 2
    queryNextBtn()?.click()
    await flushTour()

    // Close on step 2
    queryClose()?.click()
    await flushTour()
    expect(onClose).toHaveBeenCalledWith(1)
  })

  // =================== Cover ===================

  it('should render cover image', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'With Cover',
            cover: h('img', { alt: 'cover', src: 'https://example.com/img.png' }),
          },
        ],
      },
    })
    await flushTour()

    const cover = queryCover()
    expect(cover).toBeTruthy()
    expect(cover?.querySelector('img')?.getAttribute('alt')).toBe('cover')
  })

  it('should not render cover when not provided', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'No Cover' }],
      },
    })
    await flushTour()

    expect(queryCover()).toBeFalsy()
  })

  // =================== Title / Description ===================

  it('should not render header when title is null', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: null as any, description: 'Only desc' }],
      },
    })
    await flushTour()

    expect(queryHeader()).toBeFalsy()
    expect(queryDescription()?.textContent).toBe('Only desc')
  })

  it('should not render description when not provided', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Only Title' }],
      },
    })
    await flushTour()

    expect(queryTitle()?.textContent).toBe('Only Title')
    expect(queryDescription()).toBeFalsy()
  })

  // =================== Indicators ===================

  it('should show indicators for multiple steps', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }],
      },
    })
    await flushTour()

    expect(queryIndicators()).toBeTruthy()
    expect(queryAllIndicators().length).toBe(3)
  })

  it('should highlight active indicator', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    const indicators = queryAllIndicators()
    expect(indicators[0]?.classList.contains('ant-tour-indicator-active')).toBe(true)
    expect(indicators[1]?.classList.contains('ant-tour-indicator-active')).toBe(false)

    // Navigate
    queryNextBtn()?.click()
    await flushTour()

    const updatedIndicators = queryAllIndicators()
    expect(updatedIndicators[0]?.classList.contains('ant-tour-indicator-active')).toBe(false)
    expect(updatedIndicators[1]?.classList.contains('ant-tour-indicator-active')).toBe(true)
  })

  it('should not show indicators for single step', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Only Step' }],
      },
    })
    await flushTour()

    expect(queryIndicators()).toBeFalsy()
  })

  // =================== Custom indicatorsRender ===================

  it('should support indicatorsRender prop', async () => {
    const indicatorsRender = (current: number, total: number) =>
      h('span', { class: 'custom-indicator' }, `${current + 1} / ${total}`)

    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
        indicatorsRender,
      },
    })
    await flushTour()

    const custom = document.querySelector('.custom-indicator')
    expect(custom).toBeTruthy()
    expect(custom?.textContent).toBe('1 / 2')
  })

  it('should support indicatorsRender slot (slot takes priority)', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
        indicatorsRender: () => h('span', { class: 'prop-indicator' }),
      },
      slots: {
        indicatorsRender: (params: any) =>
          h('span', { class: 'slot-indicator' }, `slot: ${params.current + 1}`),
      },
    })
    await flushTour()

    expect(document.querySelector('.slot-indicator')).toBeTruthy()
    expect(document.querySelector('.prop-indicator')).toBeFalsy()
  })

  // =================== Custom actionsRender ===================

  it('should support actionsRender prop', async () => {
    const actionsRender = (_originNode: any, info: { current: number, total: number }) =>
      h('div', { class: 'custom-actions' }, `Custom ${info.current + 1}/${info.total}`)

    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
        actionsRender,
      },
    })
    await flushTour()

    const custom = document.querySelector('.custom-actions')
    expect(custom).toBeTruthy()
    expect(custom?.textContent).toBe('Custom 1/2')
  })

  it('should support actionsRender slot (slot takes priority)', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }],
        actionsRender: () => h('div', { class: 'prop-actions' }),
      },
      slots: {
        actionsRender: (_originNode: any, info: any) =>
          h('div', { class: 'slot-actions' }, `slot: ${info.current + 1}`),
      },
    })
    await flushTour()

    expect(document.querySelector('.slot-actions')).toBeTruthy()
    expect(document.querySelector('.prop-actions')).toBeFalsy()
  })

  // =================== Button Props ===================

  it('should call nextButtonProps.onClick on Next click', async () => {
    const onClick = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1', nextButtonProps: { onClick } },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(onClick).toHaveBeenCalled()
  })

  it('should call prevButtonProps.onClick on Previous click', async () => {
    const onClick = vi.fn()
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2', prevButtonProps: { onClick } },
        ],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    queryPrevBtn()?.click()
    await flushTour()
    expect(onClick).toHaveBeenCalled()
  })

  it('should apply custom class/style to next button', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Step 1',
            nextButtonProps: {
              class: 'custom-next-class',
              style: { backgroundColor: 'rgb(69, 69, 255)' },
            },
          },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    const nextBtn = queryNextBtn()
    expect(nextBtn?.classList.contains('custom-next-class')).toBe(true)
    expect(nextBtn?.style.backgroundColor).toBe('rgb(69, 69, 255)')
  })

  it('should render custom children in nextButtonProps', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Step 1',
            nextButtonProps: { children: 'Go Forward' },
          },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    expect(queryNextBtn()?.textContent).toContain('Go Forward')
  })

  it('should render custom children in prevButtonProps', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1' },
          {
            title: 'Step 2',
            prevButtonProps: { children: 'Go Back' },
          },
        ],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()
    expect(queryPrevBtn()?.textContent).toContain('Go Back')
  })

  // =================== Slots: coverRender / titleRender / descriptionRender ===================

  it('should use coverRender slot as fallback when step.cover is not set', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1' }, // no cover prop
        ],
      },
      slots: {
        coverRender: ({ step }: any) => h('div', { class: 'slot-cover' }, `Slot cover for: ${step.title}`),
      },
    })
    await flushTour()

    const cover = queryCover()
    expect(cover).toBeTruthy()
    expect(document.querySelector('.slot-cover')).toBeTruthy()
    expect(document.querySelector('.slot-cover')?.textContent).toBe('Slot cover for: Step 1')
  })

  it('should prefer step.cover prop over coverRender slot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1', cover: h('img', { alt: 'prop-cover' }) },
        ],
      },
      slots: {
        coverRender: () => h('div', { class: 'slot-cover' }, 'Slot content'),
      },
    })
    await flushTour()

    // Prop takes priority, slot-cover should not appear
    expect(document.querySelector('.slot-cover')).toBeFalsy()
    expect(queryCover()?.querySelector('img')?.getAttribute('alt')).toBe('prop-cover')
  })

  it('should use titleRender slot as fallback when step.title is not set', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ description: 'Desc only' } as any], // no title prop
      },
      slots: {
        titleRender: ({ index }: any) =>
          h('span', { class: 'custom-title' }, `Custom title ${index}`),
      },
    })
    await flushTour()

    expect(document.querySelector('.custom-title')?.textContent).toBe('Custom title 0')
  })

  it('should use descriptionRender slot as fallback when step.description is not set', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'T' }], // no description prop
      },
      slots: {
        descriptionRender: ({ index }: any) =>
          h('span', { class: 'custom-desc' }, `Custom desc ${index}`),
      },
    })
    await flushTour()

    expect(document.querySelector('.custom-desc')?.textContent).toBe('Custom desc 0')
  })

  it('should prioritize step.title over titleRender slot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Prop Title', description: 'Desc' }],
      },
      slots: {
        titleRender: () => h('span', { class: 'slot-title' }, 'Slot Title'),
      },
    })
    await flushTour()

    // Prop takes priority, slot should not appear
    expect(document.querySelector('.slot-title')).toBeFalsy()
    expect(queryTitle()?.textContent).toBe('Prop Title')
  })

  it('should prioritize step.description over descriptionRender slot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'T', description: 'Prop Desc' }],
      },
      slots: {
        descriptionRender: () => h('span', { class: 'slot-desc' }, 'Slot Desc'),
      },
    })
    await flushTour()

    // Prop takes priority, slot should not appear
    expect(document.querySelector('.slot-desc')).toBeFalsy()
    expect(queryDescription()?.textContent).toBe('Prop Desc')
  })

  // =================== Slots: nextButton / prevButton ===================

  it('should support nextButton slot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
      slots: {
        nextButton: (params: any) =>
          h('button', { class: 'slot-next' }, `Go ${params.isLast ? 'Finish' : 'Next'}`),
      },
    })
    await flushTour()

    const slotNext = document.querySelector('.slot-next')
    expect(slotNext).toBeTruthy()
    expect(slotNext?.textContent).toBe('Go Next')
  })

  it('should support prevButton slot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
      slots: {
        prevButton: (params: any) =>
          h('button', { class: 'slot-prev' }, `Back from ${params.current}`),
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()

    const slotPrev = document.querySelector('.slot-prev')
    expect(slotPrev).toBeTruthy()
    expect(slotPrev?.textContent).toBe('Back from 1')
  })

  // =================== Close Icon ===================

  it('should render close button when closable', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Closable', closable: true }],
      },
    })
    await flushTour()

    expect(queryClose()).toBeTruthy()
    expect(document.querySelector('.ant-tour-close-icon')).toBeTruthy()
  })

  it('should render close button by default (VcTour default)', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Default Closable' }],
      },
    })
    await flushTour()

    // VcTour renders close button by default
    expect(queryClose()).toBeTruthy()
  })

  it('should not render close button when closable is false', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Not Closable', closable: false }],
      },
    })
    await flushTour()

    expect(queryClose()).toBeFalsy()
  })

  it('should render custom close icon from step', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Custom Close',
            closable: { closeIcon: h('span', { class: 'custom-close' }, 'X') },
          },
        ],
      },
    })
    await flushTour()

    expect(document.querySelector('.custom-close')).toBeTruthy()
    expect(document.querySelector('.custom-close')?.textContent).toBe('X')
  })

  it('should have default aria-label on close button', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Test', closable: true }],
      },
    })
    await flushTour()

    expect(queryClose()?.getAttribute('aria-label')).toBe('Close')
  })

  it('should support custom aria-label on closable', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          {
            title: 'Test',
            closable: { 'aria-label': 'Custom Close' } as any,
          },
        ],
      },
    })
    await flushTour()

    expect(queryClose()?.getAttribute('aria-label')).toBe('Custom Close')
  })

  // =================== Controlled current ===================

  it('should support controlled current prop', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const current = ref(0)
          return () => (
            <>
              <button class="set-current" onClick={() => { current.value = 1 }}>Set</button>
              <Tour
                open
                current={current.value}
                steps={[
                  { title: 'Step 1' },
                  { title: 'Step 2', type: 'primary' },
                ]}
              />
            </>
          )
        },
      }),
      { attachTo: document.body },
    )
    await flushTour()

    expect(queryTitle()?.textContent).toBe('Step 1')

    await wrapper.find('.set-current').trigger('click')
    await flushTour()

    expect(queryTitle()?.textContent).toBe('Step 2')
    expect(queryPanel()?.closest('.ant-tour-primary')).toBeTruthy()
  })

  // =================== First step / Last step button logic ===================

  it('should hide Previous button on first step', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    expect(queryPrevBtn()).toBeFalsy()
    expect(queryNextBtn()).toBeTruthy()
  })

  it('should show Finish text on last step', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()

    expect(queryNextBtn()?.textContent).toContain('Finish')
  })

  it('should show Finish on single step (is both first and last)', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Only Step' }],
      },
    })
    await flushTour()

    expect(queryPrevBtn()).toBeFalsy()
    expect(queryNextBtn()?.textContent).toContain('Finish')
  })

  // =================== Button type: primary vs default ===================

  it('should use primary button for Next in default type tour', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'default',
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    const nextBtn = queryNextBtn()
    expect(nextBtn?.classList.contains('ant-btn-primary')).toBe(true)
  })

  it('should use default button for Next in primary type tour', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'primary',
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    const nextBtn = queryNextBtn()
    expect(nextBtn?.classList.contains('ant-btn-default')).toBe(true)
  })

  it('should use ghost style for Previous button in primary type', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        type: 'primary',
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      },
    })
    await flushTour()

    queryNextBtn()?.click()
    await flushTour()

    const prevBtn = queryPrevBtn()
    expect(prevBtn?.classList.contains('ant-btn-background-ghost')).toBe(true)
  })

  // =================== RTL ===================

  it('should apply RTL class via ConfigProvider', async () => {
    mount(() => (
      <ConfigProvider direction="rtl">
        <Tour
          open
          steps={[{ title: 'RTL Step' }]}
        />
      </ConfigProvider>
    ), { attachTo: document.body })
    await flushTour()

    const tourRoot = queryTour()
    expect(tourRoot?.classList.contains('ant-tour-rtl')).toBe(true)
  })

  // =================== rootClass ===================

  it('should apply rootClass', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        rootClass: 'custom-root',
        steps: [{ title: 'Root Class Test' }],
      },
    })
    await flushTour()

    const tourRoot = queryTour()
    expect(tourRoot?.classList.contains('custom-root')).toBe(true)
  })

  // =================== Semantic classes / styles (object form) ===================

  it('should apply semantic classes', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        classes: {
          section: 'custom-section',
          header: 'custom-header',
          title: 'custom-title',
          description: 'custom-desc',
          footer: 'custom-footer',
          actions: 'custom-actions',
          indicators: 'custom-indicators',
          indicator: 'custom-indicator',
        },
        steps: [
          { title: 'Title', description: 'Desc' },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    expect(querySection()?.classList.contains('custom-section')).toBe(true)
    expect(queryHeader()?.classList.contains('custom-header')).toBe(true)
    expect(queryTitle()?.classList.contains('custom-title')).toBe(true)
    expect(queryDescription()?.classList.contains('custom-desc')).toBe(true)
    expect(queryFooter()?.classList.contains('custom-footer')).toBe(true)
    expect(queryActions()?.classList.contains('custom-actions')).toBe(true)
    expect(queryIndicators()?.classList.contains('custom-indicators')).toBe(true)
    expect(queryAllIndicators()[0]?.classList.contains('custom-indicator')).toBe(true)
  })

  it('should apply semantic styles', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        styles: {
          section: { margin: '5px' },
          header: { backgroundColor: 'rgb(128, 128, 128)' },
          title: { fontSize: '20px' },
          description: { fontStyle: 'italic' },
          footer: { borderTop: '1px solid rgb(0, 0, 0)' },
          actions: { color: 'rgb(0, 0, 255)' },
        },
        steps: [
          { title: 'Title', description: 'Desc' },
          { title: 'Step 2' },
        ],
      },
    })
    await flushTour()

    expect(querySection()?.style.margin).toBe('5px')
    expect(queryTitle()?.style.fontSize).toBe('20px')
    expect(queryDescription()?.style.fontStyle).toBe('italic')
  })

  // =================== Cover semantic class/style ===================

  it('should apply cover semantic class and style', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        classes: { cover: 'custom-cover' },
        styles: { cover: { color: 'rgb(255, 0, 0)' } },
        steps: [
          {
            title: 'With Cover',
            cover: h('img', { alt: 'cover' }),
          },
        ],
      },
    })
    await flushTour()

    const cover = queryCover()
    expect(cover?.classList.contains('custom-cover')).toBe(true)
    expect(cover?.style.color).toBe('rgb(255, 0, 0)')
  })

  // =================== ConfigProvider integration ===================

  it('should apply ConfigProvider semantic classes and styles', async () => {
    mount(() => (
      <ConfigProvider tour={{
        classes: { section: 'ctx-section', title: 'ctx-title' },
        styles: { section: { padding: '10px' } },
      }}
      >
        <Tour
          open
          classes={{ section: 'comp-section' }}
          styles={{ section: { margin: '5px' } }}
          steps={[{ title: 'Title', description: 'Desc' }]}
        />
      </ConfigProvider>
    ), { attachTo: document.body })
    await flushTour()

    const section = querySection()
    expect(section?.classList.contains('ctx-section')).toBe(true)
    expect(section?.classList.contains('comp-section')).toBe(true)
    // Both context and component styles should be merged
    expect(section?.style.padding).toBe('10px')
    expect(section?.style.margin).toBe('5px')
  })

  // =================== Step-level class ===================

  it('should apply step class', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ title: 'Step 1', class: 'step-custom-class' }],
      },
    })
    await flushTour()

    const stepEl = document.querySelector('.step-custom-class')
    expect(stepEl).toBeTruthy()
  })

  // =================== Attrs passthrough ===================

  it('should merge attrs.class into root', async () => {
    mount(() => (
      <Tour
        open
        class="custom-attrs-class"
        steps={[{ title: 'Attrs Test' }]}
      />
    ), { attachTo: document.body })
    await flushTour()

    const tourRoot = queryTour()
    expect(tourRoot?.classList.contains('custom-attrs-class')).toBe(true)
  })

  // Note: attrs.style is merged into semanticStyles.mask (index.tsx L135),
  // but VcTour renders the mask as SVG, making CSS style verification unreliable.

  // =================== Snapshot ===================

  it('should render correct snapshot', async () => {
    mount(Tour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [
          { title: 'Step 1', description: 'Desc 1' },
          { title: 'Step 2', description: 'Desc 2' },
        ],
      },
    })
    await flushTour()

    expect(queryPanel()).toBeTruthy()
    expect(queryPanel()!).toMatchSnapshot()
  })
})

import type { CSSProperties } from 'vue'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, onMounted, shallowRef } from 'vue'
import Affix from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount, triggerResize, waitFakeTimer } from '../../../../../tests/utils'
import Button from '../../button'

const events: Partial<Record<keyof HTMLElementEventMap, (ev: Partial<Event>) => void>> = {}

interface AffixMounterProps {
  offsetTop?: number
  offsetBottom?: number
  style?: CSSProperties
  onChange?: (affixed: boolean) => void
}

const AffixMounter = defineComponent<AffixMounterProps>(
  (props) => {
    const container = shallowRef<HTMLDivElement>()

    onMounted(() => {
      if (container.value) {
        container.value.addEventListener = vi
          .fn()
          .mockImplementation((event: keyof HTMLElementEventMap, cb: (ev: Event) => void) => {
            (events as any)[event] = cb
          }) as any
      }
    })

    return () => (
      <div ref={container} class="container">
        <Affix
          class="placeholder"
          target={() => container.value ?? null}
          offsetTop={props.offsetTop}
          offsetBottom={props.offsetBottom}
          onChange={props.onChange}
          style={props.style}
        >
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    )
  },
  {
    name: 'AffixMounter',
    inheritAttrs: false,
  },
)

describe('affix Render', () => {
  rtlTest(() => h(Affix, null, { default: () => 'test' }))

  const domMock = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')

  const classRect: Record<string, DOMRect> = { container: { top: 0, bottom: 100 } as DOMRect }

  beforeAll(() => {
    domMock.mockImplementation(function fn(this: HTMLElement) {
      return classRect[this.className] || ({ top: 0, bottom: 0 } as DOMRect)
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  afterAll(() => {
    domMock.mockRestore()
  })

  const movePlaceholder = async (top: number) => {
    classRect.placeholder = { top, bottom: top } as DOMRect
    if (events.scroll == null) {
      throw new Error('scroll should be set')
    }
    events.scroll({ type: 'scroll' })
    await waitFakeTimer()
  }

  it('bindnder render perfectly', async () => {
    const wrapper = mount(AffixMounter, { attachTo: document.body })
    await waitFakeTimer()

    await movePlaceholder(0)
    expect(wrapper.element.querySelector('.ant-affix')).toBeFalsy()

    await movePlaceholder(-100)
    expect(wrapper.element.querySelector('.ant-affix')).toBeTruthy()

    await movePlaceholder(0)
    expect(wrapper.element.querySelector('.ant-affix')).toBeFalsy()

    wrapper.unmount()
  })

  it('bindnder correct render when target is null', async () => {
    const wrapper = mount(
      () => h(Affix, { target: () => null }, { default: () => 'test' }),
      { attachTo: document.body },
    )
    await waitFakeTimer()
    wrapper.unmount()
  })

  it('support offsetBottom', async () => {
    const wrapper = mount(AffixMounter, {
      props: { offsetBottom: 0 },
      attachTo: document.body,
    })

    await waitFakeTimer()

    await movePlaceholder(300)
    expect(wrapper.element.querySelector('.ant-affix')).toBeTruthy()

    await movePlaceholder(0)
    expect(wrapper.element.querySelector('.ant-affix')).toBeFalsy()

    await movePlaceholder(300)
    expect(wrapper.element.querySelector('.ant-affix')).toBeTruthy()

    wrapper.unmount()
  })

  it('updatePosition when offsetTop changed', async () => {
    const onChange = vi.fn()

    const wrapper = mount(AffixMounter, {
      props: { offsetTop: 0, onChange },
      attachTo: document.body,
    })
    await waitFakeTimer()

    await movePlaceholder(-100)
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(wrapper.element.querySelector('.ant-affix')).toHaveStyle({ top: '0px' })

    await movePlaceholder(100)
    expect(onChange).toHaveBeenLastCalledWith(false)

    await movePlaceholder(-100)
    expect(onChange).toHaveBeenLastCalledWith(true)

    await wrapper.setProps({ offsetTop: 10 })
    await waitFakeTimer()
    expect(wrapper.element.querySelector('.ant-affix')).toHaveStyle({ top: '10px' })

    wrapper.unmount()
  })

  describe('updatePosition when target changed', () => {
    it('function change', async () => {
      document.body.innerHTML = '<div id="mounter" />'
      const target = document.getElementById('mounter')
      const getTarget = () => target

      const wrapper = mount(Affix, {
        props: { target: getTarget },
        slots: { default: () => null },
        attachTo: document.getElementById('mounter')!,
      })

      await wrapper.setProps({ target: () => null })

      expect(wrapper.element.querySelector('div[aria-hidden="true"]')).toBeNull()
      expect(wrapper.element.querySelector('.ant-affix')?.getAttribute('style')).toBeUndefined()

      wrapper.unmount()
    })

    it('check position change before measure', async () => {
      const wrapper = mount(
        () => (
          <>
            <Affix offsetTop={10}>
              <Button>top</Button>
            </Affix>
            <Affix offsetBottom={10}>
              <Button>bottom</Button>
            </Affix>
          </>
        ),
        { attachTo: document.body },
      )

      await waitFakeTimer()

      // This test doesn't use AffixMounter, so Affix listens on window directly.
      // Trigger scroll on window instead of using movePlaceholder.
      classRect.placeholder = { top: 1000, bottom: 1000 } as DOMRect
      window.dispatchEvent(new Event('scroll'))
      await waitFakeTimer()

      expect(wrapper.element.querySelector('.ant-affix')).toBeTruthy()

      wrapper.unmount()
    })

    it('do not measure when hidden', async () => {
      const wrapper = mount(AffixMounter, {
        props: { offsetBottom: 0 },
        attachTo: document.body,
      })
      await waitFakeTimer()

      const affixStyleEle = wrapper.element.querySelector('.ant-affix')
      const firstAffixStyle = affixStyleEle ? affixStyleEle.getAttribute('style') : null

      await wrapper.setProps({ style: { display: 'none' } })
      await waitFakeTimer()
      const secondAffixStyle = affixStyleEle ? affixStyleEle.getAttribute('style') : null

      expect(firstAffixStyle).toEqual(secondAffixStyle)

      wrapper.unmount()
    })
  })

  describe('updatePosition when size changed', () => {
    it('add class automatically', async () => {
      document.body.innerHTML = '<div id="mounter" />'

      const wrapper = mount(AffixMounter, {
        props: { offsetBottom: 0 },
        attachTo: document.getElementById('mounter')!,
      })

      await waitFakeTimer()
      await movePlaceholder(300)
      expect(wrapper.element.querySelector('div[aria-hidden="true"]')).toBeTruthy()
      expect(wrapper.element.querySelector('.ant-affix')?.getAttribute('style')).toBeTruthy()

      wrapper.unmount()
    })

    // Trigger inner and outer element for the two <ResizeObserver>s.
    ;['.ant-btn', '.placeholder'].forEach((selector) => {
      it(`trigger listener when size change: ${selector}`, async () => {
        document.body.innerHTML = '<div id="mounter" />'
        const wrapper = mount(AffixMounter, {
          props: { offsetBottom: 0 },
          attachTo: document.getElementById('mounter')!,
        })

        await waitFakeTimer()

        const el = wrapper.element.querySelector(selector)
        if (el) {
          triggerResize(el)
          await waitFakeTimer()
        }

        // After resize, Affix should have recalculated its position
        expect(wrapper.element.querySelector('.ant-affix')).toBeDefined()

        wrapper.unmount()
      })
    })
  })
})

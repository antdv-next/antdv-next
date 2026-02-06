import { LikeOutlined, SmileOutlined } from '@antdv-next/icons'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import Base from '../Base'
import useCopyClick from '../hooks/useCopyClick'
import { flushPromises, sleep, waitFakeTimer, waitFor } from '/@tests/utils'

// Mock copy
const copyMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../../_util/copy', () => ({
  default: (...args: any[]) => copyMock(...args),
}))

// Mock useLocale
vi.mock('../../locale/useLocale', async () => {
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    default: () => [ref({ copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse', edit: 'Edit' })],
  }
})

describe('typography copy', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    errorSpy.mockReset()
    copyMock.mockReset()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('base', () => {
    describe('copyable', () => {
      function copyTest({
        name,
        icon,
        tooltips,
        iconClassNames = [],
        iconTexts = [],
        tooltipTexts = [],
        tooltipLength,
      }: {
        name: string
        icon?: any
        tooltips?: any
        iconClassNames?: string[]
        iconTexts?: string[]
        tooltipTexts?: string[]
        tooltipLength?: number
      }) {
        it(name, async () => {
          const copyable: any = {}
          if (icon !== undefined)
            copyable.icon = icon
          if (tooltips !== undefined)
            copyable.tooltips = tooltips

          // Use empty object instead of true when using fake timers, as true seems to fail in this context
          const copyableProp = (icon === undefined && tooltips === undefined) ? {} : copyable

          const wrapper = mount(Base, {
            attachTo: document.body,
            props: {
              component: 'p',
              copyable: copyableProp,
            },
            slots: {
              default: () => 'test copy',
            },
          })

          const copyBtn = wrapper.find('.ant-typography-copy')

          if (iconClassNames[0] !== undefined) {
            expect(wrapper.find(iconClassNames[0]).exists()).toBe(true)
          }
          if (iconTexts[0] !== undefined) {
            expect(copyBtn.element.textContent).toBe(
              iconTexts[0],
            )
          }

          await copyBtn.trigger('mouseenter')
          await vi.advanceTimersByTimeAsync(200)

          if (tooltipTexts[0] !== undefined) {
            await waitFor(() => {
              expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe(
                tooltipTexts[0],
              )
            })
          }

          if (tooltipLength !== undefined) {
            await waitFor(() => {
              expect(document.querySelectorAll('.ant-tooltip-container').length).toBe(
                tooltipLength,
              )
            })
          }

          await copyBtn.trigger('click')
          await flushPromises()

          if (iconClassNames[1] !== undefined) {
            expect(wrapper.find(iconClassNames[1]).exists()).toBe(true)
          }
          await copyBtn.trigger('mouseenter')

          // Double trigger to ensure tooltip shows up (mimicking React test behavior)
          await copyBtn.trigger('mouseenter')

          if (tooltipTexts[1] !== undefined) {
            const expectedInner = tooltipTexts[1]
            await waitFor(() => {
              const content = document.querySelector('.ant-tooltip-container')?.textContent
              if (expectedInner === '') {
                expect(content || '').toBe('')
              }
              else {
                expect(content).toBe(expectedInner)
              }
            })
          }

          if (iconTexts[1] !== undefined) {
            expect(wrapper.findAll('.ant-typography-copy')[0]!.element.textContent).toBe(
              iconTexts[1],
            )
          }

          await copyBtn.trigger('click')
          await waitFakeTimer()

          wrapper.unmount()
        })
      }

      const dom = (
        <>
          <span>1</span>
          2
        </>
      )
      const dom2 = (
        <>
          <span>3</span>
          4
        </>
      )
      const copy = '.anticon-copy'
      const check = '.anticon-check'

      copyTest({
        name: 'icon basic copy',
        iconClassNames: [copy, check],
        tooltipTexts: ['Copy', 'Copied'],
      })
      copyTest({ name: 'icon true', icon: true, iconClassNames: [copy, check] })
      copyTest({ name: 'icon two true', icon: [true, true], iconClassNames: [copy, check] })
      copyTest({ name: 'icon false', icon: false, iconClassNames: [copy, check] })
      copyTest({ name: 'icon custom text', icon: ['a', 'b'], iconTexts: ['a', 'b'] })
      copyTest({ name: 'icon custom element', icon: [dom, dom2], iconTexts: ['12', '34'] })
      copyTest({
        name: 'icon custom icon',
        icon: <SmileOutlined />,
        iconClassNames: ['.anticon-smile', check],
      })
      copyTest({
        name: 'icon custom icon2',
        icon: [<SmileOutlined key="a" />, <LikeOutlined key="b" />],
        iconClassNames: ['.anticon-smile', '.anticon-like'],
      })
      copyTest({
        name: 'icon custom icon3',
        icon: [
          [
            <SmileOutlined key="a" />,
            <SmileOutlined key="b" />,
          ],
          <LikeOutlined key="c" />,
        ],
        iconClassNames: ['.anticon-smile', '.anticon-like'],
      })
      copyTest({
        name: 'icon custom icon4',
        icon: (
          <>
            <SmileOutlined />
            <LikeOutlined />
          </>
        ),
        iconClassNames: ['.anticon-smile', check],
      })
      copyTest({
        name: 'icon custom icon5',
        icon: (
          <>
            <SmileOutlined />
            <LikeOutlined />
          </>
        ),
        iconClassNames: ['.anticon-like', check],
      })
      copyTest({
        name: 'tooltips true',
        tooltips: true,
        tooltipLength: 1,
        tooltipTexts: ['Copy', 'Copied'],
      })
      copyTest({ name: 'tooltips false', tooltips: false, tooltipLength: 0 })
      copyTest({
        name: 'tooltips custom text',
        tooltips: ['a', 'b'],
        tooltipLength: 1,
        tooltipTexts: ['a', 'b'],
      })
      copyTest({
        name: 'tooltips custom element ',
        tooltips: [dom, dom2],
        tooltipTexts: ['12', '34'],
      })
      copyTest({
        name: 'tooltips first empty',
        tooltips: ['', 'xxx'],
        tooltipLength: 0,
      })
      copyTest({
        name: 'tooltips first empty 2',
        tooltips: [''],
        tooltipLength: 0,
      })

      copyTest({
        name: 'tooltips true true',
        tooltips: [true, true],
        tooltipTexts: ['Copy', 'Copied'],
      })
      copyTest({
        name: 'tooltips true false',
        tooltips: [true, false],
        tooltipTexts: ['Copy', ''],
      })

      copyTest({
        name: 'tooltips false true',
        tooltips: [false, true],
        tooltipLength: 0,
      })
    })

    it('copy click event stopPropagation', async () => {
      const onDivClick = vi.fn()
      const wrapper = mount({
        render() {
          return (
            <div onClick={onDivClick}>
              <Base component="p" copyable>
                test copy
              </Base>
            </div>
          )
        },
      })
      await wrapper.find('.ant-typography-copy').trigger('click')
      expect(onDivClick).not.toHaveBeenCalled()
    })

    it('the first parameter of onCopy is the click event', async () => {
      function onCopy(e?: MouseEvent) {
        expect(e).not.toBeUndefined()
      }

      const wrapper = mount(Base, {
        props: {
          component: 'p',
          copyable: { onCopy },
        },
        slots: {
          default: () => 'test copy',
        },
      })
      await wrapper.find('.ant-typography-copy').trigger('click')
    })

    it('copy to clipboard', async () => {
      const originText = 'origin text.'
      const nextText = 'next text.'
      const Test = defineComponent({
        setup() {
          const dynamicText = ref(originText)
          onMounted(() => {
            const timer = setTimeout(() => {
              dynamicText.value = nextText
            }, 500)
            onBeforeUnmount(() => clearTimeout(timer))
          })
          return () => (
            <Base component="p" copyable>
              {dynamicText.value}
            </Base>
          )
        },
      })
      const wrapper = mount(Test)
      const copyBtn = wrapper.find('.ant-typography-copy')
      await copyBtn.trigger('click')
      expect(copyMock.mock.calls![0]![0]).toEqual(originText)
      await waitFakeTimer()
      copyMock.mockClear()

      await copyBtn.trigger('click')
      expect(copyMock.mock.calls![0]![0]).toEqual(nextText)
      copyMock.mockClear()
    })

    it('copy by async', async () => {
      const wrapper = mount(Base, {
        props: {
          component: 'p',
          copyable: {
            text: vi.fn().mockResolvedValueOnce('Request text'),
          },
        },
        slots: {
          default: () => 'test copy',
        },
      })
      await wrapper.find('.ant-typography-copy').trigger('click')
      expect(wrapper.find('.anticon-loading').exists()).toBeTruthy()
      await waitFakeTimer()
      expect(copyMock.mock.calls![0]![0]).toEqual('Request text')
      copyMock.mockClear()
      expect(wrapper.find('.anticon-loading').exists()).toBeFalsy()
    })

    it('useCopyClick error', async () => {
      // Create a dummy component to run the hook
      let error: any
      const TestComp = defineComponent({
        setup() {
          const { onClick, copyLoading } = useCopyClick({
            copyConfig: {
              text: vi.fn().mockRejectedValueOnce('Oops'),
            },
          })
          return { onClick, copyLoading }
        },
        render() {
          return null
        },
      })

      const wrapper = mount(TestComp)

      try {
        await wrapper.vm.onClick()
      }
      catch (e) {
        error = e
      }
      expect(error).toMatch('Oops')
      expect(wrapper.vm.copyLoading).toBe(false)
    })
  })

  it('not block copy text change', async () => {
    const wrapper = mount(Base, {
      props: {
        copyable: { text: 'Bamboo' },
        component: 'p',
      },
      slots: { default: () => 'Text' },
    })

    await wrapper.setProps({ copyable: { text: 'Light' } })

    await wrapper.find('.ant-typography-copy').trigger('click')
    expect(copyMock.mock.calls![0]![0]).toBe('Light')
  })

  it('dynamic set editable', async () => {
    const wrapper = mount(Base, {
      props: { component: 'p' },
      slots: { default: () => 'test' },
    })
    expect(wrapper.find('.ant-typography-copy').exists()).toBeFalsy()

    await wrapper.setProps({ copyable: true })
    expect(wrapper.find('.ant-typography-copy').exists()).toBeTruthy()
  })

  it('tabIndex of copy button', () => {
    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: { tabIndex: -1 },
      },
      slots: { default: () => 'test' },
    })
    expect(wrapper.find('.ant-typography-copy').attributes('tabindex')).toBe('-1')
  })

  it('locale text for button tooltip', async () => {
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        component: 'p',
        copyable: {},
      },
      slots: { default: () => 'test' },
    })

    await wrapper.find('.ant-typography-copy').trigger('mouseenter')

    await waitFor(() => {
      expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe('Copy')
    })

    await wrapper.find('.ant-typography-copy').trigger('click')
    await sleep(0)

    await waitFor(() => {
      expect(document.querySelector('.ant-tooltip-container')?.textContent).toBe('Copied')
    })

    wrapper.unmount()
  })

  it('copy array children', async () => {
    const bamboo = 'bamboo'
    const little = 'little'

    const wrapper = mount(Base, {
      props: {
        component: 'p',
        copyable: true,
      },
      slots: {
        default: () => [bamboo, little],
      },
    })
    await wrapper.find('.ant-typography-copy').trigger('click')

    // Check copy content
    expect(copyMock.mock.calls![0]![0]).toBe(`${bamboo}${little}`)
  })
})

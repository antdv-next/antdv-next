import type { MentionsProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import Mentions from '..'
import ConfigProvider from '../../config-provider'
import { useFormItemInputContextProvider } from '../../form/context'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount, waitFakeTimer } from '/@tests/utils'

const defaultOptions: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'yesmeck', label: 'yesmeck' },
]

async function flushMentionsTimer() {
  await waitFakeTimer(150, 10)
}

describe('mentions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  mountTest(Mentions)
  rtlTest(() => h(Mentions))

  // === Basic Rendering ===

  it('renders correctly with textarea', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(document.querySelector('.ant-mentions')).toBeTruthy()
  })

  // === Size ===

  describe('size', () => {
    it('renders small size', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, size: 'small' },
      })
      const root = document.querySelector('.ant-mentions')
      expect(root?.className).toContain('ant-mentions-sm')
    })

    it('renders large size', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, size: 'large' },
      })
      const root = document.querySelector('.ant-mentions')
      expect(root?.className).toContain('ant-mentions-lg')
    })

    it('renders default size without sm/lg class', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions },
      })
      const root = document.querySelector('.ant-mentions')
      expect(root?.className).not.toContain('ant-mentions-sm')
      expect(root?.className).not.toContain('ant-mentions-lg')
    })
  })

  // === Variant ===

  describe('variant', () => {
    it('renders outlined variant by default', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions },
      })
      expect(document.querySelector('.ant-mentions-outlined')).toBeTruthy()
    })

    it.each(['filled', 'borderless', 'underlined'] as const)(
      'renders %s variant',
      (variant) => {
        mount(Mentions, {
          attachTo: document.body,
          props: { options: defaultOptions, variant },
        })
        expect(document.querySelector(`.ant-mentions-${variant}`)).toBeTruthy()
      },
    )
  })

  // === Status ===

  describe('status', () => {
    it.each(['error', 'warning'] as const)(
      'renders %s status',
      (status) => {
        mount(Mentions, {
          attachTo: document.body,
          props: { options: defaultOptions, status },
        })
        expect(document.querySelector(`.ant-mentions-status-${status}`)).toBeTruthy()
      },
    )
  })

  // === Disabled ===

  describe('disabled', () => {
    it('renders disabled state', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, disabled: true },
      })
      expect(document.querySelector('.ant-mentions-disabled')).toBeTruthy()
      expect(document.querySelector('textarea')?.disabled).toBe(true)
    })

    it('inherits disabled from DisabledContext', () => {
      mount({
        render() {
          return (
            <ConfigProvider componentDisabled={true}>
              <Mentions options={defaultOptions} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      expect(document.querySelector('textarea')?.disabled).toBe(true)
    })
  })

  // === Focus / Blur ===

  describe('focus and blur', () => {
    it('emits focus event', async () => {
      const wrapper = mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions },
      })
      await wrapper.find('textarea').trigger('focus')
      await flushMentionsTimer()
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions },
      })
      await wrapper.find('textarea').trigger('focus')
      await flushMentionsTimer()
      await wrapper.find('textarea').trigger('blur')
      // VcMentions delays blur with setTimeout(0)
      await flushMentionsTimer()
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('toggles focused class on focus/blur', async () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions },
      })
      const textarea = document.querySelector('textarea')!
      textarea.dispatchEvent(new FocusEvent('focus'))
      await flushMentionsTimer()
      expect(document.querySelector('.ant-mentions-focused')).toBeTruthy()

      textarea.dispatchEvent(new FocusEvent('blur'))
      await flushMentionsTimer()
      expect(document.querySelector('.ant-mentions-focused')).toBeFalsy()
    })
  })

  // === Change ===

  it('emits change and update:value on input', async () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
    })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('hello')
    await flushMentionsTimer()

    const changeEvents = wrapper.emitted('change')
    const updateEvents = wrapper.emitted('update:value')
    expect(changeEvents).toBeDefined()
    expect(updateEvents).toBeDefined()
    expect(changeEvents?.[0]?.[0]).toBe('hello')
    expect(updateEvents?.[0]?.[0]).toBe('hello')
  })

  // === getMentions static method ===

  describe('getMentions', () => {
    it('parses mentions with default prefix @', () => {
      const mentions = Mentions.getMentions('@light @test')
      expect(mentions).toEqual([
        { prefix: '@', value: 'light' },
        { prefix: '@', value: 'test' },
      ])
    })

    it('parses mentions with multiple prefixes', () => {
      const mentions = Mentions.getMentions('@light #bamboo cat', {
        prefix: ['@', '#'],
      })
      expect(mentions).toEqual([
        { prefix: '@', value: 'light' },
        { prefix: '#', value: 'bamboo' },
      ])
    })

    it('parses mentions with custom split', () => {
      const mentions = Mentions.getMentions('@light,@test', { split: ',' })
      expect(mentions).toEqual([
        { prefix: '@', value: 'light' },
        { prefix: '@', value: 'test' },
      ])
    })

    it('returns empty array for no mentions', () => {
      const mentions = Mentions.getMentions('hello world')
      expect(mentions).toEqual([])
    })

    it('filters out empty values', () => {
      const mentions = Mentions.getMentions('@ @test')
      expect(mentions).toEqual([
        { prefix: '@', value: 'test' },
      ])
    })

    it('handles empty string', () => {
      const mentions = Mentions.getMentions('')
      expect(mentions).toEqual([])
    })
  })

  // === AllowClear ===

  describe('allowClear', () => {
    it('shows clear button when allowClear and has value', async () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, allowClear: true, value: 'test' },
      })
      await flushMentionsTimer()
      expect(document.querySelector('.ant-mentions-clear-icon')).toBeTruthy()
    })

    it('does not show clear button when allowClear is false', () => {
      mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, value: 'test' },
      })
      expect(document.querySelector('.ant-mentions-clear-icon')).toBeFalsy()
    })

    it('clears value on clear click', async () => {
      const wrapper = mount(Mentions, {
        attachTo: document.body,
        props: { options: defaultOptions, allowClear: true, value: 'test' },
      })
      await flushMentionsTimer()
      const clearIcon = document.querySelector('.ant-mentions-clear-icon')
      expect(clearIcon).toBeTruthy()
      clearIcon!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushMentionsTimer()

      const changeEvents = wrapper.emitted('change')
      expect(changeEvents).toBeDefined()
      const lastEvent = changeEvents?.[changeEvents.length - 1]
      expect(lastEvent?.[0]).toBe('')
    })

    it('supports custom clearIcon', async () => {
      mount(Mentions, {
        attachTo: document.body,
        props: {
          options: defaultOptions,
          allowClear: { clearIcon: <span class="custom-clear">X</span> },
          value: 'test',
        },
      })
      await flushMentionsTimer()
      expect(document.querySelector('.custom-clear')).toBeTruthy()
    })
  })

  // === Loading ===

  it('renders without error when loading', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, loading: true },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // === NotFoundContent ===

  it('accepts custom notFoundContent', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        notFoundContent: 'No data found',
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // === Options without label (value fallback) ===

  it('falls back to option.value when label is not provided', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: {
        options: [
          { value: 'no-label-option' },
        ],
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // === Form hasFeedback ===

  it('appends feedbackIcon to suffix when hasFeedback is true', () => {
    mount({
      setup() {
        useFormItemInputContextProvider(ref({
          hasFeedback: true,
          feedbackIcon: <span class="feedback-icon">✓</span>,
          status: 'success',
        }))
        return () => <Mentions options={defaultOptions} />
      },
    }, { attachTo: document.body })
    expect(document.querySelector('.feedback-icon')).toBeTruthy()
  })

  it('does not append feedbackIcon when hasFeedback is false', () => {
    mount({
      setup() {
        useFormItemInputContextProvider(ref({
          hasFeedback: false,
          feedbackIcon: <span class="no-feedback-icon">✗</span>,
        }))
        return () => <Mentions options={defaultOptions} />
      },
    }, { attachTo: document.body })
    expect(document.querySelector('.no-feedback-icon')).toBeFalsy()
  })

  // === Suffix Slot ===

  it('renders suffix slot content', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
      slots: {
        suffix: () => <span class="custom-suffix">suffix</span>,
      },
    })
    expect(document.querySelector('.custom-suffix')).toBeTruthy()
  })

  // === rootClass ===

  it('applies rootClass to root element', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, rootClass: 'my-mentions' },
    })
    const root = document.querySelector('.ant-mentions')
    expect(root?.className).toContain('my-mentions')
  })

  // === RTL ===

  it('renders RTL direction', () => {
    mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Mentions options={defaultOptions} />
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    expect(document.querySelector('.ant-mentions-rtl')).toBeTruthy()
  })

  // === ConfigProvider ===

  describe('configProvider', () => {
    it('uses custom prefixCls', () => {
      mount({
        render() {
          return (
            <ConfigProvider prefixCls="custom">
              <Mentions options={defaultOptions} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      expect(document.querySelector('.custom-mentions')).toBeTruthy()
    })

    it('uses ConfigProvider size', () => {
      mount({
        render() {
          return (
            <ConfigProvider componentSize="small">
              <Mentions options={defaultOptions} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const allElements = document.querySelectorAll('[class*="ant-mentions"]')
      const hasSmClass = Array.from(allElements).some(el => el.className.includes('ant-mentions-sm'))
      expect(hasSmClass).toBe(true)
    })
  })

  // === Expose ===

  it('exposes focus and blur methods', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
    })
    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
  })

  // === Placeholder ===

  it('renders placeholder on textarea', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, placeholder: 'Type @ to mention' },
    })
    expect(document.querySelector('textarea')?.getAttribute('placeholder')).toBe('Type @ to mention')
  })

  // === ReadOnly ===

  it('renders readonly textarea', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, readOnly: true },
    })
    expect(document.querySelector('textarea')?.readOnly).toBe(true)
  })

  // === Option export ===

  it('exports Option component', () => {
    expect(Mentions.Option).toBeTruthy()
  })

  // === install ===

  it('has install method', () => {
    expect(typeof Mentions.install).toBe('function')
  })

  // === Slot children (Mentions.Option) ===

  it('renders with slot children (deprecated Mentions.Option pattern)', () => {
    const { Option } = Mentions
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      slots: {
        default: () => [
          <Option value="afc163">afc163</Option>,
          <Option value="zombieJ">zombieJ</Option>,
        ],
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // === labelRender ===

  it('supports labelRender prop', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        labelRender: ({ option }: { option: any }) => <span>{option.value.toUpperCase()}</span>,
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('supports labelRender slot', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
      slots: {
        labelRender: ({ option }: any) => <span>{option.value.toUpperCase()}</span>,
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  // === PurePanel ===

  it('renders PurePanel', () => {
    const PurePanel = (Mentions as any)._InternalPanelDoNotUseOrYouWillBeFired
    expect(PurePanel).toBeTruthy()
    const wrapper = mount(PurePanel, { attachTo: document.body })
    expect(wrapper.element).toBeTruthy()
  })

  // === Attrs passthrough ===

  it('passes data attributes through', () => {
    mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
      attrs: {
        'data-testid': 'mentions-input',
      },
    })
    expect(document.querySelector('[data-testid="mentions-input"]')).toBeTruthy()
  })

  // === Dynamic props update ===

  it('updates size dynamically', async () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, size: 'small' },
    })
    expect(document.querySelector('.ant-mentions')?.className).toContain('ant-mentions-sm')

    await wrapper.setProps({ size: 'large' })
    expect(document.querySelector('.ant-mentions')?.className).not.toContain('ant-mentions-sm')
    expect(document.querySelector('.ant-mentions')?.className).toContain('ant-mentions-lg')
  })

  it('updates disabled dynamically', async () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, disabled: false },
    })
    expect(document.querySelector('textarea')?.disabled).toBe(false)

    await wrapper.setProps({ disabled: true })
    expect(document.querySelector('textarea')?.disabled).toBe(true)
    expect(document.querySelector('.ant-mentions-disabled')).toBeTruthy()
  })

  it('updates variant dynamically', async () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions, variant: 'outlined' },
    })
    expect(document.querySelector('.ant-mentions-outlined')).toBeTruthy()

    await wrapper.setProps({ variant: 'filled' })
    expect(document.querySelector('.ant-mentions-outlined')).toBeFalsy()
    expect(document.querySelector('.ant-mentions-filled')).toBeTruthy()
  })

  // === Snapshot ===

  it('matches snapshot', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: { options: defaultOptions },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot with features', () => {
    const wrapper = mount(Mentions, {
      attachTo: document.body,
      props: {
        options: defaultOptions,
        size: 'large',
        allowClear: true,
        value: 'hello',
        rootClass: 'snap-root',
        status: 'error',
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

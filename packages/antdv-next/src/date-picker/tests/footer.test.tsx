import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import DatePicker from '..'
import TimePicker from '../../time-picker'
import { mount } from '/@tests/utils'

function getButton(name: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.ant-picker-footer button'))
    .find(button => button.textContent?.trim() === name)
}

function createButton(testId: string) {
  return defineComponent((_, { slots }) => {
    return () => h('button', { 'type': 'button', 'data-testid': testId }, slots.default?.())
  })
}

describe('date-picker.footer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  const pickers = [
    ['DatePicker', DatePicker, { showTime: true }],
    ['RangePicker', DatePicker.RangePicker, { showTime: true, showNow: true }],
    ['TimePicker', TimePicker, {}],
    ['TimeRangePicker', TimePicker.RangePicker, { showNow: true }],
  ] as const

  it.each(pickers)('%s uses accessible footer buttons without submitting a form', async (_, Picker, props) => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault())
    const wrapper = mount({
      render: () => h('form', { onSubmit }, [h(Picker as any, { open: true, ...props })]),
    }, { attachTo: document.body })
    await nextTick()

    const now = getButton('Now')!
    const ok = getButton('OK')!
    expect(now.getAttribute('type')).toBe('button')
    expect(ok.getAttribute('type')).toBe('button')
    expect(ok.classList.contains('ant-btn-primary')).toBe(true)
    expect(ok.classList.contains('ant-picker-ok')).toBe(true)
    now.focus()
    expect(document.activeElement).toBe(now)
    now.click()
    ok.click()
    expect(onSubmit).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('disables Today when the current date is unavailable', async () => {
    const onChange = vi.fn()
    const wrapper = mount(DatePicker, {
      props: { open: true, disabledDate: () => true, onChange },
      attachTo: document.body,
    })
    await nextTick()

    const today = getButton('Today')!
    expect(today.disabled).toBe(true)
    today.click()
    expect(onChange).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('supports separate custom Now and OK buttons', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        showTime: true,
        components: { nowButton: createButton('custom-now'), okButton: createButton('custom-ok') } as any,
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('[data-testid="custom-now"]')?.textContent).toBe('Now')
    expect(document.querySelector('[data-testid="custom-ok"]')?.textContent).toBe('OK')

    wrapper.unmount()
  })

  it('keeps custom legacy confirmation buttons', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        showTime: true,
        components: { button: createButton('legacy-ok') } as any,
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('[data-testid="legacy-ok"]')?.textContent).toBe('OK')
    expect(getButton('Now')?.hasAttribute('data-testid')).toBe(false)

    wrapper.unmount()
    errorSpy.mockRestore()
  })
})

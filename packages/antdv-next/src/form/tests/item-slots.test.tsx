import { describe, expect, it, vi } from 'vitest'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form item slots', () => {
  it('supports label/tooltip/extra/help slots', () => {
    const wrapper = mount(() => (
      <Form model={{ username: '' }}>
        <FormItem
          name="username"
          v-slots={{
            label: () => <span class="slot-label">Slot Label</span>,
            tooltip: () => <span class="slot-tooltip">Slot Tooltip</span>,
            extra: () => <span class="slot-extra">Slot Extra</span>,
            help: () => <span class="slot-help">Slot Help</span>,
          }}
        >
          <input />
        </FormItem>
      </Form>
    ), { attachTo: document.body })

    expect(wrapper.find('.slot-label').exists()).toBe(true)
    expect(wrapper.find('.ant-form-item-tooltip').exists()).toBe(true)
    expect(wrapper.find('.slot-extra').exists()).toBe(true)
    expect(wrapper.find('.slot-help').exists()).toBe(true)

    wrapper.unmount()
  })

  it('uses slot content before prop values', () => {
    const tooltipSlot = vi.fn(() => ({
      title: <span class="slot-tooltip-title">Slot Tooltip</span>,
    }))

    const wrapper = mount(() => (
      <Form model={{ username: '' }}>
        <FormItem
          name="username"
          label="Prop Label"
          extra="Prop Extra"
          help="Prop Help"
          tooltip={{
            title: 'Prop Tooltip',
            icon: <span class="prop-tooltip-icon">P</span>,
          }}
          v-slots={{
            label: () => <span>Slot Label</span>,
            tooltip: tooltipSlot,
            extra: () => <span>Slot Extra</span>,
            help: () => <span>Slot Help</span>,
          }}
        >
          <input />
        </FormItem>
      </Form>
    ), { attachTo: document.body })

    expect(wrapper.text()).toContain('Slot Label')
    expect(wrapper.text()).toContain('Slot Extra')
    expect(wrapper.text()).toContain('Slot Help')
    expect(wrapper.text()).not.toContain('Prop Label')
    expect(wrapper.text()).not.toContain('Prop Extra')
    expect(wrapper.text()).not.toContain('Prop Help')
    expect(tooltipSlot).toHaveBeenCalled()
    expect(tooltipSlot.mock.calls[0]?.[0]).toEqual(expect.objectContaining({ title: 'Prop Tooltip' }))
    expect(wrapper.find('.prop-tooltip-icon').exists()).toBe(true)

    wrapper.unmount()
  })
})

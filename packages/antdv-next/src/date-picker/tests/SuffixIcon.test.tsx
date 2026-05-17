import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import SuffixIcon from '../generatePicker/SuffixIcon'
import { mount } from '/@tests/utils'

describe('date picker suffix icon', () => {
  it('marks default calendar icon as decorative', () => {
    const wrapper = mount(SuffixIcon)

    expect(wrapper.find('.anticon-calendar').attributes('aria-hidden')).toBe('true')
  })

  it('marks default time icon as decorative without hiding feedback icon', () => {
    const wrapper = mount(SuffixIcon, {
      props: {
        picker: 'time',
        hasFeedback: true,
        feedbackIcon: h('span', { class: 'feedback-icon', 'aria-label': 'feedback' }),
      },
    })

    expect(wrapper.find('.anticon-clock-circle').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.feedback-icon').attributes('aria-label')).toBe('feedback')
  })
})

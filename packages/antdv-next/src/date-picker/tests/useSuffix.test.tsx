import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import useSuffix from '../generatePicker/useSuffix'
import { mount } from '/@tests/utils'

function mountSuffix(props: Parameters<typeof useSuffix>[0] = {}) {
  return mount(defineComponent(() => () => h('div', null, [useSuffix(props) as any])))
}

describe('date picker useSuffix', () => {
  it('marks default calendar icon as decorative', () => {
    const wrapper = mountSuffix()

    expect(wrapper.find('.anticon-calendar').attributes('aria-hidden')).toBe('true')
  })

  it('marks default time icon as decorative without hiding feedback icon', () => {
    const wrapper = mountSuffix({
      picker: 'time',
      hasFeedback: true,
      feedbackIcon: h('span', { 'class': 'feedback-icon', 'aria-label': 'feedback' }),
    })

    expect(wrapper.find('.anticon-clock-circle').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.feedback-icon').attributes('aria-label')).toBe('feedback')
  })

  it('returns null for null / false suffix', () => {
    expect(useSuffix({ suffix: null })).toBeNull()
    expect(useSuffix({ suffix: false })).toBeNull()
  })

  it('returns custom suffix as is', () => {
    expect(useSuffix({ suffix: '123' })).toBe('123')
  })
})

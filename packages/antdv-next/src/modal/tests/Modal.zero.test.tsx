import { describe, expect, it } from 'vitest'
import { renderCloseIcon } from '../shared'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59153
describe('modal numeric zero close icon', () => {
  const render = (closeIcon?: any) =>
    mount({ render: () => renderCloseIcon('ant-modal', closeIcon) })

  it('renders `closeIcon={0}` instead of the default close icon', () => {
    const wrapper = render(0)
    expect(wrapper.find('.ant-modal-close-x').text()).toBe('0')
    expect(wrapper.find('.ant-modal-close-icon').exists()).toBe(false)
  })

  it('falls back to the default close icon for non-renderable values', () => {
    expect(render('').find('.ant-modal-close-icon').exists()).toBe(true)
    expect(render(undefined).find('.ant-modal-close-icon').exists()).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import Link from '../Link'
import Paragraph from '../Paragraph'
import Text from '../Text'
import Title from '../Title'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59054
describe('typography shimmer', () => {
  it.each([
    ['Text', () => <Text shimmer>Text</Text>],
    ['Title', () => <Title shimmer>Title</Title>],
    ['Paragraph', () => <Paragraph shimmer>Paragraph</Paragraph>],
    ['Link', () => <Link shimmer>Link</Link>],
  ])('should support shimmer on %s', (_, renderNode) => {
    const wrapper = mount(renderNode)
    const element = wrapper.find('.ant-typography').element as HTMLElement

    expect(element.classList.contains('ant-typography-shimmer')).toBe(true)
    expect(element.hasAttribute('shimmer')).toBe(false)
    expect(element.getAttribute('aria-busy')).toBe('true')
  })

  it('should use default shimmer duration', () => {
    const wrapper = mount(() => <Text shimmer>Text</Text>)
    const element = wrapper.find('.ant-typography').element as HTMLElement

    expect(element.style.getPropertyValue('--ant-typography-shimmer-motion-time')).toBe('1')
    expect(element.style.getPropertyValue('--ant-typography-shimmer-wait-time')).toBe('1')
  })

  it('should support custom shimmer duration', () => {
    const wrapper = mount(() => <Text shimmer={{ duration: [1.5, 0.5] }}>Text</Text>)
    const element = wrapper.find('.ant-typography').element as HTMLElement

    expect(element.style.getPropertyValue('--ant-typography-shimmer-motion-time')).toBe('1.5')
    expect(element.style.getPropertyValue('--ant-typography-shimmer-wait-time')).toBe('0.5')
  })

  it('should not enable shimmer for disabled text', () => {
    const wrapper = mount(() => (
      <Text shimmer disabled>
        Text
      </Text>
    ))
    const element = wrapper.find('.ant-typography').element as HTMLElement

    expect(element.classList.contains('ant-typography-shimmer')).toBe(false)
    expect(element.getAttribute('aria-busy')).toBe('false')
    expect(element.getAttribute('aria-disabled')).toBe('true')
  })

  it('should not set shimmer attributes without shimmer', () => {
    const wrapper = mount(() => <Text>Text</Text>)
    const element = wrapper.find('.ant-typography').element as HTMLElement

    expect(element.classList.contains('ant-typography-shimmer')).toBe(false)
    expect(element.hasAttribute('aria-busy')).toBe(false)
    expect(element.style.getPropertyValue('--ant-typography-shimmer-motion-time')).toBe('')
  })
})

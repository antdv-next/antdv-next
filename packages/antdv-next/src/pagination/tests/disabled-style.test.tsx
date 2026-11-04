import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Pagination from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59780
describe('pagination disabled custom link style', () => {
  it('applies disabled cursor to custom prev/next links', () => {
    const wrapper = mount(() => (
      <Pagination
        total={50}
        current={1}
        itemRender={(_page: number, type: string, element: any) => {
          if (type === 'prev')
            return h('a', { class: 'custom-prev' }, 'Previous')
          return element
        }}
      />
    ), { attachTo: document.body })

    const prev = wrapper.find('.custom-prev').element
    expect(prev.closest('.ant-pagination-disabled')).toBeTruthy()
    expect(getComputedStyle(prev).cursor).toBe('not-allowed')
    wrapper.unmount()
  })

  it('applies disabled cursor to custom links when the whole pagination is disabled', () => {
    const wrapper = mount(() => (
      <Pagination
        total={50}
        current={2}
        disabled
        itemRender={(_page: number, type: string, element: any) => {
          if (type === 'next')
            return h('a', { class: 'custom-next' }, 'Next')
          return element
        }}
      />
    ), { attachTo: document.body })

    const next = wrapper.find('.custom-next').element
    expect(getComputedStyle(next).cursor).toBe('not-allowed')
    wrapper.unmount()
  })
})

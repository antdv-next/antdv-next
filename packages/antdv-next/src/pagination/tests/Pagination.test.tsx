import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Pagination from '..'
import mountTest from '/@tests/shared/mountTest'
import { mount } from '/@tests/utils'

describe('pagination', () => {
  mountTest(Pagination)

  it('should render pagination', () => {
    const wrapper = mount(Pagination, {
      props: { total: 50 },
    })

    expect(wrapper.find('.ant-pagination').exists()).toBe(true)
  })

  it('should update current before change callback runs in controlled mode', async () => {
    const current = ref(1)
    const currentInChange: number[] = []
    const onChange = vi.fn(() => {
      currentInChange.push(current.value)
    })

    const wrapper = mount(() => (
      <Pagination
        total={50}
        v-model:current={current.value}
        onChange={onChange}
      />
    ))

    await wrapper.find('.ant-pagination-next .ant-pagination-item-link').trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenCalledWith(2, 10)
    expect(current.value).toBe(2)
    expect(currentInChange).toEqual([2])
  })
})

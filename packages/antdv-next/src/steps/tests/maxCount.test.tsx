import type { StepsProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Steps from '..'
import { mount } from '/@tests/utils'

type StepItem = NonNullable<StepsProps['items']>[number]

// https://github.com/ant-design/ant-design/pull/57987
describe('steps maxCount', () => {
  const items: StepItem[] = Array.from({ length: 7 }, (_, index) => ({
    title: `Step ${index + 1}`,
  }))

  const cases: Array<Array<number | null>> = [
    [0, 1, 2, null, 5, 6],
    [0, 1, 2, null, 5, 6],
    [0, 1, 2, 3, null, 6],
    [0, null, 2, 3, 4, null, 6],
    [0, null, 3, 4, 5, 6],
    [0, 1, null, 4, 5, 6],
    [0, 1, null, 4, 5, 6],
  ]

  function getRenderedSteps(el: HTMLElement): Array<number | null> {
    return Array.from(el.querySelectorAll<HTMLElement>('.ant-steps-item')).map((step) => {
      const title = step.querySelector('.ant-steps-item-title')?.textContent
      if (title) {
        return Number(title.replace('Step ', '')) - 1
      }
      expect(step.classList.contains('ant-steps-item-ellipsis')).toBe(true)
      return null
    })
  }

  cases.forEach((expected, current) => {
    it(`collapses correctly when current=${current}`, () => {
      const wrapper = mount(Steps, { props: { current, maxCount: 5, items } })
      expect(getRenderedSteps(wrapper.element as HTMLElement)).toEqual(expected)
    })
  })

  it('renders original items when maxCount is not applied', () => {
    for (const maxCount of [undefined, 7]) {
      const wrapper = mount(Steps, { props: { current: 2, maxCount, items } })
      expect(getRenderedSteps(wrapper.element as HTMLElement)).toEqual([0, 1, 2, 3, 4, 5, 6])
    }
  })

  it('warns and renders original items when maxCount is less than 3', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(Steps, { props: { current: 2, maxCount: 2, items } })
    expect(getRenderedSteps(wrapper.element as HTMLElement)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('`maxCount` should be greater than or equal to 3.'),
    )
    errorSpy.mockRestore()
  })

  it('maps onChange back to the original index', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Steps, { props: { current: 0, maxCount: 5, items, onChange } })
    // Display order: [0, 1, 2, ellipsis, 5, 6]; click the last visible step (Step 7 → index 6)
    const titles = wrapper.findAll('.ant-steps-item-title')
    await titles[titles.length - 1]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith(6)
  })
})

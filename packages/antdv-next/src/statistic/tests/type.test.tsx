import type { StatisticTimerProps } from '..'
import type { StatisticTimeEmits } from '../Timer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { StatisticTimer } from '..'

type ExpectTrue<T extends true> = T
type Equal<A, B> = (
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false
)

const timerChangeAssertions: [
  ExpectTrue<Equal<Parameters<StatisticTimeEmits['change']>, [value: number]>>,
  ExpectTrue<Equal<Parameters<NonNullable<StatisticTimerProps['onChange']>>, [value: number]>>,
] = [true, true]

describe('statistic.TypeScript', () => {
  it('timer change emits a numeric value', () => {
    expect(timerChangeAssertions).toEqual([true, true])
  })

  it('timer supports numeric onChange callbacks', () => {
    const onChange: StatisticTimerProps['onChange'] = (value: number) => value.toFixed(0)
    const wrapper = mount(() => (
      <>
        <StatisticTimer type="countdown" value={Date.now() + 1000} onChange={onChange} />
        <StatisticTimer type="countup" value={Date.now()} onChange={value => value.toFixed(0)} />
      </>
    ))

    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})

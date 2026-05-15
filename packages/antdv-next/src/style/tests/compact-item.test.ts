import { describe, expect, it } from 'vitest'
import { genCompactItemStyle } from '../compact-item'
import { genCompactItemVerticalStyle } from '../compact-item-vertical'

const token = {
  componentCls: '.ant-btn',
  lineWidth: 1,
  calc: (value: number) => ({
    mul: (factor: number) => ({
      equal: () => value * factor,
    }),
  }),
} as any

describe('compact item style', () => {
  it('puts hover above focus and active states', () => {
    const style = genCompactItemStyle(token) as any
    const itemStyle = style['.ant-btn-compact']['&-item']

    expect(itemStyle['&:focus,&:active']).toEqual({ zIndex: 3 })
    expect(itemStyle['&:hover']).toEqual({ zIndex: 4 })
  })

  it('puts vertical hover above focus and active states', () => {
    const style = genCompactItemVerticalStyle(token) as any
    const itemStyle = style['.ant-btn-compact-vertical']['&-item']

    expect(itemStyle['&:focus,&:active']).toEqual({ zIndex: 3 })
    expect(itemStyle['&:hover']).toEqual({ zIndex: 4 })
  })
})

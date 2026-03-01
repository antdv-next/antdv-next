import { describe, expect, it } from 'vitest'
import AbstractCalculator from '../src/theme/calc/calculator'

class TestCalculator extends AbstractCalculator {
  private current: number

  constructor(initial: number) {
    super()
    this.current = initial
  }

  add(num: number | string | AbstractCalculator) {
    this.current += Number((num as any).equal?.() ?? num)
    return this
  }

  sub(num: number | string | AbstractCalculator) {
    this.current -= Number((num as any).equal?.() ?? num)
    return this
  }

  mul(num: number | string | AbstractCalculator) {
    this.current *= Number((num as any).equal?.() ?? num)
    return this
  }

  div(num: number | string | AbstractCalculator) {
    this.current /= Number((num as any).equal?.() ?? num)
    return this
  }

  equal() {
    return this.current
  }
}

describe('abstractCalculator', () => {
  it('supports chain operations in concrete subclass', () => {
    const value = new TestCalculator(10)
      .add(2)
      .sub(1)
      .mul(3)
      .div(3)
      .equal()

    expect(value).toBe(11)
  })
})

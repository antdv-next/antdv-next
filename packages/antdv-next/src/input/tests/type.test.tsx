import type {
  InputPasswordRef,
  InputSearchRef,
  InputTextAreaRef,
  OTPEmits,
  OTPSlots,
} from '..'
import type Input from '..'
import type {
  InputOTPEmits as ComponentsInputOTPEmits,
  InputOTPSlots as ComponentsInputOTPSlots,
  InputPasswordRef as ComponentsInputPasswordRef,
  InputSearchRef as ComponentsInputSearchRef,
  InputTextAreaRef as ComponentsInputTextAreaRef,
} from '../../components'
import { describe, expect, it } from 'vitest'

type IsAny<T> = 0 extends (1 & T) ? true : false
type ExpectFalse<T extends false> = T
type ExpectTrue<T extends true> = T
type Equal<A, B> = (
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false
)

const inputStaticsAssertions: [
  ExpectFalse<IsAny<typeof Input.Password>>,
  ExpectFalse<IsAny<typeof Input.Search>>,
  ExpectFalse<IsAny<typeof Input.TextArea>>,
] = [
  false,
  false,
  false,
]

const inputRefAssertions: [
  ExpectTrue<Equal<InputPasswordRef extends { focus: (...args: any[]) => void, blur: () => void, input: HTMLInputElement | null } ? true : false, true>>,
  ExpectTrue<Equal<InputSearchRef extends { focus: (...args: any[]) => void, blur: () => void, input: HTMLInputElement | null } ? true : false, true>>,
  ExpectTrue<Equal<InputTextAreaRef extends { focus: (...args: any[]) => void, blur: () => void, nativeElement: HTMLElement | null } ? true : false, true>>,
] = [
  true,
  true,
  true,
]

const componentsExportAssertions: [
  ExpectTrue<Equal<OTPEmits, ComponentsInputOTPEmits>>,
  ExpectTrue<Equal<OTPSlots, ComponentsInputOTPSlots>>,
  ExpectTrue<Equal<InputPasswordRef, ComponentsInputPasswordRef>>,
  ExpectTrue<Equal<InputSearchRef, ComponentsInputSearchRef>>,
  ExpectTrue<Equal<InputTextAreaRef, ComponentsInputTextAreaRef>>,
] = [
  true,
  true,
  true,
  true,
  true,
]

describe('input.typescript', () => {
  it('exposes typed input compound members and ref aliases', () => {
    expect(inputStaticsAssertions).toHaveLength(3)
    expect(inputRefAssertions).toHaveLength(3)
    expect(componentsExportAssertions).toHaveLength(5)
  })
})

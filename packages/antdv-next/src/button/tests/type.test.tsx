import type {
  ButtonEmits,
  ButtonSemanticName,
  ButtonSlots,
  LegacyButtonType,
} from '..'
import type {
  ButtonEmits as ComponentsButtonEmits,
  ButtonSemanticName as ComponentsButtonSemanticName,
  ButtonSlots as ComponentsButtonSlots,
  LegacyButtonType as ComponentsLegacyButtonType,
} from '../../components'
import { describe, expect, it } from 'vitest'

type ExpectTrue<T extends true> = T
type Equal<A, B> = (
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false
)

const buttonExportAssertions: [
  ExpectTrue<Equal<ButtonEmits, ComponentsButtonEmits>>,
  ExpectTrue<Equal<ButtonSlots, ComponentsButtonSlots>>,
  ExpectTrue<Equal<ButtonSemanticName, ComponentsButtonSemanticName>>,
  ExpectTrue<Equal<LegacyButtonType, ComponentsLegacyButtonType>>,
] = [
  true,
  true,
  true,
  true,
]

describe('button.typescript', () => {
  it('exports button helper types through barrel files', () => {
    expect(buttonExportAssertions).toHaveLength(4)
  })
})

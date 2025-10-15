import { PresetColors } from '../theme/interface'

const rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/
export const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
export function isUnBorderedButtonVariant(type?: ButtonVariantType) {
  return type === 'text' || type === 'link'
}

const _ButtonTypes = ['default', 'primary', 'dashed', 'link', 'text'] as const
export type ButtonType = (typeof _ButtonTypes)[number]

const _ButtonShapes = ['default', 'circle', 'round'] as const
export type ButtonShape = (typeof _ButtonShapes)[number]

const _ButtonHTMLTypes = ['submit', 'button', 'reset'] as const
export type ButtonHTMLType = (typeof _ButtonHTMLTypes)[number]

export const _ButtonVariantTypes = [
  'outlined',
  'dashed',
  'solid',
  'filled',
  'text',
  'link',
] as const
export type ButtonVariantType = (typeof _ButtonVariantTypes)[number]

export const _ButtonColorTypes = ['default', 'primary', 'danger', ...PresetColors] as const

export type ButtonColorType = (typeof _ButtonColorTypes)[number]

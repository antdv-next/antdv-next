import type { ColorGenInput } from '@v-c/color-picker'

export type {
  ColorGenInput,
}

export type Colors<T> = {
  color: ColorGenInput<T>
  percent: number
}[]

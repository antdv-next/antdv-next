import type { CSSProperties } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext'

export interface FlexProps extends ComponentBaseProps {
  vertical?: boolean
  wrap?: boolean | CSSProperties['flexWrap']
  justify?: CSSProperties['justifyContent']
  align?: CSSProperties['alignItems']
  flex?: CSSProperties['flex']
  gap?: CSSProperties['gap'] | SizeType
  component?: any
}

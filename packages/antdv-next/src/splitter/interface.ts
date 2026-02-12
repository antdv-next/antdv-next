import type { CSSProperties } from 'vue'
// ================ outside ================
import type {
  Orientation,
  SemanticClassNamesType,
  SemanticStylesType,
} from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import type { ShowCollapsibleIconMode } from './SplitBar'

export type SplitterSemanticName = keyof SplitterSemanticClassNames & keyof SplitterSemanticStyles

export interface SplitterSemanticClassNames {
  root?: string
  panel?: string
}

export interface SplitterSemanticStyles {
  root?: CSSProperties
  panel?: CSSProperties
}

export type DraggerSemantic = keyof DraggerSemanticClassNames & keyof DraggerSemanticStyles

export interface DraggerSemanticClassNames {
  default?: string
  active?: string
}

export interface DraggerSemanticStyles {
  default?: CSSProperties
  active?: CSSProperties
}

export interface SplitterSemanticDraggerClassNames {
  default?: string
  active?: string
}

export type SplitterClassNamesType = SemanticClassNamesType<
  SplitterProps,
  SplitterSemanticClassNames,
  { dragger?: string | DraggerSemanticClassNames }
>

export type SplitterStylesType = SemanticStylesType<
  SplitterProps,
  SplitterSemanticStyles,
  { dragger?: CSSProperties | DraggerSemanticStyles }
>

export interface SplitterProps extends ComponentBaseProps {
  classes?: SplitterClassNamesType
  styles?: SplitterStylesType
  /**
   * @deprecated please use `orientation`
   * @default horizontal
   */
  layout?: Orientation
  orientation?: Orientation
  vertical?: boolean
  draggerIcon?: VueNode
  collapsibleIcon?: {
    start?: VueNode
    end?: VueNode
  }
  onDraggerDoubleClick?: (index: number) => void
  onResizeStart?: (sizes: number[]) => void
  onResize?: (sizes: number[]) => void
  onResizeEnd?: (sizes: number[]) => void
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void
  'onUpdate:collapse'?: (collapsed: boolean[]) => void
  lazy?: boolean
}

export interface SplitterEmits {
  // 'resizeStart': (sizes: number[]) => void
  // 'resize': (sizes: number[]) => void
  // 'resizeEnd': (sizes: number[]) => void
  // 'collapse': (collapsed: boolean[], sizes: number[]) => void
  // 'update:collapse': (collapsed: boolean[]) => void
}
export interface SplitterSlots {
  draggerIcon?: () => any
  collapsibleIconStart?: () => any
  collapsibleIconEnd?: () => any
  default?: () => any
}

export interface PanelProps {
  class?: string
  style?: CSSProperties
  min?: number | string
  max?: number | string
  size?: number | string
  collapsible?:
    | boolean
    | { start?: boolean, end?: boolean, showCollapsibleIcon?: ShowCollapsibleIconMode }
  resizable?: boolean
  defaultSize?: number | string
}

// ================ inside ================
export interface InternalPanelProps extends PanelProps {
  class?: string
  prefixCls?: string
}

export interface UseResizeProps {
  basicsState: number[]
  items: PanelProps[]
  panelsRef: Array<{ current: HTMLElement | null }>
  reverse: boolean
  setBasicsState: (value: number[] | ((prevState: number[]) => number[])) => void
  onResize: (sizes: number[]) => void
}

export interface UseResize {
  setSize: (data: { size: number, index: number }[]) => void
  setOffset: (offset: number, containerSize: number, index: number) => void
}

export interface UseHandleProps extends Pick<SplitterProps, 'layout'> {
  basicsState: number[]
  containerRef?: { current: HTMLDivElement | null }
  setOffset: UseResize['setOffset']
  setResizing: (value: boolean | ((prevState: boolean) => boolean)) => void
  onResizeStart: (sizes: number[]) => void
  onResizeEnd: (sizes: number[]) => void
}

export interface UseHandle {
  onStart: (x: number, y: number, index: number) => void
}

export interface UseCollapsibleProps {
  basicsState: number[]
  collapsible?: PanelProps['collapsible']
  index: number
  reverse: boolean
  setSize?: UseResize['setSize']
}

export interface UseCollapsible {
  nextIcon: boolean
  overlap: boolean
  previousIcon: boolean
  onFold: (type: 'previous' | 'next') => void
  setOldBasics: () => void
}

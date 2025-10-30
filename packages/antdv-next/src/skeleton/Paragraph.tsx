import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'

type WidthUnit = number | string

export interface SkeletonParagraphProps {
  prefixCls?: string
  rootClass?: string
  width?: WidthUnit | Array<WidthUnit>
  rows?: number
}

function getWidth(index: number, props: SkeletonParagraphProps) {
  const { width, rows = 2 } = props
  if (Array.isArray(width)) {
    return width[index]
  }
  // last paragraph
  if (rows - 1 === index) {
    return width
  }
  return undefined
}

const defaults = {
  rows: 0,
} as any

const Paragraph = defineComponent<SkeletonParagraphProps>(
  (props = defaults, { attrs }) => {
    return () => {
      const { prefixCls, rootClass, rows = 0 } = props
      const rowList = Array.from({ length: rows }).map((_, index) => (
        <li key={index} style={{ width: getWidth(index, props) }} />
      ))
      return (
        <ul class={classNames(prefixCls, rootClass, (attrs as any)?.class)} {...omit(attrs, ['class'])}>
          {rowList}
        </ul>
      )
    }
  },
  {
    name: 'ASkeletonParagraph',
    inheritAttrs: false,
  },
)

export default Paragraph

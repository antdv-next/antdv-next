import type { CSSProperties } from 'vue'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'

export interface SkeletonTitleProps {
  prefixCls?: string
  rootClass?: string
  style?: CSSProperties
  width?: number | string
}

const Title = defineComponent<SkeletonTitleProps>(
  (props, { attrs }) => {
    return () => {
      const { prefixCls, rootClass, width } = props
      return (
        <h3
          class={classNames(prefixCls, rootClass, (attrs as any)?.class)}
          style={[{ width }, (attrs as any)?.style]}
          {...omit(attrs, ['class', 'style'])}
        />
      )
    }
  },
  {
    name: 'ASkeletonTitle',
    inheritAttrs: false,
  },
)

export default Title

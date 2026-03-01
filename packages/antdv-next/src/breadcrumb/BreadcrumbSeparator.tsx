import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context.ts'
import { useBreadcrumbContext } from './BreadcrumbContext.ts'

const BreadcrumbSeparator = defineComponent(
  (_, { slots }) => {
    const { prefixCls } = useBaseConfig('breadcrumb')
    const breadcrumbContext = useBreadcrumbContext()
    return () => {
      const { classes: mergedClassNames, styles: mergedStyles } = breadcrumbContext.value

      const children = filterEmpty(slots?.default?.() ?? [])
      return (
        <li
          class={clsx(
            `${prefixCls.value}-separator`,
            mergedClassNames?.separator,
          )}
          style={mergedStyles?.separator}
        >
          {children.length === 1 ? (children[0] === '' ? children : children[0]) : (children.length === 0 ? '/' : children)}
        </li>
      )
    }
  },
  {
    name: 'ABreadcrumbSeparator',
    inheritAttrs: false,
  },
)

;(BreadcrumbSeparator as any).__ANT_BREADCRUMB_SEPARATOR = true
export default BreadcrumbSeparator as typeof BreadcrumbSeparator & {
  /** @internal */
  __ANT_BREADCRUMB_SEPARATOR: boolean
}

import type {
  PopoverClassNamesType,
  PopoverProps,
  PopoverSemanticClassNames,
  PopoverSemanticStyles,
  PopoverStylesType,
} from '.'
import type { VueNode } from '../_util/type.ts'
import { Popup } from '@v-c/tooltip'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useStyle from './style'

interface OverlayProps {
  prefixCls?: string
  title?: VueNode
  content?: VueNode
  classes?: PopoverSemanticClassNames
  styles?: PopoverSemanticStyles
}

export const Overlay = defineComponent<OverlayProps>(
  (props, { slots }) => {
    return () => {
      const { prefixCls, classes, styles } = props
      const title = getSlotPropsFnRun(slots, props, 'title')
      const content = getSlotPropsFnRun(slots, props, 'content')
      if (!title && !content) {
        return null
      }
      return (
        <>
          {title && (
            <div class={clsx(`${prefixCls}-title`, classes?.title)} style={styles?.title}>
              {title}
            </div>
          )}
          {content && (
            <div class={clsx(`${prefixCls}-content`, classes?.content)} style={styles?.content}>
              {content}
            </div>
          )}
        </>
      )
    }
  },
)

export interface PurePanelProps extends PopoverProps {

}

interface RawPurePanelProps extends PopoverProps {
  hashId: string
}
const defaults = {
  placement: 'top',
} as any

export const RawPurePanel = defineComponent<RawPurePanelProps>(
  (props = defaults, { slots, attrs }) => {
    const { classes, styles } = toPropsRefs(props, 'styles', 'classes')
    const mergedProps = computed(() => {
      return props
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PopoverClassNamesType,
      PopoverStylesType,
      PopoverProps
    >(useToArr(classes), useToArr(styles), useToProps(mergedProps))
    return () => {
      const titleNode = getSlotPropsFnRun(slots, props, 'title')
      const contentNode = getSlotPropsFnRun(slots, props, 'content')
      const children = filterEmpty(slots?.default?.() ?? [])
      const { hashId, prefixCls, placement } = props
      const rootClassName = clsx(
        hashId,
        prefixCls,
        `${prefixCls}-pure`,
        `${prefixCls}-placement-${placement}`,
        (attrs as any).class,
      )
      return (
        <div class={rootClassName} style={(attrs as any).style}>
          <div class={`${prefixCls}-arrow`} />
          <Popup {...props} className={hashId} prefixCls={prefixCls} classNames={mergedClassNames.value} styles={mergedStyles.value}>
            {children.length
              ? children
              : (
                  <Overlay
                    prefixCls={prefixCls}
                    title={titleNode}
                    content={contentNode}
                    classes={mergedClassNames.value}
                    styles={mergedStyles.value}
                  />
                )}
          </Popup>
        </div>
      )
    }
  },
  {
    name: 'PopoverRawPurePanel',
    inheritAttrs: false,
  },
)

const PurePanel = defineComponent<PurePanelProps>(
  (props, { attrs, slots }) => {
    const { prefixCls } = useComponentBaseConfig('popover', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const content = getSlotPropsFnRun(slots, props, 'content')
      return (
        <RawPurePanel
          {...omit(attrs, ['class'])}
          {...props}
          content={content}
          prefixCls={prefixCls.value}
          hashId={hashId.value}
          class={clsx((attrs as any).class, cssVarCls.value)}
        />
      )
    }
  },
  {
    name: 'PopoverPurePanel',
    inheritAttrs: false,
  },
)

export default PurePanel

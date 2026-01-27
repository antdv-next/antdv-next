import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties, Ref, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { StepItem, StepsProps, StepsSemanticClassNames, StepsSemanticName, StepsSemanticStyles } from '../steps'
import { useUnstableProvider } from '@v-c/steps/dist/UnstableContext.js'
import { classNames as clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, ref, toRefs } from 'vue'
import { useBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Steps from '../steps'
import { provideInternalContext } from '../steps/context.ts'
import useStyle from './style'
import useItems from './useItems'

type Color = 'blue' | 'red' | 'green' | 'gray'

export type ItemPlacement = 'start' | 'end'

export type ItemPosition = 'left' | 'right' | 'start' | 'end'

export interface TimelineItemType {
  // Style
  color?: LiteralUnion<Color>
  className?: string
  style?: CSSProperties
  classes?: NonNullable<StepItem['classes']>
  styles?: NonNullable<StepItem['styles']>

  // Design
  placement?: ItemPlacement
  /** @deprecated please use `placement` instead */
  position?: ItemPosition
  loading?: boolean

  // Data
  key?: string | number
  title?: VueNode
  content?: VueNode
  /** @deprecated Please use `title` instead */
  label?: VueNode
  /** @deprecated Please use `content` instead */
  children?: VueNode

  // Icon
  icon?: VueNode
  /** @deprecated Please use `icon` instead */
  dot?: VueNode
}

export type TimelineSemanticName = StepsSemanticName

export type TimelineSemanticClassNames = StepsSemanticClassNames

export type TimelineSemanticStyles = StepsSemanticStyles

export type TimelineClassNamesType = SemanticClassNamesType<
  TimelineProps,
  TimelineSemanticClassNames
>

export type TimelineMode = ItemPosition | 'alternate'

export interface TimelineProps extends ComponentBaseProps {
  pending?: VueNode
  pendingDot?: VueNode
  reverse?: boolean
  mode?: 'left' | 'alternate' | 'right' | 'start' | 'end'
  items?: TimelineItemType[]
  dotRender?: (params: { item: TimelineItemType, index: number }) => void
  labelRender?: (params: { item: TimelineItemType, index: number }) => void
  contentRender?: (params: { item: TimelineItemType, index: number }) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: StepsProps['variant']
  classes?: TimelineClassNamesType
  styles?: TimelineStylesType
}

export type TimelineStylesType = SemanticStylesType<TimelineProps, TimelineSemanticStyles>

export interface TimelineSlots {
  pending?: () => void
  pendingDot?: () => void
  dotRender?: (params: { item: TimelineItemType, index: number }) => void
  labelRender?: (params: { item: TimelineItemType, index: number }) => void
  contentRender?: (params: { item: TimelineItemType, index: number }) => void
}

const Timeline = defineComponent<
  TimelineProps,
  EmptyEmit,
  string,
  SlotsType<TimelineSlots>
>(
  (props, { slots, attrs }) => {
    provideInternalContext(ref({
      rootComponent: 'ol',
      itemComponent: 'li',
    }))

    const { reverse } = toRefs(props)
    const orientation = computed(() => props.orientation || 'vertical')
    useUnstableProvider({ railFollowPrevStatus: reverse as Ref<boolean> })

    const { prefixCls, timeline, direction } = useBaseConfig('timeline', props)
    const items = computed(() => props.items)
    const pending = computed(() => props.pending)
    const pendingDot = computed(() => props.pendingDot)
    // ===================== Mode =======================
    const mergedMode = computed(() => {
    // Deprecated
      if (props.mode === 'left') {
        return 'start'
      }

      if (props.mode === 'right') {
        return 'end'
      }

      // Fill
      const modeList: (string | undefined)[] = ['alternate', 'start', 'end']
      return (modeList.includes(props.mode) ? props.mode : 'start') as TimelineMode
    })

    // Style
    const rootCls = useCSSVarCls(prefixCls)

    const [hashId, cssVarCls] = useStyle(prefixCls)

    const rawItems = useItems(rootCls, prefixCls, mergedMode, items, pending, pendingDot)

    const mergedItems = computed(() => {
      return (props.reverse ? [...rawItems.value].reverse() : rawItems.value) as StepItem[]
    })

    // ==================== Design ======================
    const layoutAlternate = computed(
      () => {
        return mergedMode.value === 'alternate'
          || (orientation.value === 'vertical' && mergedItems.value.some(item => item.title))
      },
    )

    const mergedClasses = computed(() => {
      return {
        item: `${prefixCls.value}-item`,
        itemTitle: `${prefixCls.value}-item-title`,
        itemIcon: `${prefixCls.value}-item-icon`,
        itemContent: `${prefixCls.value}-item-content`,
        itemRail: `${prefixCls.value}-item-rail`,
        itemWrapper: `${prefixCls.value}-item-wrapper`,
        itemSection: `${prefixCls.value}-item-section`,
        itemHeader: `${prefixCls.value}-item-header`,
      }
    })

    return () => {
      const { variant = 'outlined' } = props

      return (
        <Steps
          {...omit(attrs, ['class', 'style'])}
          {...omit(props, ['items', 'prefixCls'])}
          class={clsx(
            timeline.value?.class,
            (attrs as any).class,
            rootCls.value,
            hashId.value,
            cssVarCls.value,
            prefixCls.value,
            { [`${prefixCls.value}-${orientation.value}`]: orientation.value === 'horizontal', [`${prefixCls.value}-layout-alternate`]: layoutAlternate.value, [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
          )}
          classes={mergedClasses.value}
          style={{
            ...(timeline?.value?.style || {}),
            ...((attrs as any).style || {}),
          }}
          // Design
          variant={variant}
          orientation={orientation.value}
          // Layout
          type="dot"
          items={mergedItems.value}
          v-slots={slots}
          current={mergedItems.value.length - 1}
        />
      )
    }
  },
  {
    name: 'ATimeline',
    inheritAttrs: false,
  },
)

;(Timeline as any).install = (app: App) => {
  app.component(Timeline.name, Timeline)
}

export default Timeline

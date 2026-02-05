import type { ItemType } from '@v-c/collapse'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import type { CollapsibleType } from './CollapsePanel.tsx'
import { RightOutlined } from '@antdv-next/icons'
import VcCollapse from '@v-c/collapse'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import {
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import initCollapseMotion from '../_util/motion.ts'
import { toPropsRefs } from '../_util/tools.ts'
import { checkRenderNode, cloneElement } from '../_util/vueNode.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useStyle from './style'

export type ExpandIconPlacement = 'start' | 'end'

export type CollapseSemanticName = keyof CollapseSemanticClassNames & keyof CollapseSemanticStyles

export interface CollapseSemanticClassNames {
  root?: string
  header?: string
  title?: string
  body?: string
  icon?: string
}

export interface CollapseSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  body?: CSSProperties
  icon?: CSSProperties
}

export type CollapseClassNamesType = SemanticClassNamesType<
  CollapseProps,
  CollapseSemanticClassNames
>

export type CollapseStylesType = SemanticStylesType<CollapseProps, CollapseSemanticStyles>

export type CollapseItemType = Omit<ItemType, 'children'> & {
  content?: ItemType['children']
}
export interface CollapseProps {
  activeKey?: Array<string | number> | string | number
  defaultActiveKey?: Array<string | number> | string | number
  /** 手风琴效果 */
  accordion?: boolean
  /**
   * @since 5.25.0
   */
  destroyOnHidden?: boolean
  rootClass?: string
  bordered?: boolean
  prefixCls?: string
  expandIcon?: (panelProps: PanelProps) => any
  expandIconPlacement?: ExpandIconPlacement
  ghost?: boolean
  size?: SizeType
  collapsible?: CollapsibleType
  labelRender?: (params: { item: CollapseItemType, index: number }) => any
  contentRender?: (params: { item: CollapseItemType, index: number }) => any
  classes?: CollapseClassNamesType
  styles?: CollapseStylesType
  items?: CollapseItemType[]
}

export interface CollapseEmits {
  change: (key: string[]) => void
}

interface PanelProps {
  isActive?: boolean
  header?: VueNode
  className?: string
  style?: CSSProperties
  showArrow?: boolean
  forceRender?: boolean
  extra?: VueNode
  collapsible?: CollapsibleType
}

interface CollapseSlots {
  expandIcon: (panelProps: PanelProps) => any
  labelRender: (params: { item: CollapseItemType, index: number }) => any
  contentRender: (params: { item: CollapseItemType, index: number }) => any
}

const defaults = {
  expandIconPlacement: 'start',
  bordered: true,
} as any
const Collapse = defineComponent<
  CollapseProps,
  CollapseEmits,
  string,
  SlotsType<CollapseSlots>
>(
  (props = defaults, { attrs, emit, slots }) => {
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      direction,
      prefixCls,
      getPrefixCls,
      expandIcon,
    } = useComponentBaseConfig('collapse', props, ['expandIcon'])
    const { styles, classes } = toPropsRefs(props, 'styles', 'classes')
    const mergedSize = useSize<SizeType>(ctxSize => props?.size ?? ctxSize ?? 'middle')
    const rootPrefixCls = getPrefixCls()
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const mergedPlacement = computed(() => props.expandIconPlacement ?? 'start')
    const mergedProps = computed(() => props)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CollapseClassNamesType,
      CollapseStylesType,
      CollapseProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const renderExpandIcon = (panelProps: PanelProps = {}) => {
      const mergedExpandIcon = slots?.expandIcon ?? props?.expandIcon ?? expandIcon.value
      const icon = typeof mergedExpandIcon === 'function'
        ? mergedExpandIcon?.(panelProps)
        : (
            <RightOutlined
              rotate={panelProps.isActive ? (direction.value === 'rtl' ? -90 : 90) : undefined}
              aria-label={panelProps.isActive ? 'expanded' : 'collapsed'}
            />
          )
      return cloneElement(icon, () => {
        return {
          class: classNames(
            icon.props?.class,
            `${prefixCls.value}-arrow`,
          ),
        }
      })
    }
    const openMotion = computed(() => {
      return {
        ...initCollapseMotion(rootPrefixCls),
        appear: false,
      }
    })
    return () => {
      const { bordered, ghost, rootClass, destroyOnHidden } = props
      const collapseClassName = classNames(
        `${prefixCls.value}-icon-position-${mergedPlacement.value}`,
        {
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-ghost`]: !!ghost,
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value !== 'middle',
        },
        contextClassName.value,
        (attrs as any).class,
        rootClass,
        hashId.value,
        cssVarCls.value,
        mergedClassNames.value.root,
      )
      const labelRender = slots?.labelRender ?? props?.labelRender
      const contentRender = slots?.contentRender ?? props?.contentRender
      const items = (props.items ?? []).map((item, index) => {
        const label = checkRenderNode(labelRender ? labelRender?.({ item, index }) : item.label)
        const children = checkRenderNode(contentRender ? contentRender?.({ item, index }) : item.content)
        const _item: ItemType = {
          ...item,
        }
        if (label) {
          _item.label = label
        }
        if (children) {
          _item.children = children
        }
        return _item
      })
      return (
        <VcCollapse
          openMotion={openMotion.value}
          {...omit(attrs, ['class', 'style'])}
          {...omit(props, ['rootClass', 'items', 'expandIconPlacement', 'classes', 'styles']) as any}
          class={collapseClassName}
          prefixCls={prefixCls.value}
          style={[mergedStyles.value.root, contextStyle.value, (attrs as any).style]}
          expandIcon={renderExpandIcon}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          onChange={key => emit('change', key)}
          destroyOnHidden={destroyOnHidden}
          items={items}
        />
      )
    }
  },
  {
    name: 'ACollapse',
    inheritAttrs: false,
  },
)

;(Collapse as any).install = (app: App) => {
  app.component(Collapse.name, Collapse)
}
export default Collapse

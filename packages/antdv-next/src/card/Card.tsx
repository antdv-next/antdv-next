import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import type { Tab, TabsSlots } from '../tabs'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, isVNode } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useSize } from '../config-provider/hooks/useSize'
import useVariant from '../form/hooks/useVariant'
import Skeleton from '../skeleton'
import Tabs from '../tabs'
import useStyle from './style'

export type CardType = 'inner'

export type CardSize = 'default' | 'small'

export interface CardTabListType extends Omit<Tab, 'label'> {
  key: string
  /** @deprecated Please use `label` instead */
  tab?: VueNode
  label?: VueNode
}

export type CardSemanticName = keyof CardSemanticClassNames & keyof CardSemanticStyles

export interface CardSemanticClassNames {
  root?: string
  header?: string
  body?: string
  extra?: string
  title?: string
  actions?: string
  cover?: string
}

export interface CardSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  extra?: CSSProperties
  title?: CSSProperties
  actions?: CSSProperties
  cover?: CSSProperties
}

export type CardClassNamesType = SemanticClassNamesType<CardProps, CardSemanticClassNames>

export type CardStylesType = SemanticStylesType<CardProps, CardSemanticStyles>

export interface CardProps extends ComponentBaseProps {
  title?: VueNode
  extra?: VueNode
  /** @deprecated Please use `variant` instead */
  bordered?: boolean
  /** @deprecated Please use `styles.header` instead */
  headStyle?: CSSProperties
  /** @deprecated Please use `styles.body` instead */
  bodyStyle?: CSSProperties
  loading?: boolean
  hoverable?: boolean
  id?: string
  size?: CardSize
  type?: CardType
  cover?: VueNode
  actions?: VueNode[]
  tabList?: CardTabListType[]
  tabBarExtraContent?: VueNode | { [key: string]: VueNode }
  // onTabChange?: (key: string) => void
  activeTabKey?: string
  defaultActiveTabKey?: string
  tabProps?: Record<string, any>
  classes?: CardClassNamesType
  styles?: CardStylesType
  variant?: 'borderless' | 'outlined'
}

export interface CardEmits {
  'tabChange': (key: string) => void
  'update:activeTabKey': (key: string) => void
}

export interface CardSlots {
  default?: () => any
  title?: () => any
  extra?: () => any
  cover?: () => any
  actions?: () => any
  tabContentRender?: TabsSlots['contentRender']
  tabLabelRender?: TabsSlots['labelRender']
  tabBarExtraContent?: () => any
}

const ActionNode = defineComponent<{
  actionClasses: string
  actions: any[]
  actionStyle?: CSSProperties
}>(
  (props) => {
    return () => {
      const { actionClasses, actions = [], actionStyle } = props
      return (
        <ul class={actionClasses} style={actionStyle}>
          {actions.map((action, index) => {
            // Move this out since eslint not allow index key
            // And eslint-disable makes conflict with rollup
            // ref https://github.com/ant-design/ant-design/issues/46022
            const key = `action-${index}`
            return (
              <li style={{ width: `${100 / actions.length}%` }} key={key}>
                <span>{action}</span>
              </li>
            )
          })}
        </ul>
      )
    }
  },
)

const Card = defineComponent<
  CardProps,
  CardEmits,
  string,
  SlotsType<CardSlots>
>(
  (props, { slots, emit, attrs }) => {
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('card', props)
    const {
      styles,
      classes,
      size: customizeSize,
      variant: customVariant,
      bordered,
    } = toPropsRefs(props, 'bordered', 'variant', 'classes', 'styles', 'size')
    const [variant] = useVariant('card', customVariant, bordered)

    const mergedSize = useSize(customizeSize)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        variant: customVariant.value,
      } as CardProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CardClassNamesType,
      CardStylesType,
      CardProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // =================Warning===================
    if (isDev) {
      const warning = devUseWarning('Card');
      [
        ['headStyle', 'styles.header'],
        ['bodyStyle', 'styles.body'],
        ['bordered', 'variant'],
      ].forEach(([deprecatedName, newName]) => {
        warning.deprecated(!((props as any)[deprecatedName!] !== undefined), deprecatedName!, newName!)
      })
    }

    const onTabChange = (key: string) => {
      emit('tabChange', key)
    }

    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const {
        activeTabKey,
        tabProps,
        defaultActiveTabKey,
        tabBarExtraContent,
        tabList,
        headStyle,
        bodyStyle,
        loading,
        rootClass,
        hoverable,
        type,
      } = props
      const { style, className, restAttrs } = getAttrStyleAndClass(attrs)
      const children = filterEmpty(slots?.default?.() ?? [])
      const title = getSlotPropsFnRun(slots, props, 'title')
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      let actions = getSlotPropsFnRun(slots, props, 'actions')
      if (actions) {
        actions = filterEmpty(Array.isArray(actions) ? actions : [actions])
      }
      const cover = getSlotPropsFnRun(slots, props, 'cover')

      const isContainGrid = children.some(child => isVNode(child) && (child.type as any)?.name === 'ACardGrid')

      const loadingBlock = (
        <Skeleton loading active paragraph={{ rows: 4 }} title={false}>
          {children}
        </Skeleton>
      )
      const hasActiveTabKey = activeTabKey !== undefined
      const tabBarExtraContentSlot = typeof tabBarExtraContent === 'object' && tabBarExtraContent ? tabBarExtraContent : getSlotPropsFnRun(slots, props, 'tabBarExtraContent')
      const extraProps = {
        ...tabProps,
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
          ? activeTabKey
          : defaultActiveTabKey,
        tabBarExtraContent: tabBarExtraContentSlot,
      }

      let head: any

      const tabSize = !mergedSize.value || mergedSize.value === 'default' ? 'large' : mergedSize.value

      const tabsSlots: Record<string, any> = {
        contentRender: slots?.tabContentRender,
        labelRender: slots?.tabLabelRender,
      }
      const tabs = tabList
        ? (
            <Tabs
              size={tabSize}
              {...extraProps}
              class={`${prefixCls.value}-head-size`}
              {
                ... {
                  'onUpdate:activeKey': (key: string) => {
                    onTabChange(key)
                  },
                }
              }
              items={tabList.map(({ tab, ...item }) => {
                return { label: tab, ...item }
              })}
              v-slots={tabsSlots}
            />
          )
        : null
      if (title || extra || tabs) {
        const headClasses = clsx(`${prefixCls.value}-head`, mergedClassNames.value.header)
        const titleClasses = clsx(`${prefixCls.value}-head-title`, mergedClassNames.value.title)
        const extraClasses = clsx(`${prefixCls.value}-extra`, mergedClassNames.value.extra)
        const mergedHeadStyle: CSSProperties = {
          ...headStyle,
          ...mergedStyles.value.header,
        }
        head = (
          <div class={headClasses} style={mergedHeadStyle}>
            <div class={`${prefixCls.value}-head-wrapper`}>
              {!!title && (
                <div class={titleClasses} style={mergedStyles.value.title}>
                  {title}
                </div>
              )}
              {!!extra && (
                <div class={extraClasses} style={mergedStyles.value.extra}>
                  {extra}
                </div>
              )}
            </div>
            {tabs}
          </div>
        )
      }
      const coverClasses = clsx(`${prefixCls.value}-cover`, mergedClassNames.value.cover)

      const coverDom = cover
        ? (
            <div class={coverClasses} style={mergedStyles.value.cover}>{cover}</div>
          )
        : null

      const bodyClasses = clsx(`${prefixCls.value}-body`, mergedClassNames.value.body)

      const mergedBodyStyle = {
        ...bodyStyle,
        ...mergedStyles.value.body,
      }

      const body = (
        <div class={bodyClasses} style={mergedBodyStyle}>
          {loading ? loadingBlock : children}
        </div>
      )

      const actionClasses = clsx(`${prefixCls.value}-actions`, mergedClassNames.value.actions)
      // 需要处理一下actions

      const actionDom = actions?.length
        ? (
            <ActionNode actionClasses={actionClasses} actionStyle={mergedStyles.value.actions} actions={actions} />
          )
        : null

      const divProps = {
        ...restAttrs,
        id: props.id,
      }

      const classString = clsx(
        prefixCls.value,
        contextClassName.value,
        {
          [`${prefixCls.value}-loading`]: loading,
          [`${prefixCls.value}-bordered`]: variant.value !== 'borderless',
          [`${prefixCls.value}-hoverable`]: hoverable,
          [`${prefixCls.value}-contain-grid`]: isContainGrid,
          [`${prefixCls.value}-contain-tabs`]: tabList?.length,
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
          [`${prefixCls.value}-type-${type}`]: !!type,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        className,
        rootClass,
        hashId.value,
        cssVarCls.value,
        mergedClassNames.value.root,
      )

      const mergedStyle: CSSProperties = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      return (
        <div {...divProps} class={classString} style={mergedStyle}>
          {head}
          {coverDom}
          {body}
          {actionDom}
        </div>
      )
    }
  },
  {
    inheritAttrs: false,
    name: 'ACard',
  },
)

export default Card

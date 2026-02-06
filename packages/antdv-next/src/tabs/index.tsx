import type { GetIndicatorSize, MoreProps, TabsProps as VcTabsProps, Tab as VcTabType } from '@v-c/tabs'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import { CloseOutlined, EllipsisOutlined, PlusOutlined } from '@antdv-next/icons'
import VcTabs from '@v-c/tabs'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, toRef } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useAnimateConfig from './hooks/useAnimateConfig'
import useLegacyItems from './hooks/useLegacyItems'
import useStyle from './style'
import TabPane from './TabPane'

export type TabsType = 'line' | 'card' | 'editable-card'

export type TabPosition = 'top' | 'right' | 'bottom' | 'left'

export type TabPlacement = 'top' | 'end' | 'bottom' | 'start'

export type TabsSemanticName = keyof TabsSemanticClassNames & keyof TabsSemanticStyles

export interface TabsSemanticClassNames {
  root?: string
  item?: string
  indicator?: string
  content?: string
  header?: string
}

export interface TabsSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  indicator?: CSSProperties
  content?: CSSProperties
  header?: CSSProperties
}

export type TabsClassNamesType = SemanticClassNamesType<
  TabsProps,
  TabsSemanticClassNames,
  {
    popup?: { root?: string }
  }
>

export type TabsStylesType = SemanticStylesType<
  TabsProps,
  TabsSemanticStyles,
  {
    popup?: { root?: CSSProperties }
  }
>

export interface CompatibilityProps {
  /** @deprecated Please use `destroyOnHidden` instead */
  destroyInactiveTabPane?: boolean
}

export interface Tab extends Omit<VcTabType, 'children' | 'className'> {
  content?: VueNode
  class?: string
}

export interface TabsRef {
  nativeElement: any
}
export interface BaseTabsProps extends ComponentBaseProps {
  type?: TabsType
  size?: SizeType
  hideAdd?: boolean
  centered?: boolean
  classes?: TabsClassNamesType
  styles?: TabsStylesType
  /** @deprecated please use `tabPlacement` instead */
  tabPosition?: TabPosition
  tabPlacement?: TabPlacement
  /** @deprecated Please use `indicator={{ size: ... }}` instead */
  indicatorSize?: GetIndicatorSize
  items?: Tab[]
}

export interface TabsEmits {
  'edit': (e: MouseEvent | KeyboardEvent | string, action: 'add' | 'remove') => void
  'change': NonNullable<VcTabsProps['onChange']>
  'tabClick': NonNullable<VcTabsProps['onTabClick']>
  'tabScroll': NonNullable<VcTabsProps['onTabScroll']>
  'update:activeKey': (activeKey: string) => void
}

export interface TabsProps extends BaseTabsProps, CompatibilityProps, Omit<
  VcTabsProps,
  | 'editable'
  | 'items'
  | 'classNames'
  | 'className'
  | 'popupClassName'
  | 'styles'
  | 'style'
  | 'onChange'
  | 'onTabScroll'
  | 'onTabClick'
  | 'renderTabBar'
> {
  addIcon?: VueNode
  moreIcon?: VueNode
  more?: MoreProps
  removeIcon?: VueNode
  styles?: TabsStylesType
  classes?: TabsClassNamesType
  /** @deprecated Please use `classNames.popup` instead */
  popupClassName?: string
  renderTabBar?: (args: { props: any, TabNavListComponent: any }) => any
}

export type TabItem = Tab & Record<string, any>

export interface TabsSlots {
  default: () => any
  addIcon: () => any
  moreIcon: () => any
  removeIcon: () => any
  labelRender: (args: { item: TabItem, index: number }) => any
  contentRender: (args: { item: TabItem, index: number }) => any
  renderTabBar?: (args: { props: any, TabNavListComponent: any }) => any
  rightExtra?: () => any
  leftExtra?: () => any
}

const InternalTabs = defineComponent<
  TabsProps,
  TabsEmits,
  string,
  SlotsType<TabsSlots>
>(
  (props, { attrs, slots, emit, expose }) => {
    const {
      classes,
      styles,
      type,
      size: customSize,
      tabPlacement: tabPlacementProp,
      tabPosition,
      hideAdd,
      centered,
      indicatorSize,
    } = toPropsRefs(
      props,
      'classes',
      'styles',
      'type',
      'size',
      'tabPlacement',
      'tabPosition',
      'hideAdd',
      'centered',
      'indicatorSize',
    )
    const classNames = toRef(props, 'classes')
    const more = toRef(props, 'more')
    const popupClassName = toRef(props, 'popupClassName')
    const indicator = toRef(props, 'indicator')

    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      getPopupContainer,
      getPrefixCls,
    } = useComponentBaseConfig('tabs', props)

    const size = useSize(customSize)

    const mergedPlacement = computed<TabPosition | undefined>(() => {
      const placement = tabPlacementProp.value ?? tabPosition.value
      const isRTL = direction.value === 'rtl'
      switch (placement) {
        case 'start':
          return isRTL ? 'right' : 'left'
        case 'end':
          return isRTL ? 'left' : 'right'
        default:
          return placement as TabPosition | undefined
      }
    })

    const mergedItems = useLegacyItems(() => props.items, slots)
    const mergedProps = computed(() => {
      return {
        ...props,
        size: size.value,
        tabPlacement: mergedPlacement.value as TabPlacement,
        items: mergedItems.value,
      } as TabsProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TabsClassNamesType,
      TabsStylesType,
      TabsProps
    >(
      useToArr(contextClassNames, classNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => ({
        popup: {
          _default: 'root',
        },
      })),
    )

    const mergedAnimated = computed(() => useAnimateConfig(prefixCls.value, props.animated))
    const mergedIndicator = computed(() => ({
      align: indicator.value?.align,
      size: indicator.value?.size ?? indicatorSize.value,
    }))

    const tabsRef = shallowRef<any>()

    expose({
      nativeElement: computed(() => (tabsRef.value as any)?.$el ?? tabsRef.value ?? null),
    })

    if (isDev) {
      const warning = devUseWarning('Tabs')
      warning.deprecated(!popupClassName.value, 'popupClassName', 'classNames.popup')
      warning.deprecated(!tabPosition.value, 'tabPosition', 'tabPlacement')
      warning(
        !((props as any).onPrevClick || (props as any).onNextClick),
        'breaking',
        '`onPrevClick` and `onNextClick` has been removed. Please use `onTabScroll` instead.',
      )
      warning.deprecated(!(indicatorSize.value), 'indicatorSize', 'indicator')
      warning.deprecated(
        !(
          props.destroyInactiveTabPane
          || props.items?.some(item => 'destroyInactiveTabPane' in (item as any))
        ),
        'destroyInactiveTabPane',
        'destroyOnHidden',
      )
      warning.deprecated(!slots.default, 'Tabs.TabPane', 'items')
    }

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const onInternalChange: VcTabsProps['onChange'] = (activeKey) => {
      emit('update:activeKey', activeKey)
      emit('change', activeKey)
    }
    const onInternalTabClick: VcTabsProps['onTabClick'] = (activeKey, e) => {
      emit('tabClick', activeKey, e)
    }
    const onInternalTabScroll: VcTabsProps['onTabScroll'] = (info) => {
      emit('tabScroll', info)
    }

    return () => {
      const { className: attrClassName, style: attrStyle, restAttrs } = getAttrStyleAndClass(attrs)
      const addIcon = getSlotPropsFnRun(slots, props, 'addIcon') ?? <PlusOutlined />
      const removeIcon = getSlotPropsFnRun(slots, props, 'removeIcon') ?? <CloseOutlined />
      const moreIcon = getSlotPropsFnRun(slots, props, 'moreIcon') ?? <EllipsisOutlined />
      const editableFn = () => {
        if (type.value !== 'editable-card') {
          return undefined
        }
        return {
          onEdit: (editType: 'add' | 'remove', { key, event }: { key?: string, event: MouseEvent | KeyboardEvent }) => {
            emit('edit', editType === 'add' ? event : key ?? '', editType)
          },
          removeIcon,
          addIcon,
          showAdd: hideAdd.value !== true,
        }
      }

      const mergedMoreFn = () => {
        const rootPrefixCls = getPrefixCls()
        if (!rootPrefixCls) {
          return {
            icon: moreIcon,
            ...more.value,
          }
        }
        return {
          icon: moreIcon,
          transitionName: `${rootPrefixCls}-slide-up`,
          ...more.value,
        }
      }

      const mergedMore = mergedMoreFn()

      const editable = editableFn()
      const restProps = omit(
        props,
        [
          'items',
          'style',
          'styles',
          'classNames',
          'classes',
          'type',
          'size',
          'hideAdd',
          'centered',
          'addIcon',
          'removeIcon',
          'moreIcon',
          'more',
          'indicatorSize',
          'tabPlacement',
          'tabPosition',
          'rootClass',
          'popupClassName',
          'animated',
          'indicator',
          'destroyInactiveTabPane',
          'renderTabBar',
          'tabBarExtraContent',
        ],
      )
      const rootClassName = clsx(
        props.rootClass,
        contextClassName.value,
        mergedClassNames.value.root,
        {
          [`${prefixCls.value}-${size.value}`]: size.value,
          [`${prefixCls.value}-card`]: ['card', 'editable-card'].includes(type.value ?? ''),
          [`${prefixCls.value}-editable-card`]: type.value === 'editable-card',
          [`${prefixCls.value}-centered`]: centered.value,
        },
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        attrClassName,
      )

      const popupCls = clsx(
        popupClassName.value,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        mergedClassNames.value?.popup?.root,
      )

      const mergedStyle = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...attrStyle,
      }
      let renderTabBar: any | undefined
      if (slots.renderTabBar || props.renderTabBar) {
        renderTabBar = (props: any, TabNavListComponent: any) => {
          return getSlotPropsFnRun(slots, props, 'renderTabBar', true, { props, TabNavListComponent })
        }
      }
      let tabBarExtraContent: any
      if (props.tabBarExtraContent) {
        tabBarExtraContent = props.tabBarExtraContent
      }
      else {
        const leftExtra = getSlotPropsFnRun(slots, {}, 'leftExtra')
        const rightExtra = getSlotPropsFnRun(slots, {}, 'rightExtra')
        if (!leftExtra && rightExtra) {
          tabBarExtraContent = rightExtra
        }
        else if (leftExtra && rightExtra) {
          tabBarExtraContent = {
            left: leftExtra,
            right: rightExtra,
          }
        }
        else if (leftExtra && !rightExtra) {
          tabBarExtraContent = {
            left: leftExtra,
          }
        }
      }
      return (
        <VcTabs
          ref={tabsRef}
          direction={direction.value}
          getPopupContainer={getPopupContainer}
          {...restAttrs}
          {...restProps}
          items={mergedItems.value}
          className={rootClassName}
          classNames={{
            ...mergedClassNames.value,
            popup: popupCls,
          }}
          renderTabBar={renderTabBar}
          tabBarExtraContent={tabBarExtraContent}
          styles={mergedStyles.value}
          style={mergedStyle}
          editable={editable}
          more={mergedMore}
          prefixCls={prefixCls.value}
          animated={mergedAnimated.value}
          indicator={mergedIndicator.value}
          destroyOnHidden={props.destroyOnHidden ?? props.destroyInactiveTabPane}
          tabPosition={mergedPlacement.value}
          onChange={onInternalChange}
          onTabClick={onInternalTabClick}
          onTabScroll={onInternalTabScroll}
        />
      )
    }
  },
  {
    name: 'ATabs',
    inheritAttrs: false,
  },
)

const Tabs = InternalTabs

;(Tabs as any).TabPane = TabPane

;(Tabs as any).install = (app: App) => {
  app.component(Tabs.name, Tabs)
  app.component(TabPane.name, TabPane)
}

export { TabPane }
export type { TabPaneProps } from './TabPane'
export default Tabs

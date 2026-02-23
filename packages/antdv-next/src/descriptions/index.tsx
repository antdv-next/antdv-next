import type { Key } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { DescriptionsItemProps } from './Item.tsx'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import {

  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { matchScreen } from '../_util/responsiveObserver.ts'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useBreakpoint } from '../grid'
import DEFAULT_COLUMN_MAP from './constant.ts'
import { useDescriptionsProvider } from './DescriptionsContext.ts'
import useItems from './hooks/useItems.ts'
import useRow from './hooks/useRow.ts'
import Row from './Row.tsx'
import useStyle from './style'

export type DescriptionsSemanticName = keyof DescriptionsSemanticClassNames
  & keyof DescriptionsSemanticStyles

export interface DescriptionsSemanticClassNames {
  root?: string
  header?: string
  title?: string
  extra?: string
  label?: string
  content?: string
}

export interface DescriptionsSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
}

export type DescriptionsClassNamesType = SemanticClassNamesType<
  DescriptionsProps,
  DescriptionsSemanticClassNames
>

export type DescriptionsStylesType = SemanticStylesType<
  DescriptionsProps,
  DescriptionsSemanticStyles
>
export interface InternalDescriptionsItemType extends Omit<DescriptionsItemProps, 'span'> {
  key?: Key
  filled?: boolean
  span?: number
  /**
   * @internal 记录当前项的索引，用于渲染时的辅助计算
   */
  _$index?: number
}

export interface DescriptionsItemType extends Omit<DescriptionsItemProps, 'prefixCls'> {
  key?: Key
}

export type RenderDescriptionsItem = (params: { item: InternalDescriptionsItemType, index: number, value: any }) => any

export interface DescriptionsProps extends ComponentBaseProps {
  bordered?: boolean
  size?: 'middle' | 'small' | 'default'
  title?: VueNode
  extra?: VueNode
  labelRender?: RenderDescriptionsItem
  contentRender?: RenderDescriptionsItem
  column?: number | Partial<Record<Breakpoint, number>>
  layout?: 'horizontal' | 'vertical'
  colon?: boolean
  styles?: DescriptionsStylesType
  classes?: DescriptionsClassNamesType
  items?: DescriptionsItemType[]
  id?: string
}

const defaults = {
  colon: true,
} as any

export interface DescriptionsSlots {
  title?: () => any
  extra?: () => any
  labelRender?: RenderDescriptionsItem
  contentRender?: RenderDescriptionsItem
}

const Descriptions = defineComponent<
  DescriptionsProps,
  EmptyEmit,
  string,
  SlotsType<DescriptionsSlots>
>(
  (props = defaults, { slots, attrs }) => {
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
      direction,
    } = useComponentBaseConfig('descriptions', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const screens = useBreakpoint()
    const items = computed(() => props.items ?? [])
    const customizeSize = computed(() => props.size)
    // Column count
    const mergedColumn = computed(() => {
      if (typeof props.column === 'number') {
        return props.column
      }
      return matchScreen(screens.value!, {
        ...DEFAULT_COLUMN_MAP,
        ...props?.column,
      }) ?? 3
    })
    // Items with responsive
    const mergedItems = useItems(screens as any, items)

    const mergedSize = useSize(customizeSize)
    const rows = useRow(mergedColumn, mergedItems)
    const [hashId, cssVarCls] = useStyle(prefixCls)
    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        column: mergedColumn.value,
        items: mergedItems.value,
        size: mergedSize.value,
      }
    })
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      DescriptionsClassNamesType,
      DescriptionsStylesType,
      DescriptionsProps
    >(
      useToArr(contextClassNames, classes as any),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    // ======================== Render ========================
    const contextValue = computed(() => {
      return {
        styles: {
          content: mergedStyles.value?.content,
          label: mergedStyles.value.label,
        },
        classes: {
          content: mergedClassNames.value.content,
          label: mergedClassNames.value.label,
        },
      }
    })
    useDescriptionsProvider(contextValue)
    return () => {
      const { bordered, rootClass, colon, layout } = props
      const title = getSlotPropsFnRun(slots, props, 'title')
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      const labelRender = slots?.labelRender ?? props?.labelRender
      const contentRender = slots?.contentRender ?? props?.contentRender
      return (
        <div
          class={classNames(
            prefixCls.value,
            contextClassName.value,
            mergedClassNames.value.root,
            {
              [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value && mergedSize.value !== 'default',
              [`${prefixCls.value}-bordered`]: !!bordered,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            (attrs as any).class,
            rootClass,
            hashId.value,
            cssVarCls.value,
          )}
          id={props.id}
          style={[contextStyle, mergedStyles.value.root, (attrs as any).style]}
          {...omit(attrs, ['class', 'style'])}
        >
          {(!!title || !!extra) && (
            <div
              class={classNames(
                `${prefixCls.value}-header`,
                mergedClassNames.value?.header,
              )}
              style={mergedStyles.value.header}
            >
              {!!title && (
                <div
                  class={classNames(
                    `${prefixCls.value}-title`,
                    mergedClassNames.value.title,
                  )}
                  style={mergedStyles.value.title}
                >
                  {title}
                </div>
              )}
              {!!extra && (
                <div
                  class={classNames(
                    `${prefixCls.value}-extra`,
                    mergedClassNames.value.extra,
                  )}
                  style={mergedStyles.value.extra}
                >
                  {extra}
                </div>
              )}
            </div>
          )}

          <div class={`${prefixCls.value}-view`}>
            <table>
              <tbody>
                {rows.value.map(
                  (row, index) => (
                    <Row
                      key={index}
                      index={index}
                      labelRender={labelRender}
                      contentRender={contentRender}
                      colon={!!colon}
                      prefixCls={prefixCls.value}
                      vertical={layout === 'vertical'}
                      bordered={bordered}
                      row={row}
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  },
  {
    name: 'ADescriptions',
    inheritAttrs: false,
  },
)
;(Descriptions as any).install = (app: App) => {
  app.component(Descriptions.name, Descriptions)
}
export default Descriptions

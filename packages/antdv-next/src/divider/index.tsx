import type { App, CSSProperties } from 'vue'
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent } from 'vue'
import { pureAttrs, useMergeSemantic, useOrientation, useToArr } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useStyle from './style'

export type TitlePlacement
  = | 'left'
    | 'right'
    | 'center'
    | 'start' // 👈 5.24.0+
    | 'end' // 👈 5.24.0+

const titlePlacementList = ['left', 'right', 'center', 'start', 'end']

export type DividerSemanticName = keyof DividerSemanticClassNames & keyof DividerSemanticStyles

export interface DividerSemanticClassNames {
  root?: string
  rail?: string
  content?: string
}

export interface DividerSemanticStyles {
  root?: CSSProperties
  rail?: CSSProperties
  content?: CSSProperties
}

export type DividerClassNamesType = SemanticClassNamesType<DividerProps, DividerSemanticClassNames>

export type DividerStylesType = SemanticStylesType<DividerProps, DividerSemanticStyles>

export interface DividerProps extends ComponentBaseProps {
  /**  @deprecated please use `orientation` */
  type?: Orientation
  /**
   * @default center
   */
  orientation?: Orientation
  vertical?: boolean
  titlePlacement?: TitlePlacement
  /** @deprecated please use `styles.content.margin` */
  orientationMargin?: string | number
  dashed?: boolean
  /**
   * @since 5.20.0
   * @default solid
   */
  variant?: 'dashed' | 'dotted' | 'solid'
  size?: SizeType
  plain?: boolean
  classes?: DividerClassNamesType
  styles?: DividerStylesType
}

const sizeClassNameMap: Record<string, string> = { small: 'sm', middle: 'md' }

const defaultProps = {
  orientation: 'center',
  variant: 'solid',
  type: 'horizontal',
  orientationMargin: undefined,
} as any
const Divider = defineComponent<DividerProps>(
  (props = defaultProps, { slots, attrs }) => {
    const {
      class: contextClassName,
      classes: contextClassNames,
      styles: contextStyles,
      direction,
      prefixCls,
    } = useComponentBaseConfig('divider', props)
    const { type, vertical, orientation, classes, styles, size } = toPropsRefs(props, 'orientation', 'vertical', 'type', 'classes', 'styles', 'size')
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const sizeFullName = useSize(size)
    const sizeCls = computed(() => sizeClassNameMap[sizeFullName.value!])
    const validTitlePlacement = computed(() => titlePlacementList.includes(orientation.value || ''))
    const mergedTitlePlacement = computed<'start' | 'end' | 'center'>(() => {
      const placement = props?.titlePlacement ?? (validTitlePlacement.value ? (orientation.value as TitlePlacement) : 'center')
      if (placement === 'left') {
        return direction.value === 'rtl' ? 'end' : 'start'
      }
      if (placement === 'right') {
        return direction.value === 'rtl' ? 'start' : 'end'
      }
      return placement
    })

    const hasMarginStart = computed(() => mergedTitlePlacement.value === 'start' && props.orientationMargin != null)
    const hasMarginEnd = computed(() => mergedTitlePlacement.value === 'end' && props.orientationMargin != null)
    const [mergedOrientation, mergedVertical] = useOrientation(orientation, vertical, type)

    // ========================= Semantic =========================
    const mergedProps = computed(() => {
      return {
        ...props,
        orientation: mergedOrientation.value,
        titlePlacement: mergedTitlePlacement.value,
        size: sizeFullName.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<DividerClassNamesType, DividerStylesType, DividerProps>(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      computed(() => {
        return {
          props: mergedProps.value,
        }
      }),
    )
    const memoizedOrientationMargin = computed(() => {
      const orientationMargin = props.orientationMargin
      if (typeof orientationMargin === 'number') {
        return `${orientationMargin}px`
      }
      if (/^\d+$/.test(orientationMargin!)) {
        return `${Number(orientationMargin)}px`
      }
      return orientationMargin!
    })
    return () => {
      const {
        variant,
        dashed,
        plain,
        rootClass,
      } = props
      const children = filterEmpty(slots?.default?.())
      const hasChildren = children.length > 0
      const railCls = `${prefixCls.value}-rail`
      const classString = classNames(
        prefixCls.value,
        contextClassName?.value,
        hashId.value,
        cssVarCls.value,
        `${prefixCls.value}-${mergedOrientation.value}`,
        {
          [`${prefixCls.value}-with-text`]: hasChildren,
          [`${prefixCls.value}-with-text-${mergedTitlePlacement.value}`]: hasChildren,
          [`${prefixCls.value}-dashed`]: !!dashed,
          [`${prefixCls.value}-${variant}`]: variant !== 'solid',
          [`${prefixCls.value}-plain`]: !!plain,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-no-default-orientation-margin-start`]: hasMarginStart.value,
          [`${prefixCls.value}-no-default-orientation-margin-end`]: hasMarginEnd.value,
          [`${prefixCls.value}-${sizeCls.value}`]: !!sizeCls.value,
          [railCls]: !hasChildren,
          [mergedClassNames.value.rail as string]: mergedClassNames.value.rail && !hasChildren,
        },
        rootClass,
        mergedClassNames.value.root,
      )
      const innerStyle: CSSProperties = {
        marginInlineStart: hasMarginStart.value ? memoizedOrientationMargin.value : undefined,
        marginInlineEnd: hasMarginEnd.value ? memoizedOrientationMargin.value : undefined,
      }
      return (
        <div
          class={classString}
          style={[
            contextStyles.value,
            mergedStyles.value.root,
            hasChildren ? {} : mergedStyles.value.rail,
            (attrs as any).style,
          ]}
          {...pureAttrs(attrs)}
          role="separator"
        >
          {hasChildren && !mergedVertical.value && (
            <>
              <div
                class={classNames(railCls, `${railCls}-start`, mergedClassNames.value.rail)}
                style={mergedStyles.value.rail}
              />
              <span
                class={classNames(
                  `${prefixCls.value}-inner-text`,
                  mergedClassNames.value.content,
                )}
                style={[innerStyle, mergedStyles.value.content]}
              >
                {children}
              </span>

              <div
                class={classNames(railCls, `${railCls}-end`, mergedClassNames.value.rail)}
                style={mergedStyles.value.rail}
              />
            </>
          )}
        </div>
      )
    }
  },
  {
    name: 'ADivider',
    inheritAttrs: false,
  },
)

;(Divider as any).install = (app: App) => {
  app.component(Divider.name, Divider)
}

export default Divider

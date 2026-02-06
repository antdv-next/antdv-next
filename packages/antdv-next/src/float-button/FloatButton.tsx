import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { BadgeProps } from '../badge'
import type { ButtonHTMLType, ButtonSemanticName } from '../button'
import type { ButtonSemanticClassNames, ButtonSemanticStyles } from '../button/Button.tsx'
import type { ComponentBaseProps } from '../config-provider/context'
import type { TooltipProps } from '../tooltip'
import { FileTextOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { filterEmpty, removeUndefined } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import convertToTooltipProps from '../_util/convertToTooltipProps'
import { pureAttrs, useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import Badge from '../badge'
import Button from '../button'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Tooltip from '../tooltip'
import { useGroupContext } from './context'
import useStyle from './style'

export type FloatButtonElement = HTMLAnchorElement | HTMLButtonElement

export interface FloatButtonRef {
  nativeElement: FloatButtonElement | null
}

export type FloatButtonType = 'default' | 'primary'

export type FloatButtonShape = 'circle' | 'square'

export type FloatButtonGroupTrigger = 'click' | 'hover'

export type FloatButtonBadgeProps = Omit<BadgeProps, 'status' | 'text' | 'title'>

export type FloatButtonSemanticName = ButtonSemanticName

export type FloatButtonClassNamesType = SemanticClassNamesType<
  FloatButtonProps,
  ButtonSemanticClassNames
>

export type FloatButtonStylesType = SemanticStylesType<FloatButtonProps, ButtonSemanticStyles>

export interface FloatButtonProps extends ComponentBaseProps {
  icon?: VueNode
  /** @deprecated Use `content` instead */
  description?: VueNode
  content?: VueNode
  type?: FloatButtonType
  shape?: FloatButtonShape
  tooltip?: VueNode | TooltipProps
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top' | string
  badge?: FloatButtonBadgeProps & { class?: string }
  htmlType?: ButtonHTMLType
  ariaLabel?: string
  style?: CSSProperties
  classes?: FloatButtonClassNamesType
  styles?: FloatButtonStylesType
}

export interface FloatButtonSlots {
  default?: () => any
  icon?: () => any
  tooltip?: () => any
}

export interface FloatButtonEmits {
  click: (e: MouseEvent) => void
  mouseenter: (e: MouseEvent) => void
  mouseleave: (e: MouseEvent) => void
  focus: (e: FocusEvent) => void
  blur: (e: FocusEvent) => void
}

export const floatButtonPrefixCls = 'float-btn'

const defaultProps = {
  type: 'default',
  shape: 'circle',
} as any

const InternalFloatButton = defineComponent<
  FloatButtonProps,
  FloatButtonEmits,
  string,
  SlotsType<FloatButtonSlots>
>(
  (props = defaultProps, { slots, attrs, emit, expose }) => {
    const {
      prefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClasses,
      styles: contextStyles,
      direction,
    } = useComponentBaseConfig('floatButton', props, [], floatButtonPrefixCls)

    const rootCls = useCSSVarCls(prefixCls)
    const groupContext = useGroupContext()
    const groupClassNames = computed(() => groupContext?.value?.classNames)
    const groupStyles = computed(() => groupContext?.value?.styles)
    const groupShape = computed(() => groupContext?.value?.shape)
    const groupIndividual = computed(() => groupContext?.value?.individual)

    const { classes, styles, badge, tooltip, style } = toPropsRefs(props, 'classes', 'styles', 'badge', 'tooltip', 'style')

    const mergedShape = computed<FloatButtonShape>(() => groupShape.value ?? props.shape ?? 'circle')
    const mergedType = computed<FloatButtonType>(() => props.type ?? 'default')
    const mergedIndividual = computed(() => groupIndividual.value ?? true)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => ({
      ...props,
      type: mergedType.value,
      shape: mergedShape.value,
    }))

    const floatButtonClassNames = computed(() => ({
      icon: `${prefixCls.value}-icon`,
      content: `${prefixCls.value}-content`,
    }))

    // ============================ Styles ============================
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FloatButtonClassNamesType,
      FloatButtonStylesType,
      FloatButtonProps
    >(
      useToArr(floatButtonClassNames, groupClassNames, contextClasses, classes),
      useToArr(groupStyles, contextStyles, styles),
      useToProps(mergedProps),
    )

    const buttonRef = shallowRef<any>()
    expose({
      nativeElement: computed(() => buttonRef.value),
    })

    // ============================ zIndex ============================
    const [zIndex] = useZIndex('FloatButton', computed(() => style.value?.zIndex as number | undefined))
    const zIndexStyle = computed(() => (zIndex.value === undefined ? undefined : { zIndex: zIndex.value }))

    return () => {
      const slotContent = filterEmpty(slots.default?.() ?? [])
      let contentNodes: any = null
      if (slotContent.length) {
        contentNodes = slotContent
      }
      else if (props.content !== undefined) {
        contentNodes = props.content
      }
      else if (props.description !== undefined) {
        contentNodes = props.description
      }

      const hasContent = Array.isArray(contentNodes)
        ? contentNodes.length > 0
        : contentNodes !== null && contentNodes !== undefined && contentNodes !== false

      const iconNode = getSlotPropsFnRun(slots, props, 'icon')
      const mergedIcon = iconNode ?? props.icon ?? (!hasContent ? <FileTextOutlined /> : null)

      const tooltipSlotNodes = filterEmpty(slots.tooltip?.() ?? [])
      const tooltipNode = tooltipSlotNodes.length
        ? tooltipSlotNodes.length === 1
          ? tooltipSlotNodes[0]
          : tooltipSlotNodes
        : undefined
      const tooltipValue = tooltip.value ?? tooltipNode
      const tooltipProps = convertToTooltipProps<TooltipProps>(tooltipValue as any)

      // ============================ Badge =============================
      // 虽然在 ts 中已经 omit 过了，但是为了防止多余的属性被透传进来，这里再 omit 一遍，以防万一
      const badgeProps = badge.value
        ? (omit(badge.value, ['status', 'text', 'title']) as FloatButtonBadgeProps & { class?: string })
        : null

      const badgeNode = badge.value
        ? (
            <Badge
              {...badgeProps}
              class={classNames(
                badgeProps?.class,
                `${prefixCls.value}-badge`,
                {
                  [`${prefixCls.value}-badge-dot`]: badgeProps?.dot,
                },
              )}
            />
          )
        : null
      const buttonClass = classNames(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        `${prefixCls.value}-${mergedType.value}`,
        `${prefixCls.value}-${mergedShape.value}`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-individual`]: mergedIndividual.value,
          [`${prefixCls.value}-icon-only`]: !hasContent,
        },
        contextClassName.value,
        props.rootClass,
        (attrs as any).class,
        mergedClassNames.value.root,
      )

      const buttonSlots = {
        default: () => (
          <>
            {contentNodes}
            {badgeNode}
          </>
        ),
      }

      const buttonNode = (
        <Button
          {...removeUndefined(pureAttrs(attrs))}
          ref={(node: any) => {
            buttonRef.value = node
          }}
          class={buttonClass}
          style={[
            mergedStyles.value.root,
            contextStyle.value,
            props.style,
            (attrs as any).style,
            zIndexStyle.value,
          ]}
          classes={mergedClassNames.value}
          styles={mergedStyles.value}
          size="large"
          type={mergedType.value}
          shape={mergedShape.value}
          href={props.href}
          target={props.target as any}
          icon={mergedIcon ? () => mergedIcon : undefined}
          htmlType={props.htmlType as ButtonHTMLType | undefined}
          aria-label={props.ariaLabel}
          _skipSemantic
          onClick={(e: MouseEvent) => emit('click', e)}
          onMouseenter={(e: MouseEvent) => emit('mouseenter', e)}
          onMouseleave={(e: MouseEvent) => emit('mouseleave', e)}
          onFocus={(e: FocusEvent) => emit('focus', e)}
          onBlur={(e: FocusEvent) => emit('blur', e)}
          v-slots={buttonSlots}
        />
      )

      if (tooltipProps) {
        return (
          <Tooltip {...tooltipProps}>
            {buttonNode}
          </Tooltip>
        )
      }

      return buttonNode
    }
  },
  {
    name: 'AFloatButton',
    inheritAttrs: false,
  },
)

const FloatButton = InternalFloatButton as typeof InternalFloatButton

export default FloatButton

import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { PresetColorType, PresetStatusColorType } from '../_util/colors.ts'
import type { ClosableType } from '../_util/hooks/useClosable.tsx'
import type { EmitsType, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { CloseOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, getCurrentInstance, isVNode, shallowRef } from 'vue'
import { isPresetColor, isPresetStatusColor } from '../_util/colors.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { replaceElement } from '../_util/vueNode.ts'
import Wave from '../_util/wave'
import { useConfig } from '../config-provider/context.ts'
import CheckableTag from './CheckableTag.tsx'
import useStyle from './style'
import PresetCmp from './style/presetCmp.ts'
import StatusCmp from './style/statusCmp.ts'

export type { CheckableTagProps } from './CheckableTag.tsx'
type SemanticName = 'root'

export interface TagProps extends ComponentBaseProps {
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>
  /** Advised to use closeIcon instead. */
  closable?: ClosableType
  closeIcon?: VueNode
  icon?: VueNode
  bordered?: boolean
  styles?: Partial<Record<SemanticName, CSSProperties>>
  classes?: Partial<Record<SemanticName, string>>
}

export interface TagSlots {
  default?: () => any
  icon?: () => any
  closeIcon?: () => any
}

export type TagEmits = EmitsType<{
  close?: (ev: MouseEvent) => void
  click?: (ev: MouseEvent) => void
}>

const defaultProps: Partial<TagProps> = {
  bordered: true,
}

function pickAriaProps(source: Record<string, any> | undefined) {
  if (!source)
    return {}
  const ariaProps: Record<string, any> = {}
  Object.keys(source).forEach((key) => {
    if (
      key.startsWith('aria-')
      || key.startsWith('data-')
      || key === 'role'
      || key === 'tabindex'
    ) {
      ariaProps[key] = source[key]
    }
  })
  return ariaProps
}

function normalizeNode(node?: VueNode | VueNode[] | null) {
  if (node === undefined || node === null) {
    return null
  }
  const nodes = Array.isArray(node) ? node : [node]
  const list = filterEmpty(nodes)
  return list.length ? list[0] : null
}

function resolveRenderNode(render?: VueNode | VueNode[] | (() => VueNode | VueNode[] | null) | null) {
  if (render === undefined || render === null) {
    return null
  }
  if (typeof render === 'function') {
    return resolveRenderNode(render())
  }
  return normalizeNode(render)
}

const InternalTag = defineComponent<
  TagProps,
  TagEmits,
  string,
  SlotsType<TagSlots>
>(
  (props = defaultProps, { slots, attrs, emit, expose }) => {
    const configContext = useConfig()
    const prefixCls = computed(() => configContext.value.getPrefixCls('tag', props.prefixCls))
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)
    const visible = shallowRef(true)
    const instance = getCurrentInstance()
    const tagRef = shallowRef<HTMLElement>()
    expose({ tagRef })

    const handleInternalClick = (e: MouseEvent) => {
      emit('click', e)
    }

    return () => {
      const tagConfig = configContext.value.tag
      const mergedAttrs = omit(attrs, ['class', 'style', 'onClick'])
      const iconSlot = getSlotPropsFnRun(slots, props, 'icon')
      const closeIconSlot = getSlotPropsFnRun(slots, props, 'closeIcon')
      const iconNode = normalizeNode(iconSlot ?? (props.icon ? [props.icon] : []))

      const closable = props.closable
      const closableOptions = typeof closable === 'object' ? closable : undefined

      const slotCloseIconNode = normalizeNode(closeIconSlot)
      const closableRenderCloseIcon = resolveRenderNode(closableOptions?.closeIcon)
      const propCloseIconNode = normalizeNode(props.closeIcon)

      let closeIconNode: VueNode | null = null
      let canClose = false
      let closeDisabled = false
      let ariaProps: Record<string, any> = {}

      const hasExplicitCloseIconDisabled
        = props.closeIcon === false
          || props.closeIcon === null
          || (closableOptions && ((closableOptions as any).closeIcon === false || closableOptions.closeIcon === null))

      if (!hasExplicitCloseIconDisabled) {
        if (closable === true) {
          canClose = true
        }
        else if (typeof closable === 'object') {
          canClose = true
          closeDisabled = !!closableOptions?.disabled
          ariaProps = pickAriaProps(closableOptions)
        }

        if (!canClose) {
          if (slotCloseIconNode) {
            canClose = true
          }
          else if (propCloseIconNode) {
            canClose = true
          }
          else if (closableRenderCloseIcon) {
            canClose = true
          }
        }

        if (canClose) {
          closeIconNode = slotCloseIconNode
            ?? closableRenderCloseIcon
            ?? propCloseIconNode
            ?? <CloseOutlined />
        }
      }

      const isPreset = isPresetColor(props.color)
      const isStatus = isPresetStatusColor(props.color)
      const isInternalColor = isPreset || isStatus

      const tagStyleList: CSSProperties[] = []
      if (props.color && !isInternalColor) {
        tagStyleList.push({
          backgroundColor: props.color as CSSProperties['backgroundColor'],
        })
      }
      if (tagConfig?.style) {
        tagStyleList.push(tagConfig.style)
      }
      if (tagConfig?.styles?.root) {
        tagStyleList.push(tagConfig.styles.root)
      }
      if (props.styles?.root) {
        tagStyleList.push(props.styles.root)
      }
      if (attrs.style) {
        tagStyleList.push(attrs.style as CSSProperties)
      }

      const tagClassName = classNames(
        prefixCls.value,
        tagConfig?.class,
        tagConfig?.classes?.root,
        props.classes?.root,
        {
          [`${prefixCls.value}-${props.color}`]: isInternalColor && props.color,
          [`${prefixCls.value}-has-color`]: props.color && !isInternalColor,
          [`${prefixCls.value}-rtl`]: configContext.value.direction === 'rtl',
          [`${prefixCls.value}-borderless`]: props.bordered === false,
          [`${prefixCls.value}-hidden`]: !visible.value,
        },
        props.rootClass,
        hashId,
        cssVarCls,
        (attrs as any).class,
      )

      const children = filterEmpty(slots.default?.() ?? [])
      const hasAnchorChild = children.some(child => isVNode(child) && typeof child.type === 'string' && child.type.toLowerCase() === 'a')

      const componentProps = instance?.vnode.props ?? {}
      const hasClickListeners = Boolean(
        componentProps.onClick
        || componentProps.onClickOnce
        || componentProps.onClickCapture
        || componentProps.onClickPassive,
      )
      const needWave = hasClickListeners || hasAnchorChild

      const handleClose = (e: MouseEvent) => {
        e.stopPropagation()
        emit('close', e)
        if (e.defaultPrevented || closeDisabled) {
          return
        }
        visible.value = false
      }

      let mergedCloseIcon: VueNode | null = null
      if (canClose && closeIconNode !== null) {
        const ariaLabel = ariaProps['aria-label'] ?? 'close'
        const baseCloseIcon = (
          <span
            class={`${prefixCls.value}-close-icon`}
            tabindex={ariaProps.tabindex ?? 0}
            aria-label={ariaLabel}
            {...ariaProps}
            onClick={handleClose}
          >
            {closeIconNode}
          </span>
        )

        mergedCloseIcon = isVNode(closeIconNode)
          ? replaceElement(closeIconNode, baseCloseIcon, originProps => ({
              ...originProps,
              'class': classNames(originProps?.class, `${prefixCls.value}-close-icon`),
              'aria-label': originProps?.['aria-label'] ?? ariaLabel,
              ...ariaProps,
              'tabindex': originProps?.tabindex ?? ariaProps.tabindex ?? 0,
              'onClick': (event: MouseEvent) => {
                originProps?.onClick?.(event)
                handleClose(event)
              },
            }))
          : baseCloseIcon
      }

      const kids = iconNode
        ? [iconNode, children.length ? <span>{children}</span> : null].filter(item => item !== null && item !== undefined)
        : children

      const tagNode = (
        <span
          {...mergedAttrs}
          ref={tagRef}
          class={tagClassName}
          style={tagStyleList}
          onClick={handleInternalClick}
        >
          {kids}
          {mergedCloseIcon}
          {isPreset ? <PresetCmp prefixCls={prefixCls.value} /> : null}
          {isStatus ? <StatusCmp prefixCls={prefixCls.value} /> : null}
        </span>
      )

      return wrapCSSVar(needWave ? <Wave component="Tag">{tagNode}</Wave> : tagNode)
    }
  },
  {
    name: 'ATag',
    inheritAttrs: false,
  },
)

const Tag = InternalTag as typeof InternalTag & {
  CheckableTag: typeof CheckableTag
}

Tag.CheckableTag = CheckableTag

;(Tag as any).install = (app: App) => {
  app.component(InternalTag.name, Tag)
  app.component(CheckableTag.name, CheckableTag)
}

export default Tag

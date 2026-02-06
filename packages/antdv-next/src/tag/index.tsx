import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { PresetColorType, PresetStatusColorType } from '../_util/colors.ts'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ClosableType } from '../_util/hooks/useClosable.tsx'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent, shallowRef } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import useClosable, { pickClosable } from '../_util/hooks/useClosable.tsx'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { replaceElement } from '../_util/vueNode.ts'
import Wave from '../_util/wave'
import { useComponentBaseConfig, useConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import CheckableTag from './CheckableTag.tsx'
import CheckableTagGroup from './CheckableTagGroup.tsx'
import useColor from './hooks/useColor.ts'
import useStyle from './style'
import PresetCmp from './style/presetCmp.ts'
import StatusCmp from './style/statusCmp.ts'

export type { CheckableTagProps } from './CheckableTag.tsx'

export type TagSemanticName = keyof TagSemanticClassNames & keyof TagSemanticStyles

export interface TagSemanticClassNames {
  root?: string
  icon?: string
  content?: string
}

export interface TagSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
}

export type TagClassNamesType = SemanticClassNamesType<TagProps, TagSemanticClassNames>

export type TagStylesType = SemanticStylesType<TagProps, TagSemanticStyles>

export interface TagProps extends ComponentBaseProps {
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>
  /** Advised to use closeIcon instead. */
  closable?: ClosableType
  closeIcon?: VueNode
  icon?: VueNode
  onClick?: (e: MouseEvent) => void
  href?: string
  target?: string
  disabled?: boolean
  bordered?: boolean
  styles?: TagStylesType
  classes?: TagClassNamesType
  variant?: 'filled' | 'solid' | 'outlined'
}

export interface TagSlots {
  default?: () => any
  icon?: () => any
  closeIcon?: () => any
}

export interface TagEmits {
  close: (ev: MouseEvent) => void
}

const defaultProps: Partial<TagProps> = {
  bordered: true,
  closable: undefined,
}
const InternalTag = defineComponent<
  TagProps,
  TagEmits,
  string,
  SlotsType<TagSlots>
>(
  (props = defaultProps, { slots, attrs, emit, expose }) => {
    const configContext = useConfig()
    const {
      prefixCls,
      direction,
      class: contextClassName,
      variant: contextVariant,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('tag', props, ['variant'])
    const { variant, href, target, disabled: customDisabled, color, bordered, classes, styles } = toPropsRefs(props, 'classes', 'styles', 'variant', 'href', 'target', 'disabled', 'color', 'bordered')
    const [hashId, cssVarCls] = useStyle(prefixCls)

    // ====================== Colors ======================
    const [mergedVariant, mergedColor, isPreset, isStatus, customTagStyle] = useColor(
      { bordered, variant, color },
      contextVariant,
    )

    const isInternalColor = computed(() => isPreset.value || isStatus.value)
    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled?.value ?? disabled.value)
    const visible = shallowRef(true)
    const tagRef = shallowRef<HTMLElement>()
    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        color: mergedColor?.value,
        variant: mergedVariant?.value,
        disabled: mergedDisabled?.value,
      } as TagProps
    })

    // ====================== Styles ======================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TagClassNamesType,
      TagStylesType,
      TagProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )
    expose({ tagRef })

    const handleCloseClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        return
      }
      e.stopPropagation()
      emit('close', e)
      if (e.defaultPrevented) {
        return
      }
      visible.value = false
    }

    const closableInfo = useClosable(
      pickClosable(computed(() => ({ ...props, closeIcon: getSlotPropsFnRun(slots, props, 'closeIcon') }) as unknown as any)) as any,
      pickClosable(computed(() => configContext.value.tag as any)) as any,
      computed(() => {
        return {
          closable: false,
          closeIconRender(iconNode) {
            const replacement = (
              <span class={`${prefixCls.value}-close-icon`} onClick={handleCloseClick}>
                {iconNode}
              </span>
            )
            return replaceElement(iconNode, replacement, (originProps) => {
              return {
                onClick(e: MouseEvent) {
                  originProps?.onClick?.(e)
                  handleCloseClick(e)
                },
                class: classNames(originProps?.class, `${prefixCls.value}-close-icon`),
              }
            })
          },
        }
      }),
    )

    const tagStyle = computed(() => {
      let nextTagStyle: any = { ...mergedStyles.value?.root, ...contextStyle.value, ...(attrs as any).style }
      if (!mergedDisabled.value) {
        nextTagStyle = { ...customTagStyle.value, ...nextTagStyle }
      }
      return nextTagStyle as CSSProperties
    })

    return () => {
      // Style
      const tagClassName = classNames(
        prefixCls.value,
        contextClassName.value,
        mergedClassNames.value.root,
        `${prefixCls.value}-${mergedVariant.value}`,
        {
          [`${prefixCls.value}-${mergedColor.value}`]: isInternalColor.value,
          [`${prefixCls.value}-hidden`]: !visible.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-disabled`]: mergedDisabled.value,
        },
        (attrs as any).class,
        props.rootClass,
        hashId.value,
        cssVarCls.value,
      )
      const children = filterEmpty(slots?.default?.())[0]
      // ====================== Render ======================
      const isNeedWave = (children && children.type === 'a') || typeof props.onClick === 'function'
      const iconNode = getSlotPropsFnRun(slots, props, 'icon')
      let iconNodes = iconNode
      if (iconNode) {
        iconNodes = createVNode(iconNode, {
          class: mergedClassNames.value?.icon,
          style: mergedStyles.value?.icon,
        })
      }

      const kids = iconNodes
        ? (
            <>
              {iconNodes}
              {children && (
                <span
                  class={mergedClassNames.value.content}
                  style={mergedStyles.value.content}
                >
                  {children}
                </span>
              )}
            </>
          )
        : children
      const TagWrapper = href.value ? 'a' : 'span'

      const mergedCloseIcon = closableInfo.value?.[1]
      const tagNode = (
        <TagWrapper
          {...pureAttrs(attrs)}
          class={tagClassName}
          style={tagStyle.value}
          href={mergedDisabled.value ? undefined : href.value}
          target={target.value}
          onClick={mergedDisabled.value ? undefined : props.onClick}
          {
            ...(href.value && mergedDisabled.value ? { 'aria-disabled': true } : {})
          }
        >
          {kids}
          {mergedCloseIcon}
          {isPreset.value && <PresetCmp key="preset" prefixCls={prefixCls.value} />}
          {isStatus.value && <StatusCmp key="status" prefixCls={prefixCls.value} />}
        </TagWrapper>
      )
      return isNeedWave ? <Wave component="Tag">{tagNode}</Wave> : tagNode
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
  app.component(CheckableTagGroup.name, CheckableTagGroup)
}
export {
  CheckableTag,
  CheckableTagGroup,
}

export default Tag

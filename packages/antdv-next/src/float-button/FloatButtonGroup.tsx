import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import type { GroupContextProps } from './context'
import type { FloatButtonGroupTrigger, FloatButtonProps, FloatButtonShape } from './FloatButton'
import { CloseOutlined, FileTextOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, shallowRef, Transition, watch } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { useZIndex } from '../_util/hooks/useZIndex'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Flex from '../flex'
import { SpaceCompact } from '../space'
import { GroupContextProvider } from './context'
import FloatButton, { floatButtonPrefixCls } from './FloatButton'
import useStyle from './style'

const VALID_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const

export type FloatButtonGroupSemanticName = keyof FloatButtonGroupSemanticClassNames
  & keyof FloatButtonGroupSemanticStyles

export interface FloatButtonGroupSemanticClassNames {
  root?: string
  list?: string
  item?: string
  itemIcon?: string
  itemContent?: string
  trigger?: string
  triggerIcon?: string
  triggerContent?: string
}

export interface FloatButtonGroupSemanticStyles {
  root?: CSSProperties
  list?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemContent?: CSSProperties
  trigger?: CSSProperties
  triggerIcon?: CSSProperties
  triggerContent?: CSSProperties
}

export type FloatButtonGroupClassNamesType = SemanticClassNamesType<
  FloatButtonGroupProps,
  FloatButtonGroupSemanticClassNames
>

export type FloatButtonGroupStylesType = SemanticStylesType<
  FloatButtonGroupProps,
  FloatButtonGroupSemanticStyles
>

export interface FloatButtonGroupProps extends Omit<FloatButtonProps, 'classes' | 'styles'>, ComponentBaseProps {
  // Styles
  classes?: FloatButtonGroupClassNamesType
  styles?: FloatButtonGroupStylesType
  // Control
  trigger?: FloatButtonGroupTrigger
  open?: boolean
  defaultOpen?: boolean

  // UI
  closeIcon?: VueNode
  placement?: 'top' | 'left' | 'right' | 'bottom'
  style?: CSSProperties
}

export interface FloatButtonGroupSlots {
  default?: () => any
  closeIcon?: () => any
  icon?: () => any
}

export interface FloatButtonGroupEmits {
  'openChange': (open: boolean) => void
  'update:open': (open: boolean) => void
  'click': (e: MouseEvent) => void
}

const groupOmittedProps: (keyof FloatButtonGroupProps)[] = [
  'classes',
  'styles',
  'trigger',
  'open',
  'defaultOpen',
  'closeIcon',
  'placement',
  'style',
  'rootClass',
]

const defaults = {
  shape: 'circle',
  type: 'default',
  icon: () => <FileTextOutlined />,
} as any

const InternalFloatButtonGroup = defineComponent<
  FloatButtonGroupProps,
  FloatButtonGroupEmits,
  string,
  SlotsType<FloatButtonGroupSlots>
>(
  (props = defaults, { slots, attrs, emit }) => {
    const componentConfig = useComponentBaseConfig('floatButtonGroup', props, ['closeIcon'], floatButtonPrefixCls)
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClasses,
      styles: contextStyles,
      direction,
      closeIcon: contextCloseIcon,
      prefixCls,
    } = componentConfig

    const groupPrefixCls = computed(() => `${prefixCls.value}-group`)
    const listCls = computed(() => `${groupPrefixCls.value}-list`)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const { classes, styles, trigger, placement, shape, type, style } = toPropsRefs(
      props,
      'classes',
      'styles',
      'trigger',
      'placement',
      'shape',
      'type',
      'style',
    )

    const mergedPlacement = computed(() => {
      return VALID_PLACEMENTS.includes(placement.value as any)
        ? placement.value
        : 'top'
    })

    const mergedShape = computed<FloatButtonShape>(() => shape.value ?? 'circle')
    const individual = computed(() => mergedShape.value === 'circle')
    const mergedType = computed(() => type.value ?? 'default')

    // ============================ zIndex ============================
    const [zIndex] = useZIndex('FloatButton', computed(() => style.value?.zIndex as number | undefined))
    const zIndexStyle = computed(() => (zIndex.value === undefined ? undefined : { zIndex: zIndex.value }))

    const open = shallowRef(props.open ?? props.defaultOpen ?? false)
    watch(() => props.open, (val) => {
      if (val !== undefined) {
        open.value = !!val
      }
    })

    const triggerMode = computed(() => trigger.value && ['click', 'hover'].includes(trigger.value))
    const hoverTrigger = computed(() => trigger.value === 'hover')
    const clickTrigger = computed(() => trigger.value === 'click')

    const triggerOpen = (nextOpen: boolean) => {
      emit('update:open', nextOpen)
      if (props.open !== undefined) {
        return
      }
      if (open.value === nextOpen) {
        return
      }
      open.value = nextOpen
      emit('openChange', nextOpen)
    }

    const groupRef = shallowRef<HTMLElement>()

    const handleDocClick = (event: MouseEvent) => {
      if (!clickTrigger.value) {
        return
      }
      if (groupRef.value?.contains(event.target as Node)) {
        return
      }
      triggerOpen(false)
    }

    const canUseDocument = typeof document !== 'undefined'

    const setupDocListener = () => {
      if (clickTrigger.value && canUseDocument) {
        document.addEventListener('click', handleDocClick, { capture: true })
      }
    }

    const removeDocListener = () => {
      if (canUseDocument) {
        document.removeEventListener('click', handleDocClick, { capture: true })
      }
    }

    watch(clickTrigger, async (_n, _o, onCleanup) => {
      await nextTick()
      setupDocListener()
      onCleanup(() => {
        removeDocListener()
      })
    })

    onMounted(() => {
      setupDocListener()
    })

    onBeforeUnmount(() => {
      removeDocListener()
    })

    const onMouseEnter = () => {
      if (hoverTrigger.value) {
        triggerOpen(true)
      }
    }

    const onMouseLeave = () => {
      if (hoverTrigger.value) {
        triggerOpen(false)
      }
    }

    const mergedProps = computed(() => ({
      ...props,
      type: mergedType.value,
      shape: mergedShape.value,
      placement: mergedPlacement.value,
    }))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FloatButtonGroupClassNamesType,
      FloatButtonGroupStylesType,
      FloatButtonGroupProps
    >(
      useToArr(contextClasses, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const listContext = computed<GroupContextProps>(() => ({
      shape: mergedShape.value,
      individual: individual.value,
      classNames: {
        root: mergedClassNames.value.item,
        icon: mergedClassNames.value.itemIcon,
        content: mergedClassNames.value.itemContent,
      },
      styles: {
        root: mergedStyles.value.item,
        icon: mergedStyles.value.itemIcon,
        content: mergedStyles.value.itemContent,
      },
    }))

    const triggerContext = computed<GroupContextProps>(() => ({
      shape: mergedShape.value,
      individual: true,
      classNames: {
        root: mergedClassNames.value.trigger,
        icon: mergedClassNames.value.triggerIcon,
        content: mergedClassNames.value.triggerContent,
      },
      styles: {
        root: mergedStyles.value.trigger,
        icon: mergedStyles.value.triggerIcon,
        content: mergedStyles.value.triggerContent,
      },
    }))

    const restButtonProps = computed(() => {
      return omit(props, groupOmittedProps) as FloatButtonProps
    })

    return () => {
      const closeIcon = getSlotPropsFnRun(slots, props, 'closeIcon')
      const icon = getSlotPropsFnRun(slots, props, 'icon')
      const _contextCloseIcon = getSlotPropsFnRun({}, {
        closeIcon: contextCloseIcon?.value,
      }, 'closeIcon')
      const mergedCloseIcon = closeIcon ?? _contextCloseIcon ?? <CloseOutlined />
      const mergedTriggerIcon = icon ?? <FileTextOutlined />
      const motionName = `${listCls.value}-motion`
      const transitionProps = getTransitionProps(motionName)

      const renderList = () => {
        const children = filterEmpty(slots.default?.() ?? [])
        if (!children.length) {
          return null
        }
        const vertical = mergedPlacement.value === 'top' || mergedPlacement.value === 'bottom'
        const sharedClass = classNames(
          listCls.value,
          `${listCls.value}-motion`,
          mergedClassNames.value.list,
        )
        const sharedStyle = mergedStyles.value.list

        return individual.value
          ? (
              <Flex vertical={vertical} class={sharedClass} style={sharedStyle}>
                {children}
              </Flex>
            )
          : (
              <SpaceCompact
                direction={vertical ? 'vertical' : 'horizontal'}
                class={sharedClass}
                style={sharedStyle}
              >
                {children}
              </SpaceCompact>
            )
      }

      const renderTrigger = () => {
        if (!triggerMode.value) {
          return null
        }
        return (
          <GroupContextProvider value={triggerContext.value}>
            <FloatButton
              {...restButtonProps.value}
              type={mergedType.value}
              shape={mergedShape.value}
              icon={open.value ? mergedCloseIcon : mergedTriggerIcon}
              rootClass={classNames(`${groupPrefixCls.value}-trigger`, mergedClassNames.value.trigger)}
              classes={undefined}
              styles={undefined}
              onClick={(e: MouseEvent) => {
                if (clickTrigger.value) {
                  triggerOpen(!open.value)
                }
                emit('click', e)
              }}
              ariaLabel={props.ariaLabel}
            />
          </GroupContextProvider>
        )
      }
      return (
        <GroupContextProvider value={listContext.value}>
          <div
            {...pureAttrs(attrs)}
            ref={groupRef as any}
            class={classNames(
              groupPrefixCls.value,
              hashId.value,
              cssVarCls.value,
              rootCls.value,
              contextClassName.value,
              mergedClassNames.value.root,
              props.rootClass,
              (attrs as any).class,
              {
                [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
                [`${groupPrefixCls.value}-individual`]: individual.value,
                [`${groupPrefixCls.value}-${mergedPlacement.value}`]: !!triggerMode.value,
                [`${groupPrefixCls.value}-menu-mode`]: !!triggerMode.value,
              },
            )}
            style={[
              contextStyle.value,
              mergedStyles.value.root,
              props.style,
              (attrs as any).style,
              zIndexStyle.value,
            ]}
            onMouseenter={onMouseEnter}
            onMouseleave={onMouseLeave}
          >
            {triggerMode.value
              ? (
                  <Transition {...transitionProps}>
                    {open.value ? renderList() : null}
                  </Transition>
                )
              : renderList()}
            {renderTrigger()}
          </div>
        </GroupContextProvider>
      )
    }
  },
  {
    name: 'AFloatButtonGroup',
    inheritAttrs: false,
  },
)

const FloatButtonGroup = InternalFloatButtonGroup as typeof InternalFloatButtonGroup

export default FloatButtonGroup

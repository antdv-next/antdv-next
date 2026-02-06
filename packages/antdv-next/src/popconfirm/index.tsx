import type { App, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ButtonProps, LegacyButtonType } from '../button'
import type { PopoverProps, PopoverSemanticClassNames, PopoverSemanticName, PopoverSemanticStyles } from '../popover'
import type { TooltipEmits, TooltipRef } from '../tooltip'
import { ExclamationCircleFilled } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { removeUndefined } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watchEffect } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import Popover from '../popover'
import useMergedArrow from '../tooltip/hooks/useMergedArrow'
import PurePanel, { Overlay } from './PurePanel'
import useStyle from './style'

export type PopconfirmSemanticName = PopoverSemanticName

export type PopconfirmSemanticClassNames = PopoverSemanticClassNames

export type PopconfirmSemanticStyles = PopoverSemanticStyles

export type PopconfirmClassNamesType = SemanticClassNamesType<
  PopconfirmProps,
  PopconfirmSemanticClassNames
>

export type PopconfirmStylesType = SemanticStylesType<PopconfirmProps, PopconfirmSemanticStyles>

export interface PopconfirmProps extends Omit<PopoverProps, 'title' | 'content' | 'classes' | 'styles'> {
  title?: VueNode
  description?: VueNode
  disabled?: boolean
  okText?: VueNode
  cancelText?: VueNode
  okType?: LegacyButtonType
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  showCancel?: boolean
  icon?: VueNode
  classes?: PopconfirmClassNamesType
  styles?: PopconfirmStylesType
  onConfirm?: (e?: MouseEvent) => void
}

export interface PopconfirmRef extends TooltipRef {}

export interface PopconfirmEmits extends TooltipEmits {
  openChange: (open: boolean, e?: MouseEvent | KeyboardEvent) => void
  confirm: (e?: MouseEvent) => void
  cancel: (e?: MouseEvent) => void
  popupClick: (e: MouseEvent) => void
}

export interface PopconfirmSlots {
  default?: () => any
  title?: () => any
  description?: () => any
  icon?: () => any
  okText?: () => any
  cancelText?: () => any
}

const OMITTED_PROP_KEYS: (keyof PopconfirmProps)[] = [
  'title',
  'description',
  'okText',
  'cancelText',
  'okType',
  'okButtonProps',
  'cancelButtonProps',
  'showCancel',
  'icon',
  'disabled',
  'classes',
  'styles',
  'prefixCls',
  'arrow',
]

const defaultIcon = <ExclamationCircleFilled />

const defaults = {
  placement: 'top',
  okType: 'primary',
} as any

const InternalPopconfirm = defineComponent<
  PopconfirmProps,
  PopconfirmEmits,
  string,
  SlotsType<PopconfirmSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      arrow: contextArrow,
      trigger: contextTrigger,
      prefixCls,
    } = useComponentBaseConfig('popconfirm', props, ['arrow', 'trigger'])
    const { arrow: arrowProp, classes, styles } = toPropsRefs(props, 'arrow', 'classes', 'styles')
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const mergedArrow = useMergedArrow(arrowProp, contextArrow)
    const mergedTrigger = computed(() => props?.trigger ?? contextTrigger.value ?? 'click')
    const popoverRef = shallowRef<TooltipRef>()

    const open = shallowRef(props.open ?? props.defaultOpen ?? false)
    watchEffect(() => {
      if (props.open !== undefined) {
        open.value = props.open
      }
    })

    const settingOpen = (value: boolean, e?: MouseEvent | KeyboardEvent) => {
      if (props.open === undefined) {
        open.value = value
      }
      emit('openChange', value, e)
      emit('update:open', value)
    }

    const close = (e?: MouseEvent) => {
      settingOpen(false, e)
    }

    const onCancel = (e?: MouseEvent) => {
      emit('cancel', e)
      settingOpen(false, e)
    }

    const handlePopupClick = (e: MouseEvent) => {
      emit('popupClick', e)
    }

    const onInternalOpenChange = (value: boolean, e?: MouseEvent | KeyboardEvent) => {
      if (props.disabled) {
        return
      }
      settingOpen(value, e)
    }

    expose({
      forceAlign: () => popoverRef.value?.forceAlign?.(),
      nativeElement: computed(() => popoverRef.value?.nativeElement),
      popupElement: computed(() => popoverRef.value?.popupElement),
    })

    const mergedProps = computed(() => ({
      ...props,
      trigger: mergedTrigger.value,
    }))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PopconfirmClassNamesType,
      PopconfirmStylesType,
      PopconfirmProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const rootClassNames = computed(() =>
      clsx(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        contextClassName.value,
        mergedClassNames.value.root,
      ),
    )

    return () => {
      const titleNode = getSlotPropsFnRun(slots, props, 'title') ?? props.title
      const descriptionNode = getSlotPropsFnRun(slots, props, 'description') ?? props.description
      const iconNode = getSlotPropsFnRun(slots, props, 'icon') ?? props.icon ?? defaultIcon
      const okTextNode = getSlotPropsFnRun(slots, props, 'okText') ?? props.okText
      const cancelTextNode = getSlotPropsFnRun(slots, props, 'cancelText') ?? props.cancelText
      const restProps = omit(props, OMITTED_PROP_KEYS)

      const content = (
        <Overlay
          prefixCls={prefixCls.value}
          title={titleNode}
          description={descriptionNode}
          icon={iconNode}
          okText={okTextNode}
          cancelText={cancelTextNode}
          okType={props.okType ?? 'primary'}
          showCancel={props.showCancel ?? true}
          okButtonProps={props.okButtonProps}
          cancelButtonProps={props.cancelButtonProps}
          close={close}
          onConfirm={props.onConfirm}
          onCancel={onCancel}
          onPopupClick={handlePopupClick}
          classes={mergedClassNames.value}
          styles={mergedStyles.value}
        />
      )

      return (
        <Popover
          {...attrs}
          {...removeUndefined(restProps)}
          trigger={mergedTrigger.value}
          ref={popoverRef as any}
          open={open.value}
          arrow={mergedArrow.value}
          onOpenChange={onInternalOpenChange}
          content={content}
          classes={{
            root: rootClassNames.value,
            container: mergedClassNames.value.container,
            arrow: mergedClassNames.value.arrow,
          }}
          styles={{
            root: { ...mergedStyles.value.root, ...contextStyle.value },
            container: mergedStyles.value.container,
            arrow: mergedStyles.value.arrow,
          }}
        >
          {slots.default?.()}
        </Popover>
      )
    }
  },
  {
    name: 'APopconfirm',
    inheritAttrs: false,
  },
)

type PopconfirmType = typeof InternalPopconfirm & {
  install: (app: App) => void
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel
}

const Popconfirm = InternalPopconfirm as PopconfirmType

Popconfirm.install = (app: App) => {
  app.component(Popconfirm.name, Popconfirm)
}

Popconfirm._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export default Popconfirm

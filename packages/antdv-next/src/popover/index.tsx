import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { TooltipEmits, TooltipProps, TooltipRef, TooltipSemanticClassNames, TooltipSemanticStyles } from '../tooltip'
import { clsx } from '@v-c/util'
import KeyCode from '@v-c/util/dist/KeyCode'
import { filterEmpty, removeUndefined } from '@v-c/util/dist/props-util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed, createVNode, defineComponent, shallowRef, watchEffect } from 'vue'
import {
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import Tooltip from '../tooltip'
import useMergedArrow from '../tooltip/hooks/useMergedArrow.ts'
import PurePanel, { Overlay } from './PurePanel.tsx'
// CSSINJS
import useStyle from './style'

export type PopoverSemanticName = keyof PopoverSemanticClassNames & keyof PopoverSemanticStyles

export type PopoverSemanticClassNames = TooltipSemanticClassNames & {
  title?: string
  content?: string
}

export type PopoverSemanticStyles = TooltipSemanticStyles & {
  title?: CSSProperties
  content?: CSSProperties
}

export type PopoverClassNamesType = SemanticClassNamesType<PopoverProps, PopoverSemanticClassNames>

export type PopoverStylesType = SemanticStylesType<PopoverProps, PopoverSemanticStyles>

export interface PopoverProps extends TooltipProps {
  title?: VueNode
  content?: VueNode
  classes?: PopoverClassNamesType
  styles?: PopoverStylesType
}

export interface PopoverRef extends TooltipRef {

}
export interface PopoverEmits extends TooltipEmits {
  openChange: (open: boolean, e?: MouseEvent | KeyboardEvent) => void
}

export interface PopoverSlots {
  title: () => any
  content: () => any
  default: () => any
}

const defaults = {
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
} as any
const InternalPopover = defineComponent<
  PopoverProps,
  PopoverEmits,
  string,
  SlotsType<PopoverSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const {
      getPrefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      arrow: contextArrow,
      trigger: contextTrigger,
      prefixCls,
    } = useComponentBaseConfig('popover', props, ['arrow', 'trigger'])
    const { arrow: popoverArrow, classes, styles } = toPropsRefs(props, 'arrow', 'classes', 'styles')
    const rootCls = computed(() => getPrefixCls())
    const [hashId, cssVarCls] = useStyle(prefixCls)
    const mergedArrow = useMergedArrow(popoverArrow, contextArrow)
    const mergedTrigger = computed(() => props?.trigger ?? contextTrigger.value ?? 'hover')
    const popoverRef = shallowRef()

    const forceAlign = () => {
      popoverRef.value?.forceAlign?.()
    }
    expose({
      forceAlign,
      nativeElement: computed(() => popoverRef.value?.nativeElement),
      popupElement: computed(() => popoverRef.value?.popupElement),
    })

    // ============================= Styles =============================
    const mergedProps = computed(() => ({
      ...props,
      trigger: mergedTrigger.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PopoverClassNamesType,
      PopoverStylesType,
      PopoverProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))
    const open = shallowRef(props?.open ?? props?.defaultOpen ?? false)
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        settingOpen(false, e)
      }
    }

    const onInternalOpenChange = (value: boolean) => {
      settingOpen(value)
    }

    return () => {
      const children = filterEmpty(slots?.default?.() ?? [])?.[0]
      const {
        placement,
        mouseLeaveDelay,
        mouseEnterDelay,
        motion,
        ...restProps
      } = props
      const titleNode = getSlotPropsFnRun(slots, props, 'title')
      const contentNode = getSlotPropsFnRun(slots, props, 'content')
      const rootClassNames = clsx(
        hashId.value,
        cssVarCls.value,
        contextClassName.value,
        mergedClassNames.value.root,
      )
      return (
        <Tooltip
          {...attrs}
          unique={false}
          arrow={mergedArrow.value}
          placement={placement}
          trigger={mergedTrigger.value}
          mouseLeaveDelay={mouseLeaveDelay}
          mouseEnterDelay={mouseEnterDelay}
          {...removeUndefined(restProps)}
          prefixCls={prefixCls.value}
          classes={{
            root: rootClassNames,
            container: mergedClassNames.value?.container,
            arrow: mergedClassNames.value?.arrow,
          }}
          styles={{
            root: { ...mergedStyles.value?.root, ...contextStyle.value },
            container: mergedStyles.value?.container,
            arrow: mergedStyles.value?.arrow,
          }}
          open={open.value}
          onOpenChange={onInternalOpenChange}
          overlay={
            titleNode || contentNode
              ? (
                  <Overlay
                    prefixCls={prefixCls.value}
                    title={titleNode}
                    content={contentNode}
                    classes={mergedClassNames.value}
                    styles={mergedStyles.value}
                  />
                )
              : null
          }
          motion={{
            name: getTransitionName(
              rootCls.value,
              'zoom-big',
              typeof motion?.name === 'string' ? motion?.name : undefined,
            ),
          }}
          dataPopoverInject={true}
          ref={popoverRef}
        >
          { children ? createVNode(children, { onKeydown: onKeyDown }) : null}
        </Tooltip>
      )
    }
  },
  {
    name: 'APopover',
    inheritAttrs: false,
  },
)

const Popover = InternalPopover as typeof InternalPopover & {
  install: (app: App) => void
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

Popover.install = (app: App) => {
  app.component(Popover.name, Popover)
}

Popover._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export default Popover

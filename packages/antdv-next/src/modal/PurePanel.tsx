import type { DialogProps } from '@v-c/dialog'
import type { SlotsType } from 'vue'
import type { ModalClassNamesType, ModalFuncProps, ModalStylesType } from './interface'
import { Panel } from '@v-c/dialog'
import { clsx } from '@v-c/util'
import { toPropsRefs } from '@v-c/util/dist/props-util'
import { computed, defineComponent } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { withPureRenderTheme } from '../_util/PurePanel'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { ConfirmContent } from './ConfirmDialog'
import { Footer, renderCloseIcon } from './shared'
import useStyle from './style'

export interface PurePanelProps
  extends Omit<DialogProps, 'prefixCls' | 'footer' | 'visible' | 'classNames' | 'styles' | 'style'>,
  Pick<ModalFuncProps, 'type' | 'footer'> {
  prefixCls?: string
  rootClass?: string
  classes?: ModalClassNamesType
  styles?: ModalStylesType
}

export interface PurePanelSlots {
  default?: () => any
  title?: () => any
  closeIcon?: () => any
  footer?: (params: { originNode: any, extra: { OkBtn: any, CancelBtn: any } }) => any
}

const PurePanel = defineComponent<
  PurePanelProps,
  Record<string, never>,
  string,
  SlotsType<PurePanelSlots>
>(
  (props, { slots, attrs }) => {
    const {
      prefixCls,
      getPrefixCls,
      styles: contextStyles,
      classes: contextClassNames,
      class: contextClassName,
      style: contextStyle,
    } = useComponentBaseConfig('modal', props, [])
    const {
      classes,
      styles,
    } = toPropsRefs(props, 'classes', 'styles')
    const rootPrefixCls = computed(() => getPrefixCls(undefined, ''))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<ModalClassNamesType, ModalStylesType, PurePanelProps>(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(computed(() => props)),
    )
    const rootCls = useCSSVarCls(rootPrefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const confirmPrefixCls = computed(() => `${prefixCls.value}-confirm`)

    return () => {
      const { className: attrClassName, restAttrs, style: attrStyle } = getAttrStyleAndClass(attrs)
      const { type, closable, closeIcon } = props
      const footer = getSlotPropsFnRun(slots, props, 'footer', false)
      const title = getSlotPropsFnRun(slots, props, 'title', false)
      // Choose target props by confirm mark
      let additionalProps: Partial<DialogProps> = {}
      if (type) {
        additionalProps = {
          closable: closable ?? false,
          title: '',
          footer: '',
          children: (
            <ConfirmContent
              {...props as any}
              prefixCls={prefixCls.value}
              confirmPrefixCls={confirmPrefixCls.value}
              rootPrefixCls={rootPrefixCls.value}
              content={slots.default?.()}
            />
          ),
        }
      }
      else {
        additionalProps = {
          closable: closable ?? true,
          title,
          footer: footer !== null && <Footer {...props} footer={footer} />,
          children: slots.default?.(),
        }
      }
      return (
        <Panel
          prefixCls={prefixCls.value}
          className={clsx(
            hashId.value,
            `${prefixCls.value}-pure-panel`,
            type && confirmPrefixCls.value,
            type && `${confirmPrefixCls.value}-${type}`,
            attrClassName,
            contextClassName.value,
            cssVarCls.value,
            rootCls.value,
            props.rootClass,
            mergedClassNames.value?.root,
          )}
          animationVisible={true}
          style={[contextStyle, mergedStyles.value?.root, attrStyle]}
          {...restAttrs as any}
          closeIcon={renderCloseIcon(prefixCls.value, slots.closeIcon || closeIcon)}
          closable={closable}
          visible={true}
          {...additionalProps}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          v-slots={{
            default: () => additionalProps.children,
          }}
        />
      )
    }
  },
  {
    name: 'AModalPurePanel',
    inheritAttrs: false,
  },
)

export default withPureRenderTheme(PurePanel)

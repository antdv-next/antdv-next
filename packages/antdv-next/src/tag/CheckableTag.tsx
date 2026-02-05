import type { SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { computed, defineComponent } from 'vue'
import { pureAttrs } from '../_util/hooks'
import { clsx, getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig, useConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useStyle from './style'

export interface CheckableTagProps extends ComponentBaseProps {
  /**
   * It is an absolute controlled component and has no uncontrolled mode.
   *
   * .zh-cn 该组件为完全受控组件，不支持非受控用法。
   */
  checked: boolean
  /**
   * @since 5.27.0
   */
  icon?: VueNode
  disabled?: boolean
}

export interface CheckableTagEmits {
  'change': (checked: boolean) => void
  'update:checked': (checked: boolean) => void
  'click': (e: MouseEvent) => void
}

export interface CheckableTagSlots {
  default: () => any
  icon: () => any
}

const CheckableTag = defineComponent<
  CheckableTagProps,
  CheckableTagEmits,
  string,
  SlotsType<CheckableTagSlots>
>(
  (props, { slots, emit, attrs }) => {
    const configCtx = useConfig()
    const { prefixCls } = useComponentBaseConfig('tag', props)
    const { disabled: customDisabled } = toPropsRefs(props, 'disabled')

    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)
    const handleClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        return
      }
      const checked = !props.checked
      emit('change', checked)
      emit('update:checked', checked)
      emit('click', e)
    }
    const [hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const tag = configCtx.value.tag
      const { checked } = props
      const cls = clsx(
        prefixCls.value,
        `${prefixCls.value}-checkable`,
        {
          [`${prefixCls.value}-checkable-checked`]: checked,
          [`${prefixCls.value}-checkable-disabled`]: mergedDisabled.value,
        },
        tag?.class,
        (attrs as any).class,
        hashId.value,
        cssVarCls.value,
      )
      const icon = getSlotPropsFnRun(slots, props, 'icon')

      return (
        <span
          {...pureAttrs(attrs)}
          style={[tag?.style, (attrs as any).style]}
          class={cls}
          onClick={handleClick}
        >
          {icon}
          <span>{slots?.default?.()}</span>
        </span>
      )
    }
  },
  {
    name: 'ACheckableTag',
    inheritAttrs: false,
  },
)

export default CheckableTag

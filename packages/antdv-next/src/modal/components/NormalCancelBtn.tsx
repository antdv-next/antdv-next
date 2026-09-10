import type { VueNode } from '../../_util/type.ts'
import type { ModalEmits, ModalProps } from '../interface.ts'
import { defineComponent } from 'vue'
import Button from '../../button'
import { useModalContext } from '../context.ts'

export interface NormalCancelBtnProps extends Pick<ModalProps, 'cancelButtonProps'> {
  cancelTextLocale?: VueNode
  onCancel?: ModalEmits['cancel']
}

const NormalCancelBtn = defineComponent(
  () => {
    const context = useModalContext()
    return () => {
      const { onCancel, cancelTextLocale, cancelButtonProps } = context.value
      const { onClick, ...restCancelButtonProps } = (cancelButtonProps ?? {}) as Record<string, any>
      const onInternalClick = (event: MouseEvent) => {
        onCancel?.(event)
        onClick?.(event)
      }
      return (
        <Button {...restCancelButtonProps} onClick={onInternalClick}>
          {cancelTextLocale}
        </Button>
      )
    }
  },
  {
    name: 'NormalCancelBtn',
    inheritAttrs: false,
  },
)

export default NormalCancelBtn

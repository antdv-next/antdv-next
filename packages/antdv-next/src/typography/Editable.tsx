import type { CSSProperties, SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type'
import type { DirectionType } from '../config-provider/context'
import type { TextAreaRef } from '../input'
import { EnterOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import KeyCode from '@v-c/util/dist/KeyCode'
import { defineComponent, onMounted, shallowRef, watch } from 'vue'
import { toPropsRefs } from '../_util/tools.ts'
import { cloneElement } from '../_util/vueNode'
import TextArea from '../input/TextArea'
import useStyle from './style'

export interface EditableProps {
  'prefixCls': string
  'value': string
  'aria-label'?: string
  'onSave': (value: string) => void
  'onCancel': () => void
  'onEnd'?: () => void
  'className'?: string
  'style'?: CSSProperties
  'direction'?: DirectionType
  'maxLength'?: number
  'autoSize'?: any
  'enterIcon'?: VueNode
  'component'?: string
}

const defaults = {
  autoSize: true,
} as any
const Editable = defineComponent<
  EditableProps,
  EmptyEmit,
  string,
  SlotsType<Record<string, never>>
>(
  (props = defaults) => {
    const { prefixCls, direction, maxLength, autoSize } = toPropsRefs(props, 'prefixCls', 'direction', 'maxLength', 'autoSize')

    const ref = shallowRef<TextAreaRef>()

    const inComposition = shallowRef(false)
    const lastKeyCode = shallowRef<number | null>(null)

    const current = shallowRef(props.value)

    watch(
      () => props.value,
      (val) => {
        current.value = val
      },
    )

    onMounted(() => {
      if (ref.value?.resizableTextArea) {
        const { textArea } = ref.value.resizableTextArea
        textArea.focus()
        const { length } = textArea.value
        textArea.setSelectionRange(length, length)
      }
    })

    const onChange: any = ({ target }: any) => {
      current.value = target.value.replace(/[\n\r]/g, '')
    }

    const onCompositionStart = () => {
      inComposition.value = true
    }

    const onCompositionEnd = () => {
      inComposition.value = false
    }

    const onKeyDown: any = ({ keyCode }: KeyboardEvent) => {
      if (inComposition.value) {
        return
      }
      lastKeyCode.value = keyCode
    }

    const confirmChange = () => {
      props?.onSave?.(current.value.trim())
    }

    const onKeyUp: any = ({ keyCode, ctrlKey, altKey, metaKey, shiftKey }: KeyboardEvent) => {
      if (
        lastKeyCode.value !== keyCode
        || inComposition.value
        || ctrlKey
        || altKey
        || metaKey
        || shiftKey
      ) {
        return
      }
      if (keyCode === KeyCode.ENTER) {
        confirmChange()
        props?.onEnd?.()
      }
      else if (keyCode === KeyCode.ESC) {
        props?.onCancel?.()
      }
    }

    const onBlur: any = () => {
      confirmChange()
    }

    const [hashId, cssVarCls] = useStyle(prefixCls)

    const icon = props.enterIcon === undefined ? <EnterOutlined /> : props.enterIcon

    return () => {
      const { component, className } = props
      const textAreaClassName = clsx(
        prefixCls.value,
        `${prefixCls.value}-edit-content`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${component}`]: !!component,
        },
        className,
        hashId.value,
        cssVarCls.value,
      )
      return (
        <div class={textAreaClassName} style={props.style}>
          <TextArea
            ref={ref}
            maxlength={maxLength.value}
            value={current.value}
            onChange={onChange}
            onKeydown={onKeyDown}
            onKeyup={onKeyUp}
            onCompositionstart={onCompositionStart}
            onCompositionend={onCompositionEnd}
            onBlur={onBlur}
            aria-label={props['aria-label']}
            rows={1}
            autoSize={autoSize.value}
          />
          {icon !== null
            ? cloneElement(icon as any, { class: `${prefixCls.value}-edit-content-confirm` })
            : null}
        </div>
      )
    }
  },
  {
    name: 'TypographyEditable',
    inheritAttrs: false,
  },
)

export default Editable

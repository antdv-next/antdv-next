import type { SlotsType } from 'vue'
import type { VueNode } from '../_util/type'
import { SearchOutlined } from '@antdv-next/icons'
import { defineComponent } from 'vue'
import Input from '../input/Input'

export interface TransferSearchProps {
  prefixCls?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (e: Event) => void
  onClear?: () => void
}

export interface TransferSearchEmits {
  change: (e: Event) => void
  clear: () => void
}

export interface TransferSearchSlots {
  prefix?: () => VueNode
}

const Search = defineComponent<
  TransferSearchProps,
  TransferSearchEmits,
  string,
  SlotsType<TransferSearchSlots>
>(
  (props, { slots }) => {
    const handleChange = (e: Event) => {
      props?.onChange?.(e)
      const target = e?.target as HTMLInputElement | null
      if (!target?.value) {
        props?.onClear?.()
      }
    }

    return () => (
      <Input
        placeholder={props.placeholder || ''}
        class={props.prefixCls}
        value={props.value}
        onChange={handleChange}
        disabled={props.disabled}
        allowClear
        prefix={slots?.prefix?.() ?? <SearchOutlined />}
      />
    )
  },
  {
    name: 'ATransferSearch',
    inheritAttrs: false,
  },
)

export default Search

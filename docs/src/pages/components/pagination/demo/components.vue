<docs lang="zh-CN">
通过 `components` 替换每页条数切换器。
</docs>

<docs lang="en-US">
Replace the page size changer with `components`.
</docs>

<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'
import { InputNumber } from 'antdv-next'
import { defineComponent, h } from 'vue'

const SizeChanger = defineComponent({
  name: 'SizeChanger',
  props: {
    value: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () =>
      h(InputNumber, {
        'aria-label': 'Page Size',
        'disabled': props.disabled,
        'min': 1,
        'precision': 0,
        'style': { width: '100px' },
        'value': props.value,
        'onChange': (nextValue: number | string | null) => {
          if (nextValue !== null) {
            emit('change', Number(nextValue))
          }
        },
      })
  },
})

const components: PaginationProps['components'] = {
  sizeChanger: SizeChanger,
}
</script>

<template>
  <a-pagination
    show-size-changer
    :components="components"
    :default-current="3"
    :total="500"
  />
</template>

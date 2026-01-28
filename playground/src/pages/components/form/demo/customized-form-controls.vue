<docs lang="zh-CN">
自定义表单控件。
</docs>

<docs lang="en-US">
Customized form controls.
</docs>

<script setup lang="ts">
import type { PropType } from 'vue'
import { InputNumber, Select } from 'antdv-next'
import { defineComponent, h, reactive, ref, watch } from 'vue'

type Currency = 'rmb' | 'dollar'

interface PriceValue {
  number?: number
  currency?: Currency
}

const PriceInput = defineComponent({
  name: 'PriceInput',
  props: {
    value: {
      type: Object as PropType<PriceValue>,
      default: () => ({}),
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const number = ref<number>(props.value?.number ?? 0)
    const currency = ref<Currency>(props.value?.currency ?? 'rmb')

    watch(
      () => props.value,
      (val) => {
        if (!val)
          return
        if (val.number !== undefined)
          number.value = val.number
        if (val.currency)
          currency.value = val.currency
      },
      { deep: true },
    )

    const triggerChange = (changedValue: Partial<PriceValue>) => {
      emit('update:value', {
        number: number.value,
        currency: currency.value,
        ...props.value,
        ...changedValue,
      })
    }

    const onNumberChange = (value: number | null) => {
      const newNumber = value ?? 0
      number.value = newNumber
      triggerChange({ number: newNumber })
    }

    const onCurrencyChange = (value: Currency) => {
      currency.value = value
      triggerChange({ currency: value })
    }

    return () => h(
      'span',
      { style: { display: 'inline-flex', alignItems: 'center' } },
      [
        h(InputNumber, {
          'value': props.value?.number ?? number.value,
          'onUpdate:value': onNumberChange,
          'style': { width: '100px' },
        }),
        h(Select, {
          'value': props.value?.currency ?? currency.value,
          'onUpdate:value': onCurrencyChange,
          'style': { width: '80px', margin: '0 8px' },
          'options': [
            { label: 'RMB', value: 'rmb' },
            { label: 'Dollar', value: 'dollar' },
          ],
        }),
      ],
    )
  },
})

const model = reactive({
  price: { number: 0, currency: 'rmb' as Currency },
})

function checkPrice(_rule: any, value: PriceValue) {
  if ((value?.number ?? 0) > 0) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('Price must be greater than zero!'))
}

function handleFinish(values: any) {
  console.log('Received values from form: ', values)
}
</script>

<template>
  <a-form name="customized_form_controls" layout="inline" :model="model" @finish="handleFinish">
    <a-form-item name="price" label="Price" :rules="[{ validator: checkPrice }]">
      <PriceInput v-model:value="model.price" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

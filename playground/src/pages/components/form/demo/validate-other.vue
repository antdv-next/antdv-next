<docs lang="zh-CN">
其他类型控件的校验示例。
</docs>

<docs lang="en-US">
Validation with other form controls.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  select: undefined as string | undefined,
  selectMultiple: [] as string[],
  inputNumber: 3,
  switch: false,
  slider: 30,
  radioGroup: 'a',
  radioButton: 'a',
  checkboxGroup: ['A', 'B'],
  rate: 3.5,
})

const selectOptions = [
  { label: 'China', value: 'china' },
  { label: 'U.S.A', value: 'usa' },
]

const colorOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
]

const checkboxOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B', disabled: true },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
]

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <a-form
    name="validate_other"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item label="Plain Text">
      <span class="ant-form-text">China</span>
    </a-form-item>
    <a-form-item
      name="select"
      label="Select"
      has-feedback
      :rules="[{ required: true, message: 'Please select your country!' }]"
    >
      <a-select v-model:value="model.select" placeholder="Please select a country" :options="selectOptions" />
    </a-form-item>

    <a-form-item
      name="selectMultiple"
      label="Select[multiple]"
      :rules="[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]"
    >
      <a-select v-model:value="model.selectMultiple" mode="multiple" placeholder="Please select favourite colors" :options="colorOptions" />
    </a-form-item>

    <a-form-item label="InputNumber">
      <a-form-item name="inputNumber" no-style>
        <a-input-number v-model:value="model.inputNumber" :min="1" :max="10" />
      </a-form-item>
      <span class="ant-form-text" style="margin-inline-start: 8px">machines</span>
    </a-form-item>

    <a-form-item name="switch" label="Switch">
      <a-switch v-model:checked="model.switch" />
    </a-form-item>

    <a-form-item name="slider" label="Slider">
      <a-slider v-model:value="model.slider" :marks="{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }" />
    </a-form-item>

    <a-form-item name="radioGroup" label="Radio.Group">
      <a-radio-group v-model:value="model.radioGroup">
        <a-radio value="a">
          item 1
        </a-radio>
        <a-radio value="b">
          item 2
        </a-radio>
        <a-radio value="c">
          item 3
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      name="radioButton"
      label="Radio.Button"
      :rules="[{ required: true, message: 'Please pick an item!' }]"
    >
      <a-radio-group v-model:value="model.radioButton">
        <a-radio-button value="a">
          item 1
        </a-radio-button>
        <a-radio-button value="b">
          item 2
        </a-radio-button>
        <a-radio-button value="c">
          item 3
        </a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item name="checkboxGroup" label="Checkbox.Group">
      <a-checkbox-group v-model:value="model.checkboxGroup" :options="checkboxOptions" />
    </a-form-item>

    <a-form-item name="rate" label="Rate">
      <a-rate v-model:value="model.rate" />
    </a-form-item>

    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

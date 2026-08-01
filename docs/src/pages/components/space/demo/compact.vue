<docs lang="zh-CN">
紧凑布局组件，适合用于输入框、选择器等组件的组合。
</docs>

<docs lang="en-US">
Compact layout component, suitable for combining input boxes, selectors and other components.
</docs>

<script setup lang="ts">
import { CopyOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const zhejiangJiangsuOptions = [
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Jiangsu', value: 'Jiangsu' },
]

const option12Options = [
  { label: 'Option1', value: 'Option1' },
  { label: 'Option2', value: 'Option2' },
]

const option11Options = [
  { label: 'Option1-1', value: 'Option1-1' },
  { label: 'Option1-2', value: 'Option1-2' },
]

const option22Options = [
  { label: 'Option2-1', value: 'Option2-1' },
  { label: 'Option2-2', value: 'Option2-2' },
]

const betweenExceptOptions = [
  { label: 'Between', value: '1' },
  { label: 'Except', value: '2' },
]

const signOptions = [
  { label: 'Sign Up', value: 'Sign Up' },
  { label: 'Sign In', value: 'Sign In' },
]

const emailOptions = [{ value: 'text 1' }, { value: 'text 2' }]

const addressOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          { value: 'leaf1', title: 'leaf1' },
          { value: 'leaf2', title: 'leaf2' },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          { value: 'leaf3', title: 'leaf3' },
        ],
      },
    ],
  },
]

const value = ref('leaf1')
</script>

<template>
  <a-space orientation="vertical">
    <a-space-compact block>
      <a-input style="width: 20%" default-value="0571" />
      <a-input style="width: 30%" default-value="26888888" />
    </a-space-compact>
    <a-space-compact block size="small">
      <a-input style="width: calc(100% - 200px)" default-value="https://ant.design" />
      <a-button type="primary">
        Submit
      </a-button>
    </a-space-compact>
    <a-space-compact block>
      <a-input style="width: calc(100% - 200px)" default-value="https://ant.design" />
      <a-button type="primary">
        Submit
      </a-button>
    </a-space-compact>
    <a-space-compact block>
      <a-input
        style="width: calc(100% - 200px)"
        default-value="git@github.com:ant-design/ant-design.git"
      />
      <a-tooltip title="copy git url">
        <a-button>
          <template #icon>
            <CopyOutlined />
          </template>
        </a-button>
      </a-tooltip>
    </a-space-compact>
    <a-space-compact block>
      <a-select
        allow-clear
        default-value="Zhejiang"
        :options="zhejiangJiangsuOptions"
      />
      <a-input style="width: 50%" default-value="Xihu District, Hangzhou" />
    </a-space-compact>
    <a-space-compact block>
      <a-select
        allow-clear
        mode="multiple"
        default-value="Zhejiang"
        style="width: 50%"
        :options="zhejiangJiangsuOptions"
      />
      <a-input style="width: 50%" default-value="Xihu District, Hangzhou" />
    </a-space-compact>
    <a-space-compact block>
      <a-input-search style="width: 30%" default-value="0571" />
      <a-input-search allow-clear style="width: 50%" default-value="26888888" />
      <a-input-search style="width: 20%" default-value="+1" />
    </a-space-compact>
    <a-space-compact block>
      <a-select
        default-value="Option1"
        :options="option12Options"
      />
      <a-input style="width: 50%" default-value="input content" />
      <a-input-number :default-value="12" />
    </a-space-compact>
    <a-space-compact block>
      <a-input style="width: 50%" default-value="input content" />
      <a-date-picker style="width: 50%" />
    </a-space-compact>
    <a-space-compact block>
      <a-range-picker style="width: 70%" />
      <a-input style="width: 30%" default-value="input content" />
      <a-button type="primary">
        Search
      </a-button>
    </a-space-compact>
    <a-space-compact block>
      <a-input style="width: 30%" default-value="input content" />
      <a-range-picker style="width: 70%" />
    </a-space-compact>
    <a-space-compact block>
      <a-select
        default-value="Option1-1"
        :options="option11Options"
      />
      <a-select
        default-value="Option2-2"
        :options="option22Options"
      />
    </a-space-compact>
    <a-space-compact block>
      <a-select
        default-value="1"
        :options="betweenExceptOptions"
      />
      <a-input style="width: 100px; text-align: center" placeholder="Minimum" />
      <a-input
        class="site-input-split"
        style="width: 30px; border-inline-start: 0; border-inline-end: 0; pointer-events: none"
        placeholder="~"
        disabled
      />
      <a-input
        class="site-input-right"
        style="width: 100px; text-align: center"
        placeholder="Maximum"
      />
    </a-space-compact>
    <a-space-compact block>
      <a-select
        default-value="Sign Up"
        style="width: 30%"
        :options="signOptions"
      />
      <a-auto-complete
        style="width: 70%"
        placeholder="Email"
        :options="emailOptions"
      />
    </a-space-compact>
    <a-space-compact block>
      <a-time-picker style="width: 70%" />
      <a-cascader
        style="width: 70%"
        :options="addressOptions"
        placeholder="Select Address"
      />
    </a-space-compact>
    <a-space-compact block>
      <a-time-range-picker />
      <a-tree-select
        v-model:value="value"
        show-search
        style="width: 60%"
        :styles="{ popup: { root: { maxHeight: '400px', overflow: 'auto' } } }"
        placeholder="Please select"
        allow-clear
        tree-default-expand-all
        :tree-data="treeData"
      >
        <template #title="{ value: val, title }">
          <b v-if="val === 'leaf3'" style="color: #08c">{{ title }}</b>
          <template v-else>
            {{ title }}
          </template>
        </template>
      </a-tree-select>
      <a-button type="primary">
        Submit
      </a-button>
    </a-space-compact>
    <a-space-compact>
      <a-input placeholder="input here" />
      <a-space-addon>$</a-space-addon>
      <a-input-number placeholder="another input" style="width: 100%" />
      <a-input-number placeholder="another input" style="width: 100%" />
      <a-space-addon>$</a-space-addon>
    </a-space-compact>
    <a-space-compact>
      <a-input placeholder="input here" />
      <a-color-picker />
    </a-space-compact>
    <a-space-compact>
      <a-button type="primary">
        Button
      </a-button>
      <a-input placeholder="input here" />
      <a-space-addon>$</a-space-addon>
    </a-space-compact>
  </a-space>
</template>

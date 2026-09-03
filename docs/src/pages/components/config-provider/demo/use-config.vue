<docs lang="zh-CN">
获取父级 `Provider` 的值。如 `DisabledContextProvider`、`SizeContextProvider`。
</docs>

<docs lang="en-US">
Get the value of the parent `Provider`. Such as `DisabledContextProvider`, `SizeContextProvider`.
</docs>

<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { ref } from 'vue'
import ConfigDisplay from './use-config-display.vue'

type SizeType = ConfigProviderProps['componentSize']

const componentSize = ref<SizeType>('small')
const disabled = ref(true)
</script>

<template>
  <div>
    <a-space>
      <a-radio-group v-model:value="componentSize">
        <a-radio-button value="small">
          Small
        </a-radio-button>
        <a-radio-button value="medium">
          Medium
        </a-radio-button>
        <a-radio-button value="large">
          Large
        </a-radio-button>
      </a-radio-group>
      <a-checkbox v-model:checked="disabled">
        Form disabled
      </a-checkbox>
    </a-space>
    <a-divider />
    <a-config-provider :component-size="componentSize">
      <div class="example">
        <a-form :disabled="disabled">
          <ConfigDisplay />
        </a-form>
      </div>
    </a-config-provider>
  </div>
</template>

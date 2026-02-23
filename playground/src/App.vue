<script setup lang="ts">
import { ref } from 'vue'

const data = ref<Record<string, any>>({ test: '1' })

function handleClick() {
  data.value = {}
}
</script>

<template>
  <a-radio-group v-model:value="data.test">
    <a-radio value="1">
      测试1
    </a-radio>
    <a-radio value="2">
      测试2
    </a-radio>
  </a-radio-group>
  <div>
    <a-button @click="handleClick">
      点击触发bug
    </a-button>
  </div>
  {{ data }}
</template>

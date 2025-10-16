<script setup lang="ts">
import type { SizeType } from 'antdv-next/src/config-provider/SizeContext.tsx'
import { shallowRef } from 'vue'

const size = shallowRef<SizeType>('middle')
function change() {
  size.value === 'middle' ? size.value = 'small' : size.value = 'middle'
}
</script>

<template>
  <a-button @click="change">
    Change
  </a-button>
  <a-config-provider :component-size="size">
    <a-flex vertical gap="small">
      <a-flex gap="small" wrap>
        <a-button color="default" variant="solid">
          Solid
        </a-button>
        <a-button color="default" variant="outlined">
          Outlined
        </a-button>
        <a-button color="default" variant="dashed">
          Dashed
        </a-button>
        <a-button color="default" variant="filled">
          Filled
        </a-button>
        <a-button color="default" variant="text">
          Text
        </a-button>
        <a-button color="default" variant="link">
          Link
        </a-button>
      </a-flex>
      <a-flex gap="small" wrap>
        <a-button color="primary" variant="solid">
          Solid
        </a-button>
        <a-button color="primary" variant="outlined">
          Outlined
        </a-button>
        <a-button color="primary" variant="dashed">
          Dashed
        </a-button>
        <a-button color="primary" variant="filled">
          Filled
        </a-button>
        <a-button color="primary" variant="text">
          Text
        </a-button>
        <a-button color="primary" variant="link">
          Link
        </a-button>
      </a-flex>
      <a-flex gap="small" wrap>
        <a-button color="danger" variant="solid">
          Solid
        </a-button>
        <a-button color="danger" variant="outlined">
          Outlined
        </a-button>
        <a-button color="danger" variant="dashed">
          Dashed
        </a-button>
        <a-button color="danger" variant="filled">
          Filled
        </a-button>
        <a-button color="danger" variant="text">
          Text
        </a-button>
        <a-button color="danger" variant="link">
          Link
        </a-button>
      </a-flex>
      <a-flex gap="small" wrap>
        <a-button color="pink" variant="solid">
          Solid
        </a-button>
        <a-button color="pink" variant="outlined">
          Outlined
        </a-button>
        <a-button color="pink" variant="dashed">
          Dashed
        </a-button>
        <a-button color="pink" variant="filled">
          Filled
        </a-button>
        <a-button color="pink" variant="text">
          Text
        </a-button>
        <a-button color="pink" variant="link">
          Link
        </a-button>
      </a-flex>
      <a-flex gap="small" wrap>
        <a-button color="purple" variant="solid">
          Solid
        </a-button>
        <a-button color="purple" variant="outlined">
          Outlined
        </a-button>
        <a-button color="purple" variant="dashed">
          Dashed
        </a-button>
        <a-button color="purple" variant="filled">
          Filled
        </a-button>
        <a-button color="purple" variant="text">
          Text
        </a-button>
        <a-button color="purple" variant="link">
          Link
        </a-button>
      </a-flex>
      <a-flex gap="small" wrap>
        <a-button color="cyan" variant="solid">
          Solid
        </a-button>
        <a-button color="cyan" variant="outlined">
          Outlined
        </a-button>
        <a-button color="cyan" variant="dashed">
          Dashed
        </a-button>
        <a-button color="cyan" variant="filled">
          Filled
        </a-button>
        <a-button color="cyan" variant="text">
          Text
        </a-button>
        <a-button color="cyan" variant="link">
          Link
        </a-button>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>

<style scoped>

</style>

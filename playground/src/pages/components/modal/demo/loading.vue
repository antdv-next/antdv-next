<script lang="ts" setup>
import { ref } from 'vue'

const open = ref(false)
const loading = ref(true)
function showLoading() {
  open.value = true
  loading.value = true

  // Simple loading mock. You should add cleanup logic in real world.
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <a-button type="primary" @click="showLoading">
    Open Modal
  </a-button>
  <a-modal
    v-model:open="open"
    :loading="loading"
    @cancel="open = false"
  >
    <template #title>
      <p>Loading Modal</p>
    </template>
    <template #footer>
      <a-button type="primary" @click="showLoading">
        Reload
      </a-button>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const open = ref(false)

function showModal() {
  open.value = true
}
function hideModal() {
  open.value = false
}
</script>

<template>
  <a-button type="primary" @click="showModal">
    Modal
  </a-button>
  <a-modal
    v-model:open="open"
    title="Modal"
    ok-text="确定"
    cancel-text="取消"
    @cancel="hideModal"
    @ok="hideModal"
  >
    <p>Bla bla ...</p>
    <p>Bla bla ...</p>
    <p>Bla bla ...</p>
  </a-modal>
</template>

<script setup lang="ts">
import { Modal } from 'antdv-next'

const [modal, ContextHolder] = Modal.useModal()
function countDown() {
  let secondsToGo = 5
  const instance = modal.success({
    title: 'This is a notification message',
    content: `This modal will be destroyed after ${secondsToGo} second.`,
  })

  const timer = setInterval(() => {
    secondsToGo -= 1
    instance.update({
      content: `This modal will be destroyed after ${secondsToGo} second.`,
    })
  }, 1000)

  setTimeout(() => {
    clearInterval(timer)
    instance.destroy()
  }, secondsToGo * 1000)
}
</script>

<template>
  <a-button @click="countDown">
    Open modal to close in 5s
  </a-button>
  <ContextHolder />
</template>

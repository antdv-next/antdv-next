<script setup lang="ts">
import { theme } from 'antdv-next'

const { useToken } = theme
const { token } = useToken()
</script>

<template>
  <a-space>
    <a-qrcode value="https://www.antdv-next.com" :color="token.colorSuccessText" />
    <a-qrcode value="https://www.antdv-next.com" :color="token.colorInfoText" :bg-color="token.colorBgLayout" />
  </a-space>
</template>

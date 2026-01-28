<docs lang="zh-CN">
下载二维码的简单实现。
</docs>

<docs lang="en-US">
A way to download QRCode.
</docs>

<script setup lang="ts">
import type { QRCodeProps } from 'antdv-next'
import { ref, useTemplateRef } from 'vue'

const renderType = ref<QRCodeProps['type']>('canvas')
const qrcodeRef = useTemplateRef('qrcode')
function doDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadCanvasQRCode() {
  if (qrcodeRef.value) {
    const url = qrcodeRef.value.toDataURL()
    doDownload(url, 'QRCode.png')
  }
}

function downloadSvgQRCode() {
  const svg = qrcodeRef.value.$el?.querySelector<SVGElement>('svg')
  const svgData = new XMLSerializer().serializeToString(svg!)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  doDownload(url, 'QRCode.svg')
}
</script>

<template>
  <a-space vertical>
    <a-segmented v-model:value="renderType" :options="['canvas', 'svg']" />
    <div>
      <a-qrcode ref="qrcode" :type="renderType" value="https://ant.design" bg-color="rgba(255,255,255,0.5)" style="margin-bottom: 16px;" icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
      <a-button type="primary" @click="renderType === 'canvas' ? downloadCanvasQRCode() : downloadSvgQRCode()">
        download
      </a-button>
    </div>
  </a-space>
</template>

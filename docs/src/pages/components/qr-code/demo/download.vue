<docs lang="zh-CN">
下载二维码的简单实现。
</docs>

<docs lang="en-US">
A way to download QRCode.
</docs>

<script setup lang="ts">
import type { QRCodeProps, QRCodeRef } from 'antdv-next'
import { ref, useTemplateRef } from 'vue'

const renderType = ref<QRCodeProps['type']>('canvas')
const qrcodeRef = useTemplateRef<QRCodeRef>('qrcode')
function doDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadCanvasQRCode() {
  const canvas = qrcodeRef.value?.nativeElement?.querySelector<HTMLCanvasElement>('canvas')
  if (canvas) {
    const url = canvas.toDataURL()
    doDownload(url, 'QRCode.png')
  }
}

function downloadSvgQRCode() {
  const svg = qrcodeRef.value?.nativeElement?.querySelector<SVGElement>('svg')
  if (!svg)
    return
  const svgData = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  doDownload(url, 'QRCode.svg')
}
</script>

<template>
  <a-space vertical>
    <a-segmented v-model:value="renderType" :options="['canvas', 'svg']" />
    <div>
      <a-qrcode ref="qrcode" :type="renderType" value="https://ant.design" bg-color="rgba(255,255,255,0.5)" style="margin-bottom: 16px;" icon="/antdv-next.svg" />
      <a-button type="primary" @click="renderType === 'canvas' ? downloadCanvasQRCode() : downloadSvgQRCode()">
        download
      </a-button>
    </div>
  </a-space>
</template>

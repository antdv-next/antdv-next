<docs lang="zh-CN">
波纹效果带来了灵动性，可以通过 `component` 判断来自哪个组件。你也可以使用 [`@antdv-next/happy-work-theme`](https://github.com/antdv-next/happy-work-theme) 提供的 HappyProvider 实现动态波纹效果。
</docs>

<docs lang="en-US">
Wave effect brings dynamic. Use `component` to determine which component use it. You can also use HappyProvider from [`@antdv-next/happy-work-theme`](https://github.com/antdv-next/happy-work-theme) to implement dynamic wave effect.
</docs>

<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { HappyProvider } from '@antdv-next/happy-work-theme'

function createHolder(node: HTMLElement) {
  const { borderWidth } = getComputedStyle(node)
  const borderWidthNum = Number.parseInt(borderWidth, 10)

  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.inset = `-${borderWidthNum}px`
  div.style.borderRadius = 'inherit'
  div.style.background = 'transparent'
  div.style.zIndex = '999'
  div.style.pointerEvents = 'none'
  div.style.overflow = 'hidden'
  node.appendChild(div)

  return div
}

function createDot(holder: HTMLElement, color: string, left: number, top: number, size = 0) {
  const dot = document.createElement('div')
  dot.style.position = 'absolute'
  dot.style.left = `${left}px`
  dot.style.top = `${top}px`
  dot.style.width = `${size}px`
  dot.style.height = `${size}px`
  dot.style.borderRadius = '50%'
  dot.style.background = color
  dot.style.transform = 'translate3d(-50%, -50%, 0)'
  dot.style.transition = 'all 1s ease-out'
  holder.appendChild(dot)
  return dot
}

type WaveConfig = NonNullable<ConfigProviderProps['wave']>

const showInsetEffect: WaveConfig['showEffect'] = (node: HTMLElement, { event, component }: { event: MouseEvent, component?: string }) => {
  if (component !== 'Button') {
    return
  }

  const holder = createHolder(node)
  const rect = holder.getBoundingClientRect()
  const left = event.clientX - rect.left
  const top = event.clientY - rect.top

  const dot = createDot(holder, 'rgba(255, 255, 255, 0.65)', left, top)

  requestAnimationFrame(() => {
    dot.ontransitionend = () => {
      holder.remove()
    }

    dot.style.width = '200px'
    dot.style.height = '200px'
    dot.style.opacity = '0'
  })
}

const showShakeEffect: WaveConfig['showEffect'] = (node: HTMLElement, { component }: { component?: string }) => {
  if (component !== 'Button') {
    return
  }

  const seq = [0, -15, 15, -5, 5, 0]
  const itv = 10
  let steps = 0

  const loop = () => {
    cancelAnimationFrame((node as any).effectTimeout)
    ;(node as any).effectTimeout = requestAnimationFrame(() => {
      const currentStep = Math.floor(steps / itv)
      const current = seq[currentStep]
      const next = seq[currentStep + 1]

      if (current === undefined || next === undefined || next === null) {
        node.style.transform = ''
        node.style.transition = ''
        return
      }

      const angle = current + ((next - current) / itv) * (steps % itv)

      node.style.transform = `rotate(${angle}deg)`
      node.style.transition = 'none'

      steps += 1
      loop()
    })
  }

  loop()
}

const configs: Array<{ name: string, wave: WaveConfig }> = [
  { name: 'Disabled', wave: { disabled: true } },
  { name: 'Default', wave: {} },
  { name: 'Inset', wave: { showEffect: showInsetEffect } },
  { name: 'Shake', wave: { showEffect: showShakeEffect } },
]
</script>

<template>
  <a-flex gap="large" wrap>
    <a-config-provider v-for="item in configs" :key="item.name" :wave="item.wave">
      <a-button type="primary">
        {{ item.name }}
      </a-button>
    </a-config-provider>
    <HappyProvider v-slot="{ wave }" :enabled="true">
      <a-config-provider :wave="wave">
        <a-button type="primary">
          Happy Work
        </a-button>
      </a-config-provider>
    </HappyProvider>
  </a-flex>
</template>

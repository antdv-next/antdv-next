<script setup lang="ts">
import type { VNode } from 'vue'
import type { DocPage } from '@/composables/doc-page.ts'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, inject, onMounted, onUnmounted, ref, useSlots } from 'vue'

defineOptions({
  name: 'DemoGroup',
})

const props = defineProps<{
  cols?: number
}>()

const slots = useSlots()
const pageInfo = inject<DocPage | null>('__pageInfo__', null)
const containerRef = ref<HTMLElement>()

// 配置
const gap = 8
const minColumnWidth = 420 // 每列最小宽度，低于此值会减少列数

const configuredCols = computed(() => {
  if (props.cols)
    return props.cols
  return pageInfo?.frontmatter?.demo?.cols || 1
})

// 响应式：根据容器宽度计算实际列数
const containerWidth = ref(0)
const actualCols = computed(() => {
  const configured = configuredCols.value
  if (configured <= 1)
    return 1

  // 如果容器宽度未知，默认使用配置的列数
  if (containerWidth.value === 0)
    return configured

  // 计算当前宽度能容纳的最大列数
  // 公式：(containerWidth + gap) / (minColumnWidth + gap)
  const maxPossibleCols = Math.floor((containerWidth.value + gap) / (minColumnWidth + gap))

  // 取配置列数和可容纳列数的较小值，至少为 1
  return Math.max(1, Math.min(configured, maxPossibleCols))
})

/**
 * 将子元素分配到多个列中
 * 采用和 React dumi DumiDemoGrid 相同的策略：
 * 按顺序将元素依次分配到每列，形成类似蛇形分布
 * 例如 cols=2，6个元素会分配为: col1=[1,3,5], col2=[2,4,6]
 */
const columns = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot)
    return []

  // 获取所有子节点，过滤掉空白节点
  const children = filterEmpty(defaultSlot).filter((node) => {
    // 过滤掉文本节点、注释节点等
    if (typeof node === 'string' || typeof node === 'number')
      return false
    if (node.type === Comment)
      return false
    // 过滤掉空白文本
    if (node.type === Text && typeof node.children === 'string' && !node.children.trim())
      return false
    // Debug demos are shown in development only and hidden in the production docs build
    if (import.meta.env.PROD && (node.props?.debug === '' || node.props?.debug === true || node.props?.debug === 'true'))
      return false
    return true
  })

  const cols = actualCols.value
  if (cols <= 1) {
    // 单列模式，所有元素放在一个列中
    return [children]
  }

  // 多列模式：按照 dumi 的方式分配元素
  // 元素按顺序分配到各列：0->col0, 1->col1, 2->col0, 3->col1...
  const result: VNode[][] = Array.from({ length: cols }, () => [])

  for (let i = 0; i < children.length; i += cols) {
    children.slice(i, i + cols).forEach((item, j) => {
      result[j]!.push(item as VNode)
    })
  }

  return result
})

const containerStyle = computed(() => ({
  '--gap': `${gap}px`,
}))

// 响应式监听容器宽度
let resizeObserver: ResizeObserver | null = null

function updateContainerWidth() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateContainerWidth()
  if (containerRef.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateContainerWidth)
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    class="ant-doc-demo-group"
    :style="containerStyle"
    :class="pageInfo?.frontmatter?.demo?.class"
  >
    <section v-for="(col, index) in columns" :key="index" class="ant-doc-demo-column">
      <component :is="() => col" />
    </section>
  </div>
</template>

<style lang="less" scoped>
.ant-doc-demo-group {
  display: flex;
  margin: calc(var(--gap) * -1);
  margin-bottom: 24px;
}

.ant-doc-demo-column {
  flex: 1;
  padding: var(--gap);
  width: 0; // 配合 flex: 1 确保等宽

  :deep(> *) {
    margin-bottom: calc(var(--gap) * 2);

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

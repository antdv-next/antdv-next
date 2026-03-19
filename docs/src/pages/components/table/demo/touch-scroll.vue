<docs lang="zh-CN">
移动端触摸滚动增强，提供惯性滑动与同步表头。设为 `true` 使用默认配置，传入对象可自定义阻尼、阈值等参数。
</docs>

<docs lang="en-US">
Mobile touch scroll enhancement with inertial scrolling and header sync. Set to `true` for defaults, or pass an object to customize friction, thresholds, etc.
</docs>

<script setup lang="ts">
import type { TableProps, TableTouchScrollConfig } from 'antdv-next'
import { computed, ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
  { title: 'Address', dataIndex: 'address', key: 'address', width: 300 },
]

const dataSource: DataType[] = Array.from({ length: 50 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32 + (i % 10),
  address: `London, Park Lane no. ${i}`,
}))

// 预设配置示例
const preset = ref<'default' | 'smooth' | 'noInertia' | 'custom'>('default')
const customFriction = ref(0.92)
const customDragThreshold = ref(8)
const scrollLog = ref<string[]>([])

const touchScrollConfig = computed<boolean | TableTouchScrollConfig>(() => {
  if (preset.value === 'default') {
    return true
  }

  if (preset.value === 'smooth') {
    return {
      friction: 0.98,
      onScrollStart: () => scrollLog.value.push('开始滑动'),
      onScrollEnd: () => scrollLog.value.push('滑动结束'),
    }
  }

  if (preset.value === 'noInertia') {
    return {
      disableInertia: true,
      onScrollEnd: () => scrollLog.value.push('松手即停'),
    }
  }

  return {
    friction: customFriction.value,
    dragThreshold: customDragThreshold.value,
    onScrollStart: () => scrollLog.value.push('Start'),
    onScrollEnd: () => scrollLog.value.push('End'),
  }
})

function clearLog() {
  scrollLog.value = []
}
</script>

<template>
  <div style="padding: 16px;">
    <a-space direction="vertical" style="width: 100%">
      <a-space wrap>
        <span>预设：</span>
        <a-radio-group v-model:value="preset">
          <a-radio-button value="default">
            默认
          </a-radio-button>
          <a-radio-button value="smooth">
            更顺滑
          </a-radio-button>
          <a-radio-button value="noInertia">
            无惯性
          </a-radio-button>
          <a-radio-button value="custom">
            自定义
          </a-radio-button>
        </a-radio-group>
      </a-space>

      <a-space v-if="preset === 'custom'" wrap>
        <a-input-number v-model:value="customFriction" :min="0.8" :max="0.99" :step="0.01" addon-before="friction" />
        <a-input-number v-model:value="customDragThreshold" :min="1" :max="20" addon-before="dragThreshold" />
      </a-space>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ y: 300, x: 600 }"
        :touch-scroll="touchScrollConfig"
      />

      <div v-if="scrollLog.length > 0">
        <a-space>
          <span>滚动回调日志：</span>
          <a-button size="small" @click="clearLog">
            清空
          </a-button>
        </a-space>
        <pre style="margin: 8px 0 0; max-height: 80px; overflow: auto; font-size: 12px;">{{ scrollLog.join('\n') }}</pre>
      </div>
    </a-space>
  </div>
</template>

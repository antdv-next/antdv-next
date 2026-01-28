<docs lang="zh-CN">
在卡片中展示统计数值。
</docs>

<docs lang="en-US">
Display statistic data in Card.
</docs>

<script setup lang="ts">
import { ArrowDownOutlined, ArrowUpOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-card variant="borderless">
        <a-statistic title="Active" :value="11.28" :precision="2" :styles="{ content: { color: '#3f8600' } }" suffix="%">
          <template #prefix>
            <ArrowUpOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card variant="borderless">
        <a-statistic title="Idle" :value="9.3" :precision="2" :styles="{ content: { color: '#cf1322' } }" suffix="%">
          <template #prefix>
            <ArrowDownOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
  </a-row>
</template>

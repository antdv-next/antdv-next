<docs lang="zh-CN">
自定义尺寸，适应在各种容器中展示。
</docs>

<docs lang="en-US">
Custom sizes to fit in a variety of containers.
</docs>

<script setup lang="ts">
  import { ref } from 'vue'

  const size = ref<'default' | 'middle' | 'small'>('default')
  const borderItems = [
    {
      key: '1',
      label: 'Product',
      content: 'Cloud Database',
    },
    {
      key: '2',
      label: 'Billing Mode',
      content: 'Prepaid',
    },
    {
      key: '3',
      label: 'Automatic Renewal',
      content: 'YES',
    },
    {
      key: '4',
      label: 'Order time',
      content: '2018-04-24 18:00:00',
    },
    {
      key: '5',
      label: 'Usage Time',
      content: '2019-04-24 18:00:00',
      span: 2,
    },
    {
      key: '6',
      label: 'Status',
      span: 3,
    },
    {
      key: '7',
      label: 'Negotiated Amount',
      content: '$80.00',
    },
    {
      key: '8',
      label: 'Discount',
      content: '$20.00',
    },
    {
      key: '9',
      label: 'Official Receipts',
      content: '$60.00',
    },
    {
      key: '10',
      label: 'Config Info',
    },
  ]

  const items = [
    {
      key: '1',
      label: 'Product',
      content: 'Cloud Database',
    },
    {
      key: '2',
      label: 'Billing',
      content: 'Prepaid',
    },
    {
      key: '3',
      label: 'Time',
      content: '18:00:00',
    },
    {
      key: '4',
      label: 'Amount',
      content: '$80.00',
    },
    {
      key: '5',
      label: 'Discount',
      content: '$20.00',
    },
    {
      key: '6',
      label: 'Official',
      content: '$60.00',
    },
  ]
</script>

<template>
  <a-radio-group v-model:value="size">
    <a-radio value="default">default</a-radio>
    <a-radio value="middle">middle</a-radio>
    <a-radio value="small">small</a-radio>
  </a-radio-group>
  <br>
  <br>
  <a-descriptions title="User Info" :items="borderItems" bordered :size="size">
    <template #contentRender="{ index, item }">
      <template v-if="index === 5">
        <a-badge status="processing" text="running" />
      </template>
      <template v-if="item.key === '10'">
        Data disk type: MongoDB
        <br>
        Database version: 3.4
        <br>
        Package: dds.mongo.mid
        <br>
        Storage space: 10 GB
        <br>
        Replication factor: 3
        <br>
        Region: East China 1
        <br>
      </template>
    </template>
  </a-descriptions>
  <br>
  <br>
  <a-descriptions title="Custom Size" :items="items" :size="size">
    <template #extra>
      <a-button type="primary">Edit</a-button>
    </template>
  </a-descriptions>
</template>

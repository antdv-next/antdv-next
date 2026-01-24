<docs lang="zh-CN">
垂直带边框和背景颜色的列表。
</docs>

<docs lang="en-US">
Descriptions with border and background color.
</docs>

<script setup lang="ts">
  const items = [
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
</script>

<template>
  <a-descriptions title="User Info" :items="items" bordered layout="vertical">
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
</template>

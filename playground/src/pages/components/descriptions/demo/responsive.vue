<docs lang="zh-CN">
通过响应式的配置可以实现在小屏幕设备上的完美呈现。
</docs>

<docs lang="en-US">
Responsive configuration enables perfect presentation on small screen devices.
</docs>

<script setup lang="ts">
  const items = [
    {
      label: 'Product',
      content: 'Cloud Database',
    },
    {
      label: 'Billing',
      content: 'Prepaid',
    },
    {
      label: 'Time',
      content: '18:00:00',
    },
    {
      label: 'Amount',
      content: '$80.00',
    },
    {
      label: 'Discount',
      span: { xl: 2, xxl: 2 },
      content: '$20.00',
    },
    {
      label: 'Official',
      span: { xl: 2, xxl: 2 },
      content: '$60.00',
    },
    {
      label: 'Config Info',
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: 'Hardware Info',
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
  ]
</script>

<template>
  <a-descriptions title="Responsive Descriptions" bordered  :column="{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }" :items="items">
    <template #contentRender="{ item }">
      <template v-if="item.label === 'Config Info'">
        Data disk type: MongoDB
        <br>
        Database version: 3.4
        <br>
        Package: dds.mongo.mid
      </template>
      <template v-else-if="item.label === 'Hardware Info'">
        CPU: 6 Core 3.5 GHz
        <br>
        Storage space: 10 GB
        <br>
        Replication factor: 3
        <br>
        Region: East China 1
      </template>  
    </template>  
  </a-descriptions>
</template>

<style scoped></style>

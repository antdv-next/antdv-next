<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Descriptions 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Descriptions by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
  import type { DescriptionsProps } from 'antdv-next';

  const classes: DescriptionsProps['classes'] = {
    root: 'custom-descriptions-root',
  }

  const items: DescriptionsProps['items'] = [
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
  ]

  const styles: DescriptionsProps['styles'] = {
    label: {
      color: '#000',
    },
  }

  const stylesFn: DescriptionsProps['styles'] = (info) => {
    if (info.props.size === 'default') {
      return {
        root: {
          borderRadius: '8px',
          border: '1px solid #CDC1FF',
        },
        label: { color: '#A294F9' },
      } satisfies DescriptionsProps['styles'];
    }
    return {};
  }

  const descriptionsProps: DescriptionsProps = {
    title: 'User Info',
    items,
    bordered: true,
    classes,
  }
</script>

<template>
  <a-flex vertical gap="middle">
    <a-descriptions v-bind="descriptionsProps" :styles="styles" size="small" />
    <a-descriptions v-bind="descriptionsProps" :styles="stylesFn" size="default" />
  </a-flex>
</template>

<style scoped>
.custom-descriptions-root {
  padding: 10px;
}
</style>

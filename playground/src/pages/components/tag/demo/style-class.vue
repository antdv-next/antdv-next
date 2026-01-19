<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Tag 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Tag by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { CheckCircleOutlined, CloseCircleOutlined } from '@antdv-next/icons';

const tagStyles = {
  root: {
    backgroundColor: '#e6f7ff',
  },
  icon: {
    color: '#52c41a',
  },
  content: {
    color: '#262626',
  },
};

const filledTagStyles = {
  root: {
    backgroundColor: '#F5EFFF',
  },
  icon: {
    color: '#8F87F1',
  },
  content: {
    color: '#8F87F1',
  },
};

const groupStyles = {
  root: {
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: 'rgba(82, 196, 26, 0.08)',
    borderRadius: '8px',
  },
  item: {
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    color: '#52c41a',
  },
};

const multipleGroupStyles = {
  root: {
    gap: '16px',
    padding: '8px 12px',
    backgroundColor: 'rgba(143, 135, 241, 0.08)',
    borderRadius: '8px',
  },
  item: {
    backgroundColor: 'rgba(143, 135, 241, 0.1)',
    borderColor: 'rgba(143, 135, 241, 0.3)',
    color: '#8F87F1',
    fontWeight: 500,
  },
};

const options1 = ['React', 'Vue', 'Angular'];
const options2 = ['meet-student', 'thinkasany'];
</script>

<template>
  <a-space size="large" vertical>
    <a-flex gap="middle">
      <a-tag :classes="{ root: 'custom-tag-root' }" :styles="tagStyles">
        <template #icon>
          <CheckCircleOutlined />
        </template>
        Object
      </a-tag>
      <a-tag
        variant="filled"
        :classes="{ root: 'custom-tag-root' }"
        :styles="filledTagStyles"
      >
        <template #icon>
          <CloseCircleOutlined />
        </template>
        Function
      </a-tag>
    </a-flex>
    <a-flex vertical gap="middle">
      <a-checkable-tag-group
        :classes="{ root: 'custom-tag-root' }"
        :styles="groupStyles"
        :options="options1"
      />
      <a-checkable-tag-group
        :classes="{ root: 'custom-tag-root' }"
        :styles="multipleGroupStyles"
        :options="options2"
        multiple
      />
    </a-flex>
  </a-space>
</template>

<style scoped>
.custom-tag-root {
  padding: 2px 6px;
  border-radius: 4px;
}
</style>

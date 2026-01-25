<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Calendar 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Calendar by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
  import type { CalendarProps } from 'antdv-next'
  import type { Dayjs } from 'dayjs'

  const classes = {
    root: 'custom-calendar-root',
  };

  const stylesObject: CalendarProps<Dayjs>['styles'] = {
    root: {
      borderRadius: '8px',
      width: '600px',
    },
  };

  const stylesFunction: CalendarProps<Dayjs>['styles'] = (info) => {
    if (info.props.fullscreen) {
      return {
        root: {
          border: '2px solid #BDE3C3',
          borderRadius: '10px',
          backgroundColor: 'rgba(189,227,195, 0.3)',
        },
      } satisfies CalendarProps<Dayjs>['styles'];
    }
  };
</script>

<template>
  <a-flex vertical gap="middle">
    <a-calendar :fullscreen="false" :classes="classes" :styles="stylesObject" />
    <a-calendar :classes="classes" :styles="stylesFunction" />
  </a-flex>
</template>

<style scoped>
.custom-calendar-root {
  padding: 10px;
  background-color: #e6f4ff;
}
</style>

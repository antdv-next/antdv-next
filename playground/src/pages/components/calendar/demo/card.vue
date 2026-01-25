<docs lang="zh-CN">
用于嵌套在空间有限的容器中。
</docs>

<docs lang="en-US">
Nested inside a container element for rendering in limited space.
</docs>

<script setup lang="ts">
  import type { CalendarProps } from 'antdv-next'
  import type { Dayjs } from 'dayjs'

  function onPanelChange(value: Dayjs, mode: CalendarProps<Dayjs>['mode']) {
    console.log(value.format('YYYY-MM-DD'), mode);
  }
</script>

<template>
  <div class="wrapStyle">
    <a-calendar :fullscreen="false" @panel-change="onPanelChange" />
  </div>
</template>

<style scoped>
.wrapStyle {
  width: 300px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
}
</style>

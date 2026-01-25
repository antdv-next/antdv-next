<docs lang="zh-CN">
一个复杂的应用示例，用 `dateCellRender` 和 `monthCellRender` 函数来自定义需要渲染的数据。
</docs>

<docs lang="en-US">
This component can be rendered by using `dateCellRender` and `monthCellRender` with the data you need.
</docs>

<script setup lang="ts">
  import type { BadgeProps} from 'antdv-next'

  function getListData(value: any) {
    let listData: { type: string; content: string }[] = []; // Specify the type of listData
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event......' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || [];
  }

  function getMonthData(value: any) {
    if (value.month() === 8) {
      return 1394;
    }
  }
</script>

<template>
  <a-calendar>
    <template #cellRender="{ date, info }">
      <template v-if="info.type === 'date'">
        <ul class="events">
          <li v-for="item in getListData(date)" :key="item.content">
            <a-badge :status="item.type as BadgeProps['status']" :text="item.content" />
          </li>
        </ul>
      </template>
      <template v-else-if="info.type === 'month'">
        <div v-if="getMonthData(date)" class="notes-month">
          <section>{{ getMonthData(date) }}</section>
          <span>Backlog number</span>
        </div>
      </template>  
    </template>
  </a-calendar>
</template>

<style scoped>
.events {
  margin: 0;
  padding: 0;
  list-style: none;
}

.events .ant-badge-status {
  width: 100%;
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notes-month {
  font-size: 28px;
  text-align: center;
}

.notes-month section {
  font-size: 28px;
}
</style>

<docs lang="zh-CN">
自定义日历头部内容。
</docs>

<docs lang="en-US">
Customize Calendar header content.
</docs>

<script setup lang="ts">
  import type { Dayjs } from 'dayjs'
  import dayjs from 'dayjs'
  import dayLocaleData from 'dayjs/plugin/localeData'
  import 'dayjs/locale/zh-cn'

  dayjs.extend(dayLocaleData)

  function getYearOptions(value: Dayjs) {
    const year = value.year();

    const yearOptions = Array.from({ length: 20 }, (_, i) => {
      const label = year - 10 + i;
      return { label, value: label };
    })
    return yearOptions
  }

  function getMonthOptions(value: Dayjs) {
    const monthOptions = value
      .localeData()
      .monthsShort()
      .map((label, index) => ({
        label,
        value: index,
      }))
    return monthOptions
  }
</script>

<template>
  <div class="wrapperStyle">
    <a-calendar :fullscreen="false">
      <template #headerRender="{ value, type, onChange, onTypeChange }">
        <div style="padding: 8px;">
          <a-typography-title :level="4">Custom header</a-typography-title>
          <a-flex gap="8">
            <a-radio-group size="small" :value="type" @change="(e) => onTypeChange(e.target.value)">
              <a-radio-button value="month">Month</a-radio-button>
              <a-radio-button value="year">Year</a-radio-button>
            </a-radio-group>
            <a-select
              size="small"
              :popup-match-select-width="false"
              :value="value.year()"
              :options="getYearOptions(value)"
              @change="(newYear) => onChange(value.clone().year(newYear))"
            />
            <a-select
              size="small"
              :popup-match-select-width="false"
              :value="value.month()"
              :options="getMonthOptions(value)"
              @change="(newMonth) => onChange(value.clone().month(newMonth))"
            />
          </a-flex>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<style scoped>
.wrapperStyle {
  width: 300px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
}
</style>

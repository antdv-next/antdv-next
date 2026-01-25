<docs lang="zh-CN">
展示农历、节气等信息。
</docs>

<docs lang="en-US">
Display lunar calendar, solar terms and other information.
</docs>

<script setup lang="ts">
  import type { CalendarProps } from 'antdv-next'
  import type { Dayjs } from 'dayjs'
  import dayjs from 'dayjs';
  import { HolidayUtil, Lunar } from 'lunar-typescript'
  import { ref } from 'vue'

  const selectDate = ref<Dayjs>(dayjs())
  const panelDate = ref<Dayjs>(dayjs())
  function getYearLabel(year: number) {
    const d = Lunar.fromDate(new Date(year + 1, 0));
    return `${d.getYearInChinese()}年（${d.getYearInGanZhi()}${d.getYearShengXiao()}年）`;
  }

  function getMonthLabel(month: number, value: Dayjs) {
    const d = Lunar.fromDate(new Date(value.year(), month));
    const lunar = d.getMonthInChinese();
    return `${month + 1}月（${lunar}月）`;
  }

  function getCellDate(date) {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
    const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    return { lunar, solarTerm, displayHoliday, isWeekend };
  }

  function getCellMonth(date) {
    const d2 = Lunar.fromDate(new Date(date.get('year'), date.get('month')))
    const month = d2.getMonthInChinese()
    return month
  }

  function getMonthOptions(value) {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    let current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current = current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let i = start; i < end; i++) {
      monthOptions.push({
        label: getMonthLabel(i, value),
        value: i,
      });
    }
    return monthOptions
  }

  function getOptions(value) {
    const year = value.year();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push({
        label: getYearLabel(i),
        value: i,
      });
    }
    return options
  }

  function onPanelChange(value: Dayjs, mode: CalendarProps<Dayjs>['mode']) {
    console.log(value.format('YYYY-MM-DD'), mode);
    panelDate.value = value
  }

  function onSelect(value, selectInfo) {
    if (selectInfo.source === 'date') {
      selectDate.value = value;
    }
  }
</script>

<template>
  <div class="wrapper">
    <a-calendar :fullscreen="false" @panel-change="onPanelChange" @select="onSelect">
      <template #fullCellRender="{ date, info }">
        <template v-if="info.type === 'date'">
          <div class="dateCell" :class="{ current: selectDate.isSame(date, 'date'), today: date.isSame(dayjs(), 'date') }">
            <div class="text">
              <span :class="{ weekend: getCellDate(date).isWeekend, gray: !panelDate.isSame(date, 'month') }">
                {{ date.get('date') }}
              </span>
              <template v-if="info.type === 'date'">
                <div class="lunar">{{ getCellDate(date).displayHoliday || getCellDate(date).solarTerm || getCellDate(date).lunar }}
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="info.type === 'month'">
          <div class="monthCell" :class="{ monthCellCurrent: selectDate.isSame(date, 'month') }">{{ date.get('month') + 1 }}月（{{ getCellMonth(date) }} 月）</div>
        </template>  
      </template>
      <template #headerRender="{ value, type, onChange, onTypeChange }">
        <a-row justify="end" :gutter="8" style="padding: 8px;">
          <a-col>
            <a-select size="small" :options="getOptions(value)" :value="value.year()" @change="(newYear) => onChange(value.clone().year(newYear))" />
          </a-col>
          <a-col>
            <a-select size="small" :options="getMonthOptions(value)" :value="value.month()" @change="(newMonth) => onChange(value.clone().month(newMonth))" />
          </a-col>
          <a-col>
            <a-radio-group size="small" :value="type" @change="(e) => onTypeChange(e.target.value)">
              <a-radio-button value="month">月</a-radio-button>
              <a-radio-button value="year">年</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
      </template>
    </a-calendar>
  </div>
</template>

<style scoped>
.wrapper {
  width: 450px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 5px;
}
.dateCell {
  position: relative;
}
.dateCell::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-inline-end: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  max-width: 40px;
  max-height: 40px;
  background: transparent;
  transition: background-color 300ms;
  border-radius: 4px;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.dateCell:hover::before {
  background: rgba(0, 0, 0, 0.04);
}
.current {
  color: #fff;
}
.current::before {
  background: #1677ff;
}
.current:hover::before {
  background: #1677ff;
  opacity: 0.8;
}
.current .lunar {
  color: #fff;
  opacity: 0.9;
}
.current .weekend {
  color: #fff;
}
.today::before {
  border: 1px solid #1677ff;
}
.text {
  position: relative;
  z-index: 1;
}
.lunar {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
.weekend {
  color: #ff4d4f;
  &.gray {
    opacity: 0.4;
  }
}
.monthCell {
  width: 120px;
  color: #000;
  border-radius: 4px;
  padding: 5px 0;
}
.monthCell:hover {
  background: rgba(0, 0, 0, 0.04);
}
.monthCellCurrent {
  color: #fff;
  background: #1677ff;
}
.monthCellCurrent:hover {
  background: #1677ff;
  opacity: 0.8;
}
</style>

<script setup lang="ts">
import type { RadioOptionType } from 'antdv-next'
import { BarChartOutlined, DotChartOutlined, LineChartOutlined, PieChartOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const iconsMap: any = {
  1: LineChartOutlined,
  2: DotChartOutlined,
  3: BarChartOutlined,
  4: PieChartOutlined,
}
const options: RadioOptionType[] = [
  {
    value: 1,
    class: 'option-1',
    label: 'LineChat',
  },
  {
    value: 2,
    class: 'option-2',
    label: 'DotChart',
  },
  {
    value: 3,
    class: 'option-3',
    label: 'BarChart',
  },
  {
    value: 4,
    class: 'option-4',
    label: 'PieChart',
  },
]
const model = ref({
  test: 3,
})
</script>

<template>
  <div>
    {{ model }}
    <a-radio-group :value="model.test" :options="options">
      <template #labelRender="{ item }">
        <a-flex gap="small" justify="center" align="center" vertical>
          <component :is="iconsMap[item.value]" style="font-size: 18px" />
          {{ item.label }}
        </a-flex>
      </template>
    </a-radio-group>
  </div>
</template>

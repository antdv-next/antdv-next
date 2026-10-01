import type { Component } from 'vue'
import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Input,
  Menu,
  Select,
  Table,
  Tooltip,
} from 'antdv-next'
import { defineComponent, h, nextTick, reactive, ref, shallowRef } from 'vue'

export interface Scenario {
  /** Default instance / row count when `?n=` is not given. */
  defaultN: number
  component: (n: number) => Component
  /** Optional interaction to time after the last hot mount. */
  update?: () => Promise<void>
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

const tableColumns = range(6).map(i => ({
  title: `Col ${i}`,
  dataIndex: `c${i}`,
  key: `c${i}`,
}))

function tableRows(n: number) {
  return range(n).map((r) => {
    const row: Record<string, any> = { key: r }
    tableColumns.forEach((col, c) => {
      row[col.dataIndex] = `r${r}c${c}`
    })
    return row
  })
}

function menuItems(groups: number, perGroup: number) {
  return range(groups).map(g => ({
    key: `g${g}`,
    label: `Group ${g}`,
    children: range(perGroup).map(i => ({ key: `g${g}-${i}`, label: `Item ${g}-${i}` })),
  }))
}

function formScene(n: number) {
  const model = reactive<Record<string, string>>({})
  range(n).forEach((i) => {
    model[`field${i}`] = ''
  })
  const formRef = ref<any>(null)
  const component = defineComponent({
    render: () => h(Form, { ref: formRef, model, layout: 'vertical' }, () => range(n).map(i => h(
      FormItem,
      { key: i, name: `field${i}`, label: `Field ${i}`, rules: [{ required: true }] },
      () => h(Input, {
        'value': model[`field${i}`],
        'onUpdate:value': (v: string) => {
          model[`field${i}`] = v
        },
      }),
    ))),
  })
  return { component, model, formRef }
}

let latestTableUpdate: () => Promise<void> = async () => {}
let latestFormChange: () => Promise<void> = async () => {}
let latestFormValidate: () => Promise<void> = async () => {}

export const scenarios: Record<string, Scenario> = {
  'button': {
    defaultN: 1000,
    component: n => defineComponent({
      render: () => range(n).map(i => h(Button, { key: i }, () => 'Button')),
    }),
  },
  'input': {
    defaultN: 500,
    component: n => defineComponent({
      render: () => range(n).map(i => h(Input, { key: i, value: `value ${i}` })),
    }),
  },
  // Closed tooltips (one Trigger each). `trigger: 'click'` so a runner can
  // open one deterministically; `placement: 'top'` so the popup is aligned via
  // its bottom inset, the case the reduced-motion alignment fix guards.
  'tooltip': {
    defaultN: 300,
    component: n => defineComponent({
      render: () => h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '120px' } }, range(n).map(i => h(Tooltip, {
        key: i,
        title: `Tooltip ${i}`,
        placement: 'top',
        trigger: 'click',
      }, () => h(Button, null, () => `Tip ${i}`)))),
    }),
  },
  'select': {
    defaultN: 500,
    component: n => defineComponent({
      render: () => range(n).map(i => h(Select, {
        key: i,
        value: 'a',
        options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }],
        style: { width: '160px' },
      })),
    }),
  },
  'date-picker': {
    defaultN: 200,
    component: n => defineComponent({
      render: () => range(n).map(i => h(DatePicker, { key: i })),
    }),
  },
  'menu': {
    defaultN: 500,
    component: (n) => {
      const groups = 10
      const items = menuItems(groups, Math.ceil(n / groups))
      return defineComponent({
        render: () => h(Menu, {
          mode: 'inline',
          items,
          openKeys: items.map(item => item.key),
          style: { width: '256px' },
        }),
      })
    },
  },
  'form': {
    defaultN: 100,
    component: n => formScene(n).component,
  },
  'table': {
    defaultN: 1000,
    component: n => defineComponent({
      render: () => h(Table, { columns: tableColumns, dataSource: tableRows(n), pagination: false }),
    }),
  },
  // ---- Update-path scenes: mount once, then time one interaction ----
  'table-update': {
    defaultN: 1000,
    component: (n) => {
      const data = shallowRef(tableRows(n))
      latestTableUpdate = async () => {
        // Replace every row with a new object (same keys), as a data refresh would.
        data.value = tableRows(n).map(row => ({ ...row, c0: `${row.c0}*` }))
      }
      return defineComponent({
        render: () => h(Table, { columns: tableColumns, dataSource: data.value, pagination: false }),
      })
    },
    update: () => latestTableUpdate(),
  },
  'form-change': {
    defaultN: 100,
    component: (n) => {
      const scene = formScene(n)
      latestFormChange = async () => {
        for (let i = 0; i < 100; i += 1) {
          scene.model.field0 = `value ${i}`
          await nextTick()
        }
      }
      return scene.component
    },
    update: () => latestFormChange(),
  },
  'form-validate': {
    defaultN: 100,
    component: (n) => {
      const scene = formScene(n)
      latestFormValidate = async () => {
        // Every field is required and empty: renders one error per field. The
        // validate promise can settle before the errors reach the DOM, so wait
        // until they are rendered (bounded) before the caller stops the clock.
        await scene.formRef.value?.validate?.().catch(() => {})
        const deadline = performance.now() + 3000
        while (document.querySelectorAll('.ant-form-item-explain-error').length < n && performance.now() < deadline) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
      }
      return scene.component
    },
    update: () => latestFormValidate(),
  },
  // A "typical admin page": side menu + inline filter form + buttons + paginated table.
  'admin': {
    defaultN: 1,
    component: () => {
      const FilterForm = formScene(4).component
      const items = menuItems(5, 8)
      return defineComponent({
        render: () => h('div', { style: { display: 'flex', gap: '16px' } }, [
          h(Menu, { mode: 'inline', items, openKeys: items.map(item => item.key), style: { width: '200px' } }),
          h('div', { style: { flex: 1 } }, [
            h('div', { style: { display: 'flex', gap: '8px' } }, [
              h(FilterForm),
              ...range(3).map(i => h(Select, { key: `s${i}`, value: 'a', options: [{ value: 'a', label: 'A' }], style: { width: '120px' } })),
              ...range(3).map(i => h(DatePicker, { key: `d${i}` })),
            ]),
            h('div', { style: { display: 'flex', gap: '8px', margin: '8px 0' } }, range(10).map(i => h(Button, { key: i, type: i === 0 ? 'primary' : 'default' }, () => `Action ${i}`))),
            h(Table, { columns: tableColumns, dataSource: tableRows(200), pagination: { pageSize: 20 } }),
          ]),
        ]),
      })
    },
  },
}

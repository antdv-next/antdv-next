import { describe, expect, it } from 'vitest'
import { h, markRaw } from 'vue'
import {
  Anchor,
  AutoComplete,
  Button,
  DatePicker,
  FloatButtonGroup,
  Image,
  Masonry,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Splitter,
  SplitterPanel,
  TimePicker,
  TimeRangePicker,
  TreeSelect,
} from '../src'
import ScopedCssParent from './fixtures/ScopedCssParent.vue'
import { mount } from '/@tests/utils'

interface ScopedCssCase {
  name: string
  component: any
  props?: Record<string, any>
  selector: string
  slots?: () => any
}

const cases: ScopedCssCase[] = [
  {
    name: 'Anchor',
    component: Anchor,
    props: { items: [{ key: 'a', href: '#a', title: 'a' }] },
    selector: '.ant-anchor-wrapper',
  },
  {
    name: 'AutoComplete',
    component: AutoComplete,
    props: { options: [{ label: 'a', value: 'a' }] },
    selector: '.ant-select-auto-complete',
  },
  {
    name: 'DatePicker',
    component: DatePicker,
    selector: '.ant-picker',
  },
  {
    name: 'WeekPicker',
    component: DatePicker.WeekPicker,
    selector: '.ant-picker',
  },
  {
    name: 'MonthPicker',
    component: DatePicker.MonthPicker,
    selector: '.ant-picker',
  },
  {
    name: 'YearPicker',
    component: DatePicker.YearPicker,
    selector: '.ant-picker',
  },
  {
    name: 'QuarterPicker',
    component: DatePicker.QuarterPicker,
    selector: '.ant-picker',
  },
  {
    name: 'RangePicker',
    component: DatePicker.RangePicker,
    selector: '.ant-picker-range',
  },
  {
    name: 'FloatButtonGroup',
    component: FloatButtonGroup,
    selector: '.ant-float-btn-group',
  },
  {
    name: 'Image',
    component: Image,
    props: { src: 'image.png', preview: false },
    selector: '.ant-image',
  },
  {
    name: 'Masonry',
    component: Masonry,
    props: { items: [{ key: 'a', children: 'a' }] },
    selector: '.ant-masonry',
  },
  {
    name: 'Menu',
    component: Menu,
    slots: () => [h(MenuItem, { key: 'a' }, () => 'a')],
    selector: '.ant-menu',
  },
  {
    name: 'Pagination',
    component: Pagination,
    props: { total: 100 },
    selector: '.ant-pagination',
  },
  {
    name: 'Select',
    component: Select,
    props: { options: [{ label: 'a', value: 'a' }] },
    selector: '.ant-select',
  },
  {
    name: 'Splitter',
    component: Splitter,
    slots: () => [
      h(SplitterPanel, { size: '50%' }, () => 'a'),
      h(SplitterPanel, { size: '50%' }, () => 'b'),
    ],
    selector: '.ant-splitter',
  },
  {
    name: 'TimePicker',
    component: TimePicker,
    selector: '.ant-picker',
  },
  {
    name: 'TimeRangePicker',
    component: TimeRangePicker,
    selector: '.ant-picker-range',
  },
  {
    name: 'TreeSelect',
    component: TreeSelect,
    props: { treeData: [{ value: 'a', title: 'a' }] },
    selector: '.ant-select',
  },
  {
    name: 'Button control',
    component: Button,
    selector: '.ant-btn',
  },
]

describe('scoped css id', () => {
  it.each(cases)('$name root receives the parent SFC scope id', ({ component, props, selector, slots }) => {
    const scopeId = (ScopedCssParent as any).__scopeId
    const wrapper = mount(ScopedCssParent, {
      props: {
        component: markRaw(component),
        componentProps: props,
      },
      slots: slots ? { default: slots } : undefined,
    })
    const root = wrapper.find(selector)

    expect(root.exists()).toBe(true)
    expect(root.attributes(scopeId)).toBeDefined()
  })
})

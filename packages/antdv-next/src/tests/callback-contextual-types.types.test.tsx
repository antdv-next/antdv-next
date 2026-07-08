/**
 * Type-level regression tests: callback props written inline in
 * `h(Component, { ... })` must receive contextual parameter types — no
 * manual annotations. Under `noImplicitAny`, any component that loses
 * contextual typing for its function props fails compilation here
 * (verified by `vue-tsc`; runtime is a trivial smoke assertion).
 *
 * Keep every callback parameter USED so unused-parameter lint stays quiet,
 * and keep this file free of explicit parameter annotations on purpose.
 */
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Calendar,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Collapse,
  ConfigProvider,
  DatePicker,
  Dropdown,
  Form,
  FormItem,
  Input,
  InputNumber,
  Mentions,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Progress,
  Radio,
  Rate,
  Select,
  Slider,
  Statistic,
  Steps,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Tooltip,
  Transfer,
  Tree,
  Upload,
} from '../components'

export function renderAll() {
  return [
    // ======== events via EmitsToPropsLoose / EmitsProps ========
    h(Button, { onClick: e => e.preventDefault() }),
    h(Input, { onChange: e => e.target, onPressEnter: e => e.key }),
    h(Checkbox, { onChange: e => e.target.checked }),
    h(Radio, { onChange: e => e.target.checked }),
    h(Rate, { onChange: v => v.toFixed(1) }),
    h(Slider, { onChange: v => v }),
    h(Tag, { onClose: e => e.type }),
    h(Tooltip, { onOpenChange: open => !open }),
    h(Popconfirm, { onConfirm: e => e?.type }),
    h(Modal, { onOk: e => e.type, onCancel: e => e.type }),
    h(Steps, { onChange: current => current + 1 }),
    h(Tabs, { onChange: key => `${key}`, onEdit: (e, action) => `${action}:${String(e)}` }),
    h(Menu, { onClick: info => info.key, onOpenChange: keys => keys.length }),
    h(Dropdown, { onOpenChange: (open, info) => open && info.source }),
    h(Collapse, { onChange: key => key }),
    h(CheckboxGroup, { onChange: values => values.length }),
    h(Pagination, { onChange: (page, pageSize) => page + pageSize }),

    // ======== render/config callbacks declared as props ========
    h(Table, {
      columns: [{ title: 'a', dataIndex: 'a', render: (value, record, index) => [value, record, index] }],
      rowKey: record => record.id,
      pagination: { showTotal: (total, range) => `${total}-${range[0]}` },
    }),
    h(Select, {
      options: [{ value: 'a', label: 'A' }],
      filterOption: (input, option) => !!option && input.length > 0,
      onChange: (value, option) => [value, option],
    }),
    h(AutoComplete, {
      options: [{ value: 'a' }],
      filterOption: (input, option) => !!option && input.length > 0,
    }),
    h(Cascader, {
      displayRender: labels => labels.join(' / '),
      loadData: selectedOptions => selectedOptions.length,
    }),
    h(Transfer, {
      render: item => item.title,
      filterOption: (input, item) => input.length > 0 && !!item,
      rowKey: record => record.key,
    }),
    h(DatePicker, {
      disabledDate: current => !current,
      onChange: (date, dateString) => [date, dateString],
    }),
    h(TimePicker, { onChange: (time, timeString) => [time, timeString] }),
    h(Calendar, { disabledDate: current => !current }),
    h(InputNumber, {
      formatter: value => `${value}`,
      parser: text => text,
      onChange: value => value,
    }),
    h(Progress, { format: (percent, successPercent) => `${percent}-${successPercent}` }),
    h(Statistic, { formatter: value => value }),
    h(Breadcrumb, { itemRender: (route, params, routes, paths) => [route, params, routes, paths] }),
    h(Upload, {
      beforeUpload: (file, fileList) => fileList.includes(file),
      onChange: info => info.file,
    }),
    h(Tree, {
      onSelect: (keys, info) => [keys, info.node],
      onCheck: (keys, info) => [keys, info.node],
      filterTreeNode: node => !!node,
    }),
    h(Mentions, {
      filterOption: (input, option) => input.length > 0 && !!option.value,
      onSelect: (option, prefix) => [option, prefix],
    }),
    h(Form, { onFinish: values => values }),
    h(FormItem, { rules: [{ validator: (rule, value) => Promise.resolve([rule, value]) }] }),
    h(ConfigProvider, { theme: { cssVar: true, hashed: true } }),
  ]
}

describe('callback contextual types', () => {
  it('type-only assertions compile', () => {
    expect(typeof renderAll).toBe('function')
  })
})

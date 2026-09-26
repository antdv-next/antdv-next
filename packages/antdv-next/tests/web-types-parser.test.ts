import type { HeadingAlias } from '../scripts/web-types/types'
import { describe, expect, it } from 'vitest'
import { inferSection, parseMarkdownContent } from '../scripts/web-types/parser'
import { Registry } from '../scripts/web-types/registry'

function parse(content: string, doc: string, names: string[], aliases: HeadingAlias[] = []) {
  return parseMarkdownContent(content, { source: `${doc}.md`, doc, registry: Registry.fromNames(names), aliases })
}

function find(result: ReturnType<typeof parse>, name: string) {
  return result.components.find(component => component.name === name)
}

describe('web-types parser', () => {
  it('parses a single-component page, including zh headers and deprecated rows', () => {
    const result = parse(`---
title: Button
description: Button desc
---

## API

### 属性 {#props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 按钮类型 | string | - | - |
| ~~ghost~~ | 幽灵按钮 | boolean | false | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | 点击 | (e: MouseEvent) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 内容 | () => any | - |

### 方法 {#methods}

| 名称 | 说明 |
| --- | --- |
| focus() | 聚焦 |
`, 'button', ['AButton'])

    expect(result.page).toBe('AButton')
    expect(result.components).toHaveLength(1)
    const button = find(result, 'AButton')!
    expect(button.tagName).toBe('a-button')
    expect(button.componentName).toBe('Button')
    expect(button.description).toBe('Button desc')
    expect(button.attributes).toEqual([
      { name: 'type', description: '按钮类型', type: 'string', default: undefined, deprecated: undefined },
      { name: 'ghost', description: '幽灵按钮', type: 'boolean', default: 'false', deprecated: true },
    ])
    expect(button.events.map(event => event.name)).toEqual(['click'])
    expect(button.slots.map(slot => slot.name)).toEqual(['default'])
  })

  it('parses grouped pages and level-3 sections belong to the page component', () => {
    const result = parse(`---
title: Form
---

## API

### Form

### Props {#form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| layout | Layout | string | - | - |

### FormItem {#form-item}

#### Props {#form-item-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | Field name | string | - | - |

#### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| label | Label | () => any | - |

### Events {#form-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| finish | Finish | () => void | - |
`, 'form', ['AForm', 'AFormItem'])

    expect(result.components.map(component => component.tagName)).toEqual(['a-form', 'a-form-item'])
    expect(find(result, 'AForm')?.attributes.map(attr => attr.name)).toEqual(['layout'])
    expect(find(result, 'AForm')?.events.map(event => event.name)).toEqual(['finish'])
    expect(find(result, 'AFormItem')?.attributes.map(attr => attr.name)).toEqual(['name'])
    expect(find(result, 'AFormItem')?.slots.map(slot => slot.name)).toEqual(['label'])
    expect(find(result, 'AFormItem')?.events).toEqual([])
  })

  it('maps component headings to global names instead of guessing tag names', () => {
    const result = parse(`---
title: Input
---

## API

### Input

#### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value | string | - |

### TextArea {#input-textarea}

#### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoSize | Auto size | boolean | false |

### Types {#types}

#### CountConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| max | Max | number | - |
`, 'input', ['AInput', 'ATextarea'])

    expect(result.components.map(component => component.tagName)).toEqual(['a-input', 'a-textarea'])
    expect(find(result, 'ATextarea')?.attributes.map(attr => attr.name)).toEqual(['auto-size'])
    expect(result.unmatchedHeadings).toEqual(['Types'])
  })

  it('resolves child components through the page prefix and infers props tables', () => {
    const result = parse(`---
title: Select
---

## API

### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| showSearch | Search | boolean | false |

### showSearch {#showsearch}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| filterOption | Filter | boolean | true |

### Option props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| disabled | Disabled | boolean | false |

### OptGroup props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Label | string | - |

### Select Methods {#methods}

| Name | Description |
| --- | --- |
| focus() | Focus |
`, 'select', ['ASelect', 'ASelectOption', 'ASelectOptGroup'])

    expect(find(result, 'ASelect')?.attributes.map(attr => attr.name)).toEqual(['show-search'])
    expect(find(result, 'ASelectOption')?.attributes.map(attr => attr.name)).toEqual(['disabled'])
    expect(find(result, 'ASelectOptGroup')?.attributes.map(attr => attr.name)).toEqual(['label'])
    expect(result.unmatchedHeadings).toEqual(['showSearch'])
  })

  it('handles `A/B` headings and page-prefixed compound names', () => {
    const radio = parse(`---
title: Radio
---

## API

### Radio/RadioButton {#radio-radiobutton}

#### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Checked | boolean | false |
`, 'radio', ['ARadio', 'ARadioButton', 'ARadioGroup'])
    expect(find(radio, 'ARadio')?.attributes.map(attr => attr.name)).toEqual(['checked'])
    expect(find(radio, 'ARadioButton')?.attributes.map(attr => attr.name)).toEqual(['checked'])

    const tag = parse(`---
title: Tag
---

## API

### Tag.CheckableTag

#### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Checked | boolean | false |

### Statistic.Timer

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| format | Format | string | - |
`, 'tag', ['ATag', 'ACheckableTag', 'AStatisticTimer'])
    expect(find(tag, 'ACheckableTag')?.attributes.map(attr => attr.name)).toEqual(['checked'])
    expect(find(tag, 'AStatisticTimer')?.attributes.map(attr => attr.name)).toEqual(['format'])
  })

  it('merges conditional headings, applies aliases and drops nested keys', () => {
    const aliases: HeadingAlias[] = [
      { doc: 'date-picker', heading: /^(?:共同的 api|common api)$/i, component: ['ADatePicker', 'ARangePicker'], section: 'props' },
    ]
    const result = parse(`---
title: DatePicker
---

## API

### Localization

Some prose.

### Common API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| allowClear | Clear | boolean | true |
| showTime.defaultOpenValue | Nested | dayjs | - |

### DatePicker

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| format | Format | string | YYYY-MM-DD |

### DatePicker[picker=year]

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| format | Year format | string | YYYY |
| multiple | Multiple | boolean | false |

### RangePicker

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| separator | Separator | string | - |

#### formatType

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| ignored | Ignored | string | - |

### Events

| Event | Description | Type |
| --- | --- | --- |
| change | Change | () => void |
`, 'date-picker', ['ADatePicker', 'ARangePicker'], aliases)

    const datePicker = find(result, 'ADatePicker')!
    expect(datePicker.attributes.map(attr => [attr.name, attr.default])).toEqual([
      ['allow-clear', 'true'],
      ['format', 'YYYY-MM-DD'],
      ['multiple', 'false'],
    ])
    expect(datePicker.events.map(event => event.name)).toEqual(['change'])

    const rangePicker = find(result, 'ARangePicker')!
    expect(rangePicker.attributes.map(attr => attr.name)).toEqual(['allow-clear', 'separator'])
    expect(rangePicker.events).toEqual([])
    expect(result.unmatchedHeadings).toEqual(['Localization'])
  })

  it('never treats lowercase config headings as components', () => {
    const result = parse(`---
title: Table
---

## API

### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| bordered | Bordered | boolean | false |

### Column

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| dataIndex | Data index | string | - |

### pagination

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Placement | string | - |
`, 'table', ['ATable', 'ATableColumn', 'APagination'])

    expect(result.components.map(component => component.name)).toEqual(['ATable', 'ATableColumn'])
    expect(find(result, 'ATableColumn')?.attributes.map(attr => attr.name)).toEqual(['data-index'])
    expect(result.unmatchedHeadings).toEqual(['pagination'])
  })

  it('accepts a props table placed directly under `## API`', () => {
    const result = parse(`---
title: Listy
---

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| height | Height | number | - |

### Events

| Event | Description | Type |
| --- | --- | --- |
| scroll | Scroll | () => void |

### Group

| Property | Description | Type |
| --- | --- | --- |
| key | Key | string |
`, 'listy', ['AListy'])

    const listy = find(result, 'AListy')!
    expect(listy.attributes.map(attr => attr.name)).toEqual(['height'])
    expect(listy.events.map(event => event.name)).toEqual(['scroll'])
    expect(result.unmatchedHeadings).toEqual(['Group'])
  })

  it('produces nothing for pages without a global component', () => {
    const result = parse(`---
title: Icon
---

## API

### Common Icon

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| spin | Spin | boolean | false |
`, 'icon', ['AButton'])

    expect(result.page).toBeUndefined()
    expect(result.components).toEqual([])
  })
})

describe('web-types section inference', () => {
  it('detects the table kind from its header row', () => {
    expect(inferSection(['参数', '说明', '类型', '默认值', '版本'])).toBe('props')
    expect(inferSection(['property', 'description', 'type', 'default'])).toBe('props')
    expect(inferSection(['事件', '说明', '类型', '版本'])).toBe('events')
    expect(inferSection(['slot', 'description', 'type', 'version'])).toBe('slots')
    expect(inferSection(['名称', '说明', '版本'])).toBeNull()
    expect(inferSection(['method', 'description', 'version'])).toBe('methods')
  })
})

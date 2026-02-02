---
category: Components
group: 反馈
title: Progress
subtitle: 进度条
description: 展示操作的当前进度。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gK_4S6fDRfgAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HJH8Tb1lcYAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

- 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时；
- 当需要显示一个操作完成的百分比时。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/line.vue">进度条</demo>
  <demo src="./demo/circle.vue">进度圈</demo>
  <demo src="./demo/line-mini.vue">小型进度条</demo>
  <demo src="./demo/circle-micro.vue">响应式进度圈</demo>
  <demo src="./demo/circle-mini.vue">小型进度圈</demo>
  <demo src="./demo/dynamic.vue">动态展示</demo>
  <demo src="./demo/format.vue">自定义文字格式</demo>
  <demo src="./demo/dashboard.vue">仪表盘</demo>
  <demo src="./demo/segment.vue">分段进度条</demo>
  <demo src="./demo/linecap.vue">边缘形状</demo>
  <demo src="./demo/gradient-line.vue">自定义进度条渐变色</demo>
  <demo src="./demo/steps.vue">步骤进度条</demo>
  <demo src="./demo/circle-steps.vue">步骤进度圈</demo>
  <demo src="./demo/size.vue">尺寸</demo>
  <demo src="./demo/info-position.vue">改变进度数值位置</demo>
  <demo src="./demo/style-class.vue">自定义语义结构样式</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

各类型共用的属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | ProgressClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | ProgressStylesType | - | - |
| rootClass | 根节点 class | string | - | - |
| type | 类型，可选 `line` `circle` `dashboard` | ProgressType | `line` | - |
| percent | 百分比 | number | 0 | - |
| format | 内容的模板函数 | (percent?: number, successPercent?: number) =&gt; any | (percent) =&gt; percent + `%` | - |
| status | 状态，可选：`success` `exception` `normal` `active`(仅限 line) | (typeof ProgressStatuses)[number] | - | - |
| showInfo | 是否显示进度数值或状态图标 | boolean | true | - |
| strokeWidth | - | number | - | - |
| strokeLinecap | 进度条的样式 | 'butt' \| 'square' \| 'round' | `round` | - |
| strokeColor | 进度条的色彩 | string \| string[] \| ProgressGradient | - | - |
| railColor | 未完成的分段的颜色 | string | - | - |
| success | 成功进度条相关配置 | SuccessProps | - | - |
| trailColor | 未完成的分段的颜色。已废弃，请使用 `railColor` | string | - | - |
| width | 已废弃，请使用 `size` | number | - | - |
| size | 进度条的尺寸 | number \| [number \| string, number] \| ProgressSize \| &#123; width?: number, height?: number &#125; | `default` | - |

### `type="line"` {#type-line}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| steps | 进度条总共步数 | number | - | - |
| rounding | 用于四舍五入数值的函数 | (step: number) =&gt; number | Math.round | - |
| strokeColor | 进度条的色彩，传入 object 时为渐变。当有 `steps` 时支持传入一个数组。 | string \| string[] \| ProgressGradient | - | - |
| percentPosition | 进度数值位置，传入对象，`align` 表示数值的水平位置，`type` 表示数值在进度条内部还是外部 | PercentPositionType | &#123; align: 'end', type: 'outer' &#125; | - |

### `type="circle"` {#type-circle}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| steps | 进度条总共步数，传入 object 时，count 指步数，gap 指间隔大小。传 number 类型时，gap 默认为 2。 | number \| &#123; count: number, gap: number &#125; | - | - |
| strokeColor | 圆形进度条线的色彩，传入 object 时为渐变 | string \| ProgressGradient | - | - |
| strokeWidth | 圆形进度条线的宽度，单位是进度条画布宽度的百分比 | number | 6 | - |

### `type="dashboard"` {#type-dashboard}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| steps | 进度条总共步数，传入 object 时，count 指步数，gap 指间隔大小。传 number 类型时，gap 默认为 2。 | number \| &#123; count: number, gap: number &#125; | - | - |
| gapDegree | 仪表盘进度条缺口角度，可取值 0 ~ 295 | number | 75 | - |
| gapPlacement | 仪表盘进度条缺口位置 | GapPlacement | `bottom` | - |
| gapPosition | 已废弃，请使用 `gapPlacement` 替换 | GapPosition | `bottom` | - |
| strokeWidth | 仪表盘进度条线的宽度，单位是进度条画布宽度的百分比 | number | 6 | - |


## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Progress"></ComponentTokenTable>

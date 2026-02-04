---
category: Components
group: 数据展示
title: Tour
subtitle: 漫游式引导
description: 用于分步引导用户了解产品功能的气泡组件。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NMvqRZpuJfQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*D70qQJJmzhgAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

常用于引导用户了解产品功能。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本</demo>
  <demo src="./demo/non-modal.vue">非模态</demo>
  <demo src="./demo/placement.vue">位置</demo>
  <demo src="./demo/mask.vue">自定义遮罩样式</demo>
  <demo src="./demo/indicator.vue">自定义指示器</demo>
  <demo src="./demo/actions-render.vue">自定义操作按钮</demo>
  <demo src="./demo/gap.vue">自定义高亮区域的样式</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| steps | 引导步骤配置 | TourStepItem[\] | - | - |
| open | 打开引导，支持 `v-model:open` | boolean | false | - |
| current | 当前处于哪一步 | number | - | - |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| closeIcon | 自定义关闭按钮 | VueNode | true | - |
| disabledInteraction | 禁用高亮区域交互 | boolean | false | - |
| gap | 控制高亮区域的圆角边框和显示间距 | &#123; offset?: number \| [number, number]; radius?: number &#125; | &#123; offset: 6, radius: 2 &#125; | - |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` | - |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色 | boolean \| &#123; style?: CSSProperties; color?: string &#125; | true | - |
| type | 类型，影响底色与文字颜色 | 'default' \| 'primary' | `default` | - |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数 | boolean \| ScrollIntoViewOptions | true | - |
| indicatorsRender | 自定义指示器 | (current: number, total: number) =&gt; VueNode | - | - |
| actionsRender | 自定义操作按钮 | (originNode: VueNode, info: &#123; current: number, total: number &#125;) =&gt; VueNode | - | - |
| zIndex | Tour 的层级 | number | 1001 | - |
| getPopupContainer | 设置 Tour 浮层的渲染节点，默认是 body | (node: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | TourClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | TourStylesType | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 步骤改变时的回调，current 为当前的步骤 | (current: number) =&gt; void | - |
| close | 关闭引导时的回调函数 | (current: number) =&gt; void | - |
| finish | 引导完成时的回调 | () =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| actionsRender | 自定义操作按钮 | (originNode: any, info: &#123; current: number, total: number &#125;) =&gt; any | - |
| indicatorsRender | 自定义指示器 | (current: number, total: number) =&gt; any | - |
| nextButton | 自定义下一步按钮 | (params: &#123; current: number, isFirst: boolean, isLast: boolean &#125;) =&gt; any | - |
| prevButton | 自定义上一步按钮 | (params: &#123; current: number, isFirst: boolean, isLast: boolean &#125;) =&gt; any | - |
| coverRender | 自定义步骤封面 | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |
| titleRender | 自定义步骤标题 | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |
| descriptionRender | 自定义步骤描述 | (params: &#123; step: TourStepItem, index: number &#125;) =&gt; any | - |

## 类型 {#types}

### TourStepItem

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| target | 获取引导卡片指向的元素，为空时居中于屏幕 | HTMLElement \| (() =&gt; HTMLElement) \| null | - | - |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | boolean \| &#123; pointAtCenter: boolean &#125; | true | - |
| closeIcon | 自定义关闭按钮 | VueNode | true | - |
| cover | 展示的图片或者视频 | VueNode | - | - |
| title | 标题 | VueNode | - | - |
| description | 主要描述部分 | VueNode | - | - |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` | - |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色，默认跟随 Tour 的 `mask` 属性 | boolean \| &#123; style?: CSSProperties; color?: string &#125; | true | - |
| type | 类型，影响底色与文字颜色 | 'default' \| 'primary' | `default` | - |
| nextButtonProps | 下一步按钮的属性 | &#123; children?: VueNode; onClick?: () =&gt; void; class?: string; style?: CSSProperties &#125; | - | - |
| prevButtonProps | 上一步按钮的属性 | &#123; children?: VueNode; onClick?: () =&gt; void; class?: string; style?: CSSProperties &#125; | - | - |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数，默认跟随 Tour 的 `scrollIntoViewOptions` 属性 | boolean \| ScrollIntoViewOptions | true | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Tour"></ComponentTokenTable>

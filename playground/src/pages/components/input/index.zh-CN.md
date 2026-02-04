---
category: Components
group: 数据录入
title: Input
subtitle: 输入框
description: 通过鼠标或键盘输入内容，是最基础的表单域的包装。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y3R0RowXHlAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sBqqTatJ-AkAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用 {#when-to-use}

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
  <demo src="./demo/size.vue">三种大小</demo>
  <demo src="./demo/variant.vue" >形态变体</demo>
  <demo src="./demo/compact-style.vue">紧凑模式</demo>
  <demo src="./demo/search-input.vue">搜索框</demo>
  <demo src="./demo/search-input-loading.vue">搜索框 loading</demo>
  <demo src="./demo/textarea.vue">文本域</demo>
  <demo src="./demo/autosize-textarea.vue">适应文本高度的文本域</demo>
  <demo src="./demo/otp.vue">一次性密码框</demo>
  <demo src="./demo/tooltip.vue">输入时格式化展示</demo>
  <demo src="./demo/presuffix.vue">前缀和后缀</demo>
  <demo src="./demo/password-input.vue">密码框</demo>
  <demo src="./demo/allowClear.vue">带移除图标</demo>
  <demo src="./demo/show-count.vue">带字数提示</demo>
  <demo src="./demo/advance-count.vue">定制计数能力</demo>
  <demo src="./demo/status.vue">自定义状态</demo>
  <demo src="./demo/focus.vue">聚焦</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

通用属性参考：[通用属性](/docs/vue/common-props)

### Input

#### Props {#input-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ~~addonAfter~~ | 带标签的 input，设置后置标签，请使用 Space.Compact 替换 | VueNode | - | - |
| ~~addonBefore~~ | 带标签的 input，设置前置标签，请使用 Space.Compact 替换 | VueNode | - | - |
| allowClear | 可以点击清除图标删除内容 | boolean \| &#123; clearIcon: VueNode &#125; | - | - |
| ~~bordered~~ | 是否有边框, 请使用 `variant` 替换 | boolean | true | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-input), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-input), string&gt; | - | - |
| count | 字符计数配置 | [CountConfig](#countconfig) | - | - |
| disabled | 是否禁用状态，默认为 false | boolean | false | - |
| id | 输入框的 id | string | - | - |
| maxlength | 最大长度 | number | - | - |
| prefix | 带有前缀图标的 input | VueNode | - | - |
| showCount | 是否展示字数 | boolean \| &#123; formatter: (info: &#123; value: string, count: number, maxLength?: number &#125;) =&gt; VueNode &#125; | false | - |
| status | 设置校验状态 | 'error' \| 'warning' | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-input), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-input), CSSProperties&gt; | - | - |
| size | 控件大小。注：标准表单内的输入框大小限制为 `middle` | `large` \| `middle` \| `small` | - | - |
| suffix | 带有后缀图标的 input | - | - | - |
| type | 声明 input 类型，同原生 input 标签的 type 属性，见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#属性)(请直接使用 `Input.TextArea` 代替 `type="textarea"`) | string | `text` | - |
| value | 输入框内容，支持 `v-model:value` | string | - | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |

> 如果 `Input` 在 `Form.Item` 内，并且 `Form.Item` 设置了 `id` 属性，则 `value` `defaultValue` 和 `id` 属性会被自动设置。

Input 的其他属性和 Vue 自带的 [input](https://cn.vuejs.org/guide/essentials/forms.html) 一致。

#### 事件 {#input-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 输入框内容变化时的回调 | function(e) | - |
| pressEnter | 按下回车的回调 | function(e) | - |
| clear | 按下清除按钮的回调 | () =&gt; void | - |

#### 方法 {#input-methods}

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| blur | 取消焦点 | - | - |
| focus | 获取焦点 | (option?: &#123; preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' &#125;) | - |

#### 插槽 {#input-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| prefix | 自定义前缀图标 | - | - |
| suffix | 自定义后缀图标 | - | - |

### TextArea {#input-textarea}

#### 属性 {#input-textarea-props}

同 Input 属性，外加：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：&#123; minRows: 2, maxRows: 6 &#125; | boolean \| object | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-textarea), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-textarea), string&gt; | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-textarea), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-textarea), CSSProperties&gt; | - | - |

`Input.TextArea` 的其他属性和浏览器自带的 [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 一致。

### InputSearch {#input-search}

#### 属性 {#input-search-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-search), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-search), string&gt; | - | - |
| enterButton | 是否有确认按钮，可设为按钮文字。该属性会与 `addonAfter` 冲突。 | VueNode | false | - |
| loading | 搜索 loading | boolean | false | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-search), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-search), CSSProperties&gt; | - | - |

其余属性和 Input 一致。

#### 事件 {#input-search-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| search | 点击搜索图标、清除图标，或按下回车键时的回调 | function(value, event, &#123; source: "input" \| "clear" &#125;) | - |

### InputPassword {#input-password}

#### 属性 {#input-password-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 语义化结构 class | Record&lt;[SemanticDOM](#semantic-password), string&gt; | - | - |
| iconRender | 自定义切换按钮 | (visible) =&gt; VueNode | (visible) =&gt; (visible ? &lt;EyeOutlined /> : &lt;EyeInvisibleOutlined />) | - |
| styles | 语义化结构 style | Record&lt;[SemanticDOM](#semantic-password), CSSProperties&gt; | - | - |
| visibilityToggle | 是否显示切换按钮或者控制密码显隐 | boolean \| [VisibilityToggle](#visibilitytoggle) | true | - |

### InputOTP {#input-otp}

`5.16.0` 新增。

> 开发者注意事项：
>
> 当 `mask` 属性的类型为 string 时，我们强烈推荐接收单个字符或单个 emoji，如果传入多个字符或多个 emoji，则会在控制台抛出警告。

#### 属性 {#input-otp-props}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-otp), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-otp), string&gt; | - | - |
| disabled | 是否禁用 | boolean | false | - |
| formatter | 格式化展示，留空字段会被 ` ` 填充 | (value: string) =&gt; string | - | - |
| separator | 分隔符，在指定索引的输入框后渲染分隔符 | VueNode \| ((i: number) =&gt; VueNode) | - | - |
| mask | 自定义展示，和 `formatter` 的区别是不会修改原始值 | boolean \| string | `false` | - |
| length | 输入元素数量 | number | 6 | - |
| status | 设置校验状态 | 'error' \| 'warning' | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record&lt;[SemanticDOM](#semantic-otp), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-otp), CSSProperties&gt; | - | - |
| size | 输入框大小 | `small` \| `middle` \| `large` | `middle` | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - |
| value | 输入框内容 | string | - | - |

#### 事件 {#input-otp-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 当输入框内容全部填充时触发回调 | (value: string) =&gt; void | - |
| input | 输入值变化时触发的回调 | (value: string[]) =&gt; void | - |

### Types {#types}

#### CountConfig

```tsx
interface CountConfig {
  // 最大字符数，不同于原生 `maxLength`，超出后标红但不会截断
  max?: number
  // 自定义字符计数，例如标准 emoji 长度大于 1，可以自定义计数策略将其改为 1
  strategy?: (value: string) => number
  // 同 `showCount`
  show?: boolean | ((args: { value: string, count: number, maxLength?: number }) => VueNode)
  // 当字符数超出 `count.max` 时的自定义裁剪逻辑，不配置时不进行裁剪
  exceedFormatter?: (value: string, config: { max: number }) => string
}
```

#### VisibilityToggle

```tsx
interface VisibilityToggle {
  // 用于手动控制密码显隐
  visible?: boolean
  // 显隐密码的回调
  onVisibleChange?: (visible: boolean) => void
}
```

## Semantic DOM

### Input {#semantic-input}

### TextArea {#semantic-textarea}

### InputSearch {#semantic-search}

### InputPassword {#semantic-password}

### InputOTP {#semantic-otp}

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="Input"></ComponentTokenTable>

## FAQ

### 为什么我动态改变 `prefix/suffix/showCount` 时，Input 会失去焦点？ {#faq-lose-focus}

当 Input 动态添加或者删除 `prefix/suffix/showCount` 时，Vue 会重新创建 DOM 结构而新的 input 是没有焦点的。你可以预设一个空的 `<span />` 来保持 DOM 结构不变：

```vue
<template>
  <a-input>
    <template #suffix>
      <template v-if="condition">
        <Icon type="smile" />
      </template>
      <template v-else>
        <span />
      </template>
    </template>
  </a-input>
</template>
```

### 为何 TextArea 受控时，`value` 可以超过 `maxLength`？ {#faq-textarea-exceed-max}

受控时，组件应该按照受控内容展示。以防止在表单组件内使用时显示值和提交值不同的问题。

---
category: Components
group: 数据展示
title: Image
subtitle: 图片
description: 可预览的图片。
cols: 2
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FbOCS6aFMeUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LVQ3R5JjjJEAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用 {#when-to-use}

- 需要展示图片时使用。
- 加载显示大图或加载失败时容错处理。

## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本用法</demo>
  <demo src="./demo/fallback.vue">容错处理</demo>
  <demo src="./demo/placeholder.vue">渐进加载</demo>
  <demo src="./demo/preview-group.vue">多张图片预览</demo>
  <demo src="./demo/preview-group-visible.vue">相册模式</demo>
  <demo src="./demo/previewSrc.vue">自定义预览图片</demo>
  <demo src="./demo/controlled-preview.vue">受控的预览</demo>
  <demo src="./demo/toolbarRender.vue">自定义工具栏</demo>
  <demo src="./demo/imageRender.vue">自定义预览内容</demo>
  <demo src="./demo/mask.vue">预览遮罩</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
  <demo src="./demo/nested.vue">嵌套</demo>
</demo-group>

## API

### 属性

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| preview | 预览参数，为 `false` 时禁用 | boolean \| PreviewConfig | true | - |
| wrapperStyle | Deprecated. | CSSProperties | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | ImageClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | ImageStylesType | - | - |
| rootClass | - | string | - | - |
| alt | 图像描述 | string | - | _ |
| height | 图像高度 | string \| number | - | - |
| src | 图片地址 | string | - | - |
| width | 图像宽度 | string \| number | - | - |

其他属性见 [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| error | 加载错误回调 | NonNullable&lt;VcImageProps['onError']&gt; | - |
| click | - | NonNullable&lt;VcImageProps['onClick']&gt; | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| fallback | 加载失败容错地址 | () =&gt; any | - |
| placeholder | 加载占位，为 `true` 时使用默认占位 | () =&gt; any | - |

### PreviewType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionsRender | 自定义工具栏渲染 | (originalNode: VNode, info: ToolbarRenderInfoType) => VNode | - | - |
| closeIcon | 自定义关闭 Icon | VNode | - | - |
| cover | 自定义预览遮罩 | VNode \| [CoverConfig](#coverconfig) | - | - |
| getContainer | 指定预览挂载的节点，但依旧为全屏展示，false 为挂载在当前位置 | string \| HTMLElement \| (() => HTMLElement) \| false | - | - |
| imageRender | 自定义预览内容 | (originalNode: VNode, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo) }) => VNode | - | - |
| mask | 预览遮罩效果 | boolean \| { enabled?: boolean, blur?: boolean } | true | - |
| maxScale | 最大缩放倍数 | number | 50 | - |
| minScale | 最小缩放倍数 | number | 1 | - |
| movable | 是否可移动 | boolean | true | - |
| open | 是否显示预览 | boolean | - | - |
| rootClassName | 预览图的根 DOM 类名，会同时作用在图片和预览层最外侧 | string | - | - |
| scaleStep | `1 + scaleStep` 为缩放放大的每步倍数 | number | 0.5 | - |
| src | 自定义预览 src | string | - | - |
| styles | 自定义语义化结构样式 | Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| onOpenChange | 预览打开状态变化的回调 | (visible: boolean) => void | - | - |
| onTransform | 预览图 transform 变化的回调 | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - | - |

### PreviewGroup

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | - |
| fallback | 加载失败容错地址 | string | - | - |
| items | 预览数组 | string[] \| { src: string, crossOrigin: string, ... }[] | - | - |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [PreviewGroupType](#previewgrouptype) | true | - |

### PreviewGroupType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionsRender | 自定义工具栏渲染 | (originalNode: VNode, info: ToolbarRenderInfoType) => VNode | - | - |
| closeIcon | 自定义关闭 Icon | VNode | - | - |
| countRender | 自定义预览计数内容 | (current: number, total: number) => VNode | - | - |
| current | 当前预览图的 index | number | - | - |
| getContainer | 指定预览挂载的节点，但依旧为全屏展示，false 为挂载在当前位置 | string \| HTMLElement \| (() => HTMLElement) \| false | - | - |
| imageRender | 自定义预览内容 | (originalNode: VNode, info: { transform: [TransformType](#transformtype), image: [ImgInfo](#imginfo), current: number }) => VNode | - | - |
| mask | 预览遮罩效果 | boolean \| { enabled?: boolean, blur?: boolean } | true | - |
| minScale | 最小缩放倍数 | number | 1 | - |
| maxScale | 最大放大倍数 | number | 50 | - |
| movable | 是否可移动 | boolean | true | - |
| open | 是否显示预览 | boolean | - | - |
| styles | 自定义语义化结构样式 | Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | - |
| scaleStep | `1 + scaleStep` 为缩放放大的每步倍数 | number | 0.5 | - |
| onOpenChange | 预览打开状态变化回调，额外携带当前预览图索引 | (visible: boolean, info: { current: number }) => void | - | - |
| onChange | 切换预览图的回调 | (current: number, prevCurrent: number) => void | - | - |
| onTransform | 预览图 transform 变化的回调 | { transform: [TransformType](#transformtype), action: [TransformAction](#transformaction) } | - | - |

## Interface

### TransformType

```typescript
{
  x: number
  y: number
  rotate: number
  scale: number
  flipX: boolean
  flipY: boolean
}
```

### TransformAction

```typescript
type TransformAction
  = | 'flipY'
    | 'flipX'
    | 'rotateLeft'
    | 'rotateRight'
    | 'zoomIn'
    | 'zoomOut'
    | 'close'
    | 'prev'
    | 'next'
    | 'wheel'
    | 'doubleClick'
    | 'move'
    | 'dragRebound'
    | 'reset'
```

### ToolbarRenderInfoType

```typescript
{
  icons: {
    flipYIcon: VNode;
    flipXIcon: VNode;
    rotateLeftIcon: VNode;
    rotateRightIcon: VNode;
    zoomOutIcon: VNode;
    zoomInIcon: VNode;
  };
  actions: {
    onActive?: (index: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onReset: () => void;
    onClose: () => void;
  };
  transform: TransformType,
  current: number;
  total: number;
  image: ImgInfo
}
```

### ImgInfo

```typescript
{
  url: string
  alt: string
  width: string | number
  height: string | number
}
```

### CoverConfig

```typescript
interface CoverConfig {
  coverNode?: VNode // 自定义遮罩元素
  placement?: 'top' | 'bottom' | 'center' // 设置预览遮罩显示的位置
};
```

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）

<ComponentTokenTable component="Divider" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

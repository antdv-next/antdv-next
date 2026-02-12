---
category: Components
title: Avatar
subtitle: 头像
description: 用来代表用户或事物，支持图片、图标或字符展示。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JJBSS5lBG4IAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YbgyQaRGz-UAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

## 代码演示 {#examples}

<demo-group>
 <demo src="./demo/basic.vue">基础用法</demo>
 <demo src="./demo/type.vue">类型</demo>
 <demo src="./demo/dynamic.vue">自动调整字符大小</demo>
 <demo src="./demo/badge.vue">带徽标的头像</demo>
 <demo src="./demo/group.vue">Avatar.Group</demo>
 <demo src="./demo/responsive.vue">响应式尺寸</demo>
</demo-group>

## API

### Avatar

#### 属性 {#avatar-props}

通用属性参考：[通用属性](/docs/vue/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- |  |
| shape | 指定头像的形状 | `circle` \| `square` | `circle` |  |
| size | 设置头像的大小 | number \| `large` \| `medium` \| `small` \| `{ xs: number, sm: number, ... }` | `medium` | - |
| gap | 字符类型距离左右两侧边界单位像素 | number | 4 | - |
| src | 图片类头像的资源地址或者图片元素 | VueNode | - | - |
| srcSet | 设置图片类头像响应式资源地址 | string | - | - |
| draggable | 图片是否允许拖动 | boolean \| `'true'` \| `'false'` | true |  |
| icon | 设置头像的自定义图标 | VueNode | - | - |
| alt | 图像无法显示时的替代文本 | string | - | - |
| crossOrigin | CORS 属性设置 | '' \| 'anonymous' \| 'use-credentials' | - | - |
| onError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | () =&gt; boolean | - | - |

#### 事件 {#avatar-events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | - | (e: MouseEvent) =&gt; void | - |

### 插槽 {#avatar-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| icon | 设置头像的自定义图标 | () =&gt; any | - |
| src | 图片类头像的资源地址或者图片元素 | () =&gt; any | - |

### AvatarGroup

#### 属性 {#avatar-group-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| max | - | &#123;     count?: number     style?: CSSProperties     popover?: PopoverProps   &#125; | - | - |
| size | 设置头像的大小 | AvatarSize | `default` | - |
| shape | 指定头像的形状 | 'circle' \| 'square' | `circle` | - |

## 主题变量（Design Token）

<ComponentTokenTable component="Avatar" />

查看 [定制主题](/docs/vue/customize-theme) 了解如何使用主题变量。

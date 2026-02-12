---
category: Components
title: Avatar
description: Used to represent users or things, supporting the display of images, icons, or characters.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JJBSS5lBG4IAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YbgyQaRGz-UAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

## Examples {#examples}

<demo-group>
 <demo src="./demo/basic.vue">Basic</demo>
 <demo src="./demo/type.vue">Type</demo>
 <demo src="./demo/dynamic.vue">Autoset Font Size</demo>
 <demo src="./demo/badge.vue">With Badge</demo>
 <demo src="./demo/group.vue">Avatar.Group</demo>
 <demo src="./demo/responsive.vue">Responsive Size</demo>
</demo-group>

## API

### Avatar

#### Props {#avatar-props}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- |-------|
| shape | The shape of avatar | `circle` \| `square` | `circle` |  |
| size | The size of the avatar | number \| `large` \| `medium` \| `small` \| `{ xs: number, sm: number, ... }` | `medium` | - |
| gap | Letter type unit distance between left and right sides | number | 4 | -     |
| src | The address of the image for an image avatar or image element | VueNode | - | -     |
| srcSet | A list of sources to use for different screen resolutions | string | - | -     |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | true |  |
| icon | Custom icon type for an icon avatar | VueNode | - | -     |
| alt | This attribute defines the alternative text describing the image | string | - | -     |
| crossOrigin | CORS settings attributes | '' \| 'anonymous' \| 'use-credentials' | - | -     |
| onError | Handler when img load error, return false to prevent default fallback behavior | () =&gt; boolean | - | -     |

#### Events {#avatar-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | - | (e: MouseEvent) =&gt; void | - |

### Slots {#avatar-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| icon | Custom icon type for an icon avatar | () =&gt; any | - |
| src | The address of the image for an image avatar or image element | () =&gt; any | - |

### AvatarGroup

#### Props {#avatar-group-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| max | - | &#123;     count?: number     style?: CSSProperties     popover?: PopoverProps   &#125; | - | - |
| size | The size of the avatar | AvatarSize | `default` | - |
| shape | The shape of avatar | 'circle' \| 'square' | `circle` | - |

## Design Token

<ComponentTokenTable component="Avatar" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

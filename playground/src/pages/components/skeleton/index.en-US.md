---
category: Components
group: Feedback
title: Skeleton
description: Provide a placeholder while you wait for content to load, or to visualize content that doesn't exist yet.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use {#when-to-use}

- When a resource needs long time to load.
- When the component contains lots of information, such as List or Card.
- Only works when loading data for the first time.
- Could be replaced by Spin in any situation, but can provide a better user experience.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/complex.vue">Complex combination</demo>
  <demo src="./demo/active.vue">Active Animation</demo>
  <demo src="./demo/element.vue">Button/Avatar/Input/Image/Node</demo>
  <demo src="./demo/children.vue">Contains sub component</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Skeleton

#### Props {#skeleton-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| avatar | Show avatar placeholder | boolean \| [SkeletonAvatarProps](#skeletonavatarprops) | false | - |
| loading | Display the skeleton when true | boolean | - | - |
| paragraph | Show paragraph placeholder | boolean \| [SkeletonParagraphProps](#skeletonparagraphprops) | true | - |
| round | Show paragraph and title radius when true | boolean | false | - |
| title | Show title placeholder | boolean \| [SkeletonTitleProps](#skeletontitleprops) | true | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

### SkeletonAvatar

#### Props {#skeletonavatar-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect, only valid when used avatar independently | boolean | false | - |
| shape | Set the shape of avatar | `circle` \| `square` | `circle` | - |
| size | Set the size of avatar | number \| `large` \| `small` \| `default` | `default` | - |

### SkeletonTitle

#### Props {#skeletontitle-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| width | Set the width of title | number \| string | - | - |

### SkeletonParagraph

#### Props {#skeletonparagraph-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| rows | Set the row count of paragraph | number | - | - |
| width | Set the width of paragraph. When width is an Array, it can set the width of each row. Otherwise only set the last row width | number \| string \| Array&lt;number \| string&gt; | - | - |

### SkeletonAvatar

#### Props {#skeletonavatar-avatar}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| shape | Set the shape of avatar | `circle` \| `square` | `circle` | - |
| size | Set the size of avatar | number \| `large` \| `small` \| `default` | `default` | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

### SkeletonButton

#### Props {#skeletonbutton-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| block | Option to fit button width to its parent width | boolean | false | - |
| shape | Set the shape of button | `circle` \| `round` \| `square` \| `default` | - | - |
| size | Set the size of button | `large` \| `small` \| `default` | - | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

### SkeletonInput

#### Props {#skeletoninput-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| size | Set the size of input | `large` \| `small` \| `default` | - | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

### SkeletonImage

#### Props {#skeletonimage-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

### SkeletonNode

#### Props {#skeletonnode-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false | - |
| classes | Customize class for each semantic structure inside the component | SkeletonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component | SkeletonStylesType | - | - |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token

<ComponentTokenTable component="Skeleton"></ComponentTokenTable>

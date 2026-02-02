---
category: Components
group: Data Display
title: Empty
description: Empty state placeholder.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZdiZSLzEV0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*obM7S5lIxeMAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- When there is no data provided, display for friendly tips.
- User tutorial to create something in a fresh new situation.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/simple.vue">Choose image</demo>
  <demo src="./demo/customize.vue">Customize</demo>
  <demo src="./demo/config-provider.vue">ConfigProvider</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo>
  <demo src="./demo/description.vue">No description</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | EmptyClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | EmptyStylesType | - | - |
| image | Customize image. Will treat as image url when string provided | VueNode | `Empty.PRESENTED_IMAGE_DEFAULT` | - |
| description | Customize description | VueNode | - | - |
| rootClass | Root container class | string | - | - |
| prefixCls | Prefix class name | string | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| image | Customize image. Will treat as image url when string provided | () => any | - |
| description | Customize description | () => any | - |
| default | Footer content | () => any | - |

## Built-in images {#built-in-images}

- Empty.PRESENTED_IMAGE_SIMPLE

  <div class="site-empty-buildIn-img site-empty-buildIn-simple"></div>

- Empty.PRESENTED_IMAGE_DEFAULT

  <div class="site-empty-buildIn-img site-empty-buildIn-default"></div>

<style>
  .site-empty-buildIn-img {
    background-repeat: no-repeat;
    background-size: contain;
  }
  .site-empty-buildIn-simple {
    width: 55px;
    height: 35px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png");
  }
  .site-empty-buildIn-default {
    width: 121px;
    height: 116px;
    background-image: url("https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png");
  }
</style>

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="Empty"></ComponentTokenTable>

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

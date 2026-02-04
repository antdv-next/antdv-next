---
category: Components
group: Data Entry
title: Rate
description: Used for rating operation on something.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oyOcTrB12_YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M7_ER7GJr6wAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use {#when-to-use}

- Show evaluation.
- A quick rating operation on something.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/half.vue">Half star</demo>
  <demo src="./demo/text.vue">Show copywriting</demo>
  <demo src="./demo/disabled.vue">Read only</demo>
  <demo src="./demo/clear.vue">Clear star</demo>
  <demo src="./demo/character.vue">Other Character</demo>
  <demo src="./demo/character-function.vue">Customize character</demo>
  <demo src="./demo/size.vue">Sizes</demo>
  <demo src="./demo/component-token.vue">Component Token</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to allow clear when click again | boolean | true |  |
| allowHalf | Whether to allow semi selection | boolean | false |  |
| character | The custom character of rate | VueNode \| (RateProps) => VueNode | &lt;StarFilled /> | function(): 4.4.0 |
| className | The custom class name of rate | string | - |  |
| count | Star count | number | 5 |  |
| disabled | If read only, unable to interact | boolean | false |  |
| keyboard | Support keyboard operation | boolean | true | 5.18.0 |
| size | Star size | 'small' \| 'middle' \| 'large' | 'middle' |  |
| style | The custom style object of rate | CSSProperties | - |  |
| tooltips | Customize tooltip by each character | [TooltipProps](/components/tooltip#api)[\] \| string\[] | - |  |
| value | The current value, support `v-model:value` | number | - |  |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when select value | (value: number) =&gt; void | - |
| hoverChange | Callback when hover item | (value: number) =&gt; void | - |
| focus | Callback when component get focus | () =&gt; void | - |
| blur | Callback when component lose focus | () =&gt; void | - |
| keydown | Callback when keydown on component | (e: KeyboardEvent) =&gt; void | - |
| mouseleave | Callback when mouse leaves the component | (e: FocusEvent) =&gt; void | - |

### Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Design Token

<ComponentTokenTable component="Rate"></ComponentTokenTable>

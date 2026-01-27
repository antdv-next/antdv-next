---
category: Components
group: Data Display
title: Carousel
description: A set of carousel areas.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bPMSSqbaTMkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-58QpYnqOsAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---



## When To Use {#when-to-use}

- When there is a group of content on the same level.
- When there is insufficient content space, it can be used to save space in the form of a revolving door.
- Commonly used for a group of pictures/cards.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/placement.vue">Position</demo>
  <demo src="./demo/autoplay.vue">Scroll automatically</demo>
  <demo src="./demo/fade.vue">Fade in</demo>
  <demo src="./demo/arrows.vue" >Arrows for switching</demo>
  <demo src="./demo/dot-duration.vue" >Progress of dots</demo>
  <demo src="./demo/component-token.vue" debug>Component Token</demo>
</demo-group>

## API

Common props ref：[Common props](/docs/vue/common-props)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| effect | Transition effect | CarouselEffect | `scrollx` | - |
| id | - | string | - | - |
| slickGoTo | - | number | - | - |
| dotPosition | The position of the dots, which can be one of `top` `bottom` `left` `right` `start` `end`, Please use `dotPlacement` instead | DotPlacement \| 'left' \| 'right' | `bottom` | - |
| dotPlacement | The position of the dots, which can be one of `top` `bottom` `start` `end` | DotPlacement | `bottom` | - |
| dots | Whether to show the dots at the bottom of the gallery, `object` for `dotsClass` | boolean \| &#123; class?: string &#125; | true | - |
| waitForAnimate | Whether to wait for the animation when switching | boolean | false | - |
| autoplay | Whether to scroll automatically, you can specify `autoplay=&#123;&#123; dotDuration: true &#125;&#125;` to display the progress bar | boolean \| &#123; dotDuration?: boolean &#125; | false | - |
| prevArrow | - | VueNode | - | - |
| nextArrow | - | VueNode | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| init | - | NonNullable&lt;Settings['onInit']&gt; | - |
| reInit | - | NonNullable&lt;Settings['onReInit']&gt; | - |
| edge | - | NonNullable&lt;Settings['onEdge']&gt; | - |
| swipe | - | NonNullable&lt;Settings['onSwipe']&gt; | - |
| lazyLoad | - | NonNullable&lt;Settings['onLazyLoad']&gt; | - |
| lazyLoadError | - | NonNullable&lt;Settings['onLazyLoadError']&gt; | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prevArrow | - | () =&gt; any | - |
| nextArrow | - | () =&gt; any | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| goTo | - | (slide: number, dontAnimate?: boolean) =&gt; void | - |
| next | - | () =&gt; void | - |
| prev | - | () =&gt; void | - |
| autoPlay | - | (playType?: 'update' \| 'leave' \| 'blur') =&gt; void | - |
| innerSlider | - | any | - |

## Design Token

<ComponentTokenTable component="Carousel" />

See [Customize Theme](/docs/vue/customize-theme) to learn how to use Design Token.

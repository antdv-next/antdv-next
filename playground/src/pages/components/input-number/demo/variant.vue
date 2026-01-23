<docs lang="zh-CN">
InputNumber 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。
</docs>

<docs lang="en-US">
Variants of InputNumber, there are four variants: `outlined` `filled` `borderless` and `underlined`.
</docs>

<template>
  <a-flex vertical :gap="12">
    <a-input-number placeholder="Outlined" style="width: 200px;" />
    <a-input-number placeholder="Filled" variant="filled" style="width: 200px;" />
    <a-input-number placeholder="Borderless" variant="borderless" style="width: 200px;" />
    <a-input-number placeholder="Underlined" variant="underlined" style="width: 200px;" />
  </a-flex>
</template>

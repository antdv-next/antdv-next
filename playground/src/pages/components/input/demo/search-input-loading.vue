<docs lang="zh-CN">
用于 `onSearch` 的时候展示 `loading`。
</docs>

<docs lang="en-US">
Search loading when onSearch.
</docs>

<template>
  <div>
    <a-input-search placeholder="input search loading default" loading />
    <br>
    <br>
    <a-input-search placeholder="input search loading with enterButton" loading enter-button />
    <br>
    <br>
    <a-input-search placeholder="input search text" enter-button="Search" size="large" loading />
  </div>
</template>

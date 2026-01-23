<docs lang="zh-CN">
用于多行输入。
</docs>

<docs lang="en-US">
For multi-line input.
</docs>

<template>
  <a-textarea :rows="4" />
  <br>
  <br>
  <a-textarea :rows="4" placeholder="maxLength is 6" :maxlength="6" />
</template>

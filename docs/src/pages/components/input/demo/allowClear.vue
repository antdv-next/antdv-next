<docs lang="zh-CN">
带移除图标的输入框，点击图标删除所有内容。

Input 和 TextArea 均支持通过 `allowClear` 配置清除按钮。`tabIndex` 为 `-1` 时，清除按钮不参与 Tab 键导航。
</docs>

<docs lang="en-US">
Input box with the remove icon, click the icon to delete everything.

Both Input and TextArea support clear button configuration through `allowClear`. A clear button with `tabIndex: -1` is excluded from Tab navigation.
</docs>

<template>
  <a-input allow-clear placeholder="input with clear icon" />
  <br>
  <br>
  <a-input :allow-clear="{ tabIndex: -1 }" placeholder="clear icon is skipped by Tab" />
  <br>
  <br>
  <a-textarea allow-clear placeholder="textarea with clear icon" />
</template>

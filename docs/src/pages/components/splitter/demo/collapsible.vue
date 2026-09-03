<docs lang="zh-CN">
可折叠的面板。
</docs>

<docs lang="en-US">
Collapsible panel.
</docs>

<template>
  <a-flex vertical gap="medium">
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel collapsible min="20%">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel collapsible>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
    <a-splitter
      orientation="vertical"
      style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    >
      <a-splitter-panel collapsible min="20%">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel collapsible>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>

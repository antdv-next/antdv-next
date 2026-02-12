<docs lang="zh-CN">
延迟渲染模式，只有在鼠标移动时才会更新面板大小。适用于大型页面，避免频繁重渲染导致卡顿。
</docs>

<docs lang="en-US">
Lazy rendering mode, only updates panel size when mouse moves. Suitable for large pages to avoid frequent re-rendering causing lag.
</docs>

<template>
  <a-space vertical style="width: 100%">
    <a-splitter lazy style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel default-size="40%" min="20%" max="70%">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
    <a-splitter
      lazy
      orientation="vertical"
      style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    >
      <a-splitter-panel default-size="40%" min="30%" max="70%">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-space>
</template>

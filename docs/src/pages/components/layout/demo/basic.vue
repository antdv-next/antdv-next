<docs lang="zh-CN">
典型的页面布局。
</docs>

<docs lang="en-US">
Classic page layouts.
</docs>

<template>
  <a-flex gap="medium" wrap>
    <a-layout class="demo-layout">
      <a-layout-header class="demo-header">
        Header
      </a-layout-header>
      <a-layout-content class="demo-content">
        Content
      </a-layout-content>
      <a-layout-footer class="demo-footer">
        Footer
      </a-layout-footer>
    </a-layout>

    <a-layout class="demo-layout">
      <a-layout-header class="demo-header">
        Header
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="25%" class="demo-sider">
          Sider
        </a-layout-sider>
        <a-layout-content class="demo-content">
          Content
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="demo-footer">
        Footer
      </a-layout-footer>
    </a-layout>

    <a-layout class="demo-layout">
      <a-layout-header class="demo-header">
        Header
      </a-layout-header>
      <a-layout>
        <a-layout-content class="demo-content">
          Content
        </a-layout-content>
        <a-layout-sider width="25%" class="demo-sider">
          Sider
        </a-layout-sider>
      </a-layout>
      <a-layout-footer class="demo-footer">
        Footer
      </a-layout-footer>
    </a-layout>

    <a-layout class="demo-layout">
      <a-layout-sider width="25%" class="demo-sider">
        Sider
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="demo-header">
          Header
        </a-layout-header>
        <a-layout-content class="demo-content">
          Content
        </a-layout-content>
        <a-layout-footer class="demo-footer">
          Footer
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-flex>
</template>

<style scoped>
.demo-layout {
  border-radius: 8px;
  overflow: hidden;
  width: calc(50% - 8px);
  max-width: calc(50% - 8px);
}

.demo-header {
  text-align: center;
  color: #fff;
  height: 64px;
  padding-inline: 48px;
  line-height: 64px;
  background-color: #4096ff;
}

.demo-content {
  text-align: center;
  min-height: 120px;
  line-height: 120px;
  color: #fff;
  background-color: #0958d9;
}

.demo-sider {
  text-align: center;
  line-height: 120px;
  color: #fff;
  background-color: #1677ff;
}

.demo-footer {
  text-align: center;
  color: #fff;
  background-color: #4096ff;
}
</style>

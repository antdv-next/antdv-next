<docs lang="zh-CN">
线框化样式。
</docs>

<docs lang="en-US">
Wireframe style.
</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
    <a-space direction="vertical" size="medium" style="width: 100%">
      <a-pagination show-size-changer :default-current="3" :total="500" />
      <a-pagination show-size-changer :default-current="3" :total="500" disabled />
      <a-pagination size="small" :default-current="50" :total="500" />
      <a-pagination size="small" :default-current="50" :total="500" disabled />
    </a-space>
  </a-config-provider>
</template>

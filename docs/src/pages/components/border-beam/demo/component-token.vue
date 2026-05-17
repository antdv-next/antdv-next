<docs lang="zh-CN">
通过 `ConfigProvider` 的 theme.components 可以覆盖 BorderBeam 的 `lineWidth` token，从而调整流光的线宽。
</docs>

<docs lang="en-US">
Override the BorderBeam `lineWidth` token via `ConfigProvider` theme.components to adjust the beam thickness.
</docs>

<script setup lang="ts">
const customTheme = {
  components: {
    BorderBeam: { lineWidth: 3 },
  },
}
</script>

<template>
  <a-flex :gap="24" wrap>
    <div :style="{ width: '320px' }">
      <a-border-beam>
        <a-card title="Default line width">
          <a-typography-text type="secondary">
            Uses the default global lineWidth token from the current theme.
          </a-typography-text>
        </a-card>
      </a-border-beam>
    </div>
    <a-config-provider :theme="customTheme">
      <div :style="{ width: '320px' }">
        <a-border-beam>
          <a-card title="Custom line width">
            <a-typography-text type="secondary">
              Override lineWidth from theme.token.
            </a-typography-text>
          </a-card>
        </a-border-beam>
      </div>
    </a-config-provider>
  </a-flex>
</template>

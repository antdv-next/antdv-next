<docs lang="zh-CN">
调试 Card extra 中按钮图标的垂直对齐（#57727、#57896、#58428）。
</docs>

<docs lang="en-US">
Debug vertical alignment of button icons inside Card extra (#57727, #57896, #58428).
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { Popconfirm } from 'antdv-next'
import { h } from 'vue'

const InternalPopconfirm = Popconfirm._InternalPanelDoNotUseOrYouWillBeFired

const btnCls = {
  icon: 'card-btn-debug-icon',
  content: 'card-btn-debug-content',
}
</script>

<template>
  <a-config-provider :button="{ classes: btnCls }">
    <a-flex vertical gap="middle">
      <a-card class="line-card" title="#57727 Card extra">
        <template #extra>
          <a-button>
            <template #icon>
              <SmileOutlined />
            </template>
            Test
          </a-button>
        </template>
        Button in Card extra should be vertically centered with the title.
      </a-card>

      <a-card title="#57896 regression minimum case">
        <div class="simulate-57896">
          <div class="inline-buttons">
            <a-button>Cancel</a-button>
            <a-button type="primary" :icon="() => h(SmileOutlined)">
              Confirm
            </a-button>
          </div>
        </div>
      </a-card>

      <InternalPopconfirm
        title="Are you OK?"
        :ok-button-props="{ icon: () => h(SmileOutlined) }"
      />
    </a-flex>
  </a-config-provider>
</template>

<style>
.card-btn-debug-icon {
  background: rgba(255, 0, 0, 0.1);
}

.card-btn-debug-icon span {
  background: rgba(0, 255, 0, 0.5);
}

.card-btn-debug-content {
  background: rgba(0, 0, 255, 0.1);
}
</style>

<script setup lang="ts">
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@antdv-next/icons'

const value = 'https://antdv-next.com'
</script>

<template>
  <a-flex gap="middle" wrap>
    <a-qrcode :value="value" status="loading">
      <template #statusRender="info">
        <template v-if="info.status === 'loading'">
          <a-space direction="vertical">
            <a-spin />
            <p>Loading...</p>
          </a-space>
        </template>
      </template>
    </a-qrcode>
    <a-qrcode :value="value" status="expired" @refresh="() => console.log('refresh')">
      <template #statusRender="info">
        <template v-if="info.status === 'expired'">
          <div>
            <CloseCircleFilled style="color: red" /> {{ info?.locale?.expired }}
            <p>
              <a-button type="link" @click="info?.onRefresh">
                <ReloadOutlined /> {{ info?.locale?.refresh }}
              </a-button>
            </p>
          </div>
        </template>
      </template>
    </a-qrcode>

    <a-qrcode :value="value" status="scanned">
      <template #statusRender="info">
        <template v-if="info.status === 'scanned'">
          <div>
            <CheckCircleFilled style="color:green" /> {{ info?.locale?.scanned }}
          </div>
        </template>
      </template>
    </a-qrcode>
  </a-flex>
</template>

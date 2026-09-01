<script setup lang="ts">
import { useLocale } from '@/composables/use-locale'

const { t } = useLocale()
</script>

<template>
  <div class="not-found">
    <a-result status="404" :title="t('ui.notFound.title')" :sub-title="t('ui.notFound.subTitle')">
      <template #extra>
        <router-link to="/">
          <a-button type="primary">
            {{ t('ui.notFound.backHome') }}
          </a-button>
        </router-link>
      </template>
    </a-result>
  </div>
</template>

<style scoped lang="less">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 48px 24px;
  box-sizing: border-box;
}
</style>

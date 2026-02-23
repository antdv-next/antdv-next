<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent } from 'vue'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'

const PreviewBanner = defineAsyncComponent(() => import('./components/preview-banner/index.vue'))
const Theme = defineAsyncComponent(() => import('./components/theme/index.vue'))
const Group = defineAsyncComponent(() => import('./components/group/index.vue'))
const ComponentsList = defineAsyncComponent(() => import('./components/components-list/index.vue'))
const DesignFramework = defineAsyncComponent(() => import('./components/design-framework/index.vue'))

const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const { t } = useLocale()
</script>

<template>
  <div class="antdv-home-page min-h-100vh">
    <section>
      <Suspense>
        <PreviewBanner />
        <template #fallback>
          <div style="height: 640px;" />
        </template>
      </Suspense>
    </section>

    <div>
      <!-- 定制主题 -->
      <Suspense>
        <Theme />
        <template #fallback>
          <div />
        </template>
      </Suspense>

      <!-- 组件列表 -->
      <Suspense>
        <Group
          id="design"
          collapse
          :title="t('home.assetsTitle')"
          :description="t('home.assetsDesc')"
        >
          <ComponentsList />
        </Group>
        <template #fallback>
          <div />
        </template>
      </Suspense>

      <!-- 设计语言与研发框架 -->
      <Suspense>
        <Group
          :title="t('home.designTitle')"
          :description="t('home.designDesc')"
          :background="darkMode ? '#393F4A' : '#F5F8FF'"
        >
          <template #decoration>
            <img
              draggable="false"
              class="antdv-home-design-framework-decoration-image"
              src="https://gw.alipayobjects.com/zos/bmw-prod/ba37a413-28e6-4be4-b1c5-01be1a0ebb1c.svg"
              alt="bg"
            >
          </template>
          <DesignFramework />
        </Group>
        <template #fallback>
          <div />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style>
.antdv-home-design-framework-decoration-image {
  position: absolute;
  inset-inline-start: 0;
  top: -50px;
  height: 160px;
}
</style>

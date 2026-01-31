<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent } from 'vue'
import { useLocaleNamespace } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'

const ComponentsBlock = defineAsyncComponent(() => import('./components/preview-banner/components-block.vue'))
const Theme = defineAsyncComponent(() => import('./components/theme/index.vue'))
const Group = defineAsyncComponent(() => import('./components/group/index.vue'))
const ComponentsList = defineAsyncComponent(() => import('./components/components-list/index.vue'))
const DesignFramework = defineAsyncComponent(() => import('./components/design-framework/index.vue'))

const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

const currentLocale = useLocaleNamespace('home')
</script>

<template>
  <div class="antdv-home-page min-h-100vh">
    <section>
      <div class="z-1 relative">
        <!-- Background Images -->
        <img
          alt="bg"
          draggable="false"
          src="https://gw.alipayobjects.com/zos/bmw-prod/49f963db-b2a8-4f15-857a-270d771a1204.svg"
          class="absolute top-0 left-0 w-240px"
        >
        <img
          alt="bg"
          draggable="false"
          src="https://gw.alipayobjects.com/zos/bmw-prod/e152223c-bcae-4913-8938-54fda9efe330.svg"
          class="absolute bottom-120px right-40% w-240px"
        >

        <!-- Main Holder -->
        <div class="antdv-home-preview-banner-holder group">
          <!-- Components Block - 绝对定位在右上角 -->
          <Suspense>
            <div class="antdv-home-preview-banner-components-block">
              <ComponentsBlock />
            </div>
            <template #fallback>
              <div class="antdv-home-preview-banner-components-block" />
            </template>
          </Suspense>

          <!-- Mask Layer -->
          <div class="antdv-home-preview-banner-mask-layer" />

          <!-- Typography -->
          <a-typography component="article" class="antdv-home-preview-banner-typography text-center relative z-1 px-xl">
            <h1 class="antdv-home-preview-banner-title font-900">
              Antdv Next
            </h1>
            <p class="antdv-home-preview-banner-slogan text-lg! font-normal! mb-0!">
              {{ currentLocale.slogan }}
            </p>
          </a-typography>

          <!-- Buttons -->
          <a-flex gap="middle" class="antdv-home-preview-banner-buttons">
            <a-button type="primary" href="/components/overview" size="large">
              {{ currentLocale.start }}
            </a-button>
            <a-button href="https://github.com/antdv-next/antdv-next" target="_blank" rel="noopener noreferrer" size="large">
              {{ currentLocale.designLanguage }}
            </a-button>
          </a-flex>

          <!-- Children Container -->
          <div class="antdv-home-preview-banner-children-container relative w-full mx-auto my-0 z-1 max-w-1200px">
            <div class="antdv-home-preview-banner-children-inner flex w-full max-w-full box-border items-stretch text-align-start min-h-178px mx-auto" />
          </div>
        </div>
      </div>
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
          :title="currentLocale.assetsTitle"
          :description="currentLocale.assetsDesc"
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
          :title="currentLocale.designTitle"
          :description="currentLocale.designDesc"
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
.antdv-home-preview-banner-holder {
  height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  perspective: 800px;
  transform: translateZ(1000px);
  row-gap: var(--ant-margin-xl);
}

.antdv-home-preview-banner-components-block {
  position: absolute;
  inset-inline-end: -60px;
  top: -24px;
  transition: all 1s cubic-bezier(0.03, 0.98, 0.52, 0.99);
}

.antdv-home-preview-banner-mask-layer {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(2px);
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
  transition: opacity 1s ease;
  pointer-events: none;
}

html.dark .antdv-home-preview-banner-mask-layer {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.antdv-home-preview-banner-holder:hover .antdv-home-preview-banner-mask-layer {
  opacity: 0;
}

.antdv-home-preview-banner-holder:hover .antdv-home-preview-banner-components-block {
  transform: scale(0.96);
}

.antdv-home-preview-banner-typography {
  text-shadow:
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container);
}

.antdv-home-preview-banner-title {
  font-size: calc(var(--ant-font-size-heading-2) * 2) !important;
  line-height: var(--ant-line-height-heading-2) !important;
}

.antdv-home-preview-banner-buttons {
  margin-bottom: var(--ant-margin-xl);
}

.antdv-home-preview-banner-children-inner {
  column-gap: calc(var(--ant-padding-md) * 2);
}

.antdv-home-design-framework-decoration-image {
  position: absolute;
  inset-inline-start: 0;
  top: -50px;
  height: 160px;
}
</style>

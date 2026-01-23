<script setup lang="ts">
import type { MenuEmits } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useDocPage } from '@/composables/doc-page'
import { useMobile } from '@/composables/mobile'
import { useAppStore } from '@/stores/app'

const { isMobile } = useMobile()
const appStore = useAppStore()
const { siderMenus, siderKey, siderOpenKeys, siderLocales, locale, direction } = storeToRefs(appStore)
const { anchorItems } = useDocPage()
const router = useRouter()
const handleChangeMenu: MenuEmits['click'] = (info) => {
  const key = info.key
  const locale = appStore.locale
  if (key) {
    if (locale === 'zh-CN') {
      router.push({
        path: `${key}-cn`,
      })
    }
    else {
      router.push({
        path: key,
      })
    }
  }
}
</script>

<template>
  <main class="ant-doc-main mt-xl flex">
    <a-col v-if="!isMobile" class="ant-doc-main-sider" :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
      <a-menu
        class="ant-doc-main-sider-menu"
        :items="siderMenus"
        mode="inline"
        :selected-keys="siderKey"
        :open-keys="siderOpenKeys"
        @click="handleChangeMenu"
      >
        <template #labelRender="{ key, label }">
          {{ siderLocales?.[key]?.[locale] ?? label }}
        </template>
        <template #extraRender="{ tag }">
          <template v-if="tag">
            <a-tag color="success">
              {{ tag }}
            </a-tag>
          </template>
        </template>
      </a-menu>
    </a-col>
    <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="24" :xs="24">
      <section class="ant-doc-main-section">
        <a-anchor :items="anchorItems" class="ant-doc-main-sider-anchor" :offset-top="70" :affix="false" />
      </section>
      <article class="pb-32px mt--16px" :class="[direction === 'ltr' ? 'pl-48px pr-164px' : 'pr-48px pl-164px']">
        <slot />
      </article>
    </a-col>
  </main>
</template>

<style lang="less">
.ant-doc-main {
  &-sider {
    z-index: 1;
    position: sticky;
    top: var(--ant-doc-header-height);
    width: 100%;
    max-height: calc(100vh - var(--ant-doc-header-height));
    overflow: hidden;
    scrollbar-width: thin;
    scrollbar-gutter: stable;

    &:hover {
      overflow-y: auto;
    }

    &-menu {
      min-height: 100%;
      padding-top: 0;
      padding-bottom: var(--ant-margin-xxl) !important;
      padding-inline: var(--ant-margin-xxs);

      //.ant-menu-inline > .ant-menu-item-group > .ant-menu-item-group-title::after {
      //  position: relative;
      //  top: 12px;
      //  display: block;
      //  width: calc(100% - 20px);
      //  height: 1px;
      //  background: var(--ant-color-split);
      //  content: '';
      //}
    }
    &-anchor {
      scrollbar-width: thin;
      scrollbar-gutter: stable;
    }
  }

  &-section {
    position: fixed;
    top: calc(var(--ant-doc-header-height) + var(--ant-margin-xl) - 4px);
    inset-inline-end: 0;
    padding: 0;
    border-radius: var(--ant-border-radius);
    box-sizing: border-box;
    width: 148px;
    margin-inline-end: calc(8px - 100vw + 100%);
    z-index: 10;

    > div {
      box-sizing: border-box;
      width: 100%;
      max-height: calc(100vh - var(--ant-doc-header-height) - var(--ant-margin-xl) - 24px) !important;
      margin: auto;
      overflow: auto;
      padding: var(--ant-padding-xxs);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }
  }
}
</style>

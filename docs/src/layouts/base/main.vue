<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import type { AntdvMenuItem } from '../../config/menu/interface'
import { LeftOutlined, RightOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocPage } from '@/composables/doc-page'
import { useMobile } from '@/composables/mobile'
import { useAppStore } from '@/stores/app'
import Contributors from './components/contributors.vue'
import Footer from './components/footer.vue'

const { isMobile } = useMobile()
const appStore = useAppStore()
const { siderMenus, siderKey, siderOpenKeys, siderLocales, locale, direction, darkMode } = storeToRefs(appStore)
const { anchorItems } = useDocPage()
const router = useRouter()
const route = useRoute()

function getMenuUrl(key: string) {
  const currentLocale = appStore.locale
  if (currentLocale === 'zh-CN') {
    return `${key}-cn`
  }
  return key
}

const handleMenuClick: MenuProps['onClick'] = (info) => {
  const key = info.key
  router.push({ path: getMenuUrl(key) })
}

const pageTurning = computed(() => {
  const menus: AntdvMenuItem[] = siderMenus.value.reduce(
    (pre, current) => {
      if (current.children) {
        return [...pre, ...current.children]
      }
      else {
        return [...pre, current]
      }
    },
    [],
  )
  const currentPath = route.path
  const currentIndex = menus.findIndex((item) => {
    if (appStore.locale === 'zh-CN') {
      const replacePath = currentPath.replace('-cn', '')
      return item.key === replacePath
    }
    return item.key === currentPath
  })
  const prev = currentIndex >= 0 && menus[currentIndex - 1]
  const next = currentIndex <= menus.length && menus[currentIndex + 1]
  const prevPath = prev ? getMenuUrl(prev.key as string) : ''
  const nextPath = next ? getMenuUrl(next.key as string) : ''
  const prevLocale = prev && siderLocales.value?.[prev.key as string]?.[locale.value]
  const nextLocale = next && siderLocales.value?.[next.key as string]?.[locale.value]
  return {
    prev,
    next,
    prevPath,
    nextPath,
    prevLocale,
    nextLocale,
  }
})
</script>

<template>
  <main class="ant-doc-main mt-xl flex">
    <a-col v-if="!isMobile" class="ant-doc-main-sider" :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
      <a-menu
        class="ant-doc-main-sider-menu"
        :items="siderMenus"
        :theme="darkMode ? 'dark' : 'light'"
        mode="inline"
        :selected-keys="siderKey"
        :open-keys="siderOpenKeys"
        @click="handleMenuClick"
      >
        <template #labelRender="{ key, label }">
          <a
            class="ant-doc-main-sider-menu-item-link"
            :href="getMenuUrl(key as string)"
            @click.prevent
          >
            {{ siderLocales?.[key]?.[locale] ?? label }}
          </a>
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
      <section v-if="!isMobile" class="ant-doc-main-section">
        <a-anchor :items="anchorItems" class="ant-doc-main-sider-anchor" :offset-top="70" :affix="false" />
      </section>
      <article class="mt--16px" :class="[isMobile ? 'px-16px' : direction === 'ltr' ? 'pl-48px pr-164px' : 'pr-48px pl-164px']">
        <slot />
        <Suspense>
          <Contributors />
          <template #fallback>
            loading
          </template>
        </Suspense>
        <!-- prev and next -->
        <div class="ant-doc-main-section-pageTurning">
          <RouterLink v-show="pageTurning.prev" :to="pageTurning.prevPath" class="ant-doc-main-section-pageTurning-prev">
            <LeftOutlined class="ant-doc-main-section-pageTurning-arrow" />
            <span class="ant-doc-main-section-pageTurning-content">
              <span class="ant-doc-main-section-pageTurning-label">{{ locale === 'zh-CN' ? '上一篇' : 'Previous' }}</span>
              <span class="ant-doc-main-section-pageTurning-title">{{ pageTurning.prevLocale }}</span>
            </span>
          </RouterLink>
          <RouterLink v-show="pageTurning.next" :to="pageTurning.nextPath" class="ant-doc-main-section-pageTurning-next">
            <span class="ant-doc-main-section-pageTurning-content">
              <span class="ant-doc-main-section-pageTurning-label">{{ locale === 'zh-CN' ? '下一篇' : 'Next' }}</span>
              <span class="ant-doc-main-section-pageTurning-title">{{ pageTurning.nextLocale }}</span>
            </span>
            <RightOutlined class="ant-doc-main-section-pageTurning-arrow" />
          </RouterLink>
        </div>
      </article>
      <Footer />
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
      background: transparent;

      &-item-link {
        color: inherit;
      }

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

    &-pageTurning {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      padding-bottom: 32px;
      border-top: 1px solid var(--ant-color-split, var(--ant-color-border));

      &-prev,
      &-next {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        flex: 0 1 auto;
        max-width: calc(50% - 8px);
        padding: 12px 16px;
        border: 1px solid var(--ant-color-border-secondary, var(--ant-color-border));
        border-radius: var(--ant-border-radius-lg, 8px);
        color: var(--ant-color-text-secondary);
        line-height: 1.4;
        transition:
          border-color 0.2s,
          color 0.2s,
          background-color 0.2s;

        &:hover {
          color: var(--ant-color-primary);
          border-color: var(--ant-color-primary);
          background-color: var(--ant-color-primary-bg, transparent);
        }
      }

      // Keep the next block on the right even when there is no previous page
      &-next {
        margin-inline-start: auto;
        text-align: end;
      }

      &-content {
        display: flex;
        flex-direction: column;
        min-width: 0;
        gap: 2px;
      }

      &-label {
        font-size: 12px;
        color: var(--ant-color-text-tertiary);
      }

      &-title {
        font-weight: 600;
        color: var(--ant-color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &-prev:hover &-title,
      &-next:hover &-title,
      &-prev:hover &-label,
      &-next:hover &-label {
        color: var(--ant-color-primary);
      }

      &-arrow {
        flex: none;
        font-size: 14px;
        color: var(--ant-color-text-tertiary);
        transition:
          transform 0.2s,
          color 0.2s;
      }

      &-prev:hover &-arrow {
        color: var(--ant-color-primary);
        transform: translateX(-3px);
      }

      &-next:hover &-arrow {
        color: var(--ant-color-primary);
        transform: translateX(3px);
      }
    }
  }
}
</style>

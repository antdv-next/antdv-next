<script setup lang="ts">
import type { MenuEmits } from 'antdv-next'
import { GithubOutlined } from '@antdv-next/icons'
import { version } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocSearch from '@/components/doc-search/index.vue'
import DirectionIcon from '@/components/icons/directionIcon.vue'
import { useMobile } from '@/composables/mobile'
import { useLocale } from '@/composables/use-locale'
import { headerItems, headerLocales } from '@/config/menu/header'
import SwitchBtn from '@/layouts/base/components/switch-btn.vue'
import ThemeBtn from '@/layouts/base/components/theme-btn.vue'
import { useAppStore } from '@/stores/app.ts'

const route = useRoute()
const appStore = useAppStore()
const { headerKey, locale, direction } = storeToRefs(appStore)
const { t } = useLocale()
const versions = ref([
  {
    label: version,
    value: version,
  },
])
const { isMobile } = useMobile()
const currentVersion = shallowRef(version)
const router = useRouter()
const handleHeaderChange: MenuEmits['click'] = (info) => {
  const key = info.key
  router.push(key)
  appStore.setHeaderKey([key])
}

const itemKeys = headerItems.map(item => item?.key).filter(Boolean) as string[]
const headerPrefixes = [...itemKeys].sort((a, b) => b.length - a.length)
watch(
  () => route.path,
  () => {
    const normalizedPath = route.path.endsWith('-cn')
      ? route.path.slice(0, route.path.length - 3)
      : route.path
    const exclude = ['', '/', route.path, normalizedPath]
    const matched = route.matched?.map(v => v.path).filter(path => !exclude.includes(path))
    appStore.setSiderOpenKeys(matched)
    // check path has -cn
    if (route.path.endsWith('-cn')) {
      const path = route.path.slice(0, route.path.length - 3)
      appStore.setSiderKey([path])
    }
    else {
      appStore.setSiderKey([route.path])
    }
    const matchedHeaderPrefix = headerPrefixes.find(prefix =>
      normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
    )
    if (matchedHeaderPrefix) {
      appStore.setHeaderKey([matchedHeaderPrefix])
      return
    }
    const foundKey = itemKeys.find(v => matched?.includes?.(v))
    appStore.setHeaderKey(foundKey ? [foundKey] : [])
  },
  { immediate: true },
)

function changeLocale(value: 1 | 2) {
  const path = route.path
  if (value === 1) {
    if (!path.endsWith('-cn')) {
      const newPath = path === '/' ? '/index-cn' : `${path}-cn`
      router.push({
        path: newPath,
        hash: route.hash,
      })
    }
  }
  else {
    if (path === '/index-cn') {
      router.push({
        path: '/',
        hash: route.hash,
      })
    }
    else if (path.endsWith('-cn')) {
      const newPath = path.slice(0, path.length - 3) || '/'
      router.push({
        path: newPath,
        hash: route.hash,
      })
    }
  }
  appStore.setLocale(value === 1 ? 'zh-CN' : 'en-US')
}
const localeValue = computed(() => {
  return locale.value === 'zh-CN' ? 1 : 2
})

const directionValue = computed(() => {
  return direction.value === 'ltr' ? 1 : 2
})

function changeDirection(value: 1 | 2) {
  appStore.toggleDirection(value === 1 ? 'ltr' : 'rtl')
}
</script>

<template>
  <header
    class="ant-doc-header sticky top-0 z-1000 w-full a-shadow-ter backdrop-blur-8px"
  >
    <a-row>
      <a-col :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
        <h1 class="m-0 p-0">
          <router-link class="inline-flex items-center pl-40px h-(--ant-doc-header-height) line-height-[var(--ant-doc-header-height)] text-18px font-bold a-color-text hover:a-color-text of-hidden" to="/">
            <img src="../../assets/antdv-next.svg" class="w-36px h-36px inline-block align-middle" draggable="false" alt="logo">
            <span class="ml-2 c-text">
              Antdv Next
            </span>
          </router-link>
        </h1>
      </a-col>
      <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="0" :xs="0">
        <div class="ant-doc-header-right flex items-center gap-sm" :class="[direction === 'ltr' ? 'pr-[var(--ant-padding)]' : 'pl-[var(--ant-padding)]']">
          <div class="flex items-center m-0" :class="[direction === 'ltr' ? 'b-l-1 b-l-solid b-l-black/6' : 'b-r-1 b-r-solid b-r-black/6']" style="flex: auto">
            <DocSearch />
          </div>
          <template v-if="!isMobile">
            <a-menu
              :selected-keys="headerKey"
              class="h-full border-b-none! ant-doc-header-menu"
              mode="horizontal"
              :items="headerItems"
              @click="handleHeaderChange"
            >
              <template #labelRender="{ key, label }">
                {{ headerLocales?.[key]?.[locale] ?? label }}
              </template>
            </a-menu>
            <a-select
              v-model:value="currentVersion"
              :options="versions"
              size="small"
              variant="filled"
              class="min-w-90px"
              :popup-match-select-width="false"
              :get-popup-container="(trigger) => trigger.parentNode"
            />
            <SwitchBtn
              key="lang"
              :value="localeValue"
              :tooltip1="t('layout.header.languageTooltip1')"
              :tooltip2="t('layout.header.languageTooltip2')"
              @click="changeLocale"
            >
              <template #label1>
                中
              </template>
              <template #label2>
                En
              </template>
            </SwitchBtn>
            <SwitchBtn
              key="direction"
              :value="directionValue"
              :tooltip1="t('layout.header.directionTooltip1')"
              :tooltip2="t('layout.header.directionTooltip2')"
              pure
              aria-label="RTL Switch Button"
              @click="changeDirection"
            >
              <template #label1>
                <DirectionIcon class="w-20px" direction="ltr" />
              </template>
              <template #label2>
                <DirectionIcon class="w-20px" direction="rtl" />
              </template>
            </SwitchBtn>
            <ThemeBtn />
            <a
              key="github"
              href="https://github.com/antdv-next/antdv-next"
              target="_blank"
              rel="noreferrer"
            >
              <a-tooltip title="GitHub" destroy-on-hidden>
                <a-button type="text" class="text-16px">
                  <template #icon>
                    <GithubOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </a>
          </template>
        </div>
      </a-col>
    </a-row>
  </header>
</template>

<style lang="less">
.ant-doc-header {
  height: var(--ant-doc-header-height);
  background-color: color-mix(in srgb, var(--ant-color-bg-container), transparent 20%);
  backdrop-filter: blur(8px);
}
.ant-doc-header a {
  white-space: nowrap;
  text-decoration: none;
}

.ant-doc-header-right {
  > * {
    flex: none;
    margin: 0;
  }
}
.ant-doc-header-menu {
  flex: 1;
  min-width: 0;
  flex-shrink: 0;
  justify-content: flex-end;
  background-color: transparent !important;

  .ant-menu-item {
    height: var(--ant-doc-header-height);
    line-height: var(--ant-doc-header-height);
  }
}

.ant-doc-search-bar {
  &-svg {
    position: absolute;
    top: 50%;
    margin-top: 1px;
    //padding-left: 16px;
    inset-inline-start: 16px;
    width: 14px;
    fill: #ced4d9;
    transform: translateY(-50%);
  }

  &-input {
    width: 280px;
    height: 22px;
    border: 0;
    max-width: calc(100vw - 768px);
    padding: 0;
    padding-inline-start: 40px;
    padding-inline-end: 12px;
    font-size: 14px;
    border-radius: 20px;
    box-sizing: border-box;
    outline: none;
    transition: all 0.3s;
    color: var(--ant-color-text);
    background: transparent;
  }
}
</style>

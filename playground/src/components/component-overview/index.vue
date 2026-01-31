<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { covers } from './covers'

defineOptions({ name: 'ComponentOverview' })

const search = ref('')
const inputRef = useTemplateRef('searchInput')
const searchBarAffixed = ref(false)

const { siderMenus, siderLocales, locale, darkMode } = storeToRefs(useAppStore())

interface ComponentItem {
  key: string
  label: string
}

interface MenuGroup {
  key: string
  label: string
  children: ComponentItem[]
}

const baseMenus = (siderMenus.value.slice(2) as unknown as MenuGroup[]).map(group => ({
  ...group,
  children: group.children.filter(item => !('type' in item && item.type === 'divider')),
}))

const searchMenus = ref<MenuGroup[]>(baseMenus)

function handleAffixChange(affixed?: boolean) {
  searchBarAffixed.value = affixed ?? false
}

function handleSearchChange(e: Event) {
  const value = (e.target as HTMLInputElement).value.trim()
  if (value) {
    searchMenus.value = baseMenus.map((group) => {
      const filteredChildren = group.children.filter(comp =>
        comp.label.toLowerCase().includes(value.toLowerCase()),
      )
      return {
        ...group,
        children: filteredChildren,
      }
    }).filter(group => group.children.length > 0)
  }
  else {
    searchMenus.value = baseMenus
  }
}

// Helper function to extract component name from key
// e.g., '/components/button' -> 'Button'
function getComponentName(key: string): string {
  const parts = key.split('/')
  const name = parts[parts.length - 1]
  if (!name)
    return ''
  // Convert kebab-case to PascalCase
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

onMounted(() => {
  ;(inputRef.value as any)?.focus()
})
</script>

<template>
  <section>
    <a-divider />
    <a-affix :offset-top="80" @change="handleAffixChange">
      <div class="components-overview-affix" :class="{ 'components-overview-affixed': searchBarAffixed }">
        <a-input ref="searchInput" v-model:value="search" auto-focus variant="borderless" placeholder="搜索组件" class="components-overview-search" :style="{ fontSize: searchBarAffixed ? '18px' : '' }" @change="handleSearchChange">
          <template #suffix>
            <SearchOutlined />
          </template>
        </a-input>
      </div>
    </a-affix>
    <a-divider />
    <template v-for="group in searchMenus" :key="group.key">
      <div class="component-overview">
        <h2 class="component-overview-group-title">
          <a-space>
            {{ siderLocales?.[group.key]?.[locale] ?? group.label }}
            <a-tag>{{ group.children.length }}</a-tag>
          </a-space>
        </h2>
        <a-row :gutter="[24, 24]">
          <template v-for="comp in group.children" :key="comp.key">
            <a-col :xs="24" :sm="12" :lg="8" :xl="6">
              <RouterLink :to="locale === 'zh-CN' ? `${comp.key}-cn` : comp.key" style="text-decoration: none; color: inherit;">
                <a-card size="small" class="components-overview-card">
                  <template #title>
                    <div class="components-overview-title">
                      {{ siderLocales?.[comp.key]?.[locale] ?? comp.label }}
                    </div>
                  </template>
                  <div class="components-overview-img">
                    <img
                      :src="darkMode ? covers?.[getComponentName(comp.key)]?.coverDark : covers?.[getComponentName(comp.key)]?.cover"
                      :alt="siderLocales?.[comp.key]?.[locale] ?? comp.label"
                    >
                  </div>
                </a-card>
              </RouterLink>
            </a-col>
          </template>
        </a-row>
      </div>
    </template>
  </section>
</template>

<style scoped lang="less">
.components-overview {
  padding: 0;

  &-group-title {
    margin-bottom: 24px !important;
  }

  &-title {
    overflow: hidden;
    color: var(--text-color);
    text-overflow: ellipsis;
  }

  &-img {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 152px;
  }

  &-card {
    cursor: pointer;
    transition: all 0.5s ease 0s;

    &:hover {
      box-shadow: var(--shadow-2);
    }
  }

  &-affix {
    transition: all 0.25s;
  }

  &-affixed {
    padding: 12px;
    margin: -8px;
    border-radius: 6px;
    border: 0 solid;
    background-color: var(--ant-color-bg-elevated);
    box-shadow: var(--ant-box-shadow-secondary);
  }
}

.components-overview-search {
  width: 100%;
  padding: 0;
  font-size: 20px;
  border: 0;
  box-shadow: none;

  input {
    font-size: 20px;
  }

  .anticon {
    color: var(--ant-color-text-placeholder);
  }
}

.components-overview-img img {
  object-fit: cover;
  max-height: 100%;
  max-width: 100%;
}
</style>

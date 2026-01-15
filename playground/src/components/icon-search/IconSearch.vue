<script setup lang="ts">
import type { CategoriesKeys } from './field'
import * as AntdIcons from '@antdv-next/icons/all'
import { storeToRefs } from 'pinia'
import { computed, h, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import Category from './Category.vue'
import { all, categories } from './field'
import metaInfo from './meta'
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons'

type ThemeType = 'Filled' | 'Outlined' | 'TwoTone'

interface MatchedCategory {
  category: string
  icons: string[]
};
const IconLocales = {
  Outlined: { 'zh-CN': '线框风格', 'en-US': 'Outlined' },
  Filled: { 'zh-CN': '实底风格', 'en-US': 'Filled' },
  TwoTone: { 'zh-CN': '双色风格', 'en-US': 'TwoTone' },
}
const { locale } = storeToRefs(useAppStore())
const allIcons = AntdIcons as Record<string, any>

const theme = ref<ThemeType>('Outlined')
const searchKey = ref('')
const searchBarAffixed = ref(false)

const options = computed(() => [
  { value: 'Outlined', label: IconLocales.Outlined[locale.value], icon: h(OutlinedIcon) },
  { value: 'Filled', label: IconLocales.Filled[locale.value], icon: h(FilledIcon) },
  { value: 'TwoTone', label: IconLocales.TwoTone[locale.value], icon: h(TwoToneIcon) },
])

const affixedStyle = computed(() => ({
  boxShadow:
    'rgba(50, 50, 93, 0.25) 0 6px 12px -2px, rgba(0, 0, 0, 0.3) 0 3px 7px -3px',
  padding: '8px',
  margin: '-8px',
  borderRadius: '8px',
  backgroundColor: '#fff',
}))

const normalizedSearchKey = computed(() => {
  let s = searchKey.value?.trim()
  if (s) {
    s = s
      .replace(/^<([a-z]*)\s\/?>$/gi, (_, name) => name)
      .replace(/(Filled|Outlined|TwoTone)$/, '')
      .toLowerCase()
  }
  return s
})

function matchCategoriesFromTag(searchKey: string, meta: Record<string, any>) {
  if (!searchKey)
    return {}

  const acc: Record<string, MatchedCategory> = {}

  Object.keys(meta).forEach((key) => {
    const icon = meta[key]
    if (!icon)
      return

    const category = icon.category
    const tags = Array.isArray(icon.tags) ? icon.tags : []

    if (tags.some((tag: string) => typeof tag === 'string' && tag.toLowerCase().includes(searchKey))) {
      if (acc[category]) {
        acc[category].icons.push(key)
      }
      else {
        acc[category] = { category, icons: [key] }
      }
    }
  })

  return acc
}

function mergeCategory(
  categoryA: Record<string, MatchedCategory>,
  categoryB: Record<string, MatchedCategory>,
) {
  const merged: Record<string, MatchedCategory> = { ...categoryA }
  Object.keys(categoryB).forEach((key) => {
    if (merged[key]) {
      merged[key].icons = Array.from(
        new Set([...merged[key].icons, ...categoryB[key].icons]),
      )
    }
    else {
      merged[key] = categoryB[key]
    }
  })
  return merged
}

const matchedCategories = computed(() => {
  const tagMatchedCategoryObj = matchCategoriesFromTag(
    normalizedSearchKey.value || '',
    metaInfo as Record<string, any>,
  )
  const namedMatchedCategoryObj = Object.keys(categories).reduce<
    Record<string, MatchedCategory>
  >((acc, key) => {
    let iconList = (categories as any)[key] as string[]
    if (normalizedSearchKey.value) {
      const matchKey = normalizedSearchKey.value
      iconList = iconList.filter(iconName =>
        iconName.toLowerCase().includes(matchKey),
      )
    }
    const ignore = ['CopyrightCircle', 'DollarCircle']
    iconList = iconList.filter(icon => !ignore.includes(icon))
    acc[key] = {
      category: key,
      icons: iconList,
    }
    return acc
  }, {})

  const merged = mergeCategory(namedMatchedCategoryObj, tagMatchedCategoryObj)
  const result = Object.values(merged)
    .map((item) => {
      item.icons = item.icons
        .map(iconName => iconName + theme.value)
        .filter(iconName => allIcons[iconName])
      return item
    })
    .filter(({ icons }) => !!icons.length)
  return result
})

function onChangeTheme(val: ThemeType) {
  theme.value = val
}
</script>

<template>
  <div class="markdown">
    <a-affix :offset-top="80" @change="v => (searchBarAffixed = v)">
      <div
        class="icon-search-affix"
        :style="searchBarAffixed ? affixedStyle : {}"
      >
        <a-segmented
          v-model:value="theme"
          size="large"
          :options="options"
          @change="onChangeTheme"
        />
        <a-input-search
          :placeholder="`Search icons (${all.length})`"
          style="flex: 1; margin-inline-start: 16px"
          v-model:value="searchKey"
          allow-clear
          auto-focus
          size="large"
        />
      </div>
    </a-affix>
    <div id="list-of-icons">
      <template v-if="matchedCategories.length">
        <Category
          v-for="item in matchedCategories"
          :key="item.category"
          :title="item.category as CategoriesKeys"
          :theme="theme"
          :icons="item.icons"
          :new-icons="[]"
        />
      </template>
      <a-empty v-else style="margin: 2em 0" />
    </div>
  </div>
</template>

<style scoped>
.icon-search-affix {
  display: flex;
  transition: all 0.3s;
  justify-content: space-between;
}
</style>

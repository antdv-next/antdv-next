<script setup lang="ts">
import type { CategoriesKeys } from './field'
import * as AntdIcons from '@antdv-next/icons/all'
import { storeToRefs } from 'pinia'
import { computed, h, ref } from 'vue'
import { useLocale } from '@/composables/use-locale'
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

const { darkMode } = storeToRefs(useAppStore())
const { t } = useLocale()
const allIcons = AntdIcons as Record<string, any>

// Icons newly added in this version; marked with a version tag in the list.
const NEW_ICON_VERSION = '1.4.0'
const NEW_ICON_NAMES: string[] = [
  'AnthropicFilled',
  'ClaudeFilled',
  'GeminiFilled',
  'MistralFilled',
  'DeepSeekFilled',
  'QwenFilled',
  'PerplexityFilled',
  'HuggingFaceFilled',
  'OllamaFilled',
  'ReplicateFilled',
  'ElevenLabsFilled',
  'TelegramFilled',
  'MastodonFilled',
  'ThreadsFilled',
  'SnapchatFilled',
]
const NEW_ICON_ORDER = new Map(NEW_ICON_NAMES.map((name, index) => [name, index]))

function groupNewIcons(icons: string[]) {
  const newIcons = icons
    .filter(iconName => NEW_ICON_ORDER.has(iconName))
    .sort((a, b) => (NEW_ICON_ORDER.get(a) ?? 0) - (NEW_ICON_ORDER.get(b) ?? 0))
  if (!newIcons.length) {
    return icons
  }
  // Surface the newly added (1.4.0-badged) icons at the top of the brand group.
  const restIcons = icons.filter(iconName => !NEW_ICON_ORDER.has(iconName))
  return [...newIcons, ...restIcons]
}

const theme = ref<ThemeType>('Outlined')
const searchKey = ref('')
const searchBarAffixed = ref(false)

const options = computed(() => [
  { value: 'Outlined', label: t('ui.iconSearch.themes.outlined'), icon: h(OutlinedIcon) },
  { value: 'Filled', label: t('ui.iconSearch.themes.filled'), icon: h(FilledIcon) },
  { value: 'TwoTone', label: t('ui.iconSearch.themes.twoTone'), icon: h(TwoToneIcon) },
])

const affixedStyle = computed(() => ({
  boxShadow: darkMode.value
    ? 'rgba(0, 0, 0, 0.5) 0 6px 12px -2px, rgba(0, 0, 0, 0.6) 0 3px 7px -3px'
    : 'rgba(50, 50, 93, 0.25) 0 6px 12px -2px, rgba(0, 0, 0, 0.3) 0 3px 7px -3px',
  padding: '8px',
  margin: '-8px',
  borderRadius: '8px',
  backgroundColor: darkMode.value ? '#141414' : '#fff',
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
    const categoryBItem = categoryB[key]
    if (!categoryBItem)
      return

    if (merged[key]) {
      merged[key].icons = Array.from(
        new Set([...merged[key].icons, ...categoryBItem.icons]),
      )
    }
    else {
      merged[key] = categoryBItem
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
      const icons = item.icons
        .map(iconName => iconName + theme.value)
        .filter(iconName => allIcons[iconName])
      // Surface the newly added icons at the top of the brand group.
      item.icons = item.category === 'logo' ? groupNewIcons(icons) : icons
      return item
    })
    .filter(({ icons }) => !!icons.length)
  return result
})

function onChangeTheme(val: string | number) {
  theme.value = val as ThemeType
}

function onChangeSearchKey() {
  const targetElement = document.getElementById('list-of-icons')

  if (!targetElement)
    return
  const headerHeight = 70
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const rect = targetElement.getBoundingClientRect()
  const y = rect.top + scrollTop - headerHeight

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  })
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
          v-model:value="searchKey"
          :placeholder="`${t('ui.iconSearch.searchPlaceholder')} (${all.length})`"
          style="flex: 1; margin-inline-start: 16px"
          allow-clear
          auto-focus
          size="large"
          @change="onChangeSearchKey"
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
          :new-icons="NEW_ICON_NAMES"
          :new-icon-version="NEW_ICON_VERSION"
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

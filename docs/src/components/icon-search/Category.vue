<script setup lang="ts">
import type { CategoriesKeys } from './field'
import { message } from 'antdv-next'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useLocale } from '@/composables/use-locale'
import CopyableIcon from './CopyableIcon.vue'

export type ThemeType = 'Filled' | 'Outlined' | 'TwoTone'

const props = defineProps<{
  title: CategoriesKeys
  icons: string[]
  theme: ThemeType
  newIcons: string[]
}>()

const { t } = useLocale()
const justCopied = ref<string | null>(null)
const copyId = ref<ReturnType<typeof setTimeout> | null>(null)

function onCopied(type: string, text: string) {
  message.success(`${text} ${t('ui.iconSearch.copiedMessage')}`)
  justCopied.value = type
  copyId.value = setTimeout(() => {
    justCopied.value = null
  }, 2000)
}

onBeforeUnmount(() => {
  if (copyId.value) {
    clearTimeout(copyId.value)
  }
})

const categoryTitle = computed(() => t(`ui.iconSearch.categories.${props.title}`))
</script>

<template>
  <div>
    <h3>{{ categoryTitle }}</h3>
    <ul class="anticonsList">
      <CopyableIcon
        v-for="name in icons"
        :key="name"
        :name="name"
        :theme="theme"
        :is-new="newIcons.includes(name)"
        :just-copied="justCopied"
        @copied="onCopied"
      />
    </ul>
  </div>
</template>

<style scoped>
.anticonsList {
  margin: 16px;
  overflow: hidden;
  direction: ltr;
  list-style: none;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 0;
}
.copiedCode {
  padding: 0;
  font-size: 1px;
  background-color: transparent;
  border-radius: 8px;
}
</style>

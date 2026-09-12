<script lang="ts" setup>
import type { Frontmatter } from '@/composables/doc-page.ts'
import { CalendarOutlined } from '@antdv-next/icons'
import { computed, reactive } from 'vue'

defineOptions({ name: 'DocMeta' })

const props = defineProps<{
  frontmatter?: Frontmatter
}>()

const avatarUrl = (name: string) => `https://github.com/${name}.png?size=24`

const avatarStatus = reactive<Record<string, 'loading' | 'done' | 'error'>>({})

function preloadAvatar(name: string) {
  if (avatarStatus[name])
    return
  avatarStatus[name] = 'loading'
  const img = new Image()
  img.onload = () => {
    avatarStatus[name] = 'done'
  }
  img.onerror = () => {
    avatarStatus[name] = 'error'
  }
  img.src = avatarUrl(name)
}

const authors = computed(() => {
  const author = props.frontmatter?.author
  if (!author)
    return []
  const names = author.split(',').map(item => item.trim()).filter(Boolean)
  names.forEach(preloadAvatar)
  return names
})
</script>

<template>
  <div
    v-if="frontmatter?.datetime || authors.length"
    class="mt-8px flex flex-wrap items-center gap-8px text-14px"
    style="color: var(--ant-color-text-tertiary)"
  >
    <span v-if="frontmatter?.datetime" class="inline-flex items-center gap-4px">
      <CalendarOutlined />
      {{ frontmatter.datetime.slice(0, 10) }}
    </span>
    <a
      v-for="name in authors"
      :key="name"
      :href="`https://github.com/${name}`"
      class="doc-heading-author inline-flex items-center gap-4px decoration-none transition-colors"
      rel="noopener noreferrer"
      target="_blank"
    >
      <a-skeleton-avatar v-if="avatarStatus[name] === 'loading'" active :size="24" />
      <a-avatar v-else :alt="name" :size="24" :src="avatarStatus[name] === 'error' ? undefined : avatarUrl(name)">
        {{ name.slice(0, 1).toUpperCase() }}
      </a-avatar>
      <span>@{{ name }}</span>
    </a>
  </div>
</template>

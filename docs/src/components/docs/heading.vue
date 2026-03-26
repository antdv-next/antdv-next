<script lang="ts" setup>
import type { Frontmatter } from '@/composables/doc-page.ts'
import { EditOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageInfo } from '@/composables/doc-page.ts'

defineOptions({
  name: 'DocHeading',
})

const props = defineProps<{
  frontmatter?: Frontmatter
}>()

const pageInfo = usePageInfo()
const frontmatter = computed(() => props?.frontmatter ?? pageInfo.frontmatter)

const route = useRoute()
const githubUrl = computed(() => {
  const path = route.path
  const isComponent = (e => e.length >= 2 && e.includes('components'))(path.split('/').filter(Boolean))
  const pathBase = path.slice(0, -3)
  const mdFile = path.endsWith('-cn') ? 'zh-CN.md' : 'en-US.md'
  const docPath = isComponent ? `${pathBase}/index.${mdFile}` : `${pathBase}.${mdFile}`
  return `https://github.com/antdv-next/antdv-next/edit/main/docs/src/pages${docPath}`
})
</script>

<template>
  <a-typography-title v-if="frontmatter && frontmatter.title" style="font-size: 32px;position: relative">
    <a-space>
      <span>{{ frontmatter?.title }}</span>
      <span>{{ frontmatter?.subtitle }}</span>
      <a-tooltip destroy-on-hidden title="在 GitHub 上编辑此页">
        <a
          :href="githubUrl" class="relative top--2px inline-block decoration-none align-mid ml-xs"
          rel="noopener noreferrer" target="_blank"
        >
          <EditOutlined class="text-16px  block" style="color: var(--ant-color-text-tertiary)" />
        </a>
      </a-tooltip>
    </a-space>
  </a-typography-title>
  {{ frontmatter?.description }}
</template>

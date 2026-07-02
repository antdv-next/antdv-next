<script lang="ts" setup>
import type { Frontmatter } from '@/composables/doc-page.ts'
import {
  BugOutlined,
  EditOutlined,
  FileTextOutlined,
  GithubOutlined,
  HistoryOutlined,
  IssuesCloseOutlined,
  LoadingOutlined,
} from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useIssueCount } from '@/composables/use-issue-count.ts'

defineOptions({ name: 'ComponentMeta' })

const props = defineProps<{
  frontmatter?: Frontmatter
}>()

const REPO = 'antdv-next/antdv-next'

const route = useRoute()

const isZhCN = computed(() => route.path.endsWith('-cn'))

const locale = computed(() => (isZhCN.value
  ? { import: '使用', copy: '复制', copied: '已复制', source: '反馈', docs: '文档', edit: '编辑此页', changelog: '更新日志', version: '版本', issueNew: '提交问题', issueOpen: '待解决' }
  : { import: 'Import', copy: 'Copy', copied: 'Copied', source: 'GitHub', docs: 'Docs', edit: 'Edit this page', changelog: 'Changelog', version: 'Version', issueNew: 'Issue', issueOpen: 'Open issues' }))

// docs folder slug, e.g. `/components/date-picker-cn` -> `date-picker`
const slug = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? ''
  return last.replace(/-cn$/, '')
})

const component = computed(() => props.frontmatter?.title)
const version = computed(() => props.frontmatter?.tag)

// Some pages don't map 1:1 to a single named export or source directory, so
// override the import snippet / source path for those (keyed by docs slug).
const IMPORT_OVERRIDES: Record<string, string> = {
  icon: `import { AntDesignOutlined } from '@antdv-next/icons'`,
  grid: `import { Row, Col } from 'antdv-next'`,
  message: `import { message } from 'antdv-next'`,
  notification: `import { notification } from 'antdv-next'`,
}
const SOURCE_OVERRIDES: Record<string, { repo?: string, dir: string }> = {
  'qr-code': { dir: 'qrcode' },
  'icon': { repo: 'antdv-next/icons', dir: 'src' },
}

const show = computed(() =>
  props.frontmatter?.category === 'Components'
  && props.frontmatter?.showImport !== false
  && !!component.value
  && !!slug.value)

const importCode = computed(() =>
  IMPORT_OVERRIDES[slug.value] ?? `import { ${component.value} } from 'antdv-next'`)

const sourceRepo = computed(() => SOURCE_OVERRIDES[slug.value]?.repo ?? REPO)
const sourcePath = computed(() => {
  const override = SOURCE_OVERRIDES[slug.value]
  if (override) {
    return override.repo ? override.dir : `packages/antdv-next/src/${override.dir}`
  }
  return `packages/antdv-next/src/${slug.value}`
})
const sourceUrl = computed(() => `https://github.com/${sourceRepo.value}/tree/main/${sourcePath.value}`)
const abbrSource = computed(() => sourceRepo.value === REPO ? sourcePath.value : sourceRepo.value)
const editUrl = computed(() =>
  `https://github.com/${REPO}/edit/main/docs/src/pages/components/${slug.value}/index.${isZhCN.value ? 'zh-CN' : 'en-US'}.md`)
const llmsUrl = computed(() => `/components/${slug.value}${isZhCN.value ? '-cn' : ''}.md`)
const changelogUrl = computed(() => `/components/changelog${isZhCN.value ? '-cn' : ''}`)

const isVersion = computed(() => !!version.value && /^\d+\.\d+\.\d+$/.test(version.value))

const { issueCount, loading, issueNewUrl, issueSearchUrl } = useIssueCount({
  repo: REPO,
  enabled: () => show.value,
  titleKeywords: () => [props.frontmatter?.title, props.frontmatter?.subtitle].filter(Boolean) as string[],
})

const copied = ref(false)
async function onCopy() {
  try {
    await navigator.clipboard.writeText(importCode.value)
    copied.value = true
  }
  catch {
    copied.value = false
  }
}
function onOpenChange(open: boolean) {
  if (open) {
    copied.value = false
  }
}
</script>

<template>
  <template v-if="show">
    <a-descriptions
      size="small"
      :colon="false"
      :column="1"
      class="component-meta"
      style="margin-top: 16px"
      :styles="{ label: { paddingInlineEnd: '16px', width: '56px' } }"
    >
      <a-descriptions-item :label="locale.import">
        <a-tooltip placement="right" :title="copied ? locale.copied : locale.copy" @open-change="onOpenChange">
          <a-typography-text class="component-meta-code" style="cursor: pointer" @click="onCopy">
            {{ importCode }}
          </a-typography-text>
        </a-tooltip>
      </a-descriptions-item>

      <a-descriptions-item :label="locale.source">
        <a-flex justify="flex-start" align="center" gap="small">
          <a-typography-link class="component-meta-code" :href="sourceUrl" target="_blank">
            <GithubOutlined class="component-meta-icon" />
            <span>{{ abbrSource }}</span>
          </a-typography-link>
          <a-typography-link class="component-meta-code" :href="issueNewUrl" target="_blank">
            <BugOutlined class="component-meta-icon" />
            <span>{{ locale.issueNew }}</span>
          </a-typography-link>
          <a-typography-link class="component-meta-code" :href="issueSearchUrl" target="_blank">
            <IssuesCloseOutlined class="component-meta-icon" />
            <span>
              {{ locale.issueOpen }}
              <LoadingOutlined v-if="loading" />
              <template v-else-if="issueCount !== undefined">{{ issueCount }}</template>
            </span>
          </a-typography-link>
        </a-flex>
      </a-descriptions-item>

      <a-descriptions-item :label="locale.docs">
        <a-flex justify="flex-start" align="center" gap="small">
          <a-typography-link class="component-meta-code" :href="editUrl" target="_blank">
            <EditOutlined class="component-meta-icon" />
            <span>{{ locale.edit }}</span>
          </a-typography-link>
          <a-typography-link class="component-meta-code" :href="llmsUrl" target="_blank" rel="noopener noreferrer">
            <FileTextOutlined class="component-meta-icon" />
            <span>LLMs.md</span>
          </a-typography-link>
          <router-link class="component-meta-code" :to="changelogUrl">
            <HistoryOutlined class="component-meta-icon" />
            <span>{{ locale.changelog }}</span>
          </router-link>
        </a-flex>
      </a-descriptions-item>

      <a-descriptions-item v-if="isVersion" :label="locale.version">
        <a-typography-text class="component-meta-code">
          {{ isZhCN ? `自 ${version} 起支持` : `supported since ${version}` }}
        </a-typography-text>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
  </template>
</template>

<style scoped>
.component-meta :deep(.component-meta-code) {
  position: relative;
  display: inline-flex;
  align-items: center;
  column-gap: var(--ant-padding-xxs);
  border-radius: var(--ant-border-radius-sm);
  padding-inline: var(--ant-padding-xxs);
  transition: all var(--ant-motion-duration-slow);
  font-family: var(--ant-font-family-code, monospace);
  color: var(--ant-color-text-secondary);
}
.component-meta :deep(.component-meta-code:hover) {
  background: var(--ant-control-item-bg-hover);
}
.component-meta :deep(a.component-meta-code:hover) {
  text-decoration: underline;
}
.component-meta-icon {
  margin-inline-end: 4px;
}
</style>

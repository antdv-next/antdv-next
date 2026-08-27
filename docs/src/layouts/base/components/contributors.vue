<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import contributorsData from '@/assets/contributors.json'
import { useLocale } from '@/composables/use-locale'

type ContributorModule = 'components' | 'blog' | 'docs/vue'

interface ContributorData {
  logins: string[]
  components: Record<string, number[]>
  blog: Record<string, number[]>
  'docs/vue': Record<string, number[]>
}

interface Contributor {
  login: string
  url: string
  avatar: string
}

defineOptions({ name: 'Contributors' })

const { t } = useLocale()
const route = useRoute()
const data = contributorsData as ContributorData

const documentKey = computed<{ module: ContributorModule, key: string } | null>(() => {
  const routePath = route.path.replace(/-cn$/, '')
  if (routePath.startsWith('/components/')) {
    return { module: 'components', key: routePath.slice('/components/'.length) }
  }
  if (routePath.startsWith('/blog/')) {
    return { module: 'blog', key: routePath.slice('/blog/'.length) }
  }
  if (routePath.startsWith('/docs/vue/')) {
    return { module: 'docs/vue', key: routePath.slice('/docs/vue/'.length) }
  }
  return null
})

const contributors = computed<Contributor[]>(() => {
  const document = documentKey.value
  if (!document) {
    return []
  }

  const indexes = data[document.module][document.key] ?? []
  return indexes.flatMap((index) => {
    const login = data.logins[index]
    if (!login) {
      return []
    }
    return [{
      login,
      url: `https://github.com/${login}`,
      avatar: `https://github.com/${login}.png?size=24`,
    }]
  })
})
</script>

<template>
  <div v-if="contributors.length > 0" class="contributors-container">
    <div class="title">
      {{ t('layout.contributors.title') }}
    </div>
    <div class="contributors-list">
      <ul class="contributors" style="margin-left: 0; padding-left: 0;">
        <li v-for="item in contributors" :key="item.login">
          <a-tooltip :title="item.login">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">
              <a-avatar :src="item.avatar" size="small" />
            </a>
          </a-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.contributors-container {
  margin-top: 120px !important;
}

.title {
  font-size: var(--ant-font-size-sm);
  opacity: 0.5;
  margin-bottom: var(--ant-margin-xs);
}

.contributors-list {
  display: flex;
  gap: 8px;
}

.contributors-list span {
  color: var(--ant-color-primary);
}

.contributors {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  clear: both;
  flex: 1;
}

.contributors li {
  height: 24px;
}

.contributors li,
.contributors .ant-avatar + .ant-avatar {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-margin-end: -8px;
  margin-inline-end: -8px;
}

.contributors:hover li,
.contributors:hover .ant-avatar {
  -webkit-margin-end: 0;
  margin-inline-end: 0;
}

li {
  list-style: none;
}
</style>

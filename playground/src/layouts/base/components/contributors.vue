<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

interface Author {
  login?: string
  id?: number
  avatar_url?: string
  html_url?: string
}

interface Committer {
  author: {
    date: string
  }
}

interface CommitsData {
  sha: string
  node_id: string
  commit: Committer
  url: string
  html_url: string
  comments_url: string
  author: Author
  committer: object
  parents: []
}

interface ResultData {
  login?: string
  url?: string
  avatar?: string
  count?: number
}

defineOptions({ name: 'Contributors' })

const REPO_OWNER = 'antdv-next'
const REPO_NAME = 'antdv-next'
const REPO_PATH = `${REPO_OWNER}/${REPO_NAME}`

const { locale } = storeToRefs(useAppStore())
const route = useRoute()
const contributors = ref<ResultData[]>([])
const isZn = computed(() => locale.value === 'zh-CN')

function filterData(data: CommitsData[]) {
  const contributorMap = new Map<string, ResultData>()

  data.forEach((item) => {
    if (item.author?.login) {
      const login = item.author.login
      if (contributorMap.has(login)) {
        const existing = contributorMap.get(login)!
        existing.count = (existing.count || 0) + 1
      }
      else {
        contributorMap.set(login, {
          login: item.author.login,
          url: item.author.html_url,
          avatar: item.author.avatar_url,
          count: 1,
        })
      }
    }
  })
  contributors.value = Array.from(contributorMap.values())
    .sort((a, b) => (b.count || 0) - (a.count || 0))
};
async function getContributors() {
  const path = route.path
  const parts = path.split('/')
  const name = parts[2]
  if (name) {
    const componentName = name.includes('-') ? name.replace('-cn', '') : name
    const url = `https://api.github.com/repos/${REPO_PATH}/commits?path=/playground/src/pages/${parts[1]}/${componentName}`
    try {
      const req = await fetch(url)
      const res = await req.json()
      filterData(res)
    }
    catch {
      return null
    }
  }
};
watchEffect(() => {
  getContributors()
})
</script>

<template>
  <div v-if="contributors.length > 0" class="contributors-container">
    <div class="title">
      {{ isZn ? '文档贡献者' : 'contributors' }}
    </div>
    <div class="contributors-list">
      <ul class="contributors" style="margin-left: 0; padding-left: 0;">
        <li v-for="item in contributors" :key="item.login">
          <a-tooltip :title="`${item.login}`">
            <a :href="item.url" target="_blank">
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
  display: -ms-flexbox;
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

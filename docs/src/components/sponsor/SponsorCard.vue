<script setup lang="ts">
import type { Sponsor, SponsorLocale } from '@/config/sponsors'
import { HeartOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSponsorDescription, getSponsorUrl } from '@/config/sponsors'

const props = defineProps<{
  sponsor: Sponsor
  locale: SponsorLocale
}>()

const router = useRouter()
const isZh = computed(() => props.locale === 'cn')
const websiteUrl = computed(() => getSponsorUrl(props.sponsor, props.locale))
const description = computed(() => getSponsorDescription(props.sponsor, props.locale))
const isWebsiteHttps = computed(() => /^https:\/\//i.test(websiteUrl.value))
const isSponsorLinkHttps = computed(() => /^https:\/\//i.test(props.sponsor.opencollective))

function goBecomeSponsor() {
  router.push({
    path: isZh.value ? '/sponsor-cn' : '/sponsor',
    query: { tab: 'enterprise' },
  })
}
</script>

<template>
  <div class="ant-doc-sponsor-card">
    <div class="ant-doc-sponsor-card-body">
      <img
        :src="sponsor.logo"
        :alt="sponsor.name"
        class="ant-doc-sponsor-card-logo"
        draggable="false"
      >
      <div class="ant-doc-sponsor-card-info">
        <component
          :is="isSponsorLinkHttps ? 'a' : 'span'"
          v-bind="isSponsorLinkHttps ? { href: sponsor.opencollective, target: '_blank', rel: 'noreferrer' } : {}"
          class="ant-doc-sponsor-card-name"
        >
          {{ sponsor.name }}
        </component>
        <span class="ant-doc-sponsor-card-desc">
          {{ description }}
        </span>
      </div>
    </div>
    <div class="ant-doc-sponsor-card-footer">
      <span class="ant-doc-sponsor-card-label">
        <HeartOutlined class="ant-doc-sponsor-card-heart" />
        {{ isZh ? '赞助商' : 'Sponsor' }}
      </span>
      <div class="ant-doc-sponsor-card-actions">
        <a-button
          type="link"
          size="small"
          class="ant-doc-sponsor-card-become"
          @click="goBecomeSponsor"
        >
          {{ isZh ? '成为赞助商' : 'Become a sponsor' }}
        </a-button>
        <a-button
          v-if="isWebsiteHttps"
          type="link"
          size="small"
          :href="websiteUrl"
          target="_blank"
          rel="noreferrer"
          class="ant-doc-sponsor-card-visit"
        >
          {{ isZh ? '访问官网 ->' : 'Visit website ->' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ant-doc-sponsor-card {
  width: 320px;
  max-width: 320px;
}

.ant-doc-sponsor-card-body {
  display: flex;
  gap: 14px;
  margin-bottom: 12px;
}

.ant-doc-sponsor-card-logo {
  flex: none;
  width: 64px;
  height: 64px;
  padding: 8px;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 14px;
  background: var(--ant-color-fill-quaternary);
  box-sizing: border-box;
  object-fit: contain;
}

.ant-doc-sponsor-card-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.ant-doc-sponsor-card-name {
  color: var(--ant-color-text);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.ant-doc-sponsor-card-name:hover {
  color: var(--ant-color-primary);
}

.ant-doc-sponsor-card-desc {
  color: var(--ant-color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.ant-doc-sponsor-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ant-doc-sponsor-card-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ant-color-text-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.ant-doc-sponsor-card-heart {
  color: #ff4d4f;
  font-size: 12px;
}

.ant-doc-sponsor-card-actions {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.ant-doc-sponsor-card-become,
.ant-doc-sponsor-card-visit {
  height: 28px;
  padding-inline: 10px;
  font-size: 13px;
}

.ant-doc-sponsor-card-become {
  color: var(--ant-color-text-tertiary) !important;
}

.ant-doc-sponsor-card-visit {
  color: var(--ant-color-primary) !important;
}
</style>

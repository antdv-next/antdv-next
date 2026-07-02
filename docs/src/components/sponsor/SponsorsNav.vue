<script setup lang="ts">
import { computed } from 'vue'
import { useCommercialSponsors } from '@/composables/sponsors'
import { getSponsorUrl } from '@/config/sponsors'
import { useAppStore } from '@/stores/app'
import SponsorCard from './SponsorCard.vue'

const props = withDefaults(defineProps<{ variant?: 'inline' | 'drawer' }>(), {
  variant: 'inline',
})

const appStore = useAppStore()
const { headerSponsors } = useCommercialSponsors()
const sponsorLocale = computed(() => appStore.locale === 'zh-CN' ? 'cn' : 'en')
const sponsorTitle = computed(() => appStore.locale === 'zh-CN' ? '赞助商' : 'Sponsors')
</script>

<template>
  <div
    v-if="props.variant === 'drawer' && headerSponsors.length"
    class="ant-doc-sponsors-drawer"
    aria-label="Sponsors"
  >
    <div class="ant-doc-sponsors-drawer-title">
      {{ sponsorTitle }}
    </div>
    <a
      v-for="sponsor in headerSponsors"
      :key="sponsor.name"
      :href="getSponsorUrl(sponsor, sponsorLocale)"
      target="_blank"
      rel="noreferrer"
      class="ant-doc-sponsors-drawer-link"
    >
      <img
        :src="sponsor.logo"
        :alt="sponsor.name"
        class="ant-doc-sponsors-drawer-avatar"
        draggable="false"
      >
      <span class="ant-doc-sponsors-drawer-name">{{ sponsor.name }}</span>
    </a>
  </div>
  <div v-else-if="headerSponsors.length" class="ant-doc-sponsors-nav" aria-label="Sponsors">
    <a-popover
      v-for="sponsor in headerSponsors"
      :key="sponsor.name"
      placement="bottomRight"
      :trigger="['hover', 'focus']"
      :arrow="{ pointAtCenter: true }"
      destroy-on-hidden
    >
      <template #content>
        <SponsorCard :sponsor="sponsor" :locale="sponsorLocale" />
      </template>
      <a
        :href="getSponsorUrl(sponsor, sponsorLocale)"
        target="_blank"
        rel="noreferrer"
        class="ant-doc-sponsors-nav-link"
      >
        <img
          :src="sponsor.logo"
          :alt="sponsor.name"
          class="ant-doc-sponsors-nav-avatar"
          draggable="false"
        >
      </a>
    </a-popover>
  </div>
</template>

<style scoped>
.ant-doc-sponsors-nav {
  display: flex;
  align-items: center;
  margin-inline: 8px 12px;
}

.ant-doc-sponsors-nav-link {
  position: relative;
  z-index: 0;
  display: block;
  margin-inline-start: -6px;
  border: 2px solid var(--ant-color-bg-layout);
  border-radius: 50%;
}

.ant-doc-sponsors-nav-link:first-child {
  margin-inline-start: 0;
}

.ant-doc-sponsors-nav-link:hover,
.ant-doc-sponsors-nav-link:focus-within {
  z-index: 1;
}

.ant-doc-sponsors-nav-avatar {
  display: block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ant-color-bg-container);
  object-fit: contain;
  opacity: 0.5;
  transition:
    transform var(--ant-motion-duration-fast),
    opacity var(--ant-motion-duration-slow);
}

.ant-doc-sponsors-nav-link:hover .ant-doc-sponsors-nav-avatar,
.ant-doc-sponsors-nav-link:focus-within .ant-doc-sponsors-nav-avatar {
  opacity: 1;
  transform: translateY(-2px);
}

.ant-doc-sponsors-drawer {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ant-doc-sponsors-drawer-title {
  padding-inline: 4px;
  margin-bottom: 4px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
}

.ant-doc-sponsors-drawer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: var(--ant-border-radius);
  color: var(--ant-color-text);
  transition: background-color var(--ant-motion-duration-fast);
}

.ant-doc-sponsors-drawer-link:active {
  background-color: var(--ant-color-fill-tertiary);
}

.ant-doc-sponsors-drawer-avatar {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--ant-color-bg-container);
  object-fit: contain;
}

.ant-doc-sponsors-drawer-name {
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

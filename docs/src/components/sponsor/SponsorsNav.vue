<script setup lang="ts">
import { computed } from 'vue'
import { useCommercialSponsors } from '@/composables/sponsors'
import { getSponsorUrl } from '@/config/sponsors'
import { useAppStore } from '@/stores/app'
import SponsorCard from './SponsorCard.vue'

const appStore = useAppStore()
const { headerSponsors } = useCommercialSponsors()
const sponsorLocale = computed(() => appStore.locale === 'zh-CN' ? 'cn' : 'en')
</script>

<template>
  <div v-if="headerSponsors.length" class="ant-doc-sponsors-nav" aria-label="Sponsors">
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
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/mobile'
import { useCommercialSponsors } from '@/composables/sponsors'
import { getSponsorUrl } from '@/config/sponsors'
import { useAppStore } from '@/stores/app'
import SponsorCard from './SponsorCard.vue'

const appStore = useAppStore()
const { isMobile } = useMobile()
const { homeSponsors } = useCommercialSponsors()
const sponsorLocale = computed(() => appStore.locale === 'zh-CN' ? 'cn' : 'en')
const popoverTrigger = computed(() => isMobile.value ? ['click'] : ['hover', 'focus'])
</script>

<template>
  <div v-if="homeSponsors.length" class="antdv-home-banner-sponsors">
    <span v-if="!isMobile" class="antdv-home-banner-sponsors-label">Sponsors</span>
    <template v-for="(sponsor, index) in homeSponsors" :key="sponsor.name">
      <div v-if="index > 0" class="antdv-home-banner-sponsors-divider" />
      <a-popover
        placement="top"
        :trigger="popoverTrigger"
        :arrow="{ pointAtCenter: true }"
        destroy-on-hidden
      >
        <template #content>
          <SponsorCard :sponsor="sponsor" :locale="sponsorLocale" />
        </template>
        <button
          v-if="isMobile"
          type="button"
          class="antdv-home-banner-sponsor-item antdv-home-banner-sponsor-button"
          :aria-label="sponsor.name"
        >
          <img :src="sponsor.logo" :alt="sponsor.name" class="antdv-home-banner-sponsor-logo">
        </button>
        <a
          v-else
          :href="getSponsorUrl(sponsor, sponsorLocale)"
          target="_blank"
          rel="noreferrer"
          class="antdv-home-banner-sponsor-item"
        >
          <img :src="sponsor.logo" :alt="sponsor.name" class="antdv-home-banner-sponsor-logo">
          <span class="antdv-home-banner-sponsor-name">{{ sponsor.name }}</span>
        </a>
      </a-popover>
    </template>
  </div>
</template>

<style scoped>
.antdv-home-banner-sponsors {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  border-top: 1px solid var(--ant-color-border-secondary);
}

.antdv-home-banner-sponsors-label {
  margin-inline-end: 16px;
  color: var(--ant-color-text-quaternary);
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}

.antdv-home-banner-sponsor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  color: var(--ant-color-text-secondary);
  text-decoration: none;
  transition: background-color var(--ant-motion-duration-fast);
}

.antdv-home-banner-sponsor-button {
  border: 0;
  background: transparent;
  appearance: none;
  cursor: pointer;
  font: inherit;
}

.antdv-home-banner-sponsor-item:hover {
  background: var(--ant-color-fill-secondary);
}

.antdv-home-banner-sponsor-logo {
  width: 22px;
  height: 22px;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 50%;
  background: var(--ant-color-bg-container);
  object-fit: contain;
}

.antdv-home-banner-sponsor-name {
  color: var(--ant-color-text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.antdv-home-banner-sponsors-divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: var(--ant-color-border-secondary);
}
</style>

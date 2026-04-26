<script setup lang="ts">
import { useRouter } from 'vue-router'
import BannerSponsors from '@/components/sponsor/BannerSponsors.vue'
import { useLocale } from '@/composables/use-locale'
import BannerRecommends from '../banner-recommends/index.vue'
import GroupMaskLayer from './group-mask-layer.vue'
import LuminousBg from './luminous-bg.vue'

const { t } = useLocale()
const router = useRouter()
</script>

<template>
  <GroupMaskLayer>
    <div class="antdv-home-preview-banner-holder">
      <LuminousBg />

      <a-typography component="article" class="antdv-home-preview-banner-typography">
        <h1 class="antdv-home-preview-banner-title">
          Antdv Next
        </h1>
        <p class="antdv-home-preview-banner-slogan">
          {{ t('home.slogan') }}
        </p>
      </a-typography>

      <a-flex gap="middle" class="antdv-home-preview-banner-buttons">
        <a-button type="primary" size="large" @click="router.push('/components/overview')">
          {{ t('home.start') }}
        </a-button>
        <a-button href="https://github.com/antdv-next/antdv-next" size="large">
          {{ t('home.designLanguage') }}
        </a-button>
      </a-flex>

      <div class="antdv-home-preview-banner-child">
        <BannerRecommends />
      </div>

      <BannerSponsors />
    </div>
  </GroupMaskLayer>
</template>

<style scoped>
.antdv-home-preview-banner-holder {
  height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  perspective: 800px;
  transform: translateZ(1000px);
  row-gap: var(--ant-margin-xl);
}

.antdv-home-preview-banner-typography {
  text-align: center;
  position: relative;
  z-index: 1;
  padding-inline: var(--ant-padding-xl);
  text-shadow:
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container),
    0 0 4px var(--ant-color-bg-container);
}

.antdv-home-preview-banner-title {
  font-weight: 900 !important;
  font-size: calc(var(--ant-font-size-heading-1) * 2) !important;
  line-height: var(--ant-line-height-heading-1) !important;
}

.antdv-home-preview-banner-slogan {
  font-size: calc(var(--ant-font-size-lg) * 1.5) !important;
  font-weight: 400 !important;
  margin-bottom: 0 !important;
  color: var(--ant-color-text-tertiary) !important;
}

.antdv-home-preview-banner-buttons {
  position: relative;
  z-index: 1;
  margin-bottom: var(--ant-margin-xl);
}

.antdv-home-preview-banner-child {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
}

@media (max-width: 767px) {
  .antdv-home-preview-banner-holder {
    height: auto;
    min-height: 640px;
    padding: 96px 16px 48px;
    row-gap: var(--ant-margin-lg);
  }

  .antdv-home-preview-banner-typography {
    padding-inline: 0;
  }

  .antdv-home-preview-banner-title {
    font-size: 44px !important;
  }

  .antdv-home-preview-banner-slogan {
    font-size: var(--ant-font-size-lg) !important;
    line-height: 1.6 !important;
  }

  .antdv-home-preview-banner-buttons {
    margin-bottom: var(--ant-margin-lg);
  }
}
</style>

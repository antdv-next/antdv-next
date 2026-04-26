<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { enterpriseSponsors } from './enterprise-sponsors'

const appStore = useAppStore()

const isZh = computed(() => appStore.locale === 'zh-CN')

const copy = computed(() => {
  if (isZh.value) {
    return {
      badge: '企业赞助',
      title: '感谢以下企业赞助者',
      description: '企业赞助将用于 Antdv Next 的持续维护、文档建设与社区基础设施投入。',
      viewAll: '查看所有 Sponsors',
      sponsorNow: '成为企业 Sponsor',
    }
  }

  return {
    badge: 'Enterprise Sponsor',
    title: 'Thanks to our enterprise sponsors',
    description: 'Enterprise sponsorship helps sustain Antdv Next maintenance, documentation, and community infrastructure.',
    viewAll: 'View all Sponsors',
    sponsorNow: 'Become a Sponsor',
  }
})

const sponsorTierUrl = 'https://opencollective.com/ant-design/contribute/sponsors-218'
const sponsorCheckoutUrl = 'https://opencollective.com/ant-design/contribute/sponsors-218/checkout'
</script>

<template>
  <section class="enterprise-sponsors glass-card rounded-2xl p-6">
    <div class="enterprise-sponsors-header">
      <div class="enterprise-sponsors-copy">
        <span class="enterprise-sponsors-badge">{{ copy.badge }}</span>
        <h2>{{ copy.title }}</h2>
        <p>{{ copy.description }}</p>
      </div>
      <a
        class="enterprise-sponsors-tier"
        :href="sponsorTierUrl"
        target="_blank"
        rel="noreferrer"
        aria-label="OpenCollective Sponsors"
      >
        <img
          src="https://opencollective.com/ant-design/tiers/sponsors/badge.svg?label=Sponsors&color=brightgreen"
          alt="Sponsors"
        >
      </a>
    </div>

    <div class="enterprise-sponsors-list">
      <a
        v-for="item in enterpriseSponsors"
        :key="item.name"
        class="enterprise-sponsor-card"
        :href="isZh ? item.href.cn : item.href.en"
        target="_blank"
        rel="noreferrer"
      >
        <img :src="item.logo" :alt="item.name" loading="lazy">
        <span>{{ item.name }}</span>
      </a>
    </div>

    <div class="enterprise-sponsors-actions">
      <a :href="sponsorTierUrl" target="_blank" rel="noreferrer">
        {{ copy.viewAll }}
      </a>
      <a :href="sponsorCheckoutUrl" target="_blank" rel="noreferrer">
        {{ copy.sponsorNow }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.enterprise-sponsors {
  margin-bottom: 24px;
}

.enterprise-sponsors-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.enterprise-sponsors-copy {
  min-width: 0;
}

.enterprise-sponsors-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  margin-bottom: 10px;
  border: 1px solid var(--ant-color-primary-border);
  border-radius: 999px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  font-size: 12px;
  font-weight: 600;
}

.enterprise-sponsors h2 {
  margin: 0;
  color: var(--ant-color-text);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
}

.enterprise-sponsors p {
  max-width: 560px;
  margin: 8px 0 0;
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.enterprise-sponsors-tier {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
}

.enterprise-sponsors-tier img {
  display: block;
}

.enterprise-sponsors-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.enterprise-sponsor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 168px;
  padding: 20px 16px;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 14px;
  background: var(--ant-color-bg-container);
  color: var(--ant-color-text);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.enterprise-sponsor-card:hover {
  border-color: var(--ant-color-primary-border-hover);
  color: var(--ant-color-primary);
  box-shadow: 0 10px 28px rgba(22, 119, 255, 0.12);
  transform: translateY(-2px);
}

.enterprise-sponsor-card img {
  width: 96px;
  height: 96px;
  object-fit: contain;
}

.enterprise-sponsor-card span {
  max-width: 100%;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.enterprise-sponsors-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.enterprise-sponsors-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--ant-color-border);
  border-radius: 8px;
  color: var(--ant-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.enterprise-sponsors-actions a:hover {
  border-color: var(--ant-color-primary);
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
}

@media (max-width: 768px) {
  .enterprise-sponsors-header {
    flex-direction: column;
    gap: 16px;
  }

  .enterprise-sponsors-list {
    grid-template-columns: 1fr;
  }
}
</style>

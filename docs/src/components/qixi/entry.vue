<script setup lang="ts">
import { computed } from 'vue'
import { localeStore } from '@/composables/local-store'
import { isQixiToday } from '@/pages/qixi/qixi-date'

const show = isQixiToday()

const tooltip = computed(() =>
  localeStore.value.startsWith('zh') ? '七夕快乐 · 去鹊桥看看' : 'Happy Qixi · visit the bridge',
)
</script>

<template>
  <router-link v-if="show" to="/qixi" class="qixi-entry" aria-label="Qixi easter egg">
    <a-tooltip :title="tooltip" destroy-on-hidden>
      <span class="qixi-entry-star">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <defs>
            <linearGradient id="qixi-entry-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffd666" />
              <stop offset="55%" stop-color="#ff85c0" />
              <stop offset="100%" stop-color="#b37feb" />
            </linearGradient>
          </defs>
          <path
            fill="url(#qixi-entry-grad)"
            d="M12 1.8c.5 3.9 1.3 6.4 2.7 7.8 1.4 1.4 3.8 2.2 7.5 2.6-3.7.4-6.1 1.2-7.5 2.6-1.4 1.4-2.2 3.9-2.7 7.8-.5-3.9-1.3-6.4-2.7-7.8C7.9 11.4 5.5 10.6 1.8 10.2c3.7-.4 6.1-1.2 7.5-2.6 1.4-1.4 2.2-3.9 2.7-7.8Z"
          />
          <circle cx="19.4" cy="4.6" r="1.1" fill="#ffd6e7" />
          <circle cx="4.8" cy="18.6" r="0.9" fill="#adc6ff" />
        </svg>
      </span>
    </a-tooltip>
  </router-link>
</template>

<style scoped lang="less">
.qixi-entry {
  display: inline-flex;
  align-items: center;
  margin-inline-start: 6px;
  line-height: 1;
}

.qixi-entry-star {
  display: inline-flex;
  cursor: pointer;
  animation: qixi-entry-twinkle 2.2s ease-in-out infinite;
  transform-origin: center;

  &:hover {
    animation-play-state: paused;
    transform: scale(1.25) rotate(12deg);
    transition: transform 0.3s;
  }
}

@keyframes qixi-entry-twinkle {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
    filter: drop-shadow(0 0 1px rgba(255, 133, 192, 0.4));
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(255, 133, 192, 0.8));
  }
}
</style>

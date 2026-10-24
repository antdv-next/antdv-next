<script setup lang="ts">
import { computed } from 'vue'
import { isFestivalToday } from '@/composables/festival'
import { localeStore } from '@/composables/local-store'
import { CODER_DAY } from '@/pages/1024/day'

const show = isFestivalToday(CODER_DAY)

const tooltip = computed(() =>
  localeStore.value.startsWith('zh') ? '程序员节快乐 · 进来看看' : 'Happy Programmer\'s Day · come in',
)
</script>

<template>
  <router-link v-if="show" to="/1024" class="coder-entry" aria-label="1024 easter egg">
    <a-tooltip :title="tooltip" destroy-on-hidden>
      <span class="coder-entry-chip">1024<span class="coder-entry-caret">_</span></span>
    </a-tooltip>
  </router-link>
</template>

<style scoped lang="less">
.coder-entry {
  display: inline-flex;
  align-items: center;
  margin-inline-start: 8px;
  line-height: 1;
  text-decoration: none;
}

.coder-entry-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 6px 3px 7px;
  font-family: 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
  border: 1px solid rgba(66, 184, 131, 0.45);
  border-radius: 4px;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s;

  &:hover {
    color: #fff;
    background: linear-gradient(120deg, #42b883, #1677ff);
    border-color: transparent;
  }
}

.coder-entry-caret {
  margin-left: 1px;
  animation: coder-entry-blink 1s steps(1) infinite;
}

@keyframes coder-entry-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .coder-entry-caret {
    animation: none;
  }
}
</style>

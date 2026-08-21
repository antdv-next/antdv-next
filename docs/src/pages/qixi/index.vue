<script setup lang="ts">
import type { QixiScene } from './scene'
import { ArrowLeftOutlined, SendOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useComponentLocale } from '@/composables/use-locale'
import { daysUntilNextQixi, isQixiToday } from './qixi-date'
import { createQixiScene } from './scene'

const locales: Record<'cn' | 'en', Record<string, string>> = {
  cn: {
    title: '鹊桥相会',
    subtitle: '跨过银河，只为与你相见',
    desc: 'antdv-next —— 连接 Ant Design 与 Vue 的鹊桥',
    vega: '织女星 · Vega',
    altair: '牛郎星 · Altair',
    wishPlaceholder: '写下你们的七夕心愿…',
    wishSend: '放飞心愿',
    wishSuccess: '心愿已化作星灯飞向银河 ✨',
    wishSuccessPair: '{a} 与 {b} 的心愿已一同放飞 💫',
    wishEmpty: '先写下一个心愿吧',
    nameA: '你的名字',
    nameB: 'TA 的名字',
    wishCount: '已放飞 {n} 个心愿',
    today: '今夜 · 鹊桥相会',
    countdown: '距下次鹊桥相会还有 {n} 天',
    back: '返回',
    skip: '跳过',
    hint: '点击夜空，也能绽放烟花',
  },
  en: {
    title: 'When Stars Meet',
    subtitle: 'Across the Milky Way, just to meet you',
    desc: 'antdv-next — the magpie bridge between Ant Design and Vue',
    vega: 'Vega · Weaver Girl',
    altair: 'Altair · Cowherd',
    wishPlaceholder: 'Make a wish for Qixi…',
    wishSend: 'Send Wish',
    wishSuccess: 'Your wish is now a star lantern ✨',
    wishSuccessPair: 'The wish of {a} & {b} is flying together 💫',
    wishEmpty: 'Write down a wish first',
    nameA: 'Your name',
    nameB: 'Their name',
    wishCount: '{n} wishes released',
    today: 'Tonight · the magpie bridge',
    countdown: '{n} days until the stars meet again',
    back: 'Back',
    skip: 'Skip',
    hint: 'Click the night sky for fireworks',
  },
}

const { t } = useComponentLocale(locales)

const WISH_STORAGE_KEY = 'qixi-wishes'
const NAMES_STORAGE_KEY = 'qixi-names'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const scene = shallowRef<QixiScene | null>(null)
const met = ref(false)
const wishText = ref('')
const wishCount = ref(0)
const nameA = ref('')
const nameB = ref('')
let metTimer: number | undefined

const isToday = isQixiToday()
const daysLeft = daysUntilNextQixi()

const countdownText = computed(() => {
  if (isToday)
    return t('today')
  if (daysLeft != null)
    return t('countdown').replace('{n}', String(daysLeft))
  return ''
})

const wishCountText = computed(() => t('wishCount').replace('{n}', String(wishCount.value)))

function loadWishes(): { text: string, date: string }[] {
  try {
    const raw = localStorage.getItem(WISH_STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  }
  catch {
    return []
  }
}

function sendWish() {
  const text = wishText.value.trim()
  if (!text) {
    message.info(t('wishEmpty'))
    return
  }
  const a = nameA.value.trim()
  const b = nameB.value.trim()
  const wishes = loadWishes()
  wishes.push({ text, date: new Date().toISOString() })
  try {
    localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(wishes.slice(-100)))
  }
  catch {}
  wishCount.value = wishes.length
  wishText.value = ''
  scene.value?.launchWish({ a, b })
  if (a && b)
    message.success(t('wishSuccessPair').replace('{a}', a).replace('{b}', b))
  else
    message.success(t('wishSuccess'))
}

function skip() {
  scene.value?.skip()
}

onMounted(() => {
  wishCount.value = loadWishes().length
  try {
    const saved = JSON.parse(localStorage.getItem(NAMES_STORAGE_KEY) || '{}')
    nameA.value = typeof saved.a === 'string' ? saved.a : ''
    nameB.value = typeof saved.b === 'string' ? saved.b : ''
  }
  catch {}
  if (canvasRef.value) {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    scene.value = createQixiScene(canvasRef.value, {
      labels: {
        vega: t('vega'),
        altair: t('altair'),
      },
      title: t('title'),
      onMeet: () => {
        // 等星尘汇聚出标题后，DOM 标题再交叉淡入接管
        if (reducedMotion)
          met.value = true
        else
          metTimer = window.setTimeout(() => (met.value = true), 2200)
      },
    })
    scene.value.setNames(nameA.value, nameB.value)
  }
})

watch([nameA, nameB], ([a, b]) => {
  scene.value?.setNames(a, b)
  try {
    localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify({ a: a.trim(), b: b.trim() }))
  }
  catch {}
})

onBeforeUnmount(() => {
  window.clearTimeout(metTimer)
  scene.value?.destroy()
  scene.value = null
})
</script>

<template>
  <div class="qixi-page">
    <canvas ref="canvas" class="qixi-canvas" />

    <!-- 顶部操作 -->
    <div class="qixi-topbar">
      <router-link to="/" class="qixi-topbar-link">
        <a-button ghost class="qixi-ghost-btn">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          {{ t('back') }}
        </a-button>
      </router-link>
      <a-button v-if="!met" ghost class="qixi-ghost-btn" @click="skip">
        {{ t('skip') }}
      </a-button>
    </div>

    <!-- 标题（相会后浮现） -->
    <transition name="qixi-rise">
      <div v-if="met" class="qixi-title-wrap">
        <div v-if="countdownText" class="qixi-badge">
          {{ countdownText }}
        </div>
        <h1 class="qixi-title">
          {{ t('title') }}
        </h1>
        <p class="qixi-subtitle">
          {{ t('subtitle') }}
        </p>
      </div>
    </transition>

    <!-- 心愿卡片（相会后浮现） -->
    <transition name="qixi-rise">
      <div v-if="met" class="qixi-wish-card">
        <p class="qixi-desc">
          <span class="qixi-desc-vue">Vue</span>
          <span class="qixi-desc-bridge">⋯⋯🐦⋯⋯</span>
          <span class="qixi-desc-ant">Ant Design</span>
          <span class="qixi-desc-line">{{ t('desc') }}</span>
        </p>
        <div class="qixi-name-row">
          <a-input
            v-model:value="nameA"
            :placeholder="t('nameA')"
            :maxlength="12"
            class="qixi-wish-input qixi-name-input"
          />
          <span class="qixi-name-heart">❤</span>
          <a-input
            v-model:value="nameB"
            :placeholder="t('nameB')"
            :maxlength="12"
            class="qixi-wish-input qixi-name-input"
          />
        </div>
        <div class="qixi-wish-row">
          <a-input
            v-model:value="wishText"
            :placeholder="t('wishPlaceholder')"
            :maxlength="60"
            class="qixi-wish-input"
            @press-enter="sendWish"
          />
          <a-button type="primary" class="qixi-wish-btn" @click="sendWish">
            <template #icon>
              <SendOutlined />
            </template>
            {{ t('wishSend') }}
          </a-button>
        </div>
        <div class="qixi-wish-meta">
          <span v-if="wishCount > 0">{{ wishCountText }}</span>
          <span class="qixi-hint">{{ t('hint') }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
.qixi-page {
  position: fixed;
  inset: 0;
  z-index: 1100;
  overflow: hidden;
  background: #050714;
  user-select: none;
}

.qixi-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.qixi-topbar {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;

  .qixi-topbar-link {
    text-decoration: none;
  }

  .qixi-ghost-btn {
    pointer-events: auto;
    color: rgba(215, 224, 250, 0.85);
    border-color: rgba(215, 224, 250, 0.3);
    backdrop-filter: blur(4px);

    &:hover {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.6);
    }
  }
}

.qixi-title-wrap {
  position: absolute;
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 640px);
  text-align: center;
  pointer-events: none;
}

.qixi-badge {
  display: inline-block;
  padding: 3px 14px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #ffd6e7;
  border: 1px solid rgba(255, 133, 192, 0.45);
  border-radius: 999px;
  background: rgba(255, 133, 192, 0.1);
  backdrop-filter: blur(4px);
}

.qixi-title {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 700;
  letter-spacing: 0.12em;
  background: linear-gradient(100deg, #42d392 0%, #ffd6e7 45%, #ffd666 60%, #4096ff 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: qixi-shimmer 6s ease-in-out infinite;
  text-shadow: none;
}

@keyframes qixi-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.qixi-subtitle {
  margin: 10px 0 0;
  font-size: clamp(14px, 2.4vw, 18px);
  letter-spacing: 0.24em;
  color: rgba(222, 230, 252, 0.85);
}

.qixi-desc {
  margin: 0 0 14px;
  font-size: 13px;
  text-align: center;
  color: rgba(180, 192, 226, 0.75);

  .qixi-desc-line {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: rgba(170, 184, 222, 0.6);
  }

  .qixi-desc-vue {
    color: #42d392;
    font-weight: 600;
  }

  .qixi-desc-ant {
    color: #69a9ff;
    font-weight: 600;
  }

  .qixi-desc-bridge {
    margin: 0 10px;
    letter-spacing: 0.1em;
    opacity: 0.9;
  }
}

.qixi-wish-card {
  position: absolute;
  bottom: max(6vh, 32px);
  left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 480px);
  padding: 18px 20px 14px;
  border-radius: 16px;
  border: 1px solid rgba(160, 178, 230, 0.22);
  background: rgba(16, 22, 52, 0.55);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 40px rgba(5, 8, 25, 0.55);
}

.qixi-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .qixi-name-input {
    flex: 1;
  }

  .qixi-name-heart {
    flex: none;
    font-size: 14px;
    color: #ff85c0;
    animation: qixi-heartbeat 1.6s ease-in-out infinite;
  }
}

@keyframes qixi-heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.25);
  }
  40% {
    transform: scale(1);
  }
}

.qixi-wish-input {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(180, 195, 240, 0.28);
  color: #e8edfb;

  :deep(input) {
    background: transparent;
    color: #e8edfb;

    &::placeholder {
      color: rgba(180, 192, 226, 0.55);
    }
  }
}

.qixi-wish-row {
  display: flex;
  gap: 10px;

  .qixi-wish-input {
    flex: 1;
  }

  .qixi-wish-btn {
    flex: none;
    background: linear-gradient(120deg, #42b883, #1677ff);
    border: none;
    box-shadow: 0 4px 18px rgba(64, 150, 255, 0.35);
  }
}

.qixi-wish-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  font-size: 12px;
  color: rgba(170, 184, 222, 0.65);

  .qixi-hint {
    margin-left: auto;
  }
}

.qixi-rise-enter-active {
  transition:
    opacity 1.2s ease,
    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.qixi-rise-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(28px);
}

.qixi-rise-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>

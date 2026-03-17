<script setup lang="ts">
import type { Frontmatter } from '@/composables/doc-page.ts'
import { WechatOutlined } from '@antdv-next/icons'
import { QRCode } from 'antdv-next'
import throttleByAnimationFrameFn from 'antdv-next/_util/throttleByAnimationFrame'
import { h, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import DocHeading from '@/components/docs/heading.vue'
import { applyRouteSeo } from '@/composables/seo.ts'
import Main from '../base/main.vue'

const route = useRoute()

const docRef = shallowRef<{
  frontmatter?: Frontmatter
}>()

const scroll = shallowRef(false)

window.addEventListener('scroll', throttleByAnimationFrameFn(() => {
  const scrollTop = document.documentElement.scrollTop
  if (scrollTop > 400) {
    scroll.value = true
  }
  else if (scrollTop <= 400) {
    scroll.value = false
  }
}))

const tooltip = {
  title: h(QRCode, {
    bordered: false,
    value: 'http://weixin.qq.com/r/mp/1iYQCM-ESZI2rYtr93PE',
  }),
  color: 'white',
  placement: 'left',
}

function setDocRef(el: any) {
  docRef.value = el
}

watch(
  () => route.fullPath,
  () => {
    docRef.value = undefined
    applyRouteSeo(route)
  },
  { immediate: true },
)

watch(
  () => docRef.value?.frontmatter,
  (frontmatter) => {
    applyRouteSeo(route, { frontmatter })
  },
  { immediate: true },
)
</script>

<template>
  <Main>
    <router-view v-slot="{ Component }">
      <DocHeading :frontmatter="docRef?.frontmatter" />
      <Suspense>
        <component :is="Component" :ref="setDocRef" />
        <template #fallback>
          <a-skeleton :paragraph="{ rows: 5 }" active />
        </template>
      </Suspense>
    </router-view>
  </Main>
  <a-float-button-group :shape="scroll ? 'square' : 'circle'">
    <a-float-button :tooltip="tooltip">
      <template #icon>
        <WechatOutlined />
      </template>
    </a-float-button>
    <a-float-back-top />
  </a-float-button-group>
</template>

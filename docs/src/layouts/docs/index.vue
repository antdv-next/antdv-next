<script setup lang="ts">
import type { Frontmatter } from '@/composables/doc-page.ts'
import { shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import DocHeading from '@/components/docs/heading.vue'
import { applyRouteSeo } from '@/composables/seo.ts'
import Main from '../base/main.vue'

const route = useRoute()

const docRef = shallowRef<{
  frontmatter?: Frontmatter
}>()

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
  <a-float-back-top />
</template>

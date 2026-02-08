<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'image', desc: t('image') },
  { name: 'cover', desc: t('cover') },
  { name: 'popup.root', desc: t('popup.root') },
  { name: 'popup.mask', desc: t('popup.mask') },
  { name: 'popup.body', desc: t('popup.body') },
  { name: 'popup.footer', desc: t('popup.footer') },
  { name: 'popup.actions', desc: t('popup.actions') },
])

const { token } = theme.useToken()
const holderRef = ref<HTMLDivElement | null>(null)

const previewItems = [
  'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
]
</script>

<template>
  <SemanticPreview
    component-name="Image"
    :padding="false"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex vertical align="center" :style="{ minHeight: '100%', width: '100%' }">
        <a-flex :style="{ padding: `${token.padding}px`, flex: 'none' }" justify="center">
          <a-image
            :width="200"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            :classes="classes"
            :preview="{ getContainer: () => holderRef! }"
          />
        </a-flex>
        <div ref="holderRef" :style="{ flex: 1, position: 'relative', minHeight: '500px', width: '100%' }">
          <a-image-preview-group
            :items="previewItems"
            :classes="classes"
            :styles="{ popup: { root: { position: 'absolute' } } }"
            :preview="{ getContainer: () => holderRef!, open: true }"
          />
        </div>
      </a-flex>
    </template>
  </SemanticPreview>
</template>

<script setup lang="ts">
import { MailOutlined } from '@antdv-next/icons'
import { computed, h, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const mode = ref<'horizontal' | 'vertical' | 'inline'>('horizontal')
const current = ref('mail')
const divRef = ref<HTMLDivElement | null>(null)

const semantics = computed(() => {
  const baseLocale = [
    { name: 'root', desc: t('root') },
    { name: 'item', desc: t('item') },
    { name: 'itemIcon', desc: t('itemIcon') },
    { name: 'itemContent', desc: t('itemContent') },
  ]
  const subMenuLocale = [
    { name: 'subMenu.itemTitle', desc: t('subMenu.itemTitle') },
    { name: 'subMenu.list', desc: t('subMenu.list') },
    { name: 'subMenu.item', desc: t('subMenu.item') },
    { name: 'subMenu.itemIcon', desc: t('subMenu.itemIcon') },
    { name: 'subMenu.itemContent', desc: t('subMenu.itemContent') },
  ]
  const groupLocale = [
    { name: 'itemTitle', desc: t('itemTitle') },
    { name: 'list', desc: t('list') },
  ]

  const additionalPopupLocale = mode.value !== 'inline' ? [{ name: 'popup', desc: t('popup') }] : []
  const additionalGroupLocale = mode.value !== 'horizontal' ? groupLocale : []

  return [...baseLocale, ...additionalGroupLocale, ...additionalPopupLocale, ...subMenuLocale]
})

const items = [
  { label: 'Navigation One', key: 'mail', icon: h(MailOutlined) },
  {
    key: 'SubMenu',
    label: 'Navigation One',
    icon: h(MailOutlined),
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1', icon: h(MailOutlined) },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
]

const groupItem = [
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
]

const itemList = computed(() => {
  return mode.value === 'horizontal' ? items : [...items, ...groupItem]
})

function onClick(e: { key: string }) {
  current.value = e.key
}
</script>

<template>
  <SemanticPreview
    component-name="Menu"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex ref="divRef" vertical gap="middle" align="center">
        <a-segmented
          :options="['horizontal', 'vertical', 'inline']"
          :value="mode"
          @change="(val: 'horizontal' | 'vertical' | 'inline') => mode = val"
        />
        <div :style="{ height: '360px' }">
          <a-menu
            :selected-keys="[current]"
            :mode="mode"
            :items="itemList"
            :styles="{
              root: { width: mode === 'horizontal' ? '310px' : '230px' },
              popup: { root: { zIndex: 1 } },
            }"
            :open-keys="['SubMenu']"
            :get-popup-container="() => divRef!"
            :classes="classes"
            @click="onClick"
          />
        </div>
      </a-flex>
    </template>
  </SemanticPreview>
</template>

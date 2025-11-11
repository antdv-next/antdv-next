<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { MailOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'

const menuTheme = ref<'dark' | 'light'>('light')
const current = ref('1')

function changeTheme(value: boolean) {
  menuTheme.value = value ? 'dark' : 'light'
}

function onClick(e: any) {
  current.value = e.key
}

const items = computed<MenuItemType[]>(() => [
  {
    key: 'sub1',
    icon: MailOutlined,
    label: 'Navigation One',
    theme: menuTheme.value,
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
    ],
  },
  { key: '5', label: 'Option 5' },
  { key: '6', label: 'Option 6' },
])
</script>

<template>
  <div>
    <a-switch
      :checked="menuTheme === 'dark'"
      checked-children="Dark"
      un-checked-children="Light"
      @change="changeTheme"
    />
    <br>
    <br>
    <a-menu
      style="width: 256px"
      :open-keys="['sub1']"
      :selected-keys="[current]"
      mode="vertical"
      theme="dark"
      :items="items"
      :get-popup-container="(node: any) => node.parentNode"
      @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { HappyProvider } from '@antdv-next/happy-work-theme'

interface Props {
  direction: ConfigProviderProps['direction']
  happy: boolean
  locale: ConfigProviderProps['locale']
  theme: ConfigProviderProps['theme']
}

defineProps<Props>()
</script>

<template>
  <a-style-provider layer>
    <HappyProvider v-slot="{ wave }" :enabled="happy">
      <a-config-provider
        :locale="locale"
        :direction="direction"
        :theme="theme"
        :wave="wave"
      >
        <a-app>
          <slot />
        </a-app>
      </a-config-provider>
    </HappyProvider>
  </a-style-provider>
</template>

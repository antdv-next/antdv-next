<script setup lang="ts">
import { Modal } from 'antdv-next'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCopyCode } from '@/components/code-demo/copy-code'
import { useLocale } from '@/composables/use-locale'
import { getChinaMainlandRedirectDecision, redirectToCnSite, setGeoRedirectPreference } from '@/utils/geo-redirect'
import BaseConfig from './layouts/base/index.vue'

useCopyCode()

const router = useRouter()
const { t } = useLocale()
const [modal, ContextModal] = Modal.useModal()

async function handleGeoRedirect() {
  const decision = await getChinaMainlandRedirectDecision()

  if (decision === 'redirect') {
    redirectToCnSite()
    return
  }

  if (decision !== 'prompt') {
    return
  }

  const confirmed = await modal.confirm({
    title: t('ui.geoRedirect.title'),
    content: t('ui.geoRedirect.content'),
    okText: t('ui.geoRedirect.okText'),
    cancelText: t('ui.geoRedirect.cancelText'),
  })

  if (confirmed) {
    setGeoRedirectPreference('accepted')
    redirectToCnSite()
    return
  }

  setGeoRedirectPreference('rejected')
}

onMounted(() => {
  void router.isReady().then(() => {
    window.setTimeout(() => {
      void handleGeoRedirect()
    }, 0)
  })
})
</script>

<template>
  <BaseConfig>
    <ContextModal />
    <router-view />
  </BaseConfig>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>

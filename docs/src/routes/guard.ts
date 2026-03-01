import type { Router } from 'vue-router'
import { applyRouteSeo } from '@/composables/seo.ts'
import { useAppStore } from '@/stores/app.ts'

export function setupRouterGuard(router: Router) {
  router.beforeEach(
    (to) => {
      // switch to CN & US
      const appStore = useAppStore()
      if (to.path.startsWith('/~demos')) {
        return true
      }
      const locale = appStore.locale
      if (locale === 'zh-CN' && !to.path.endsWith('-cn')) {
        let path = to.path
        if (path === '/' || path === '') {
          path = '/index-cn'
        }
        else {
          path = `${path}-cn`
        }
        return {
          ...to,
          replace: true,
          path,
        }
      }
      else if (locale === 'en-US' && to.path.endsWith('-cn')) {
        let path = to.path
        if (path === '/index-cn') {
          path = '/'
        }
        else {
          path = path.slice(0, path.length - 3)
        }
        return {
          ...to,
          replace: true,
          path,
        }
      }
      return true
    },
  )

  router.afterEach((to) => {
    if (!to.path.startsWith('/~demos'))
      applyRouteSeo(to)
  })
}

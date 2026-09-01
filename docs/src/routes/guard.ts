import type { Router } from 'vue-router'
import { applyRouteSeo } from '@/composables/seo.ts'
import { useAppStore } from '@/stores/app.ts'
import { toCnPathname, toEnPathname } from '@/utils/locale-path'

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
        const path = toCnPathname(to.path)
        // 注意：不能展开 ...to —— 未匹配路由命中 catch-all 后 to.name 为
        // NOT_FOUND，展开会保留 name，vue-router 解析时 name 优先于 path，
        // 导致无限重定向死循环。只保留 path/query/hash。
        return {
          path,
          replace: true,
          query: to.query,
          hash: to.hash,
        }
      }
      else if (locale === 'en-US' && to.path.endsWith('-cn')) {
        const path = toEnPathname(to.path)
        return {
          path,
          replace: true,
          query: to.query,
          hash: to.hash,
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

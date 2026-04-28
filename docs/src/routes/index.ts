import { createRouter, createWebHistory } from 'vue-router'
import componentRoutes from '@/routes/components'
import demoRoutes from '@/routes/demos'
import { pagesRoutes } from '@/routes/pages'

function waitForHashTarget(targetId: string, timeout = 5000) {
  return new Promise<HTMLElement | null>((resolve) => {
    const root = document.body ?? document.documentElement
    const getTarget = () => document.getElementById(targetId)
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof window.setTimeout> | null = null

    const resolveWithCleanup = (element: HTMLElement | null) => {
      observer?.disconnect()

      if (timer !== null) {
        window.clearTimeout(timer)
        timer = null
      }

      resolve(element)
    }

    const initialTarget = getTarget()
    if (initialTarget) {
      return resolve(initialTarget)
    }

    if (root) {
      observer = new MutationObserver(() => {
        const element = getTarget()

        if (element) {
          resolveWithCleanup(element)
        }
      })

      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id'],
      })
    }

    timer = window.setTimeout(() => {
      const element = getTarget()

      if (element) {
        return resolveWithCleanup(element)
      }

      resolveWithCleanup(null)
    }, timeout)
  })
}

export const router = createRouter({
  routes: [
    {
      path: '/root',
      name: 'ROOT_ROUTE',
      redirect: '/',
      component: () => import('@/layouts/base/root.vue'),
      children: [
        ...componentRoutes,
        ...pagesRoutes,
      ],
    },
    {
      path: '/~demos',
      redirect: '/~demos/affix-demo-basic',
      component: () => import('@/layouts/demo/index.vue'),
      children: demoRoutes,
    },
  ],
  history: createWebHistory(),
  async scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      const targetId = decodeURIComponent(to.hash.slice(1))
      const element = await waitForHashTarget(targetId)
      if (element) {
        const headerHeight = 70
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const targetTop = rect.top + scrollTop - headerHeight
        return {
          left: 0,
          top: Math.max(targetTop, headerHeight),
          behavior: 'smooth',
        }
      }
    }
    else if (savedPosition) {
      return {
        ...savedPosition,
        behavior: 'smooth',
      }
    }
    return { top: 0, left: 0 }
  },
})

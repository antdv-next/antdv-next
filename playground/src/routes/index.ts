import { createRouter, createWebHistory } from 'vue-router'
import componentRoutes from '@/routes/components'
import demoRoutes from '@/routes/demos'
import { pagesRoutes } from '@/routes/pages'

export const router = createRouter({
  routes: [
    ...componentRoutes,
    ...pagesRoutes,
    {
      path: '/~demos',
      redirect: '/~demos/affix-demo-basic',
      component: () => import('@/layouts/demo/index.vue'),
      children: demoRoutes,
    },
  ],
  history: createWebHistory(),
  async scrollBehavior(to, _from, savedPosition) {
    await new Promise(resolve => setTimeout(resolve, 0))
    if (to.hash) {
      const targetId = to.hash.slice(1)
      const element = document.getElementById(targetId)
      if (element) {
        // Scroll to the element with smooth behavior
        const headerHeight = 70
        await new Promise(resolve => setTimeout(resolve, 0))
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

import type { RouteRecordRaw } from 'vue-router'

export const pagesRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/index-cn',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/sponsor',
    component: () => import('@/pages/sponsor/index.vue'),
  },
  {
    path: '/sponsor-cn',
    component: () => import('@/pages/sponsor/index.vue'),
  },
  {
    path: '/sponsor/success',
    component: () => import('@/pages/sponsor/success.vue'),
  },
  {
    path: '/sponsor/success-cn',
    component: () => import('@/pages/sponsor/success.vue'),
  },
]

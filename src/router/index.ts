import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'activeLink',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/admin',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
        {
          path: '/media',
          name: 'media',
          component: () => import('@/views/uikit/MediaDoc.vue'),
        },
        {
          path: '/charts',
          name: 'charts',
          component: () => import('@/views/uikit/ChartDoc.vue'),
        },
        {
          path: '/crud',
          name: 'crud',
          component: () => import('@/views/pages/Crud.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/pages/Landing.vue'),
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('@/views/pages/NotFound.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/auth/Login.vue'),
    },
    {
      path: '/access',
      name: 'accessDenied',
      component: () => import('@/views/pages/auth/Access.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/pages/auth/Error.vue'),
    },
  ],
})

export default router

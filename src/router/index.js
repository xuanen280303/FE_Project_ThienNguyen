import AppLayout from '@/layout/AppLayout.vue';
import { requireAuth } from '@/middleware/authMiddleware';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'activeLink',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
    routes: [
        {
            path: '/admin',
            component: AppLayout,
            beforeEnter: requireAuth,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },

                {
                    path: 'campaign',
                    name: 'campaign',
                    component: () => import('@/views/pages/admin/campaign.vue')
                },

                {
                    path: 'permission',
                    name: 'permission',
                    component: () => import('@/views/pages/admin/permission.vue')
                },

                {
                    path: 'role',
                    name: 'role',
                    component: () => import('@/views/pages/admin/role.vue')
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('@/views/pages/admin/user.vue')
                },
                {
                    path: 'project',
                    name: 'project',
                    component: () => import('@/views/pages/admin/project.vue')
                }
            ]
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/pages/Home.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.error === 403)) {
        next({ name: 'accessDenied' });
    } else {
        next();
    }
});

export default router;

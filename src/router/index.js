import AppLayout from '@/layout/AppLayout.vue';
import { requireAuth } from '@/middleware/authMiddleware';
import { createRouter, createWebHistory } from 'vue-router';
import AppLayoutClientVue from '../layout/AppLayoutClient.vue';

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
                },
                {
                    path: 'companion',
                    name: 'companion',
                    component: () => import('@/views/pages/admin/companion.vue')
                },
                {
                    path: 'organization',
                    name: 'organization',
                    component: () => import('@/views/pages/admin/organization.vue')
                },
                {
                    path: 'notification',
                    name: 'notification',
                    component: () => import('@/views/pages/admin/notification.vue')
                },
                {
                    path: 'letter',
                    name: 'letter',
                    component: () => import('@/views/pages/admin/letter.vue')
                }
            ]
        },
        {
            path: '/',
            component: AppLayoutClientVue,
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: () => import('@/views/pages/client/index.vue')
                },
                {
                    path: 'category/:id',
                    name: 'categoryById',
                    component: () => import('@/views/pages/client/Category.vue')
                },
                {
                    path: 'category',
                    name: 'category',
                    component: () => import('@/views/pages/client/Category.vue')
                },
                {
                    path: 'detail/:id',
                    name: 'detail',
                    component: () => import('@/views/pages/client/Detail.vue')
                },
                {
                    path: 'info-donate/:id',
                    name: 'infoDonate',
                    component: () => import('@/views/pages/client/InfoDonate.vue')
                },
                {
                    path: 'detail/companions/:id',
                    name: 'detailCompanions',
                    component: () => import('@/views/pages/client/Companions.vue')
                },
                {
                    path: 'manager',
                    name: 'manager',
                    component: () => import('@/views/pages/client/Manager.vue')
                },
                {
                    path: 'manager-account',
                    name: 'managerAccount',
                    component: () => import('@/views/pages/client/managerAccount.vue')
                }
            ]
        },
        {
            path: '/success/:id',
            name: 'success',
            component: () => import('@/views/pages/client/success.vue')
        },
        {
            path: '/cancel/:id',
            name: 'cancel',
            component: () => import('@/views/pages/client/cancel.vue')
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
            path: '/signup',
            name: 'signup',
            component: () => import('@/views/pages/auth/Signup.vue')
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

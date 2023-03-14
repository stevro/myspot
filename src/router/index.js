import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/user";
import {useAuthenticationStore} from "@/stores/auth";
import {nextTick} from 'vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: 'dashboard',
            component: () => import('@/layouts/AuthenticatedLayout.vue'),
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Dashboard',
                    }

                },
                {
                    path: '/event/new',
                    name: 'new-event',
                    component: () => import('@/views/NewEvent.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'New event',
                    }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/Profile.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Profile',
                    }

                },
            ],

        },
        {
            path: '/',
            component: () => import('@/layouts/PublicLayout.vue'),
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: () => import('@/views/Login.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Login',
                    }

                },
                {
                    path: '/terms-of-service',
                    name: 'terms-of-service',
                    component: () => import('@/views/TermsOfService.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Terms of service',
                    }

                },
                {
                    path: '/privacy-policy',
                    name: 'privacy-policy',
                    component: () => import('@/views/PrivacyPolicy.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Privacy policy',
                    }

                },
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {

        const userStore = useUserStore()
        const authStore = useAuthenticationStore()
        if (userStore.profileLoaded && authStore.loggedIn) next()
        else next('/login')
    } else {
        next()
    }
})

router.afterEach((to) => {
    nextTick(() => {
        document.title = to.meta.title || import.meta.env.VITE_APP_DEFAULT_TITLE;
        document.getElementById('pageTitle').textContent = to.meta.title || import.meta.env.VITE_APP_DEFAULT_TITLE;
    });
});

export default router

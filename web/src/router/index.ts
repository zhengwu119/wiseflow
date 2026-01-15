import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Feed from '../pages/Feed.vue'
import TaskList from '../pages/Tasks/TaskList.vue'
import Settings from '../pages/Settings.vue'
import User from '../pages/User.vue'
import Guide from '../pages/Guide.vue'
import Login from '../pages/Login.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: Layout,
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', component: Dashboard, name: 'Dashboard' },
            { path: 'feed', component: Feed, name: 'Feed' },
            { path: 'tasks', component: TaskList, name: 'Tasks' },
            { path: 'settings', component: Settings, name: 'Settings' },
            { path: 'user', component: User, name: 'User' },
            { path: 'guide', component: Guide, name: 'Guide' },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard for authentication
router.beforeEach(async (to, _from, next) => {
    const { useAuthStore } = await import('../stores/authStore')
    const authStore = useAuthStore()

    // Initialize auth on first load
    if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
        await authStore.initializeAuth()
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

    if (requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        // Redirect to dashboard if already authenticated
        next({ name: 'Dashboard' })
    } else {
        next()
    }
})

export default router

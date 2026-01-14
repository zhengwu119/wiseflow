import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Feed from '../pages/Feed.vue'
import TaskList from '../pages/Tasks/TaskList.vue'
import Settings from '../pages/Settings.vue'
import User from '../pages/User.vue'
import Guide from '../pages/Guide.vue'

const routes = [
    {
        path: '/',
        component: Layout,
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

export default router

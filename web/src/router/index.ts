import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Feed from '../pages/Feed.vue'
import TaskList from '../pages/Tasks/TaskList.vue'
import Settings from '../pages/Settings.vue'

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
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

<script setup lang="ts">
import { Bell, Moon, Sun, LogOut } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
import { useWsStore } from '../../stores/wsStore'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const wsStore = useWsStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

// Get user display name
const getUserName = () => {
    return authStore.user?.name || authStore.user?.email || 'User'
}

const getUserEmail = () => {
    return authStore.user?.email || ''
}

const getAvatarUrl = () => {
    const name = getUserName().replace(/\s+/g, '+')
    return `https://ui-avatars.com/api/?name=${name}&background=52c41a&color=fff`
}
</script>

<template>
  <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
    <!-- Left: Status/Breadcrumb (Optional) -->
    <div class="flex items-center">
        <div class="flex items-center space-x-2 px-3 py-1 rounded-full border transition-colors duration-300"
             :class="wsStore.isConnected ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'">
            <div class="relative flex h-2.5 w-2.5">
              <span v-if="wsStore.isConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="wsStore.isConnected ? 'bg-green-500' : 'bg-red-500'"></span>
            </div>
            <span class="text-xs font-medium" :class="wsStore.isConnected ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                {{ wsStore.isConnected ? '已连接' : '未连接' }}
            </span>
        </div>
    </div>

    <!-- Right: Actions & User -->
    <div class="flex items-center space-x-4">
        <!-- Language Switch -->
        <button class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            EN / 中文
        </button>

        <!-- Dark Mode Toggle -->
        <button @click="toggleDark()" class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
        </button>

        <!-- Notifications -->
        <button class="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
        </button>

        <!-- User Profile -->
        <div class="flex items-center pl-4 border-l border-gray-100 dark:border-gray-700">
            <img class="h-8 w-8 rounded-full bg-gray-200" :src="getAvatarUrl()" alt="" />
            <div class="ml-3 hidden md:block">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getUserName() }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ getUserEmail() }}</p>
            </div>
        </div>

        <!-- Logout Button -->
        <button
            @click="handleLogout"
            class="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="退出登录"
        >
            <LogOut class="w-4 h-4" />
            <span class="hidden md:inline">退出</span>
        </button>
    </div>
  </header>
</template>

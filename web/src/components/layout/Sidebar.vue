<script setup lang="ts">
import { 
  LayoutDashboard, 
  Newspaper, 
  ListTodo, 
  Settings, 
  User, 
  HelpCircle,
  Cpu,
  Database,
  Shield
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: '控制台', path: '/dashboard', icon: LayoutDashboard },
  { name: '最新内容', path: '/feed', icon: Newspaper },
  { name: '任务中心', path: '/tasks', icon: ListTodo },
  { name: '代理配置', path: '/settings?tab=2', icon: Shield },
  { name: '备用信息', path: '/settings?tab=3', icon: Database },
  { name: '系统配置', path: '/settings?tab=0', icon: Settings },
  { name: '用户中心', path: '/user', icon: User },
  { name: '使用指南', path: '/guide', icon: HelpCircle },
]
</script>

<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-all duration-300">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
         <span class="text-white font-bold text-xl">AI</span>
      </div>
      <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">AI情报系统 <span class="text-xs ml-1 text-primary bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded-full">Alpha</span></h1>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        :class="[
          (route.fullPath === item.path) || (item.path !== '/' && !!item.path && route.path.startsWith(item.path.split('?')[0] || '') && !item.path.includes('?'))
            ? 'bg-green-50 text-primary dark:bg-green-900/20 dark:text-green-400' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" :class="route.path.startsWith(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Bottom Status -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
        <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 flex items-center justify-between">
            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Cpu class="w-4 h-4 mr-2" />
                <span>计算额度</span>
            </div>
            <span class="font-mono text-sm font-bold text-primary">39,219</span>
        </div>
    </div>
  </aside>
</template>

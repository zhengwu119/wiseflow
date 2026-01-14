<script setup lang="ts">
import { User, Settings, Bell, Shield } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">用户中心</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">管理您的账户信息和偏好设置。</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile Card -->
      <Card class="p-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">默认用户</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">本地用户</p>
          </div>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">用户类型</span>
            <span class="text-gray-900 dark:text-gray-100">管理员</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">创建时间</span>
            <span class="text-gray-900 dark:text-gray-100">--</span>
          </div>
        </div>
      </Card>

      <!-- Preferences Card -->
      <Card class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <Settings class="w-5 h-5 text-gray-400" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">偏好设置</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Bell class="w-4 h-4 text-gray-400" />
              <span class="text-sm text-gray-700 dark:text-gray-300">通知提醒</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Shield class="w-4 h-4 text-gray-400" />
              <span class="text-sm text-gray-700 dark:text-gray-300">安全模式</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>

    <!-- Info Notice -->
    <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
      <p class="text-sm text-blue-700 dark:text-blue-300">
        WiseFlow 当前版本为本地部署模式，用户数据存储在本地数据库中。
        如需多用户支持或云端同步功能，请关注后续版本更新。
      </p>
    </div>
  </div>
</template>

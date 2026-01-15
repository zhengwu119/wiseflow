<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button.vue'
import { Lock, Mail, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showError = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    showError.value = false
    errorMessage.value = ''

    if (!email.value || !password.value) {
        showError.value = true
        errorMessage.value = '请输入邮箱和密码'
        return
    }

    const success = await authStore.login(email.value, password.value)

    if (success) {
        router.push('/dashboard')
    } else {
        showError.value = true
        errorMessage.value = authStore.error || '登录失败'
    }
}

const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleLogin()
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <!-- Main Content -->
        <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <!-- Logo & Title -->
                <div class="text-center">
                    <div class="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h1 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        信永中和AI情报系统
                    </h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        智能信息采集与分析平台
                    </p>
                </div>

                <!-- Login Form -->
                <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <!-- Error Message -->
                        <div v-if="showError" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                            <AlertCircle class="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
                        </div>

                        <!-- Email Input -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                邮箱地址
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail class="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    autocomplete="email"
                                    required
                                    placeholder="请输入邮箱"
                                    @keypress="handleKeyPress"
                                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <!-- Password Input -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                密码
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock class="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    v-model="password"
                                    type="password"
                                    autocomplete="current-password"
                                    required
                                    placeholder="请输入密码"
                                    @keypress="handleKeyPress"
                                    class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            :loading="authStore.loading"
                            :disabled="authStore.loading"
                            class="w-full"
                        >
                            登录
                        </Button>
                    </form>

                    <!-- Demo Account Hint -->
                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
                            测试账户: demo@shinewing.com
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="py-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
                © {{ new Date().getFullYear() }} 信永中和会计师事务所. All rights reserved.
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Powered by WiseFlow AI
            </p>
        </footer>
    </div>
</template>

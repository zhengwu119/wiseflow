import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
    email: string
    name: string
    role: string
}

interface LoginResponse {
    access_token: string
    token_type: string
    user: User
}

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || (
    window.location.hostname === 'localhost' && window.location.port === '5173'
        ? 'http://localhost:8077'
        : '/api'
)

export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(localStorage.getItem('auth_token'))
    const user = ref<User | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value)

    // Initialize user from stored token
    const initializeAuth = async () => {
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
            token.value = storedToken
            try {
                await verifyToken()
            } catch (e) {
                // Token invalid, clear it
                logout()
            }
        }
    }

    // Verify token and get user info
    const verifyToken = async (): Promise<boolean> => {
        if (!token.value) return false

        try {
            const response = await axios.get(`${API_URL}/auth/verify`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            if (response.data.success) {
                user.value = response.data.data
                return true
            } else {
                logout()
                return false
            }
        } catch (e) {
            logout()
            return false
        }
    }

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        loading.value = true
        error.value = null

        try {
            const response = await axios.post<{ success: boolean; msg: string; data: LoginResponse | null }>(
                `${API_URL}/auth/login`,
                { email, password }
            )

            if (response.data.success && response.data.data) {
                const data = response.data.data
                token.value = data.access_token
                user.value = data.user
                localStorage.setItem('auth_token', data.access_token)
                return true
            } else {
                error.value = response.data.msg || '登录失败'
                return false
            }
        } catch (e: any) {
            error.value = e.response?.data?.msg || '网络错误，请稍后重试'
            return false
        } finally {
            loading.value = false
        }
    }

    // Logout
    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
    }

    // Get authorization header
    const getAuthHeader = () => {
        if (token.value) {
            return { Authorization: `Bearer ${token.value}` }
        }
        return {}
    }

    return {
        // State
        token,
        user,
        loading,
        error,
        // Getters
        isAuthenticated,
        // Actions
        initializeAuth,
        verifyToken,
        login,
        logout,
        getAuthHeader
    }
})

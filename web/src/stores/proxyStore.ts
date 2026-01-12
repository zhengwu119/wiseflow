import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import type { LocalProxy, KDLProxy, ProxyRequest, KdlProxyRequest } from '../types/api'

export const useProxyStore = defineStore('proxies', () => {
    const localProxies = ref<LocalProxy[]>([])
    const kdlProxies = ref<KDLProxy[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchLocalProxies() {
        loading.value = true
        try {
            const res = await api.listLocalProxies()
            if (res.success) {
                localProxies.value = res.data
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function addLocalProxy(data: ProxyRequest) {
        const res = await api.addLocalProxy(data)
        if (res.success) await fetchLocalProxies()
        else throw new Error(res.msg)
    }

    async function deleteLocalProxy(id: number) {
        const res = await api.deleteLocalProxy(id)
        if (res.success) await fetchLocalProxies()
    }

    async function fetchKdlProxies() {
        loading.value = true
        try {
            const res = await api.listKdlProxies()
            if (res.success) {
                kdlProxies.value = res.data
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function addKdlProxy(data: KdlProxyRequest) {
        const res = await api.addKdlProxy(data)
        if (res.success) await fetchKdlProxies()
        else throw new Error(res.msg)
    }

    async function deleteKdlProxy(id: number) {
        const res = await api.deleteKdlProxy(id)
        if (res.success) await fetchKdlProxies()
    }

    return {
        localProxies, kdlProxies, loading, error,
        fetchLocalProxies, addLocalProxy, deleteLocalProxy,
        fetchKdlProxies, addKdlProxy, deleteKdlProxy
    }
})

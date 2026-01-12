import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import type { Config, MCBackupAccount } from '../types/api'

export const useConfigStore = defineStore('config', () => {
    const config = ref<Config>({})
    const mcAccounts = ref<MCBackupAccount[]>([])
    const loading = ref(false)

    async function fetchConfig() {
        const res = await api.listConfig()
        if (res.success) config.value = res.data
    }

    async function updateConfig(data: Config) {
        await api.updateConfig(data)
        await fetchConfig()
    }

    async function resetConfig() {
        await api.resetConfig()
        await fetchConfig()
    }

    async function fetchMcAccounts() {
        const res = await api.listMcBackupAccounts()
        if (res.success) mcAccounts.value = res.data
    }

    async function addMcAccount(data: any) {
        await api.addMcBackupAccount(data)
        await fetchMcAccounts()
    }

    async function deleteMcAccount(id: number) {
        await api.deleteMcBackupAccount(id)
        await fetchMcAccounts()
    }

    return {
        config, mcAccounts, loading,
        fetchConfig, updateConfig, resetConfig,
        fetchMcAccounts, addMcAccount, deleteMcAccount
    }
})

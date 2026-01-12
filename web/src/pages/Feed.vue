<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ExternalLink, Calendar, RefreshCw } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import Drawer from '../components/ui/Drawer.vue'
import { api } from '../services/api'
import type { Info } from '../types/api'

// State
const feedItems = ref<Info[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedItem = ref<Info | null>(null)
const showDrawer = ref(false)
const searchQuery = ref('')

// Methods
const loadFeed = async () => {
    loading.value = true
    error.value = null
    try {
        const res = await api.listInfo()
        if (res.success) {
            // listInfo returns { "focusId": [infos...], ... }
            const allInfos: Info[] = []
            Object.values(res.data).forEach((list: any) => allInfos.push(...list))
            // Sort by created desc
            allInfos.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            feedItems.value = allInfos
        } else {
            error.value = res.msg
        }
    } catch (e: any) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

const openDetail = (item: Info) => {
    selectedItem.value = item
    showDrawer.value = true
}

const formatDate = (isoString: string) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleString()
}

// Helpers
const getDomain = (url?: string) => {
    if (!url) return '未知来源'
    try {
        return new URL(url).hostname
    } catch {
        return url
    }
}

onMounted(() => {
    loadFeed()
})
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto h-full flex flex-col">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">情报流</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">实时收集并经 LLM 处理的情报信息。</p>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
         <Input v-model="searchQuery" placeholder="搜索情报..." class="w-full md:w-64" />
         <Button @click="loadFeed" :loading="loading" variant="secondary">
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
         </Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded mb-4">
        {{ error }}
    </div>

    <!-- Feed List -->
    <div class="space-y-4">
        <div v-if="feedItems.length === 0 && !loading" class="text-center py-10 text-gray-500">
            暂无情报数据，请先创建任务开始采集。
        </div>

        <Card v-for="item in feedItems" :key="item.id" class="hover:border-primary/50 transition-colors cursor-pointer group" @click="openDetail(item)">
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <Badge variant="primary">{{ getDomain(item.source_url) }}</Badge>
                    <span class="text-xs text-gray-400 flex items-center">
                        <Calendar class="w-3 h-3 mr-1" />
                        {{ formatDate(item.created) }}
                    </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                    {{ item.source_title || '无标题' }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {{ item.content }}
                </p>
                <div class="mt-3 flex gap-2" v-if="item.focus_statement">
                    <span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        目标: {{ item.focus_statement }}
                    </span>
                </div>
            </div>
        </Card>
    </div>

    <!-- Detail Drawer -->
    <Drawer :show="showDrawer" @close="showDrawer = false" title="情报详情">
        <div v-if="selectedItem" class="space-y-6">
            <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ selectedItem.source_title }}</h2>
                <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{{ getDomain(selectedItem.source_url) }}</span>
                    <span>•</span>
                    <span>{{ formatDate(selectedItem.created) }}</span>
                </div>
                <a v-if="selectedItem.source_url" :href="selectedItem.source_url" target="_blank" class="inline-flex items-center text-primary hover:text-green-600 text-sm font-medium">
                    查看原文 <ExternalLink class="w-4 h-4 ml-1" />
                </a>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <h4 class="text-sm font-bold text-green-800 dark:text-green-400 mb-2">内容摘要</h4>
                <p class="text-sm text-green-900 dark:text-green-200 leading-relaxed whitespace-pre-wrap">{{ selectedItem.content }}</p>
            </div>

            <div v-if="selectedItem.refers">
                <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">引用/参考</h4>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs font-mono text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap">
                    {{ selectedItem.refers }}
                </div>
            </div>
        </div>
    </Drawer>
  </div>
</template>

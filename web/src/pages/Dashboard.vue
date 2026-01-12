<script setup lang="ts">
import { computed } from 'vue'
import { useWsStore } from '../stores/wsStore'
import { Wifi, MessageSquare, Bell, RotateCw, Trash2, RefreshCw } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const wsStore = useWsStore()

const logs = computed(() => wsStore.logs)

const stats = computed(() => [
    { title: '连接状态', value: wsStore.isConnected ? '已连接' : '未连接', icon: Wifi, color: wsStore.isConnected ? 'text-green-500' : 'text-red-500', bg: wsStore.isConnected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20' },
    { title: '总消息数', value: wsStore.totalMessages, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: '通知消息', value: wsStore.notifyCount, icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { title: '重连次数', value: wsStore.reconnectCount + '/10', icon: RotateCw, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' },
])

const reload = () => {
    window.location.reload()
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    
    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card v-for="(stat, idx) in stats" :key="idx" class="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col items-center text-center">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{{ stat.title }}</p>
                <div class="flex items-center gap-2">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                    <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stat.value }}</span>
                </div>
            </div>
        </Card>
    </div>

    <!-- Notification Panel -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[500px] flex flex-col">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
             <div class="flex items-center gap-2">
                 <div class="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                     <Bell class="w-4 h-4" />
                 </div>
                 <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">通知面板</h2>
             </div>
             <div class="flex gap-2">
                 <Button variant="ghost" size="sm" @click="reload">
                    <RefreshCw class="w-4 h-4 mr-2" /> 重新加载
                 </Button>
                 <Button variant="ghost" size="sm" @click="wsStore.clearLogs">
                    <Trash2 class="w-4 h-4 mr-2" /> 清空
                 </Button>
             </div>
        </div>
        
        <div class="p-6 flex-1 overflow-y-auto">
             <div v-if="logs.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                 <div class="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
                     <MessageSquare class="w-8 h-8 text-gray-300 dark:text-gray-600" />
                 </div>
                 <p>暂无消息记录</p>
             </div>
             
             <div v-else class="space-y-4">
                 <div v-for="log in logs" :key="log.id" class="p-4 rounded-lg flex items-start gap-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-700" 
                      :class="log.type === 'notify' ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-gray-50/50 dark:bg-gray-800/30'">
                     <div class="mt-1">
                         <Bell v-if="log.type === 'notify'" class="w-5 h-5 text-orange-500" />
                         <MessageSquare v-else class="w-5 h-5 text-blue-500" />
                     </div>
                     <div class="flex-1">
                         <div class="flex justify-between items-start">
                             <span class="text-sm font-medium" :class="log.type === 'notify' ? 'text-orange-700 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'">
                                 {{ log.type === 'notify' ? '系统通知' : '提示' }}
                             </span>
                             <span class="text-xs text-gray-400">{{ log.timestamp }}</span>
                         </div>
                         <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ log.content }}</p>
                     </div>
                 </div>
             </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Play, Trash2, Edit2, Clock, Database, Zap, RefreshCw, FileText } from 'lucide-vue-next'
import Button from '../../components/ui/Button.vue'
import Card from '../../components/ui/Card.vue'
import Badge from '../../components/ui/Badge.vue'
import Modal from '../../components/ui/Modal.vue'
import TaskForm from './TaskForm.vue'
import { useTaskStore } from '../../stores/taskStore'
import { api } from '../../services/api'
import { useToast } from '../../composables/useToast'
import type { Task } from '../../types/api'

const toast = useToast()

const store = useTaskStore()
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTask = ref<Task | null>(null)

const openCreateModal = () => {
    showCreateModal.value = true
}

const openEditModal = (task: Task) => {
    editingTask.value = { ...task }
    showEditModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
    editingTask.value = null
}

// Run task manually
const runningTasks = ref<Set<number>>(new Set())

const runTaskNow = async (taskId: number) => {
    if (runningTasks.value.has(taskId)) return
    
    runningTasks.value.add(taskId)
    try {
        const result = await api.runTaskNow(taskId)
        if (result.success) {
            toast.success(`任务 ${taskId} 已开始执行`)
        } else {
            toast.error(`任务执行失败: ${result.msg}`)
        }
    } catch (e: any) {
        toast.error(`任务执行失败: ${e.message || '未知错误'}`)
    } finally {
        // Remove from running after a delay
        setTimeout(() => {
            runningTasks.value.delete(taskId)
        }, 3000)
    }
}

// Format schedule display
const getScheduleDisplay = (task: Task) => {
    if (task.schedule_mode === 'custom') {
        const parts = []
        if (task.custom_times && task.custom_times.length > 0) {
            parts.push(`自定义: ${task.custom_times.join(', ')}`)
        }
        if (task.interval_hours && task.interval_hours > 0) {
            parts.push(`每 ${task.interval_hours} 小时`)
        }
        return parts.length > 0 ? parts.join(' | ') : '未设置'
    } else {
        const slotNames: Record<string, string> = {
            'first': '上午',
            'second': '下午',
            'third': '晚上',
            'fourth': '凌晨'
        }
        if (task.time_slots && task.time_slots.length > 0) {
            return task.time_slots.map(s => slotNames[s] || s).join(', ')
        }
        return '未设置'
    }
}

// Format last run time
const formatLastRun = (lastRun?: string) => {
    if (!lastRun) return '从未运行'
    try {
        const date = new Date(lastRun)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 60) {
            return `${diffMins} 分钟前`
        } else if (diffHours < 24) {
            return `${diffHours} 小时前`
        } else {
            return date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }
    } catch {
        return lastRun
    }
}

// 计算平均运行时间
const getAvgRunTime = (task: Task) => {
    const runCount = task.total_run_count || 0
    const totalTime = task.total_run_time || 0
    if (runCount === 0) return '--'
    const avgSeconds = totalTime / runCount
    if (avgSeconds < 60) {
        return `${Math.round(avgSeconds)} 秒`
    } else {
        return `${(avgSeconds / 60).toFixed(1)} 分钟`
    }
}

// 计算总体平均运行时间
const overallAvgRunTime = computed(() => {
    let totalTime = 0
    let totalRuns = 0
    for (const task of store.tasks) {
        totalTime += task.total_run_time || 0
        totalRuns += task.total_run_count || 0
    }
    if (totalRuns === 0) return '--'
    const avgSeconds = totalTime / totalRuns
    if (avgSeconds < 60) {
        return `${Math.round(avgSeconds)} 秒`
    } else {
        return `${(avgSeconds / 60).toFixed(1)} 分钟`
    }
})

// 计算总抓取数据条数
const totalInfoCount = computed(() => {
    return store.tasks.reduce((sum, task) => sum + (task.total_info_count || 0), 0)
})

onMounted(() => {
    store.fetchTasks()
})
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">任务管理</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">管理数据采集指令和计划。</p>
      </div>
      <Button @click="openCreateModal">
        <Plus class="w-4 h-4 mr-2" />
        新建任务
      </Button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="p-6 flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-4">
                <Database class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">总任务数</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ store.tasks.length }}</p>
            </div>
        </Card>
        <Card class="p-6 flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-4">
                <Play class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">活跃任务</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ store.tasks.filter(t => t.activated).length }}</p>
            </div>
        </Card>
        <Card class="p-6 flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mr-4">
                <Clock class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">平均运行时间</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ overallAvgRunTime }}</p>
            </div>
        </Card>
        <Card class="p-6 flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-4">
                <FileText class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">累计抓取数据</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalInfoCount }} 条</p>
            </div>
        </Card>
    </div>

    <!-- Task Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card v-for="task in store.tasks" :key="task.id" class="p-0 hover:shadow-md transition-shadow">
        <div class="p-5">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ task.title || '无标题任务' }} <span class="text-xs text-gray-400">(ID: {{ task.id }})</span></h3>
                    <div class="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock class="w-3.5 h-3.5 mr-1" />
                        <span>{{ formatLastRun(task.last_run) }}</span>
                    </div>
                </div>
                <Badge :variant="task.activated ? 'success' : 'neutral'">
                    {{ task.activated ? '活跃' : '已暂停' }}
                </Badge>
            </div>
            
            <div class="space-y-3 mb-6">
                 <!-- Schedule Info -->
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">调度</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[200px] truncate" :title="getScheduleDisplay(task)">{{ getScheduleDisplay(task) }}</span>
                </div>
                 <!-- Stats -->
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">来源数</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ (task.search?.length || 0) + (task.sources?.length || 0) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">平均运行时间</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ getAvgRunTime(task) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">抓取数据</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ task.total_info_count || 0 }} 条</span>
                </div>
                
                <div class="flex flex-wrap gap-2">
                    <span v-for="s in task.search" :key="s" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {{ s }}
                    </span>
                     <span v-for="src in task.sources" :key="src.type" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        {{ src.type }}
                    </span>
                </div>
            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button 
                    variant="primary" 
                    size="sm" 
                    class="flex-1" 
                    @click="runTaskNow(task.id)"
                    :disabled="runningTasks.has(task.id)"
                >
                    <RefreshCw v-if="runningTasks.has(task.id)" class="w-4 h-4 mr-2 animate-spin" />
                    <Zap v-else class="w-4 h-4 mr-2" />
                    {{ runningTasks.has(task.id) ? '执行中...' : '立即运行' }}
                </Button>
                <Button variant="ghost" size="sm" @click="openEditModal(task)">
                    <Edit2 class="w-4 h-4" />
                </Button>
                 <Button variant="ghost" size="sm" class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" @click="store.deleteTask(task.id)">
                    <Trash2 class="w-4 h-4" />
                </Button>
            </div>
        </div>
      </Card>
      
      <!-- New Task Card -->
      <button @click="openCreateModal" class="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-center h-full min-h-[250px]">
        <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 text-gray-400 group-hover:text-primary transition-colors mb-4">
            <Plus class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">新建任务</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">设置新的情报采集流程。</p>
      </button>
    </div>

    <!-- Create Modal -->
    <Modal :show="showCreateModal" @close="showCreateModal = false" title="新建任务" max-width="2xl">
        <TaskForm @success="showCreateModal = false; store.fetchTasks()" @cancel="showCreateModal = false" />
    </Modal>

    <!-- Edit Modal -->
    <Modal :show="showEditModal" @close="closeEditModal" title="编辑任务" max-width="2xl">
        <TaskForm v-if="editingTask" :task="editingTask" @success="closeEditModal(); store.fetchTasks()" @cancel="closeEditModal()" />
    </Modal>

  </div>
</template>

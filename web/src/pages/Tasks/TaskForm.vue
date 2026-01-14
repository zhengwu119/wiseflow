<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Trash2, Globe, Target } from 'lucide-vue-next'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import { useTaskStore } from '../../stores/taskStore'
import type { Focus, Task } from '../../types/api'

interface Props {
  task?: Task
}

const props = defineProps<Props>()
const emit = defineEmits(['success', 'cancel'])
const store = useTaskStore()

const loading = ref(false)
const isEditMode = ref(!!props.task)

const form = reactive({
  title: '',
  schedule_mode: 'slots' as 'slots' | 'custom',
  time_slots: [] as string[],
  custom_times: [] as string[],
  interval_hours: 0,
  search: [] as string[],
  sources: [] as { type: string; detail: string[] }[],
  focuses: [] as Focus[], 
})

// Custom time input
const newCustomTime = ref('')

const platformOptions = [
  'bing', 'github', 'arxiv'
]

const timeSlotOptions = [
    { label: '上午', value: 'first' },
    { label: '下午', value: 'second' },
    { label: '晚上', value: 'third' },
    { label: '凌晨', value: 'fourth' },
]

// Monitor logic
const monitorUrls = ref<{ url: string; type: string }[]>([])

const addUrl = () => {
    monitorUrls.value.push({ url: '', type: 'web' })
}

const removeUrl = (index: number) => {
    monitorUrls.value.splice(index, 1)
}

// Focuses logic
const addFocus = () => {
    form.focuses.push({
        focuspoint: '',
        custom_schema: '',
        restrictions: '',
        explanation: '',
        role: '',
        purpose: ''
    })
}

const removeFocus = (index: number) => {
    form.focuses.splice(index, 1)
}

// Custom time management
const addCustomTime = () => {
    const time = newCustomTime.value.trim()
    if (time && /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time)) {
        if (!form.custom_times.includes(time)) {
            form.custom_times.push(time)
            // Sort times
            form.custom_times.sort()
        }
        newCustomTime.value = ''
    }
}

const removeCustomTime = (index: number) => {
    form.custom_times.splice(index, 1)
}

// Initialize form data
const initializeForm = () => {
    if (props.task) {
        form.title = props.task.title || ''
        form.schedule_mode = props.task.schedule_mode || 'slots'
        form.time_slots = [...(props.task.time_slots || [])]
        form.custom_times = [...(props.task.custom_times || [])]
        form.interval_hours = props.task.interval_hours || 0
        form.search = [...(props.task.search || [])]
        form.sources = props.task.sources ? JSON.parse(JSON.stringify(props.task.sources)) : []
        
        // Initialize focuses - handle both number IDs and Focus objects
        form.focuses = (props.task.focuses || []).map(f => {
            if (typeof f === 'number') {
                // If it's just an ID, create empty focus (shouldn't happen in edit mode)
                return {
                    id: f,
                    focuspoint: '',
                    custom_schema: '',
                    restrictions: '',
                    explanation: '',
                    role: '',
                    purpose: ''
                }
            } else {
                // Clone the Focus object
                return { ...f }
            }
        })
        
        // Convert sources to monitorUrls format
        monitorUrls.value = []
        props.task.sources?.forEach(src => {
            src.detail?.forEach(url => {
                monitorUrls.value.push({ url, type: src.type })
            })
        })
    }
}

const handleSubmit = async () => {
    loading.value = true
    
    // Transform monitorUrls to sources structure
    const sourcesMap: Record<string, string[]> = {}
    monitorUrls.value.forEach(item => {
        if (!item.url) return
        if (!sourcesMap[item.type]) {
            sourcesMap[item.type] = []
        }
        sourcesMap[item.type]!.push(item.url)
    })
    
    const sourcesPayload = Object.keys(sourcesMap).map(type => ({
        type,
        detail: sourcesMap[type] || []
    }))

    try {
        if (isEditMode.value && props.task) {
            // Update existing task
            await store.updateTask(props.task.id, {
                title: form.title,
                search: form.search,
                sources: sourcesPayload,
                focuses: form.focuses.map(f => ({ ...f })),
                schedule_mode: form.schedule_mode,
                time_slots: form.schedule_mode === 'slots' ? form.time_slots : [],
                custom_times: form.schedule_mode === 'custom' ? form.custom_times : [],
                interval_hours: form.schedule_mode === 'custom' ? form.interval_hours : 0,
                activated: true
            })
        } else {
            // Create new task
            await store.addTask({
                title: form.title,
                search: form.search,
                sources: sourcesPayload,
                focuses: form.focuses.map(f => ({ ...f })),
                schedule_mode: form.schedule_mode,
                time_slots: form.schedule_mode === 'slots' ? form.time_slots : [],
                custom_times: form.schedule_mode === 'custom' ? form.custom_times : [],
                interval_hours: form.schedule_mode === 'custom' ? form.interval_hours : 0,
                activated: true
            })
        }
        emit('success')
    } catch (e) {
        // error handled in store
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    initializeForm()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Basic Info -->
    <div>
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">基本配置</h4>
        <div class="space-y-4">
            <Input v-model="form.title" label="任务名称" placeholder="例如：人工智能趋势" />
            
            <!-- Schedule Mode Selector -->
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">运行调度模式</label>
                <div class="flex gap-4">
                    <label class="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all"
                           :class="form.schedule_mode === 'slots' 
                                   ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                                   : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                        <input type="radio" value="slots" v-model="form.schedule_mode" 
                               class="text-primary focus:ring-primary" />
                        <div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">快捷时间段</span>
                            <p class="text-xs text-gray-500 dark:text-gray-400">按固定时间段运行</p>
                        </div>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all"
                           :class="form.schedule_mode === 'custom' 
                                   ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                                   : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                        <input type="radio" value="custom" v-model="form.schedule_mode" 
                               class="text-primary focus:ring-primary" />
                        <div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">自定义调度</span>
                            <p class="text-xs text-gray-500 dark:text-gray-400">指定时间点或间隔</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <!-- Time Slots Mode -->
            <div v-if="form.schedule_mode === 'slots'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">运行时间段</label>
                <div class="flex flex-wrap gap-2">
                    <label v-for="slot in timeSlotOptions" :key="slot.value" 
                           class="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <input type="checkbox" :value="slot.value" v-model="form.time_slots" 
                               class="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span class="text-sm text-gray-700 dark:text-gray-200">{{ slot.label }}</span>
                    </label>
                </div>
            </div>
            
            <!-- Custom Mode -->
            <div v-if="form.schedule_mode === 'custom'" class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <!-- Custom Times -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">指定运行时间</label>
                    <div class="flex gap-2">
                        <input type="time" v-model="newCustomTime" 
                               class="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3 border" />
                        <Button size="sm" @click="addCustomTime" :disabled="!newCustomTime">
                            <Plus class="w-4 h-4 mr-1" /> 添加
                        </Button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span v-for="(time, index) in form.custom_times" :key="time" 
                              class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {{ time }}
                            <button @click="removeCustomTime(index)" class="hover:text-red-500 ml-1">
                                <Trash2 class="w-3 h-3" />
                            </button>
                        </span>
                        <span v-if="form.custom_times.length === 0" class="text-sm text-gray-400">
                            暂未设置指定运行时间
                        </span>
                    </div>
                </div>
                
                <!-- Interval Hours -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">间隔运行 (小时)</label>
                    <div class="flex items-center gap-2">
                        <input type="number" v-model.number="form.interval_hours" min="0" max="168" step="1"
                               placeholder="0" 
                               class="w-24 block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3 border" />
                        <span class="text-sm text-gray-500 dark:text-gray-400">小时 (0 表示不使用间隔运行)</span>
                    </div>
                    <p class="text-xs text-gray-400">设置后，任务将在上次运行后指定小时数自动执行</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Search Sources -->
    <div>
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">搜索引擎</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label v-for="platform in platformOptions" :key="platform" class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input type="checkbox" :value="platform" v-model="form.search" class="rounded border-gray-300 text-primary focus:ring-primary" />
                <span class="text-sm text-gray-700 dark:text-gray-200 capitalize">{{ platform }}</span>
            </label>
        </div>
    </div>

    <!-- 3. Direct Monitor -->
    <div>
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">定向监控 (来源)</h4>
            <Button size="sm" variant="ghost" @click="addUrl">
                <Plus class="w-3.5 h-3.5 mr-1" /> 添加链接
            </Button>
        </div>
        
        <div class="space-y-3">
            <div v-for="(item, index) in monitorUrls" :key="index" class="flex items-start gap-2">
                <div class="flex-1">
                    <Input v-model="item.url" placeholder="https://..." />
                </div>
                <div class="w-32">
                    <select v-model="item.type" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3 border">
                        <option value="web">网页</option>
                        <option value="rss">RSS</option>
                    </select>
                </div>
                <button @click="removeUrl(index)" class="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 class="w-4 h-4" />
                </button>
            </div>
            <div v-if="monitorUrls.length === 0" class="text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                <Globe class="w-8 h-8 text-gray-300 mx-auto mb-1" />
                <p class="text-xs text-gray-400">暂无定向监控链接</p>
            </div>
        </div>
    </div>

    <!-- 4. Focus Logic -->
    <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                 <div class="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                     <Target class="w-4 h-4" />
                 </div>
                 <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100">设定具体的信息提取关注点，可添加多个</h4>
            </div>
            <Button size="sm" @click="addFocus">
                <Plus class="w-4 h-4 mr-1" /> 添加关注点
            </Button>
        </div>

        <div class="space-y-6">
            <div v-for="(focus, index) in form.focuses" :key="index" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative group">
                <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <h5 class="text-sm font-semibold text-gray-900 dark:text-gray-100">关注点 {{ index + 1 }}</h5>
                    <button @click="removeFocus(index)" class="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            <span class="text-red-500 mr-0.5">*</span>关注点描述 (你想获取哪方面的信息)
                        </label>
                        <Input v-model="focus.focuspoint" placeholder="例如：美国政府最新的对华贸易政策" />
                    </div>

                     <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            自定义结构化提取 (可选)
                        </label>
                        <Input v-model="focus.custom_schema" placeholder="如：姓名 | 联系方式 | 备注" />
                        <p class="text-[10px] text-gray-400">按自定义字段提取信息。字段名称必须用 | 分隔。</p>
                    </div>

                     <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            提取限制 (可选，建议，程序将按此排除信息)
                        </label>
                        <Input v-model="focus.restrictions" placeholder="例如：发布时间三天内的" />
                    </div>

                     <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            专有名词解释 (可选)
                        </label>
                        <textarea 
                            v-model="focus.explanation"
                            rows="2"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white px-3 py-2 border"
                            placeholder="如果有专有名词或简称，请给出相关解释"
                        ></textarea>
                    </div>

                     <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            提取角色设定 (选填，提取出的信息会给谁看)
                        </label>
                        <Input v-model="focus.role" placeholder="比如：设备经销商" />
                         <p class="text-[10px] text-gray-400">有助于 LLM 更准确掌握提取角度和最终输出风格</p>
                    </div>

                     <div class="col-span-1 md:col-span-1 space-y-1">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            提取目的 (选填，提取出的信息的主要用途)
                        </label>
                        <Input v-model="focus.purpose" placeholder="比如：寻找潜在客户" />
                        <p class="text-[10px] text-gray-400">有助于 LLM 更准确掌握提取角度和最终输出风格</p>
                    </div>
                </div>
            </div>
            
             <div v-if="form.focuses.length === 0" class="text-center py-8 text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Target class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p class="text-sm">暂无关注点，请点击右上角添加</p>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button variant="secondary" @click="$emit('cancel')">取消</Button>
        <Button @click="handleSubmit" :loading="loading">{{ isEditMode ? '更新任务' : '创建任务' }}</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Cog, Globe, Shield, User, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Modal from '../components/ui/Modal.vue'
import { useConfigStore } from '../stores/configStore'
import { useProxyStore } from '../stores/proxyStore'
import type { ProxyRequest, KdlProxyRequest } from '../types/api'

// Stores
const configStore = useConfigStore()
const proxyStore = useProxyStore()

// State
const categories = [
    { name: '全局设置', icon: Cog },
    { name: '站点登录', icon: Globe },
    { name: '代理管理', icon: Shield },
    { name: '备份账户', icon: User },
]

// Proxy Modal State
const showProxyModal = ref(false)
const proxyType = ref<'local' | 'kdl'>('local')
const localForm = ref<ProxyRequest>({ ip: '', port: 0, apply_to: [] })
const kdlForm = ref<KdlProxyRequest>({ SECERT_ID: '', SIGNATURE: '', USER_NAME: '', USER_PWD: '' })

// Lifecycle
onMounted(() => {
    configStore.fetchConfig()
    configStore.fetchMcAccounts()
    proxyStore.fetchLocalProxies()
    proxyStore.fetchKdlProxies()
})

// Methods
const openProxyModal = (type: 'local' | 'kdl') => {
    proxyType.value = type
    showProxyModal.value = true
}

const submitProxy = async () => {
    try {
        if (proxyType.value === 'local') {
            await proxyStore.addLocalProxy({ ...localForm.value, port: Number(localForm.value.port) })
        } else {
            await proxyStore.addKdlProxy(kdlForm.value)
        }
        showProxyModal.value = false
        // Reset forms
        localForm.value = { ip: '', port: 0, apply_to: [] }
    } catch (e) {
        alert('添加代理失败')
    }
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">系统设置</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">配置系统行为、代理和账户。</p>
    </div>

    <TabGroup>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <TabList class="flex flex-col space-y-2">
            <Tab v-for="category in categories" as="template" :key="category.name" v-slot="{ selected }">
              <button
                :class="[
                  'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all',
                  selected
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <component :is="category.icon" class="w-5 h-5 mr-3" />
                {{ category.name }}
              </button>
            </Tab>
          </TabList>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <TabPanels>
            
            <!-- Category 1: General Config -->
            <TabPanel>
              <Card class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">全局配置</h2>
                    <Button variant="ghost" size="sm" @click="configStore.fetchConfig">
                        <RefreshCw class="w-4 h-4 mr-2" /> 刷新
                    </Button>
                </div>
                
                <div class="space-y-4">
                    <!-- Raw JSON Editor for Config (simplified) -->
                    <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                        <pre>{{ configStore.config }}</pre>
                    </div>
                    <div class="flex gap-2">
                         <Button variant="secondary" @click="configStore.resetConfig">恢复默认</Button>
                         <!-- Update implementation could be a JSON editor modal -->
                    </div>
                </div>
              </Card>
            </TabPanel>

            <!-- Category 2: Site Login (Placeholder for now, integrated logic pending) -->
            <TabPanel>
              <Card class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">站点登录管理</h2>
                <p class="text-gray-500">管理各平台的登录会话。</p>
                <!-- Existing login manager code can go here -->
              </Card>
            </TabPanel>

            <!-- Category 3: Proxies -->
            <TabPanel>
              <div class="space-y-6">
                <!-- Local Proxies -->
                <Card class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">本地代理</h3>
                        <Button size="sm" @click="openProxyModal('local')"><Plus class="w-4 h-4 mr-2"/>添加本地代理</Button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP:端口</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="p in proxyStore.localProxies" :key="p.id">
                                    <td class="px-3 py-2 text-sm">{{ p.ip }}:{{ p.port }}</td>
                                    <td class="px-3 py-2 text-sm">{{ p.user || '-' }}</td>
                                    <td class="px-3 py-2">
                                        <button class="text-red-500 hover:text-red-700" @click="proxyStore.deleteLocalProxy(p.id)">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                 <!-- KDL Proxies -->
                <Card class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">KDL 代理</h3>
                        <Button size="sm" @click="openProxyModal('kdl')"><Plus class="w-4 h-4 mr-2"/>添加 KDL 代理</Button>
                    </div>
                     <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="p in proxyStore.kdlProxies" :key="p.id">
                                    <td class="px-3 py-2 text-sm">{{ p.USER_NAME }}</td>
                                    <td class="px-3 py-2">
                                        <button class="text-red-500 hover:text-red-700" @click="proxyStore.deleteKdlProxy(p.id)">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
              </div>
            </TabPanel>

            <!-- Category 4: Backups -->
            <TabPanel>
               <Card class="p-6">
                 <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">MC 备份账户</h2>
                  <div class="text-sm text-gray-500">
                      总账户数: {{ configStore.mcAccounts.length }}
                  </div>
                  <!-- List and Add logic similar to proxies -->
               </Card>
            </TabPanel>

          </TabPanels>
        </div>
      </div>
    </TabGroup>

    <!-- Add Proxy Modal -->
    <Modal :show="showProxyModal" @close="showProxyModal = false" :title="`添加 ${proxyType === 'local' ? '本地' : 'KDL'} 代理`">
        <div class="space-y-4">
            <template v-if="proxyType === 'local'">
                <Input v-model="localForm.ip" label="IP 地址" />
                <Input v-model="localForm.port" label="端口" type="number" />
                <Input v-model="localForm.user" label="用户名 (可选)" />
                <Input v-model="localForm.password" label="密码 (可选)" type="password" />
            </template>
            <template v-else>
                <Input v-model="kdlForm.SECERT_ID" label="Secret ID" />
                <Input v-model="kdlForm.SIGNATURE" label="签名" />
                <Input v-model="kdlForm.USER_NAME" label="用户名" />
                <Input v-model="kdlForm.USER_PWD" label="密码" type="password" />
            </template>
            <div class="flex justify-end gap-2 mt-4">
                <Button variant="secondary" @click="showProxyModal = false">取消</Button>
                <Button @click="submitProxy">保存</Button>
            </div>
        </div>
    </Modal>
  </div>
</template>

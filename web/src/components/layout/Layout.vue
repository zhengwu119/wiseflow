<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useWsStore } from '../../stores/wsStore'

const wsStore = useWsStore()

onMounted(() => {
    wsStore.connect()
})
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main class="flex-1 overflow-y-auto">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

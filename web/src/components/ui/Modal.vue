<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X } from 'lucide-vue-next'

defineProps<{
  show: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>()

defineEmits(['close'])
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel 
                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
                :class="{
                    'sm:max-w-sm': maxWidth === 'sm',
                    'sm:max-w-md': maxWidth === 'md',
                    'sm:max-w-lg': maxWidth === 'lg',
                    'sm:max-w-xl': maxWidth === 'xl',
                    'sm:max-w-2xl': (!maxWidth || maxWidth === '2xl'),
                }"
            >
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  <span class="sr-only">Close</span>
                  <X class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div v-if="title" class="mb-4">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  {{ title }}
                </DialogTitle>
              </div>
              
              <slot />
              
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

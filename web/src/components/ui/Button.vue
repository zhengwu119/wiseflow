<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>()

const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-500'
    case 'outline':
      return 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    default: // primary
      return 'bg-primary text-white hover:bg-green-600 focus:ring-green-500'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs'
    case 'lg':
      return 'h-12 px-6 text-lg'
    default:
      return 'h-10 px-4 text-sm'
  }
})
</script>

<template>
  <button :class="[baseClasses, variantClasses, sizeClasses]" :disabled="disabled || loading">
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
    <slot />
  </button>
</template>

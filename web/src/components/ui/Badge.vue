<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary'
}>()

const classes = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'danger':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'primary':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
})
</script>

<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="classes">
    <slot />
  </span>
</template>

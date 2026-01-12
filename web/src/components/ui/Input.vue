<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  label?: string
  error?: string
  placeholder?: string
  type?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="type || 'text'"
      :placeholder="placeholder"
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3 border"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error }"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

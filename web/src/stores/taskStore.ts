import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import type { Task, TaskRequest, TaskUpdateRequest } from '../types/api'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchTasks() {
        loading.value = true
        try {
            const res = await api.listTasks()
            if (res.success) {
                tasks.value = res.data
            } else {
                error.value = res.msg
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function addTask(taskData: TaskRequest) {
        loading.value = true
        try {
            const res = await api.addTask(taskData)
            if (res.success) {
                await fetchTasks() // Refresh list
            } else {
                error.value = res.msg
                throw new Error(res.msg)
            }
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    async function deleteTask(id: number) {
        try {
            const res = await api.deleteTask(id)
            if (res.success) {
                tasks.value = tasks.value.filter(t => t.id !== id)
            }
        } catch (e) {
            console.error(e)
        }
    }

    async function updateTask(id: number, updates: Partial<TaskUpdateRequest>) {
        try {
            // We need the full update object, but API allows partial if backend handles it? 
            // Backend update_task expects TaskUpdateRequest fields.
            // We should ideally merge with existing task data or just send what changed if backend supports it.
            // Based on API docs, backend does "coverage write" (overwrite). 
            // So we should probably merge current task state with updates before sending.
            const current = tasks.value.find(t => t.id === id)
            if (!current) return

            // Map Task to TaskUpdateRequest
            const req: TaskUpdateRequest = {
                task_id: id,
                title: updates.title ?? current.title,
                focuses: updates.focuses ?? current.focuses,
                search: updates.search ?? current.search,
                sources: updates.sources ?? current.sources,
                activated: updates.activated ?? current.activated,
                time_slots: updates.time_slots ?? current.time_slots
            }

            const res = await api.updateTask(req)
            if (res.success) {
                await fetchTasks()
            }
        } catch (e) {
            console.error(e)
        }
    }

    return { tasks, loading, error, fetchTasks, addTask, deleteTask, updateTask }
})

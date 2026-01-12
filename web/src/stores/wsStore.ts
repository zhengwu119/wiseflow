import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LogMessage {
    id: number
    timestamp: string
    type: 'notify' | 'prompt' | 'info'
    content: string
}

export const useWsStore = defineStore('ws', () => {
    const isConnected = ref(false)
    const reconnectCount = ref(0)
    const totalMessages = ref(0)
    const notifyCount = ref(0)
    const logs = ref<LogMessage[]>([])

    let ws: WebSocket | null = null
    let pingInterval: any = null

    function connect() {
        const wsUrl = (import.meta.env.VITE_API_URL || 'ws://localhost:8077').replace('http', 'ws') + '/ws'
        ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            isConnected.value = true
            console.log('WS Connected')
            // Heartbeat
            pingInterval = setInterval(() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    // ws.send('ping') // If backend needs explicit ping
                }
            }, 30000)
        }

        ws.onmessage = (event) => {
            totalMessages.value++
            try {
                const data = JSON.parse(event.data)

                if (data.type === 'notify') {
                    notifyCount.value++
                    addLog('notify', `Notification: ${data.params?.join(' ')}`)
                } else if (data.type === 'prompt') {
                    addLog('prompt', `Prompt: ${data.params?.join(' ')}`)
                } else if (data.type === 'ping') {
                    ws?.send(JSON.stringify({ type: 'dong', ping_id: data.ping_id }))
                }
            } catch (e) {
                console.error(e)
            }
        }

        ws.onclose = () => {
            isConnected.value = false
            clearInterval(pingInterval)
            console.log('WS Closed')
            reconnectCount.value++
            setTimeout(connect, 3000)
        }

        ws.onerror = (e) => {
            console.error('WS Error', e)
            ws?.close()
        }
    }

    function addLog(type: 'notify' | 'prompt' | 'info', content: string) {
        logs.value.unshift({
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            type,
            content
        })
        // Limit logs
        if (logs.value.length > 50) logs.value.pop()
    }

    function clearLogs() {
        logs.value = []
    }

    return {
        isConnected,
        reconnectCount,
        totalMessages,
        notifyCount,
        logs,
        connect,
        clearLogs
    }
})

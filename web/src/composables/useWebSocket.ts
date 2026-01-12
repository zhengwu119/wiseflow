import { ref, onUnmounted } from 'vue'

interface WebSocketMessage {
    type: string
    [key: string]: any
}

export function useWebSocket() {
    const isConnected = ref(false)
    let ws: WebSocket | null = null
    const reconnectInterval = 3000

    // Callbacks
    const onNotify = ref<(msg: any) => void>(() => { })
    const onPrompt = ref<(msg: any) => void>(() => { })

    const connect = () => {
        const wsUrl = (import.meta.env.VITE_API_URL || 'ws://localhost:8077').replace('http', 'ws') + '/ws'
        ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            isConnected.value = true
            console.log('WS Connected')
        }

        ws.onmessage = (event) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data)

                if (data.type === 'notify') {
                    // params: [title, msg?]
                    onNotify.value(data)
                } else if (data.type === 'prompt') {
                    onPrompt.value(data)
                } else if (data.type === 'ping') {
                    ws?.send(JSON.stringify({ type: 'dong', ping_id: data.ping_id }))
                }
            } catch (e) {
                console.error('WS Parse Error', e)
            }
        }

        ws.onclose = () => {
            isConnected.value = false
            console.log('WS Closed, reconnecting...')
            setTimeout(connect, reconnectInterval)
        }

        ws.onerror = (e) => {
            console.error('WS Error', e)
        }
    }

    const send = (msg: any) => {
        if (ws && isConnected.value) {
            ws.send(JSON.stringify(msg))
        }
    }

    onUnmounted(() => {
        ws?.close()
    })

    return { isConnected, connect, send, onNotify, onPrompt }
}

import axios from 'axios'
import type {
    APIResponse, Task, TaskRequest, TaskUpdateRequest,
    ReadInfoRequest, Info, LocalProxy, KDLProxy,
    ProxyRequest, KdlProxyRequest, Config, MCBackupAccount
} from '../types/api'

// Determine base URL
// - In Docker: use '/api' prefix (nginx will proxy to backend)
// - In development: use VITE_API_URL or default to localhost:8077
const API_URL = import.meta.env.VITE_API_URL || (
    window.location.hostname === 'localhost' && window.location.port === '5173'
        ? 'http://localhost:8077'  // Dev server
        : '/api'  // Docker/production (nginx proxy)
)

const client = axios.create({
    baseURL: API_URL,
    timeout: 30000,
})

export const api = {
    // Task Management
    listTasks: () => client.get<APIResponse<Task[]>>('/list_task').then(res => res.data),

    deleteTask: (taskId: number) => client.delete<APIResponse<null>>('/del_task', { params: { task_id: taskId } }).then(res => res.data),

    readTask: (taskId: number) => client.get<APIResponse<Task>>('/read_task', { params: { task_id: taskId } }).then(res => res.data),

    addTask: (data: TaskRequest) => client.post<APIResponse<number>>('/add_task', data).then(res => res.data),

    updateTask: (data: TaskUpdateRequest) => client.put<APIResponse<number>>('/update_task', data).then(res => res.data),

    clearTaskErrors: (taskId: number) => client.get<APIResponse<any>>('/clear_task_errors', { params: { task_id: taskId } }).then(res => res.data),

    runTaskNow: (taskId: number) => client.post<APIResponse<number>>('/run_task', null, { params: { task_id: taskId } }).then(res => res.data),

    // Focus Management
    readFocus: () => client.get<APIResponse<any[]>>('/read_focus').then(res => res.data),

    // Info/Feed
    listInfo: (startTime?: string, maxItemsPerFocus: number = 0) =>
        client.get<APIResponse<Record<string, Info[]>>>('/list_info', { params: { start_time: startTime, max_items_per_focus: maxItemsPerFocus } }).then(res => res.data),

    deleteInfo: (infoId: string) => client.delete<APIResponse<null>>('/del_info', { params: { info_id: infoId } }).then(res => res.data),

    readInfo: (data: ReadInfoRequest) => client.post<APIResponse<Info[]>>('/read_info', data).then(res => res.data),

    infoStat: (focusId?: number) => client.get<APIResponse<Record<string, number>>>('/info_stat', { params: { focus_id: focusId } }).then(res => res.data),

    // Local Proxies
    listLocalProxies: () => client.get<APIResponse<LocalProxy[]>>('/list_local_proxies').then(res => res.data),

    addLocalProxy: (data: ProxyRequest) => client.post<APIResponse<number>>('/add_local_proxies', data).then(res => res.data),

    updateLocalProxy: (id: number, data: ProxyRequest) => client.put<APIResponse<number>>('/update_local_proxies', data, { params: { proxy_id: id } }).then(res => res.data),

    deleteLocalProxy: (id: number) => client.delete<APIResponse<null>>('/del_local_proxies', { params: { proxy_id: id } }).then(res => res.data),

    // KDL Proxies
    listKdlProxies: () => client.get<APIResponse<KDLProxy[]>>('/list_kdl_proxies').then(res => res.data),

    addKdlProxy: (data: KdlProxyRequest) => client.post<APIResponse<number>>('/add_kdl_proxies', data).then(res => res.data),

    updateKdlProxy: (id: number, data: KdlProxyRequest) => client.put<APIResponse<number>>('/update_kdl_proxies', data, { params: { proxy_id: id } }).then(res => res.data),

    deleteKdlProxy: (id: number) => client.delete<APIResponse<null>>('/del_kdl_proxies', { params: { proxy_id: id } }).then(res => res.data),

    // MC Backup Accounts
    listMcBackupAccounts: () => client.get<APIResponse<MCBackupAccount[]>>('/list_mc_backup_accounts').then(res => res.data),

    addMcBackupAccount: (data: any) => client.post<APIResponse<number>>('/add_mc_backup_accounts', data).then(res => res.data),

    updateMcBackupAccount: (id: number, data: any) => client.put<APIResponse<number>>('/update_mc_backup_accounts', data, { params: { account_id: id } }).then(res => res.data),

    deleteMcBackupAccount: (id: number) => client.delete<APIResponse<null>>('/del_mc_backup_accounts', { params: { account_id: id } }).then(res => res.data),

    // System Config
    listConfig: () => client.get<APIResponse<Config>>('/list_config').then(res => res.data),

    resetConfig: () => client.get<APIResponse<null>>('/reset_config').then(res => res.data),

    updateConfig: (data: Config) => client.post<APIResponse<null>>('/update_config', data).then(res => res.data),

    // WebSocket History
    getWsHistory: (limit: number = 10, offset: number = 0) => client.get<APIResponse<any[]>>('/ws_history', { params: { limit, offset } }).then(res => res.data),
}

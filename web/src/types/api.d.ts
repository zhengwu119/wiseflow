export interface APIResponse<T = any> {
    success: boolean
    msg: string
    data: T
}

export interface Focus {
    id?: number
    focuspoint: string
    custom_schema?: string
    restrictions?: string
    explanation?: string
    role?: string
    purpose?: string
}

export interface Task {
    id: number
    title?: string
    activated: boolean
    search: string[]
    sources: { type: string; detail: string[] }[]
    focuses: (number | Focus)[] // ID or Object
    schedule_mode?: 'slots' | 'custom'
    time_slots: string[]
    custom_times?: string[]
    interval_hours?: number
    last_run?: string
    status?: string
    errors?: string
    // 统计字段
    total_info_count?: number
    total_run_count?: number
    total_run_time?: number
}

export interface TaskRequest {
    focuses?: (number | Focus)[]
    search?: string[]
    sources?: { type: string; detail: string[] }[]
    activated?: boolean
    schedule_mode?: 'slots' | 'custom'
    time_slots?: string[]
    custom_times?: string[]
    interval_hours?: number
    title?: string
}

export interface TaskUpdateRequest extends TaskRequest {
    task_id: number
}

export interface Info {
    id: string
    type: string
    content: string
    focus_statement?: string
    focus_id?: number
    source_url?: string
    source_title?: string
    refers?: string
    created: string
}

export interface LocalProxy {
    id: number
    ip: string
    port: number
    user?: string
    password?: string
    apply_to: string[]
    life_time?: number
}

export interface KDLProxy {
    id: number
    SECERT_ID: string
    SIGNATURE: string
    USER_NAME: string
    USER_PWD: string
    apply_to: string[]
}

export interface MCBackupAccount {
    id: number;
    // Add fields as necessary, assuming standard ID for now
    [key: string]: any
}

export interface ProxyRequest {
    ip: string
    port: number
    user?: string
    password?: string
    apply_to?: string[]
    life_time?: number
}

export interface KdlProxyRequest {
    SECERT_ID: string
    SIGNATURE: string
    USER_NAME: string
    USER_PWD: string
    apply_to?: string[]
}

export interface ReadInfoRequest {
    focuses?: number[]
    per_focus_limit?: number
    limit?: number
    offset?: number
    start_time?: string
    end_time?: string
    source_url?: string
    info_id?: string
}

export interface Config {
    [key: string]: any
}

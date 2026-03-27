// ===========================================
// System API
// ===========================================

import type { IApiResponse, ISystemConfig, IUISetting } from '@/types'

/**
 * Get system configuration
 */
export function getSystemConfig(): Promise<ISystemConfig> {
  return Promise.resolve({
    version: '1.0.0',
    gapWhere: 'intranet',
    linkState: 'OK'
  })
}

/**
 * Get UI settings
 */
export function getUISetting(): Promise<IUISetting> {
  return Promise.resolve({
    browserTitle: 'GAP System',
    favicon: '/favicon.svg',
    copyright: '© 2024 Security Gap System',
    logo: '/logo.svg',
    systemName: '安全隔离网闸'
  })
}

/**
 * Save system configuration
 */
export function saveSystemConfig(data: Partial<ISystemConfig>): Promise<IApiResponse> {
  console.log('Save system config:', data)
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Check link state
 */
export function checkLinkState(): Promise<IApiResponse<{ state: 'OK' | 'ERROR' }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { state: Math.random() > 0.2 ? 'OK' : 'ERROR' }
  })
}

/**
 * Get system time
 */
export function getSystemTime(): Promise<IApiResponse<{ time: string }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { time: new Date().toISOString() }
  })
}

/**
 * Get system version
 */
export function getSystemVersion(): Promise<IApiResponse<{ version: string; buildTime: string }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: {
      version: '1.0.0',
      buildTime: '2024-01-01 00:00:00'
    }
  })
}

/**
 * Get system resources
 */
export function getSystemResources(): Promise<IApiResponse<{
  cpu: number
  memory: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
  uptime: number
}>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: {
      cpu: Math.floor(Math.random() * 60) + 20,
      memory: { used: 4, total: 8, percent: 50 },
      disk: { used: 150, total: 500, percent: 30 },
      uptime: 864000
    }
  })
}

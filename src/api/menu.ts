// ===========================================
// Menu API
// ===========================================

import type { IMenuConfigRaw, IApiResponse } from '@/types'

/**
 * Get menu configuration
 */
export function getMenuConfig(): Promise<IMenuConfigRaw> {
  // Return empty config to use default menus
  return Promise.resolve({})
}

/**
 * Get menu permissions for current user
 */
export function getMenuPermissions(): Promise<IApiResponse<string[]>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: ['*']
  })
}

// ===========================================
// Users API - Admin User Management
// ===========================================


import type { IApiResponse, IPaginatedResponse, IAdminUser, IAdminUserForm } from '@/types'

// Mock data for development
const mockUsers: IAdminUser[] = [
  { id: 1, username: 'admin', group: '管理员', pwdValidDays: 30, isActive: true, authType: 'super', certIssued: false, isDomainUser: false },
  { id: 2, username: 'auditor', group: '审计员', pwdValidDays: 30, isActive: true, authType: 'deputy', certIssued: false, isDomainUser: false },
  { id: 3, username: 'operator', group: '操作员', pwdValidDays: 15, isActive: false, authType: 'deputy', certIssued: true, isDomainUser: true }
]

/**
 * Get admin users list
 */
export function getAdminUsers(params: {
  page: number
  pageSize: number
}): Promise<IPaginatedResponse<IAdminUser>> {
  // Mock response
  return Promise.resolve({
    list: mockUsers,
    total: mockUsers.length,
    page: params.page,
    pageSize: params.pageSize
  })
}

/**
 * Add admin user
 */
export function addAdminUser(data: IAdminUserForm): Promise<IApiResponse> {
  const newUser: IAdminUser = {
    id: mockUsers.length + 1,
    username: data.username,
    group: data.authType === 'super' ? '管理员' : '操作员',
    pwdValidDays: 30,
    isActive: true,
    authType: data.authType,
    certIssued: false,
    isDomainUser: false
  }
  mockUsers.push(newUser)
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Update admin user
 */
export function updateAdminUser(data: IAdminUserForm): Promise<IApiResponse> {
  const index = mockUsers.findIndex(u => u.username === data.username)
  if (index > -1) {
    mockUsers[index] = {
      ...mockUsers[index],
      authType: data.authType,
      pwdValidDays: 30
    }
  }
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Delete admin user
 */
export function deleteAdminUser(id: number): Promise<IApiResponse> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index > -1) {
    mockUsers.splice(index, 1)
  }
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Toggle user active status
 */
export function toggleUserActive(id: number, isActive: boolean): Promise<IApiResponse> {
  const user = mockUsers.find(u => u.id === id)
  if (user) {
    user.isActive = isActive
  }
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Issue certificate for user
 */
export function issueUserCert(username: string): Promise<IApiResponse> {
  const user = mockUsers.find(u => u.username === username)
  if (user) {
    user.certIssued = true
  }
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Download user certificate
 */
export function downloadUserCert(username: string): Promise<Blob> {
  // Return a mock blob
  const content = `Certificate for ${username}`
  return Promise.resolve(new Blob([content], { type: 'application/x-pkcs12' }))
}

/**
 * Get auth list for user
 */
export function getAuthList(): Promise<IApiResponse<string[]>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: ['status', 'system', 'authority', 'security', 'audit', 'maintenance']
  })
}

/**
 * Get cert switch status
 */
export function getCertSwitch(): Promise<IApiResponse<{ enabled: boolean }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { enabled: false }
  })
}

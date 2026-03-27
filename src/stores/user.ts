// ===========================================
// User Store - Pinia
// ===========================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUserInfo, ILoginForm, ILoginResponse } from '@/types'
import { loginApi, logoutApi, getUserInfoApi } from '@/api/auth'
import router from '@/router'
import { useMenuStore } from './menu'

const TOKEN_KEY = 'gap_token'
const USER_KEY = 'gap_user'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
  const userInfo = ref<IUserInfo | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  )
  const permissions = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.username || '')
  const role = computed(() => userInfo.value?.role)
  const avatar = computed(() => userInfo.value?.avatar)
  const roles = computed(() => userInfo.value ? [userInfo.value.role] : [])

  // Actions

  /**
   * User login
   */
  async function login(form: ILoginForm): Promise<ILoginResponse> {
    const res = await loginApi(form)
    if (res.code === 0) {
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      permissions.value = res.data.permissions

      // Persist to localStorage
      localStorage.setItem(TOKEN_KEY, res.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.userInfo))
    }
    return res
  }

  /**
   * User logout
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.warn('Logout API error:', error)
    } finally {
      // Clear state
      token.value = ''
      userInfo.value = null
      permissions.value = []
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      // Clear menu store
      const menuStore = useMenuStore()
      menuStore.clearMenu()

      // Redirect to login
      router.push('/login')
    }
  }

  /**
   * Fetch current user info
   */
  async function fetchUserInfo() {
    if (!token.value) return

    try {
      const res = await getUserInfoApi()
      if (res.code === 0) {
        userInfo.value = res.data
        localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

  /**
   * Check if user has specific permission
   */
  function hasPermission(permission: string): boolean {
    // deepnet 和 sysadm 拥有所有权限
    if (role.value === 'deepnet' || role.value === 'sysadm') return true
    return permissions.value.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  function hasAnyPermission(perms: string[]): boolean {
    // deepnet 和 sysadm 拥有所有权限
    if (role.value === 'deepnet' || role.value === 'sysadm') return true
    return perms.some(p => permissions.value.includes(p))
  }

  /**
   * Check if user has all of the specified permissions
   */
  function hasAllPermissions(perms: string[]): boolean {
    // deepnet 和 sysadm 拥有所有权限
    if (role.value === 'deepnet' || role.value === 'sysadm') return true
    return perms.every(p => permissions.value.includes(p))
  }

  /**
   * Check if user is super admin (deepnet)
   */
  function isDeepnet(): boolean {
    return role.value === 'deepnet'
  }

  /**
   * Check if user has system-level access
   */
  function hasSystemLevelAccess(): boolean {
    return role.value === 'deepnet'
  }

  /**
   * Check if user has specific role
   */
  function hasRole(r: string): boolean {
    return userInfo.value?.role === r
  }

  /**
   * Set token manually
   */
  function setToken(t: string) {
    token.value = t
    localStorage.setItem(TOKEN_KEY, t)
  }

  /**
   * Set user info manually
   */
  function setUserInfo(info: IUserInfo) {
    userInfo.value = info
    localStorage.setItem(USER_KEY, JSON.stringify(info))
  }

  return {
    // State
    token,
    userInfo,
    permissions,
    // Getters
    isLoggedIn,
    username,
    nickname,
    role,
    avatar,
    roles,
    // Actions
    login,
    logout,
    fetchUserInfo,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isDeepnet,
    hasSystemLevelAccess,
    setToken,
    setUserInfo
  }
})

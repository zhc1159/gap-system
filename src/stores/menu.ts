// ===========================================
// Menu Store - Pinia
// ===========================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IMenuItem } from '@/types'
import { useUserStore } from './user'
import { getMenuConfig } from '@/api/menu'

// Default menu configuration
const defaultMenus: IMenuItem[] = [
  {
    id: 'status',
    path: '/status',
    name: 'status',
    icon: 'fa-eye',
    title: '状态监视',
    titleEn: 'Status Monitor',
    enabled: true,
    sort: 1,
    children: [
      {
        id: 'status-link',
        path: '/status/link',
        name: 'status-link',
        icon: 'fa-link',
        title: '链路检测',
        titleEn: 'Link Detection',
        enabled: true,
        sort: 1
      },
      {
        id: 'status-system',
        path: '/status/system',
        name: 'status-system',
        icon: 'fa-monitor',
        title: '系统状态',
        titleEn: 'System Status',
        enabled: true,
        sort: 2
      },
      {
        id: 'status-traffic',
        path: '/status/traffic',
        name: 'status-traffic',
        icon: 'fa-bar-chart',
        title: '流量统计',
        titleEn: 'Traffic Statistics',
        enabled: true,
        sort: 3
      }
    ]
  },
  {
    id: 'system',
    path: '/system',
    name: 'system',
    icon: 'fa-cogs',
    title: '系统管理',
    titleEn: 'System Management',
    enabled: true,
    sort: 2,
    children: [
      {
        id: 'system-interface',
        path: '/system/interface',
        name: 'system-interface',
        icon: 'fa-cog',
        title: '接口配置',
        titleEn: 'Interface Config',
        enabled: true,
        sort: 1
      },
      {
        id: 'system-route',
        path: '/system/route',
        name: 'system-route',
        icon: 'fa-link',
        title: '路由配置',
        titleEn: 'Route Config',
        enabled: true,
        sort: 2
      },
      {
        id: 'system-time',
        path: '/system/time',
        name: 'system-time',
        icon: 'fa-clock',
        title: '系统时间',
        titleEn: 'System Time',
        enabled: true,
        sort: 3
      }
    ]
  },
  {
    id: 'authority',
    path: '/authority',
    name: 'authority',
    icon: 'fa-users',
    title: '权限管理',
    titleEn: 'Authority Management',
    enabled: true,
    sort: 3,
    children: [
      {
        id: 'authority-users',
        path: '/authority/users',
        name: 'authority-users',
        icon: 'fa-user-plus',
        title: '管理员管理',
        titleEn: 'Admin Users',
        enabled: true,
        sort: 1
      },
      {
        id: 'authority-client',
        path: '/authority/client',
        name: 'authority-client',
        icon: 'fa-link',
        title: '客户端管理',
        titleEn: 'Client Management',
        enabled: true,
        sort: 2
      },
      {
        id: 'authority-security',
        path: '/authority/security',
        name: 'authority-security',
        icon: 'fa-shield',
        title: '安全配置',
        titleEn: 'Security Config',
        enabled: true,
        sort: 3
      }
    ]
  },
  {
    id: 'security',
    path: '/security',
    name: 'security',
    icon: 'fa-shield',
    title: '安全策略',
    titleEn: 'Security Policy',
    enabled: true,
    sort: 4,
    children: [
      {
        id: 'security-access',
        path: '/security/access',
        name: 'security-access',
        icon: 'fa-shield',
        title: '访问控制',
        titleEn: 'Access Control',
        enabled: true,
        sort: 1
      }
    ]
  },
  {
    id: 'audit',
    path: '/audit',
    name: 'audit',
    icon: 'fa-book',
    title: '审计日志',
    titleEn: 'Audit Logs',
    enabled: true,
    sort: 5,
    children: [
      {
        id: 'audit-attack',
        path: '/audit/attack',
        name: 'audit-attack',
        icon: 'fa-shield',
        title: '抗攻击日志',
        titleEn: 'Anti-Attack Logs',
        enabled: true,
        sort: 1
      },
      {
        id: 'audit-web',
        path: '/audit/web',
        name: 'audit-web',
        icon: 'fa-book',
        title: 'Web日志',
        titleEn: 'Web Logs',
        enabled: true,
        sort: 2
      },
      {
        id: 'audit-session',
        path: '/audit/session',
        name: 'audit-session',
        icon: 'fa-clock',
        title: '会话日志',
        titleEn: 'Session Logs',
        enabled: true,
        sort: 3
      },
      {
        id: 'audit-operation',
        path: '/audit/operation',
        name: 'audit-operation',
        icon: 'fa-tools',
        title: '操作日志',
        titleEn: 'Operation Logs',
        enabled: true,
        sort: 4
      }
    ]
  },
  {
    id: 'maintenance',
    path: '/maintenance',
    name: 'maintenance',
    icon: 'fa-tools',
    title: '系统维护',
    titleEn: 'System Maintenance',
    enabled: true,
    sort: 6,
    children: [
      {
        id: 'maintenance-backup',
        path: '/maintenance/backup',
        name: 'maintenance-backup',
        icon: 'fa-download',
        title: '配置备份',
        titleEn: 'Config Backup',
        enabled: true,
        sort: 1
      },
      {
        id: 'maintenance-upgrade',
        path: '/maintenance/upgrade',
        name: 'maintenance-upgrade',
        icon: 'fa-download',
        title: '系统升级',
        titleEn: 'System Upgrade',
        enabled: true,
        sort: 2
      },
      {
        id: 'maintenance-diagnose',
        path: '/maintenance/diagnose',
        name: 'maintenance-diagnose',
        icon: 'fa-tools',
        title: '诊断工具',
        titleEn: 'Diagnostic Tools',
        enabled: true,
        sort: 3
      }
    ]
  }
]

// Role-based menu filtering
// deepnet: 超级管理员 - 拥有所有权限 + 系统级权限
// sysadm: 系统管理员 - 拥有所有菜单权限
// admin: 普通管理员 - 大部分菜单权限
// auditor: 审计员 - 仅状态监视和审计日志
const roleMenuMap: Record<string, string[]> = {
  deepnet: ['*'], // 超级管理员 - 全部权限 + 系统级权限
  sysadm: ['*'],  // 系统管理员 - 全部菜单权限
  admin: ['status', 'system', 'authority', 'security', 'audit', 'maintenance'],
  auditor: ['status', 'audit']
}

// 系统级权限菜单（仅 deepnet 可访问）
export const systemLevelMenus = [
  'system-config-advanced',
  'system-cluster',
  'system-ha'
]

/**
 * 检查角色是否为超级管理员
 */
export function isSuperAdmin(role: string | undefined): boolean {
  return role === 'deepnet' || role === 'sysadm'
}

/**
 * 检查角色是否拥有全部菜单权限
 */
export function hasFullMenuAccess(role: string | undefined): boolean {
  if (!role) return false
  const allowedMenus = roleMenuMap[role] || []
  return allowedMenus.includes('*')
}

// 导出 roleMenuMap 供其他模块使用
export { roleMenuMap }

export const useMenuStore = defineStore('menu', () => {
  // State
  const menuList = ref<IMenuItem[]>([])
  const activeMenu = ref<string>('')
  const openMenus = ref<string[]>([])
  const searchKeyword = ref<string>('')
  const loading = ref<boolean>(false)

  // Getters
  const filteredMenuList = computed(() => {
    if (!searchKeyword.value) {
      return menuList.value
    }
    return filterMenuByKeyword(menuList.value, searchKeyword.value.toLowerCase())
  })

  // Filter menu by keyword
  function filterMenuByKeyword(menus: IMenuItem[], keyword: string): IMenuItem[] {
    return menus
      .map(menu => {
        const titleMatch = menu.title.toLowerCase().includes(keyword) ||
                          menu.titleEn.toLowerCase().includes(keyword)

        if (menu.children && menu.children.length > 0) {
          const filteredChildren = filterMenuByKeyword(menu.children, keyword)
          if (filteredChildren.length > 0) {
            return {
              ...menu,
              children: filteredChildren
            }
          }
        }

        return titleMatch ? menu : null
      })
      .filter((menu): menu is IMenuItem => menu !== null)
  }

  // Filter menus by role
  function filterByRole(menus: IMenuItem[], role: string): IMenuItem[] {
    const allowedMenus = roleMenuMap[role] || []

    if (allowedMenus.includes('*')) {
      return menus
    }

    return menus
      .filter(menu => allowedMenus.includes(menu.id))
      .map(menu => ({
        ...menu,
        children: menu.children?.filter(child =>
          allowedMenus.includes(child.id) || allowedMenus.includes(menu.id)
        )
      }))
  }

  // Load menu
  async function loadMenu() {
    const userStore = useUserStore()
    const role = userStore.role || 'auditor'

    try {
      loading.value = true
      let menus: IMenuItem[]

      try {
        await getMenuConfig()
        // Transform config if needed, for now use default
        menus = defaultMenus
      } catch {
        console.warn('Failed to load menu from API, using default')
        menus = defaultMenus
      }

      menuList.value = filterByRole(menus, role)
    } catch (error) {
      console.error('Load menu error:', error)
      menuList.value = filterByRole(defaultMenus, role)
    } finally {
      loading.value = false
    }
  }

  // Set active menu
  function setActiveMenu(path: string) {
    activeMenu.value = path
    const parentIds = findParentMenuIds(menuList.value, path)
    openMenus.value = parentIds
  }

  // Find parent menu IDs
  function findParentMenuIds(
    menus: IMenuItem[],
    targetPath: string,
    parents: string[] = []
  ): string[] {
    for (const menu of menus) {
      if (menu.path === targetPath) {
        return parents
      }

      if (menu.children && menu.children.length > 0) {
        const found = findParentMenuIds(menu.children, targetPath, [...parents, menu.id])
        if (found.length > 0 || menu.children.some(c => c.path === targetPath)) {
          return found.length > 0 ? found : [...parents, menu.id]
        }
      }
    }

    return []
  }

  // Clear menu
  function clearMenu() {
    menuList.value = []
    activeMenu.value = ''
    openMenus.value = []
    searchKeyword.value = ''
  }

  return {
    menuList,
    activeMenu,
    openMenus,
    searchKeyword,
    loading,
    filteredMenuList,
    loadMenu,
    setActiveMenu,
    clearMenu,
    filterByRole
  }
})

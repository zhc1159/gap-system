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
    id: 'supervise',
    path: '/supervise',
    name: 'supervise',
    icon: 'fa-desktop',
    title: '状态监控',
    titleEn: 'Supervision',
    enabled: true,
    sort: 2,
    children: [
      {
        id: 'supervise-sys-info',
        path: '/supervise/sys-info',
        name: 'supervise-sys-info',
        icon: 'fa-info-circle',
        title: '系统信息',
        titleEn: 'System Info',
        enabled: true,
        sort: 1
      },
      {
        id: 'supervise-gap-dip',
        path: '/supervise/gap-dip',
        name: 'supervise-gap-dip',
        icon: 'fa-server',
        title: '设备IP监控',
        titleEn: 'Device IP Monitor',
        enabled: true,
        sort: 2
      },
      {
        id: 'supervise-gap-file-sync',
        path: '/supervise/gap-file-sync',
        name: 'supervise-gap-file-sync',
        icon: 'fa-files-o',
        title: '文件同步监控',
        titleEn: 'File Sync Monitor',
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
    sort: 3,
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
    sort: 4,
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
    sort: 5,
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
      },
      {
        id: 'security-database',
        path: '/security/database',
        name: 'security-database',
        icon: 'fa-database',
        title: '数据库访问',
        titleEn: 'Database Access',
        enabled: true,
        sort: 2
      },
      {
        id: 'security-file',
        path: '/security/file',
        name: 'security-file',
        icon: 'fa-file',
        title: '文件访问',
        titleEn: 'File Access',
        enabled: true,
        sort: 3
      }
    ]
  },
  {
    id: 'transparentRule',
    path: '/transparentRule',
    name: 'transparentRule',
    icon: 'fa-filter',
    title: '透明规则',
    titleEn: 'Transparent Rules',
    enabled: true,
    sort: 6,
    children: [
      {
        id: 'transparentRule-input',
        path: '/transparentRule/input',
        name: 'transparentRule-input',
        icon: 'fa-filter',
        title: '入站规则',
        titleEn: 'Input Rules',
        enabled: true,
        sort: 1
      },
      {
        id: 'transparentRule-forward',
        path: '/transparentRule/forward',
        name: 'transparentRule-forward',
        icon: 'fa-exchange',
        title: '转发规则',
        titleEn: 'Forward Rules',
        enabled: true,
        sort: 2
      },
      {
        id: 'transparentRule-ip-group',
        path: '/transparentRule/ip-group',
        name: 'transparentRule-ip-group',
        icon: 'fa-sitemap',
        title: 'IP地址组',
        titleEn: 'IP Group',
        enabled: true,
        sort: 3
      },
      {
        id: 'transparentRule-port-group',
        path: '/transparentRule/port-group',
        name: 'transparentRule-port-group',
        icon: 'fa-th-large',
        title: '端口组',
        titleEn: 'Port Group',
        enabled: true,
        sort: 4
      },
      {
        id: 'transparentRule-time-group',
        path: '/transparentRule/time-group',
        name: 'transparentRule-time-group',
        icon: 'fa-clock-o',
        title: '时间组',
        titleEn: 'Time Group',
        enabled: true,
        sort: 5
      }
    ]
  },
  {
    id: 'nat',
    path: '/nat',
    name: 'nat',
    icon: 'fa-random',
    title: '地址转换',
    titleEn: 'NAT',
    enabled: true,
    sort: 7,
    children: [
      {
        id: 'nat-source',
        path: '/nat/source',
        name: 'nat-source',
        icon: 'fa-random',
        title: '源地址转换',
        titleEn: 'Source NAT',
        enabled: true,
        sort: 1
      },
      {
        id: 'nat-dest',
        path: '/nat/dest',
        name: 'nat-dest',
        icon: 'fa-random',
        title: '目的地址转换',
        titleEn: 'Destination NAT',
        enabled: true,
        sort: 2
      },
      {
        id: 'nat-out',
        path: '/nat/out',
        name: 'nat-out',
        icon: 'fa-sign-out',
        title: '出站NAT',
        titleEn: 'Outbound NAT',
        enabled: true,
        sort: 3
      },
      {
        id: 'nat-ip-group',
        path: '/nat/ip-group',
        name: 'nat-ip-group',
        icon: 'fa-sitemap',
        title: '转换IP组',
        titleEn: 'IP Group',
        enabled: true,
        sort: 4
      },
      {
        id: 'nat-port-group',
        path: '/nat/port-group',
        name: 'nat-port-group',
        icon: 'fa-th-large',
        title: '转换端口组',
        titleEn: 'Port Group',
        enabled: true,
        sort: 5
      }
    ]
  },
  {
    id: 'opc',
    path: '/opc',
    name: 'opc',
    icon: 'fa-industry',
    title: '工控代理',
    titleEn: 'Industrial Protocol',
    enabled: true,
    sort: 8,
    children: [
      {
        id: 'opc-modbus',
        path: '/opc/modbus',
        name: 'opc-modbus',
        icon: 'fa-plug',
        title: 'Modbus协议',
        titleEn: 'Modbus Protocol',
        enabled: true,
        sort: 1
      },
      {
        id: 'opc-opcua',
        path: '/opc/opcua',
        name: 'opc-opcua',
        icon: 'fa-server',
        title: 'OPC UA协议',
        titleEn: 'OPC UA Protocol',
        enabled: true,
        sort: 2
      },
      {
        id: 'opc-s7',
        path: '/opc/s7',
        name: 'opc-s7',
        icon: 'fa-microchip',
        title: 'S7协议',
        titleEn: 'S7 Protocol',
        enabled: true,
        sort: 3
      }
    ]
  },
  {
    id: 'rules',
    path: '/rules',
    name: 'rules',
    icon: 'fa-gavel',
    title: '规则管理',
    titleEn: 'Rules Management',
    enabled: true,
    sort: 9,
    children: [
      {
        id: 'rules-ferry-landing-zone',
        path: '/rules/ferry/landing-zone',
        name: 'rules-ferry-landing-zone',
        icon: 'fa-hdd-o',
        title: '落地区配置',
        titleEn: 'Landing Zone',
        enabled: true,
        sort: 1
      },
      {
        id: 'rules-ferry-path-conf',
        path: '/rules/ferry/path-conf',
        name: 'rules-ferry-path-conf',
        icon: 'fa-folder-open',
        title: '路径配置',
        titleEn: 'Path Configuration',
        enabled: true,
        sort: 2
      },
      {
        id: 'rules-database-show',
        path: '/rules/database/show',
        name: 'rules-database-show',
        icon: 'fa-database',
        title: '数据库同步',
        titleEn: 'Database Sync',
        enabled: true,
        sort: 3
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
    sort: 10,
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
    sort: 11,
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
        id: 'maintenance-profile-backup',
        path: '/maintenance/profile-backup',
        name: 'maintenance-profile-backup',
        icon: 'fa-file-archive-o',
        title: '配置文件备份',
        titleEn: 'Profile Backup',
        enabled: true,
        sort: 2
      },
      {
        id: 'maintenance-upgrade',
        path: '/maintenance/upgrade',
        name: 'maintenance-upgrade',
        icon: 'fa-download',
        title: '系统升级',
        titleEn: 'System Upgrade',
        enabled: true,
        sort: 3
      },
      {
        id: 'maintenance-antivirus',
        path: '/maintenance/antivirus',
        name: 'maintenance-antivirus',
        icon: 'fa-shield',
        title: '病毒库更新',
        titleEn: 'Antivirus Update',
        enabled: true,
        sort: 4
      },
      {
        id: 'maintenance-license',
        path: '/maintenance/license',
        name: 'maintenance-license',
        icon: 'fa-certificate',
        title: '许可证管理',
        titleEn: 'License Management',
        enabled: true,
        sort: 5
      },
      {
        id: 'maintenance-diagnose',
        path: '/maintenance/diagnose',
        name: 'maintenance-diagnose',
        icon: 'fa-tools',
        title: '诊断工具',
        titleEn: 'Diagnostic Tools',
        enabled: true,
        sort: 6
      },
      {
        id: 'maintenance-diagnostic',
        path: '/maintenance/diagnostic',
        name: 'maintenance-diagnostic',
        icon: 'fa-stethoscope',
        title: '网络诊断',
        titleEn: 'Network Diagnostic',
        enabled: true,
        sort: 7
      },
      {
        id: 'maintenance-system-on-off',
        path: '/maintenance/system-on-off',
        name: 'maintenance-system-on-off',
        icon: 'fa-power-off',
        title: '系统开关',
        titleEn: 'System On/Off',
        enabled: true,
        sort: 8
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
  admin: ['status', 'supervise', 'system', 'authority', 'security', 'transparentRule', 'nat', 'opc', 'rules', 'audit', 'maintenance'],
  auditor: ['status', 'supervise', 'audit']
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

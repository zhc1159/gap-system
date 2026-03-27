// ===========================================
// Route Configuration
// ===========================================

import type { RouteRecordRaw } from 'vue-router'

// Layout
import BaseLayout from '@/layouts/BaseLayout.vue'

// Views - Status Monitor
const StatusLink = () => import('@/views/status/LinkStatus.vue')
const StatusSystem = () => import('@/views/status/SystemStatus.vue')
const StatusTraffic = () => import('@/views/status/TrafficStats.vue')

// Views - System Management
const SystemInterface = () => import('@/views/system/InterfaceConfig.vue')
const SystemRoute = () => import('@/views/system/RouteConfig.vue')
const SystemTime = () => import('@/views/system/SystemTime.vue')

// Views - Authority Management
const AuthorityUsers = () => import('@/views/authority/UsersIndex.vue')
const AuthorityClient = () => import('@/views/authority/ClientIndex.vue')
const AuthoritySecurity = () => import('@/views/authority/SecurityConfig.vue')

// Views - Security Policy
const SecurityAccess = () => import('@/views/security/AccessControl.vue')

// Views - Audit Logs
const AuditAttack = () => import('@/views/audit/AttackLog.vue')
const AuditWeb = () => import('@/views/audit/WebLog.vue')
const AuditSession = () => import('@/views/audit/SessionLog.vue')
const AuditOperation = () => import('@/views/audit/OperationLog.vue')
const AuditDbSync = () => import('@/views/audit/DbSyncLog.vue')
const AuditFerryLogin = () => import('@/views/audit/FerryLoginLog.vue')
const AuditFerryReceive = () => import('@/views/audit/FerryReceiveLog.vue')
const AuditFerrySend = () => import('@/views/audit/FerrySendLog.vue')
const AuditFileSync = () => import('@/views/audit/FileSynLog.vue')
const AuditGapLog = () => import('@/views/audit/GapLog.vue')
const AuditIfcfgStatus = () => import('@/views/audit/IfcfgStatusLog.vue')
const AuditLogConfig = () => import('@/views/audit/LogConfig.vue')
const AuditOutAtk = () => import('@/views/audit/OutAtkLog.vue')
const AuditStrategy = () => import('@/views/audit/StrategyLog.vue')

// Views - Maintenance
const MaintenanceBackup = () => import('@/views/maintenance/BackupConfig.vue')
const MaintenanceUpgrade = () => import('@/views/maintenance/SystemUpgrade.vue')
const MaintenanceDiagnose = () => import('@/views/maintenance/DiagnoseTools.vue')

// Views - Error Pages
const NotFound = () => import('@/views/error/NotFound.vue')
const Forbidden = () => import('@/views/error/Forbidden.vue')

// Views - Login
const Login = () => import('@/views/login/LoginIndex.vue')

// Dashboard
const Dashboard = () => import('@/views/dashboard/DashboardIndex.vue')

/**
 * Route meta interface extension
 */
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    titleEn?: string
    icon?: string
    hidden?: boolean
    alwaysShow?: boolean
    noCache?: boolean
    affix?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    roles?: string[]
    permissions?: string[]
    requiresAuth?: boolean
  }
}

/**
 * Static routes (no auth required)
 */
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      titleEn: 'Login',
      hidden: true,
      requiresAuth: false
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      title: '无权限',
      titleEn: 'Forbidden',
      hidden: true,
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面不存在',
      titleEn: 'Not Found',
      hidden: true,
      requiresAuth: false
    }
  }
]

/**
 * Dynamic routes (auth required)
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '控制台',
          titleEn: 'Dashboard',
          icon: 'fa-eye',
          affix: true,
          requiresAuth: true
        }
      }
    ]
  },
  // Status Monitor
  {
    path: '/status',
    component: BaseLayout,
    redirect: '/status/link',
    meta: {
      title: '状态监视',
      titleEn: 'Status Monitor',
      icon: 'fa-eye',
      roles: ['sysadm', 'admin', 'auditor']
    },
    children: [
      {
        path: 'link',
        name: 'StatusLink',
        component: StatusLink,
        meta: {
          title: '链路检测',
          titleEn: 'Link Detection',
          icon: 'fa-link',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'system',
        name: 'StatusSystem',
        component: StatusSystem,
        meta: {
          title: '系统状态',
          titleEn: 'System Status',
          icon: 'fa-monitor',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'traffic',
        name: 'StatusTraffic',
        component: StatusTraffic,
        meta: {
          title: '流量统计',
          titleEn: 'Traffic Statistics',
          icon: 'fa-bar-chart',
          roles: ['sysadm', 'admin', 'auditor']
        }
      }
    ]
  },
  // System Management
  {
    path: '/system',
    component: BaseLayout,
    redirect: '/system/interface',
    meta: {
      title: '系统管理',
      titleEn: 'System Management',
      icon: 'fa-cogs',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'interface',
        name: 'SystemInterface',
        component: SystemInterface,
        meta: {
          title: '接口配置',
          titleEn: 'Interface Config',
          icon: 'fa-cog',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'route',
        name: 'SystemRoute',
        component: SystemRoute,
        meta: {
          title: '路由配置',
          titleEn: 'Route Config',
          icon: 'fa-link',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'time',
        name: 'SystemTime',
        component: SystemTime,
        meta: {
          title: '系统时间',
          titleEn: 'System Time',
          icon: 'fa-clock',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Authority Management
  {
    path: '/authority',
    component: BaseLayout,
    redirect: '/authority/users',
    meta: {
      title: '权限管理',
      titleEn: 'Authority Management',
      icon: 'fa-users',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'users',
        name: 'AuthorityUsers',
        component: AuthorityUsers,
        meta: {
          title: '管理员管理',
          titleEn: 'Admin Users',
          icon: 'fa-user-plus',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'client',
        name: 'AuthorityClient',
        component: AuthorityClient,
        meta: {
          title: '客户端管理',
          titleEn: 'Client Management',
          icon: 'fa-link',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'security',
        name: 'AuthoritySecurity',
        component: AuthoritySecurity,
        meta: {
          title: '安全配置',
          titleEn: 'Security Config',
          icon: 'fa-lock',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Security Policy
  {
    path: '/security',
    component: BaseLayout,
    redirect: '/security/access',
    meta: {
      title: '安全策略',
      titleEn: 'Security Policy',
      icon: 'fa-lock',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'access',
        name: 'SecurityAccess',
        component: SecurityAccess,
        meta: {
          title: '访问控制',
          titleEn: 'Access Control',
          icon: 'fa-lock',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Audit Logs
  {
    path: '/audit',
    component: BaseLayout,
    redirect: '/audit/attack',
    meta: {
      title: '审计日志',
      titleEn: 'Audit Logs',
      icon: 'fa-book',
      roles: ['sysadm', 'admin', 'auditor']
    },
    children: [
      {
        path: 'attack',
        name: 'AuditAttack',
        component: AuditAttack,
        meta: {
          title: '抗攻击日志',
          titleEn: 'Anti-Attack Logs',
          icon: 'fa-lock',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'web',
        name: 'AuditWeb',
        component: AuditWeb,
        meta: {
          title: 'Web日志',
          titleEn: 'Web Logs',
          icon: 'fa-book',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'session',
        name: 'AuditSession',
        component: AuditSession,
        meta: {
          title: '会话日志',
          titleEn: 'Session Logs',
          icon: 'fa-clock',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'operation',
        name: 'AuditOperation',
        component: AuditOperation,
        meta: {
          title: '操作日志',
          titleEn: 'Operation Logs',
          icon: 'fa-tools',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'db-sync',
        name: 'AuditDbSync',
        component: AuditDbSync,
        meta: {
          title: '数据库同步日志',
          titleEn: 'Database Sync Logs',
          icon: 'fa-database',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'ferry-login',
        name: 'AuditFerryLogin',
        component: AuditFerryLogin,
        meta: {
          title: '摆渡登录日志',
          titleEn: 'Ferry Login Logs',
          icon: 'fa-user',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'ferry-receive',
        name: 'AuditFerryReceive',
        component: AuditFerryReceive,
        meta: {
          title: '摆渡接收日志',
          titleEn: 'Ferry Receive Logs',
          icon: 'fa-download',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'ferry-send',
        name: 'AuditFerrySend',
        component: AuditFerrySend,
        meta: {
          title: '摆渡发送日志',
          titleEn: 'Ferry Send Logs',
          icon: 'fa-upload',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'file-sync',
        name: 'AuditFileSync',
        component: AuditFileSync,
        meta: {
          title: '文件同步日志',
          titleEn: 'File Sync Logs',
          icon: 'fa-files-o',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'gap-log',
        name: 'AuditGapLog',
        component: AuditGapLog,
        meta: {
          title: 'GAP系统日志',
          titleEn: 'GAP System Logs',
          icon: 'fa-file-text',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'ifcfg-status',
        name: 'AuditIfcfgStatus',
        component: AuditIfcfgStatus,
        meta: {
          title: '接口配置状态日志',
          titleEn: 'Interface Status Logs',
          icon: 'fa-plug',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'log-config',
        name: 'AuditLogConfig',
        component: AuditLogConfig,
        meta: {
          title: '日志配置',
          titleEn: 'Log Configuration',
          icon: 'fa-cog',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'out-atk',
        name: 'AuditOutAtk',
        component: AuditOutAtk,
        meta: {
          title: '出站攻击日志',
          titleEn: 'Outbound Attack Logs',
          icon: 'fa-warning',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'strategy',
        name: 'AuditStrategy',
        component: AuditStrategy,
        meta: {
          title: '策略日志',
          titleEn: 'Strategy Logs',
          icon: 'fa-shield',
          roles: ['sysadm', 'admin', 'auditor']
        }
      }
    ]
  },
  // Transparent Rule Management
  {
    path: '/transparentRule',
    component: BaseLayout,
    redirect: '/transparentRule/input',
    meta: {
      title: '透明规则',
      titleEn: 'Transparent Rules',
      icon: 'fa-filter',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'input',
        name: 'TransparentInput',
        component: () => import('@/views/transparentRule/InputRules.vue'),
        meta: {
          title: '入站规则',
          titleEn: 'Input Rules',
          icon: 'fa-filter',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Maintenance
  {
    path: '/maintenance',
    component: BaseLayout,
    redirect: '/maintenance/backup',
    meta: {
      title: '系统维护',
      titleEn: 'System Maintenance',
      icon: 'fa-tools',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'backup',
        name: 'MaintenanceBackup',
        component: MaintenanceBackup,
        meta: {
          title: '配置备份',
          titleEn: 'Config Backup',
          icon: 'fa-download',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'upgrade',
        name: 'MaintenanceUpgrade',
        component: MaintenanceUpgrade,
        meta: {
          title: '系统升级',
          titleEn: 'System Upgrade',
          icon: 'fa-download',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'diagnose',
        name: 'MaintenanceDiagnose',
        component: MaintenanceDiagnose,
        meta: {
          title: '诊断工具',
          titleEn: 'Diagnostic Tools',
          icon: 'fa-tools',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true, title: '404', titleEn: '404' }
  }
]

export default [...staticRoutes, ...dynamicRoutes]

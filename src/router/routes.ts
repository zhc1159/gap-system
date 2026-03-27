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
const MaintenanceAntiVirus = () => import('@/views/maintenance/AntiVirusUpdate.vue')
const MaintenanceConfigImport = () => import('@/views/maintenance/ConfigImport.vue')
const MaintenanceDiagnostic = () => import('@/views/maintenance/DiagnosticTools.vue')
const MaintenanceLicense = () => import('@/views/maintenance/LicenseShow.vue')
const MaintenanceLoadProfile = () => import('@/views/maintenance/LoadProfile.vue')
const MaintenanceProfileBackup = () => import('@/views/maintenance/ProfileBackup.vue')
const MaintenanceSystemOnOff = () => import('@/views/maintenance/SystemOnOff.vue')
const MaintenanceSystemUpdate = () => import('@/views/maintenance/SystemUpdate.vue')

// Views - Error Pages
const NotFound = () => import('@/views/error/NotFound.vue')
const Forbidden = () => import('@/views/error/Forbidden.vue')

// Views - Login
const Login = () => import('@/views/login/LoginIndex.vue')
const ChangePwd = () => import('@/views/login/ChangePwd.vue')
const ClientLogin = () => import('@/views/login/ClientLogin.vue')
const ClientManage = () => import('@/views/login/ClientManage.vue')
const UpdatePwd = () => import('@/views/login/UpdatePwd.vue')

// Dashboard
const Dashboard = () => import('@/views/dashboard/DashboardIndex.vue')

// Views - Transparent Rules
const TransparentInput = () => import('@/views/transparentRule/InputRules.vue')
const TransparentForward = () => import('@/views/transparentRule/ForwardRules.vue')
const TransparentIpGroup = () => import('@/views/transparentRule/IpGroup.vue')
const TransparentPortGroup = () => import('@/views/transparentRule/PortGroup.vue')
const TransparentTimeGroup = () => import('@/views/transparentRule/TimeGroup.vue')

// Views - NAT
const NatSource = () => import('@/views/nat/SourceNat.vue')
const NatDest = () => import('@/views/nat/DestNat.vue')
const NatOut = () => import('@/views/nat/OutNat.vue')
const NatInSource = () => import('@/views/nat/InSourceNat.vue')
const NatInDest = () => import('@/views/nat/InDestNat.vue')
const NatOutSource = () => import('@/views/nat/OutSourceNat.vue')
const NatOutDest = () => import('@/views/nat/OutDestNat.vue')
const NatTranIpGroup = () => import('@/views/nat/TranIpGroup.vue')
const NatTranPortGroup = () => import('@/views/nat/TranPortGroup.vue')

// Views - OPC
const OpcModbus = () => import('@/views/opc/Modbus.vue')
const OpcOpcua = () => import('@/views/opc/Opcua.vue')
const OpcS7 = () => import('@/views/opc/S7.vue')

// Views - Rules
const RulesMac = () => import('@/views/rules/access/Mac.vue')
const RulesDatabaseShow = () => import('@/views/rules/database/DatabaseShow.vue')
const RulesDatabasePolicy = () => import('@/views/rules/database/DatabasePolicyShow.vue')
const RulesFerryAntivirus = () => import('@/views/rules/ferry/Antivirus.vue')
const RulesFerryKeyFilter = () => import('@/views/rules/ferry/KeyFilter.vue')
const RulesFerryLandingZone = () => import('@/views/rules/ferry/LandingZone.vue')
const RulesFerryPathConf = () => import('@/views/rules/ferry/PathConf.vue')
const RulesFerrySuffixFilter = () => import('@/views/rules/ferry/SuffixFilter.vue')
const RulesAgentKey = () => import('@/views/rules/agent/Key.vue')
const RulesAgentRules = () => import('@/views/rules/agent/Rules.vue')
const RulesAgentVideo = () => import('@/views/rules/agent/VideoAgent.vue')

// Views - Security
const SecurityAccess = () => import('@/views/security/AccessControl.vue')
const SecurityDatabase = () => import('@/views/security/DatabaseAccess.vue')
const SecurityFile = () => import('@/views/security/FileAccess.vue')

// Views - Supervise
const SuperviseGapDip = () => import('@/views/supervise/GapDip.vue')
const SuperviseGapFileSync = () => import('@/views/supervise/GapFileSync.vue')
const SuperviseGapIneth = () => import('@/views/supervise/GapIneth.vue')
const SuperviseSysInfo = () => import('@/views/supervise/SysInfo.vue')
const SuperviseSysInfo2 = () => import('@/views/supervise/SysInfo2.vue')

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
    path: '/change-pwd',
    name: 'ChangePwd',
    component: ChangePwd,
    meta: {
      title: '修改密码',
      titleEn: 'Change Password',
      hidden: true,
      requiresAuth: true
    }
  },
  {
    path: '/client-login',
    name: 'ClientLogin',
    component: ClientLogin,
    meta: {
      title: '客户端登录',
      titleEn: 'Client Login',
      hidden: true,
      requiresAuth: false
    }
  },
  {
    path: '/client-manage',
    name: 'ClientManage',
    component: ClientManage,
    meta: {
      title: '客户端管理',
      titleEn: 'Client Management',
      hidden: true,
      requiresAuth: true
    }
  },
  {
    path: '/update-pwd',
    name: 'UpdatePwd',
    component: UpdatePwd,
    meta: {
      title: '更新密码',
      titleEn: 'Update Password',
      hidden: true,
      requiresAuth: true
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
      },
      {
        path: 'database',
        name: 'SecurityDatabase',
        component: SecurityDatabase,
        meta: {
          title: '数据库访问',
          titleEn: 'Database Access',
          icon: 'fa-database',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'file',
        name: 'SecurityFile',
        component: SecurityFile,
        meta: {
          title: '文件访问',
          titleEn: 'File Access',
          icon: 'fa-file',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Supervise
  {
    path: '/supervise',
    component: BaseLayout,
    redirect: '/supervise/sys-info',
    meta: {
      title: '状态监控',
      titleEn: 'Supervision',
      icon: 'fa-eye',
      roles: ['sysadm', 'admin', 'auditor']
    },
    children: [
      {
        path: 'sys-info',
        name: 'SuperviseSysInfo',
        component: SuperviseSysInfo,
        meta: {
          title: '系统信息',
          titleEn: 'System Info',
          icon: 'fa-info-circle',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'sys-info2',
        name: 'SuperviseSysInfo2',
        component: SuperviseSysInfo2,
        meta: {
          title: '系统信息(备份)',
          titleEn: 'System Info (Backup)',
          icon: 'fa-info',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'gap-dip',
        name: 'SuperviseGapDip',
        component: SuperviseGapDip,
        meta: {
          title: '设备IP监控',
          titleEn: 'Device IP Monitor',
          icon: 'fa-server',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'gap-file-sync',
        name: 'SuperviseGapFileSync',
        component: SuperviseGapFileSync,
        meta: {
          title: '文件同步监控',
          titleEn: 'File Sync Monitor',
          icon: 'fa-files-o',
          roles: ['sysadm', 'admin', 'auditor']
        }
      },
      {
        path: 'gap-ineth',
        name: 'SuperviseGapIneth',
        component: SuperviseGapIneth,
        meta: {
          title: '网络接口监控',
          titleEn: 'Interface Monitor',
          icon: 'fa-ethernet',
          roles: ['sysadm', 'admin', 'auditor']
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
        component: TransparentInput,
        meta: {
          title: '入站规则',
          titleEn: 'Input Rules',
          icon: 'fa-filter',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'forward',
        name: 'TransparentForward',
        component: TransparentForward,
        meta: {
          title: '转发规则',
          titleEn: 'Forward Rules',
          icon: 'fa-exchange',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ip-group',
        name: 'TransparentIpGroup',
        component: TransparentIpGroup,
        meta: {
          title: 'IP地址组',
          titleEn: 'IP Group',
          icon: 'fa-sitemap',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'port-group',
        name: 'TransparentPortGroup',
        component: TransparentPortGroup,
        meta: {
          title: '端口组',
          titleEn: 'Port Group',
          icon: 'fa-th-large',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'time-group',
        name: 'TransparentTimeGroup',
        component: TransparentTimeGroup,
        meta: {
          title: '时间组',
          titleEn: 'Time Group',
          icon: 'fa-clock-o',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // NAT Address Translation
  {
    path: '/nat',
    component: BaseLayout,
    redirect: '/nat/source',
    meta: {
      title: '地址转换',
      titleEn: 'NAT',
      icon: 'fa-random',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'source',
        name: 'NatSource',
        component: NatSource,
        meta: {
          title: '源地址转换',
          titleEn: 'Source NAT',
          icon: 'fa-random',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'dest',
        name: 'NatDest',
        component: NatDest,
        meta: {
          title: '目的地址转换',
          titleEn: 'Destination NAT',
          icon: 'fa-random',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'out',
        name: 'NatOut',
        component: NatOut,
        meta: {
          title: '出站NAT',
          titleEn: 'Outbound NAT',
          icon: 'fa-sign-out',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'in-source',
        name: 'NatInSource',
        component: NatInSource,
        meta: {
          title: '入站源NAT',
          titleEn: 'Inbound Source NAT',
          icon: 'fa-sign-in',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'in-dest',
        name: 'NatInDest',
        component: NatInDest,
        meta: {
          title: '入站目的NAT',
          titleEn: 'Inbound Dest NAT',
          icon: 'fa-sign-in',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'out-source',
        name: 'NatOutSource',
        component: NatOutSource,
        meta: {
          title: '出站源NAT',
          titleEn: 'Outbound Source NAT',
          icon: 'fa-sign-out',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'out-dest',
        name: 'NatOutDest',
        component: NatOutDest,
        meta: {
          title: '出站目的NAT',
          titleEn: 'Outbound Dest NAT',
          icon: 'fa-sign-out',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ip-group',
        name: 'NatTranIpGroup',
        component: NatTranIpGroup,
        meta: {
          title: '转换IP组',
          titleEn: 'Translation IP Group',
          icon: 'fa-sitemap',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'port-group',
        name: 'NatTranPortGroup',
        component: NatTranPortGroup,
        meta: {
          title: '转换端口组',
          titleEn: 'Translation Port Group',
          icon: 'fa-th-large',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // OPC Industrial Protocol
  {
    path: '/opc',
    component: BaseLayout,
    redirect: '/opc/modbus',
    meta: {
      title: '工控代理',
      titleEn: 'Industrial Protocol',
      icon: 'fa-industry',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'modbus',
        name: 'OpcModbus',
        component: OpcModbus,
        meta: {
          title: 'Modbus协议',
          titleEn: 'Modbus Protocol',
          icon: 'fa-plug',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'opcua',
        name: 'OpcOpcua',
        component: OpcOpcua,
        meta: {
          title: 'OPC UA协议',
          titleEn: 'OPC UA Protocol',
          icon: 'fa-server',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 's7',
        name: 'OpcS7',
        component: OpcS7,
        meta: {
          title: 'S7协议',
          titleEn: 'S7 Protocol',
          icon: 'fa-microchip',
          roles: ['sysadm', 'admin']
        }
      }
    ]
  },
  // Rules Management
  {
    path: '/rules',
    component: BaseLayout,
    redirect: '/rules/ferry/landing-zone',
    meta: {
      title: '规则管理',
      titleEn: 'Rules Management',
      icon: 'fa-gavel',
      roles: ['sysadm', 'admin']
    },
    children: [
      {
        path: 'ferry/landing-zone',
        name: 'RulesFerryLandingZone',
        component: RulesFerryLandingZone,
        meta: {
          title: '落地区配置',
          titleEn: 'Landing Zone',
          icon: 'fa-hdd-o',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ferry/path-conf',
        name: 'RulesFerryPathConf',
        component: RulesFerryPathConf,
        meta: {
          title: '路径配置',
          titleEn: 'Path Configuration',
          icon: 'fa-folder-open',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ferry/antivirus',
        name: 'RulesFerryAntivirus',
        component: RulesFerryAntivirus,
        meta: {
          title: '病毒过滤',
          titleEn: 'Antivirus Filter',
          icon: 'fa-shield',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ferry/suffix-filter',
        name: 'RulesFerrySuffixFilter',
        component: RulesFerrySuffixFilter,
        meta: {
          title: '后缀过滤',
          titleEn: 'Suffix Filter',
          icon: 'fa-filter',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'ferry/key-filter',
        name: 'RulesFerryKeyFilter',
        component: RulesFerryKeyFilter,
        meta: {
          title: '关键字过滤',
          titleEn: 'Keyword Filter',
          icon: 'fa-key',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'database/show',
        name: 'RulesDatabaseShow',
        component: RulesDatabaseShow,
        meta: {
          title: '数据库同步',
          titleEn: 'Database Sync',
          icon: 'fa-database',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'database/policy',
        name: 'RulesDatabasePolicy',
        component: RulesDatabasePolicy,
        meta: {
          title: '数据库策略',
          titleEn: 'Database Policy',
          icon: 'fa-shield',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'access/mac',
        name: 'RulesMac',
        component: RulesMac,
        meta: {
          title: 'MAC访问控制',
          titleEn: 'MAC Access Control',
          icon: 'fa-mac-address',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'agent/key',
        name: 'RulesAgentKey',
        component: RulesAgentKey,
        meta: {
          title: '代理密钥',
          titleEn: 'Agent Key',
          icon: 'fa-key',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'agent/rules',
        name: 'RulesAgentRules',
        component: RulesAgentRules,
        meta: {
          title: '代理规则',
          titleEn: 'Agent Rules',
          icon: 'fa-gavel',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'agent/video',
        name: 'RulesAgentVideo',
        component: RulesAgentVideo,
        meta: {
          title: '视频代理',
          titleEn: 'Video Agent',
          icon: 'fa-video-camera',
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
        path: 'profile-backup',
        name: 'MaintenanceProfileBackup',
        component: MaintenanceProfileBackup,
        meta: {
          title: '配置文件备份',
          titleEn: 'Profile Backup',
          icon: 'fa-file-archive-o',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'load-profile',
        name: 'MaintenanceLoadProfile',
        component: MaintenanceLoadProfile,
        meta: {
          title: '加载配置',
          titleEn: 'Load Profile',
          icon: 'fa-upload',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'config-import',
        name: 'MaintenanceConfigImport',
        component: MaintenanceConfigImport,
        meta: {
          title: '配置导入',
          titleEn: 'Config Import',
          icon: 'fa-file-import',
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
        path: 'system-update',
        name: 'MaintenanceSystemUpdate',
        component: MaintenanceSystemUpdate,
        meta: {
          title: '系统更新',
          titleEn: 'System Update',
          icon: 'fa-refresh',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'antivirus',
        name: 'MaintenanceAntiVirus',
        component: MaintenanceAntiVirus,
        meta: {
          title: '病毒库更新',
          titleEn: 'Antivirus Update',
          icon: 'fa-shield',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'license',
        name: 'MaintenanceLicense',
        component: MaintenanceLicense,
        meta: {
          title: '许可证管理',
          titleEn: 'License Management',
          icon: 'fa-certificate',
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
      },
      {
        path: 'diagnostic',
        name: 'MaintenanceDiagnostic',
        component: MaintenanceDiagnostic,
        meta: {
          title: '网络诊断',
          titleEn: 'Network Diagnostic',
          icon: 'fa-stethoscope',
          roles: ['sysadm', 'admin']
        }
      },
      {
        path: 'system-on-off',
        name: 'MaintenanceSystemOnOff',
        component: MaintenanceSystemOnOff,
        meta: {
          title: '系统开关',
          titleEn: 'System On/Off',
          icon: 'fa-power-off',
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

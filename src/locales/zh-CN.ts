// ===========================================
// Chinese (zh-CN) Locale
// ===========================================

export default {
  // Common
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '修改',
    add: '添加',
    search: '搜索',
    reset: '重置',
    export: '导出',
    import: '导入',
    refresh: '刷新',
    loading: '加载中...',
    success: '操作成功',
    failed: '操作失败',
    saveSuccess: '保存成功',
    deleteSuccess: '删除成功',
    deleteConfirm: '确定要删除吗？',
    noData: '暂无数据',
    all: '全部',
    enabled: '启用',
    disabled: '禁用',
    yes: '是',
    no: '否',
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    index: '序号',
    actions: '操作',
    vsLastPeriod: '较上期',
    detail: '详情',
    time: '时间',
    status: '状态'
  },

  // Login
  login: {
    title: '欢迎管理员登录',
    subtitle: '管理控制台',
    username: '账号',
    usernamePlaceholder: '请输入账号',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    certificate: '证书',
    certificatePlaceholder: '请选择证书文件',
    fingerprint: '取指纹',
    fingerprintTip: '按压指纹采集器...',
    otp: '一次性口令',
    otpPlaceholder: '请输入一次性口令',
    pin: 'PIN码',
    pinPlaceholder: '请输入UKey PIN码',
    privacy: '我已阅读并同意隐私承诺',
    privacyLink: '查看隐私政策',
    submit: '登 录',
    logging: '登录中...',
    productIntro: {
      title: '可靠的跨域安全交换产品',
      feature1: '物理隔离安全设备',
      feature2: '"2+1"的系统架构',
      feature3: '主动的文件和数据采集',
      feature4: '业务网外联的安全防护'
    },
    validation: {
      usernameRequired: '请输入账号',
      passwordRequired: '请输入密码',
      certRequired: '请上传证书文件',
      otpRequired: '请输入一次性口令',
      pinRequired: '请输入PIN码',
      privacyRequired: '请先同意隐私承诺'
    },
    message: {
      success: '登录成功',
      failed: '登录失败',
      networkError: '网络错误，请稍后重试'
    }
  },

  // Navbar
  navbar: {
    intranet: '内网端',
    extranet: '外网端',
    linkOk: '链路正常',
    linkError: '链路异常',
    linkChecking: '检测中...',
    checkLink: '检测链路',
    profile: '个人中心',
    settings: '系统设置',
    changePassword: '修改密码',
    logout: '退出登录',
    logoutConfirm: '确定要退出登录吗？',
    language: '语言',
    chinese: '中文',
    english: 'English',
    notifications: '通知',
    noNotifications: '暂无通知'
  },

  // Menu
  menu: {
    search: {
      placeholder: '搜索菜单',
      noResult: '未找到匹配的菜单'
    },
    collapse: '收起菜单',
    expand: '展开菜单',
    status: {
      title: '状态监视',
      link: '链路检测',
      system: '系统状态',
      traffic: '流量统计'
    },
    system: {
      title: '系统管理',
      config: '系统配置',
      interface: '接口配置',
      route: '路由配置',
      time: '系统时间'
    },
    authority: {
      title: '权限管理',
      users: '管理员管理',
      client: '客户端管理',
      security: '安全配置'
    },
    security: {
      title: '安全策略',
      access: '访问控制'
    },
    audit: {
      title: '审计日志',
      attack: '抗攻击日志',
      web: 'Web日志',
      session: '会话日志',
      operation: '操作日志'
    },
    maintenance: {
      title: '系统维护',
      backup: '配置备份',
      upgrade: '系统升级',
      diagnose: '诊断工具'
    }
  },

  // Layout
  layout: {
    base: {
      title: '系统管理',
      loading: '加载中...',
      copyright: '版权所有',
      version: '版本',
      sidebar: {
        collapse: '收起菜单',
        expand: '展开菜单'
      },
      footer: {
        description: '安全隔离网闸系统'
      }
    }
  },

  // Users Management
  users: {
    title: '管理员管理',
    account: '账号',
    group: '分组',
    pwdValidDays: '密码有效期',
    status: '状态',
    permission: '权限',
    cert: '证书',
    action: '操作',
    add: '添加用户',
    edit: '修改',
    delete: '删除',
    activate: '激活',
    deactivate: '冻结',
    issueCert: '签发证书',
    downloadCert: '下载证书',
    activated: '激活',
    deactivated: '冻结',
    domainAccount: '域账户',
    days: '天',
    superAdmin: '超级管理员',
    deputyAdmin: '普通管理员',
    deleteConfirm: '确定要删除该管理员吗？',
    saveSuccess: '保存成功',
    deleteSuccess: '删除成功',
    form: {
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      authType: '权限类型',
      super: '超级管理员',
      deputy: '普通管理员',
      permissions: '权限分配'
    }
  },

  // Status Monitor
  status: {
    link: {
      title: '链路检测',
      intranet: '内网',
      extranet: '外网',
      status: '链路状态',
      latency: '延迟',
      lastCheck: '上次检测时间',
      checkNow: '立即检测'
    },
    system: {
      title: '系统状态',
      cpu: 'CPU使用率',
      memory: '内存使用',
      disk: '磁盘使用',
      uptime: '运行时间',
      hostname: '主机名',
      ip: 'IP地址'
    },
    traffic: {
      title: '流量统计',
      inbound: '入站流量',
      outbound: '出站流量',
      total: '总流量',
      connections: '连接数',
      timeRange: '时间范围',
      lastHour: '最近1小时',
      lastDay: '最近24小时',
      lastWeek: '最近7天'
    }
  },

  // System Management
  system: {
    interface: {
      title: '接口配置',
      name: '接口名称',
      ip: 'IP地址',
      address: '地址',
      mask: '子网掩码',
      mac: 'MAC地址',
      status: '状态',
      mtu: 'MTU',
      rxBytes: '接收字节',
      txBytes: '发送字节'
    },
    route: {
      title: '路由配置',
      destination: '目标网络',
      gateway: '网关',
      interface: '接口',
      metric: '跃点数'
    },
    time: {
      title: '系统时间',
      currentTime: '当前时间',
      timezone: '时区',
      ntpServer: 'NTP服务器',
      syncNow: '立即同步',
      manualSet: '手动设置',
      sync: '同步',
      ntpEnabled: 'NTP服务',
      syncStatus: '同步状态',
      lastSync: '上次同步'
    }
  },

  // Audit Logs
  audit: {
    attack: {
      title: '抗攻击日志',
      attackType: '攻击类型',
      sourceIP: '源IP',
      targetIP: '目标IP',
      attackTime: '攻击时间',
      blocked: '已拦截',
      passed: '已放行'
    },
    web: {
      title: 'Web日志',
      url: '请求URL',
      method: '请求方法',
      statusCode: '状态码',
      responseTime: '响应时间',
      clientIP: '客户端IP'
    },
    session: {
      title: '会话日志',
      user: '用户',
      loginTime: '登录时间',
      logoutTime: '登出时间',
      duration: '会话时长',
      clientIP: '客户端IP',
      status: '状态'
    },
    operation: {
      title: '操作日志',
      operator: '操作人',
      module: '操作模块',
      action: '操作类型',
      detail: '操作详情',
      time: '操作时间',
      ip: '操作IP'
    }
  },

  // Maintenance
  maintenance: {
    backup: {
      title: '配置备份',
      createBackup: '创建备份',
      restoreBackup: '恢复备份',
      downloadBackup: '下载备份',
      backupList: '备份列表',
      backupTime: '备份时间',
      backupSize: '备份大小',
      backupBy: '备份人'
    },
    upgrade: {
      title: '系统升级',
      currentVersion: '当前版本',
      newVersion: '新版本',
      uploadPackage: '上传升级包',
      upgradeNow: '立即升级',
      upgradeHistory: '升级历史'
    },
    diagnose: {
      title: '诊断工具',
      ping: 'Ping测试',
      traceroute: '路由追踪',
      portScan: '端口扫描',
      dnsLookup: 'DNS查询',
      result: '诊断结果'
    }
  },

  // Dashboard
  dashboard: {
    resourceUsage: '资源使用率',
    networkTraffic: '网络流量',
    attackDistribution: '攻击类型分布',
    connectionStatus: '连接状态',
    linkStatus: '链路状态',
    systemAlerts: '系统告警',
    viewAll: '查看全部',
    lastHour: '最近1小时',
    last6Hours: '最近6小时',
    last24Hours: '最近24小时',
    inbound: '入站',
    outbound: '出站',
    attackType: '攻击类型',
    activeConnections: '活跃连接',
    sqlInjection: 'SQL注入',
    xss: 'XSS攻击',
    ddos: 'DDoS攻击',
    bruteForce: '暴力破解',
    other: '其他'
  },

  // Transparent Rule
  transparentRule: {
    input: {
      title: '入站规则管理',
      ruleName: '规则名称',
      ruleNamePlaceholder: '由字母数字下划线构成',
      ruleNameRequired: '请输入规则名称',
      protocol: '协议',
      protocolRequired: '请选择协议',
      protocols: {
        any: '任意',
        tcp: 'TCP',
        udp: 'UDP',
        icmp: 'ICMP',
        igmp: 'IGMP'
      },
      inInterface: '入口设备',
      inInterfaceRequired: '请选择入口设备',
      sourceIpGroup: '源IP组',
      sourcePortGroup: '源端口组',
      destIpGroup: '目的IP组',
      destPortGroup: '目的端口组',
      timeGroup: '时间组',
      action: '动作',
      actionRequired: '请选择动作',
      index: '序号',
      sort: '排序',
      sortRules: '排序规则',
      originalIndex: '原序号',
      targetIndex: '目标序号',
      apply: '应用',
      applyConfirm: '确定要应用规则配置吗？',
      applySuccess: '规则应用成功',
      sortSuccess: '排序成功',
      enabled: '已启用',
      disabled: '已禁用'
    }
  },

  // Footer
  footer: {
    copyright: '© 2024 安全隔离网闸系统',
    version: '版本'
  }
}

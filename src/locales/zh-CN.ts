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
    },
    dbSync: {
      title: '数据库同步日志',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      direction: '方向',
      sourceDB: '源数据库',
      destDB: '目的数据库',
      dbType: '数据库类型',
      database: '数据库',
      time: '时间',
      region: '区域',
      internal: '内网',
      external: '外网',
      description: '描述'
    },
    ferryLogin: {
      title: '摆渡登录日志',
      user: '用户',
      userPlaceholder: '请输入用户名',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      description: '描述',
      descPlaceholder: '请输入描述',
      internal: '内网',
      external: '外网'
    },
    ferryReceive: {
      title: '摆渡接收日志',
      user: '用户',
      userPlaceholder: '请输入用户名',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      internal: '内网',
      external: '外网'
    },
    ferrySend: {
      title: '摆渡发送日志',
      user: '用户',
      userPlaceholder: '请输入用户名',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      internal: '内网',
      external: '外网'
    },
    fileSync: {
      title: '文件同步日志',
      user: '用户',
      userPlaceholder: '请输入用户名',
      protocol: '协议',
      protocolPlaceholder: '请输入协议',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      internal: '内网',
      external: '外网'
    },
    gapLog: {
      title: 'GAP系统日志',
      user: '用户',
      description: '描述',
      descPlaceholder: '请输入描述',
      internal: '内网',
      external: '外网'
    },
    ifcfgStatus: {
      title: '接口配置状态日志',
      internal: '内网',
      external: '外网',
      logContent: '日志内容'
    },
    logConfig: {
      title: '日志配置',
      logForwarding: '日志外发',
      switch: '开关',
      protocol: '协议',
      forwardAddr: '外发地址',
      ipv4Placeholder: '请输入IPv4地址',
      ipv4Hint: '接收日志的IPv4地址',
      forwardPort: '外发端口',
      portPlaceholder: '请输入端口号',
      portHint: '接收日志的端口',
      subsystem: '子系统',
      timePolicy: '时间策略',
      validDays: '有效天数',
      daysPlaceholder: '请输入天数',
      daysHint: '保留日志时间大于等于180天',
      logAlarm: '日志告警',
      alarmThreshold: '告警阈值',
      thresholdHint: '告警阈值（1-4096）MB',
      mailAddr: '邮件地址',
      ipv4or6Placeholder: '请输入IPv4或IPv6地址',
      mailAddrHint: '接收邮件的IPv4或IPv6地址',
      destPort: '目的端口',
      smtpPortPlaceholder: '请输入SMTP端口',
      smtpPortHint: 'SMTP服务端口',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      emailHint: '接收邮件的邮箱',
      logThreshold: '日志阈值',
      storageLimit: '存储上限',
      storageHint: '取值范围(1-100000)条',
      keepPercent: '保留百分比',
      percentHint: '日志保留百分比（20-80）%'
    },
    outAtk: {
      title: '出站攻击日志',
      warningType: '警告类型',
      attackSource: '攻击来源',
      attackDest: '攻击目的'
    },
    strategy: {
      title: '策略日志',
      user: '用户',
      userPlaceholder: '请输入用户名',
      protocol: '协议',
      protocolPlaceholder: '请输入协议',
      ip: 'IP地址',
      ipPlaceholder: '请输入IP地址',
      internal: '内网',
      external: '外网'
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
    },
    antiVirus: {
      title: '病毒库升级',
      uploadFile: '上传文件',
      uploadPlaceholder: '请上传.cvd文件',
      uploading: '上传中...',
      verifying: '校验病毒库中...',
      engine: '杀毒引擎',
      fileList: '升级文件列表',
      fileName: '文件名',
      version: '版本号',
      updateTime: '升级时间',
      autoUpdate: '自动升级',
      manualUpdate: '手动升级',
      manualUpdateConfirm: '确定要手动升级病毒库吗？',
      updateDisabled: '最近已经升级，请稍后...',
      uploadSuccess: '病毒库升级成功',
      uploadFailed: '病毒库升级失败'
    },
    configImport: {
      title: '配置导入',
      downloadTemplate: '下载模板',
      importIntranet: '导入内网规则',
      importExtranet: '导入外网规则',
      uploadTitle: '上传{type}配置规则',
      uploadPlaceholder: '请上传.xlsx文件',
      uploading: '导入规则文件中...',
      uploadSuccess: '导入成功',
      uploadFailed: '导入失败',
      internal: '内网',
      external: '外网'
    },
    diagTool: {
      title: '诊断工具',
      ping: 'Ping测试',
      traceroute: '路由追踪',
      arp: 'ARP表',
      tcpdump: '抓包工具',
      tcping: 'TCP端口测试',
      networkInterface: '网络接口',
      ipAddress: 'IP地址/域名',
      port: '端口',
      protocol: '协议',
      packetCount: '数据包数量',
      timeout: '超时时间',
      start: '开始测试',
      stop: '终止',
      running: '诊断中...',
      result: '诊断结果',
      internal: '内网',
      external: '外网'
    },
    license: {
      title: '软件授权',
      status: '授权状态',
      viewDeviceCode: '查看设备码',
      deviceCode: '设备码',
      uploadArea: '将授权文件拖到这里',
      selectFile: '点击选择文件',
      uploadSuccess: '授权成功',
      uploadFailed: '授权失败',
      remainingTime: '剩余{days}天',
      expired: '授权已过期',
      copySuccess: '复制成功'
    },
    profile: {
      title: '配置存档',
      description: '描述',
      fileName: '存档名称',
      date: '日期',
      action: '操作',
      addProfile: '添加存档',
      uploadProfile: '上传存档',
      restore: '恢复',
      delete: '删除',
      download: '下载',
      current: '当前版本',
      restoreConfirm: '确定恢复该存档吗？',
      deleteConfirm: '确定删除该存档吗？',
      restoreSuccess: '恢复成功',
      deleteSuccess: '删除成功',
      uploadPlaceholder: '请上传.tgz文件'
    },
    powerControl: {
      title: '系统开关机',
      reboot: '重启系统',
      shutdown: '关闭系统',
      rebootConfirm: '确定要重启系统吗？此操作将中断所有服务。',
      shutdownConfirm: '确定要关闭系统吗？此操作不可撤销。',
      rebootSuccess: '系统正在重启...',
      shutdownSuccess: '系统正在关闭...',
      warning: '警告：重启或关闭系统将中断所有正在进行的操作，请确保已保存所有数据。'
    },
    profileBackup: {
      title: '配置备份',
      autoBackup: '自动备份',
      interval: '间隔时间',
      minutes: '分',
      ftpIp: 'FTP服务器IP',
      ftpPort: 'FTP端口',
      ftpUser: 'FTP用户名',
      ftpPassword: 'FTP密码',
      uploadPath: '本地上传路径',
      save: '保存配置'
    },
    sysUpdate: {
      title: '系统升级',
      uploadPackage: '上传升级包',
      rollbackInit: '回退初始版本',
      currentVersion: '当前版本',
      upgradeHistory: '升级历史'
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
  },

  // Password (Change & Update)
  password: {
    change: {
      title: '修改密码',
      subtitle: '请设置您的新密码',
      expiredTitle: '密码已过期',
      expiredMessage: '您的密码已过期，请修改密码后继续使用',
      firstLoginTitle: '首次登录',
      firstLoginMessage: '检测到您是首次登录，请修改初始密码',
      oldPassword: '原密码',
      oldPasswordPlaceholder: '请输入原密码',
      newPassword: '新密码',
      newPasswordPlaceholder: '请输入新密码',
      confirmPassword: '确认新密码',
      confirmPasswordPlaceholder: '请再次输入新密码',
      submit: '更 新',
      submitting: '更新中...',
      rules: {
        title: '密码要求',
        minLength: '至少 8 个字符',
        maxLength: '最多 16 个字符',
        hasLowercase: '包含小写字母 (a-z)',
        hasUppercase: '包含大写字母 (A-Z)',
        hasNumber: '包含数字 (0-9)',
        hasSpecial: '包含特殊字符 (!@#$%^&*)',
        noSpaces: '不能包含空格',
        notSameAsOld: '不能与原密码相同'
      },
      strength: {
        title: '密码强度',
        weak: '弱',
        fair: '一般',
        good: '良好',
        strong: '强',
        veryStrong: '非常强'
      },
      validation: {
        oldPasswordRequired: '请输入原密码',
        newPasswordRequired: '请输入新密码',
        confirmPasswordRequired: '请确认新密码',
        passwordMismatch: '两次输入的密码不一致',
        invalidFormat: '密码格式不符合要求',
        sameAsOld: '新密码不能与原密码相同'
      },
      message: {
        success: '密码修改成功',
        failed: '密码修改失败',
        oldPasswordIncorrect: '原密码不正确',
        networkError: '网络错误，请稍后重试',
        redirectMessage: '秒后自动跳转...'
      },
      success: {
        title: '修改成功',
        description: '您的密码已成功修改，请使用新密码重新登录',
        backToLogin: '返回登录'
      }
    },
    update: {
      title: '设置密码',
      subtitle: '创建您的新密码',
      newPassword: '新密码',
      newPasswordPlaceholder: '请输入新密码',
      confirmPassword: '确认新密码',
      confirmPasswordPlaceholder: '请再次输入新密码',
      submit: '更 新',
      submitting: '更新中...',
      rules: {
        title: '密码要求',
        minLength: '至少 8 个字符',
        maxLength: '最多 16 个字符',
        hasLowercase: '包含小写字母 (a-z)',
        hasUppercase: '包含大写字母 (A-Z)',
        hasNumber: '包含数字 (0-9)',
        hasSpecial: '包含特殊字符 (!@#$%^&*)',
        noSpaces: '不能包含空格'
      },
      strength: {
        title: '密码强度',
        weak: '弱',
        fair: '一般',
        good: '良好',
        strong: '强',
        veryStrong: '非常强'
      },
      validation: {
        newPasswordRequired: '请输入新密码',
        confirmPasswordRequired: '请确认新密码',
        passwordMismatch: '两次输入的密码不一致',
        invalidFormat: '密码格式不符合要求'
      },
      message: {
        success: '密码设置成功',
        failed: '密码设置失败',
        networkError: '网络错误，请稍后重试'
      },
      success: {
        title: '设置成功',
        description: '您的密码已成功设置',
        backToProfile: '返回个人中心'
      }
    }
  },

  // Client Login
  clientLogin: {
    title: '用户登录',
    subtitle: '欢迎回来',
    username: '账号',
    usernamePlaceholder: '请输入账号',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    fingerprint: '取指纹',
    fingerprintTip: '按压指纹采集器...',
    otp: '一次性口令',
    otpPlaceholder: '请输入一次性口令',
    privacy: '承诺不采集用户信息',
    privacyDetail: '了解详情',
    submit: '登 录',
    logging: '登录中...',
    validation: {
      usernameRequired: '请输入账号',
      passwordRequired: '请输入密码',
      otpRequired: '请输入一次性口令',
      privacyRequired: '请确认隐私承诺'
    },
    message: {
      success: '登录成功，正在跳转...',
      failed: '登录失败，请重试',
      networkError: '网络错误，请稍后重试',
      fingerprintSuccess: '指纹采集成功',
      fingerprintFailed: '指纹采集失败'
    },
    footer: {
      help: '需要帮助？',
      contact: '联系管理员'
    }
  },

  // Client Management
  clientManage: {
    title: '客户端管理',
    subtitle: '管理所有客户端连接',
    addClient: '添加客户端',
    editClient: '修改客户端',
    clientId: '客户端ID',
    clientName: '客户端名称',
    clientNamePlaceholder: '请输入客户端名称',
    ipAddress: 'IP地址',
    ipPlaceholder: '请输入IP地址',
    status: '状态',
    active: '已激活',
    inactive: '未激活',
    lastLogin: '最后登录',
    createdAt: '创建时间',
    description: '描述',
    descPlaceholder: '请输入描述信息',
    authMethod: '认证方式',
    initialPwd: '初始密码',
    initialPwdPlaceholder: '请输入初始密码',
    enable: '启用',
    disable: '禁用',
    searchPlaceholder: '搜索客户端名称/ID/IP',
    toggleConfirm: '确定要{action}客户端【{name}】吗？',
    deleteConfirm: '确定要删除客户端【{name}】吗？',
    validation: {
      clientNameRequired: '请输入客户端名称',
      ipRequired: '请输入IP地址',
      ipInvalid: '请输入有效的IP地址',
      authMethodRequired: '请选择认证方式',
      initialPwdRequired: '请输入初始密码'
    }
  }
}

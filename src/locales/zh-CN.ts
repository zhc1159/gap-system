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
    status: '状态',
    name: '名称',
    placeholder: '请输入',
    required: '此项为必填项',
    source: '源地址',
    destination: '目的地址',
    port: '端口',
    protocol: '协议',
    prev: '上一步',
    next: '下一步',
    editSuccess: '修改成功',
    addSuccess: '添加成功'
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
    supervise: {
      title: '状态监控',
      sysInfo: '系统信息',
      gapDip: '设备IP监控',
      gapFileSync: '文件同步监控',
      gapIneth: '网络接口监控'
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
      access: '访问控制',
      databaseAccess: '数据库访问',
      fileAccess: '文件访问'
    },
    transparentRule: {
      title: '透明规则',
      input: '入站规则',
      forward: '转发规则',
      ipGroup: 'IP地址组',
      portGroup: '端口组',
      timeGroup: '时间组'
    },
    nat: {
      title: '地址转换',
      sourceNat: '源地址转换',
      destNat: '目的地址转换',
      outNat: '出站NAT',
      inSourceNat: '入站源NAT',
      inDestNat: '入站目的NAT',
      outSourceNat: '出站源NAT',
      outDestNat: '出站目的NAT',
      ipGroup: '转换IP组',
      portGroup: '转换端口组'
    },
    opc: {
      title: '工控代理',
      modbus: 'Modbus协议',
      opcua: 'OPC UA协议',
      s7: 'S7协议'
    },
    rules: {
      title: '规则管理',
      landingZone: '落地区配置',
      pathConf: '路径配置',
      databaseShow: '数据库同步',
      databasePolicy: '数据库策略',
      antivirus: '病毒过滤',
      keyFilter: '关键字过滤',
      suffixFilter: '后缀过滤',
      mac: 'MAC访问控制'
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
      profileBackup: '配置文件备份',
      loadProfile: '加载配置',
      upgrade: '系统升级',
      systemUpdate: '系统更新',
      antivirus: '病毒库更新',
      license: '许可证管理',
      diagnose: '诊断工具',
      diagnostic: '网络诊断',
      configImport: '配置导入',
      systemOnOff: '系统开关'
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

  // Security Policy Module
  securityPolicy: {
    common: {
      title: '安全策略',
      direction: {
        in: '入站',
        out: '出站'
      },
      status: {
        running: '运行中',
        stopped: '已停止'
      },
      form: {
        title: '安全策略配置',
        modeName: '规则名称',
        modeNamePlaceholder: '请输入规则名称',
        protocol: '协议',
        source: '源地址',
        destination: '目的地址',
        destinationPort: '目的端口',
        inInterface: '入接口',
        inDevice: '入设备',
        inDevicePort: '入设备端口',
        timeGroup: '时间组',
        timeGroupPlaceholder: '选择时间组（可选）'
      },
      table: {
        name: '规则名称',
        protocol: '协议',
        source: '源地址',
        destination: '目的地址',
        destinationPort: '目的端口',
        inDevicePort: '设备端口'
      },
      validation: {
        modeNameRequired: '请输入规则名称',
        protocolRequired: '请选择协议',
        sourceRequired: '请选择源地址',
        destinationRequired: '请选择目的地址',
        destinationPortRequired: '请输入目的端口',
        inInterfaceRequired: '请选择入接口',
        inDeviceRequired: '请输入入设备',
        inDevicePortRequired: '请输入入设备端口'
      },
      messages: {
        confirmDelete: '确定要删除该规则吗？',
        toggleSuccess: '状态切换成功'
      }
    },
    databaseAccess: {
      title: '数据库访问控制',
      description: '配置数据库访问策略'
    },
    fileAccess: {
      title: '文件访问控制',
      description: '配置文件访问策略'
    }
  },

  // Auth Function Module
  authFun: {
    title: '认证功能配置',
    description: '配置系统认证功能',
    adDomain: 'AD域配置',
    adDomainClient: 'AD域客户端',
    adDomainUsers: 'AD域用户',
    otp: 'OTP配置',
    otpEnable: '启用OTP',
    otpSecret: 'OTP密钥',
    otpAlgorithm: 'OTP算法',
    otpDigits: 'OTP位数',
    otpInterval: 'OTP间隔',
    ldap: 'LDAP配置',
    ldapServer: 'LDAP服务器',
    ldapPort: 'LDAP端口',
    ldapBindDn: '绑定DN',
    ldapBaseDn: '基础DN',
    ldapFilter: '过滤器',
    radius: 'RADIUS配置',
    radiusServer: 'RADIUS服务器',
    radiusSecret: 'RADIUS密钥',
    radiusTimeout: '超时时间',
    saveSuccess: '保存成功',
    testConnection: '测试连接',
    connectionSuccess: '连接成功',
    connectionFailed: '连接失败'
  },

  // Video Agent Module
  videoAgent: {
    title: '视频代理',
    description: '配置视频代理规则',
    add: '添加代理',
    addTitle: '新增视频代理',
    editTitle: '编辑视频代理',
    deleteConfirm: '确定要删除该代理吗？',
    name: '代理名称',
    nameRequired: '代理名称不能为空',
    protocol: '协议',
    protocolRequired: '请选择协议',
    sourceIp: '源IP',
    sourceIpRequired: '源IP不能为空',
    targetIp: '目标IP',
    targetIpRequired: '目标IP不能为空',
    sourcePort: '源端口',
    targetPort: '目标端口',
    enabled: '已启用',
    disabled: '已禁用'
  },

  // AD Domain Module
  adDomain: {
    title: 'AD域配置',
    description: '配置Active Directory域',
    domainName: '域名',
    domainNameRequired: '域名不能为空',
    domainController: '域控制器',
    dcRequired: '域控制器不能为空',
    bindDn: '绑定DN',
    bindDnRequired: '绑定DN不能为空',
    bindPassword: '绑定密码',
    bindPasswordRequired: '绑定密码不能为空',
    baseDn: '基础DN',
    baseDnRequired: '基础DN不能为空',
    userFilter: '用户过滤器',
    groupFilter: '组过滤器',
    testSuccess: '测试连接成功',
    testFailed: '测试连接失败'
  },

  // AD Domain Client Module
  adDomainClient: {
    title: 'AD域客户端',
    description: '管理AD域客户端',
    add: '添加客户端',
    addTitle: '新增客户端',
    editTitle: '编辑客户端',
    deleteConfirm: '确定要删除该客户端吗？',
    clientName: '客户端名称',
    clientNameRequired: '客户端名称不能为空',
    clientIp: '客户端IP',
    clientIpRequired: '客户端IP不能为空',
    status: '状态',
    lastSync: '最后同步'
  },

  // AD Domain Users Module
  adDomainUsers: {
    title: 'AD域用户',
    description: '管理AD域用户',
    username: '用户名',
    displayName: '显示名称',
    email: '邮箱',
    groups: '所属组',
    status: '状态',
    lastLogin: '最后登录',
    searchPlaceholder: '搜索用户名或邮箱'
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
  },

  // 新增模块翻译 - New Module Translations

  // 状态监控模块
  supervise: {
    sysInfo: {
      title: '系统信息',
      description: '查看系统详细信息'
    },
    gapDip: {
      title: '设备IP监控',
      description: '监控设备IP状态',
      serverIP: '服务器IP',
      txBytes: '发送字节',
      rxBytes: '接收字节',
      totalBytes: '总字节',
      newSessions: '新会话数'
    },
    gapFileSync: {
      title: '文件同步监控',
      description: '监控文件同步状态'
    },
    gapIneth: {
      title: '网络接口监控',
      description: '监控网络接口状态'
    }
  },

  // NAT地址转换模块
  natModule: {
    sourceNat: {
      title: '源地址转换',
      description: '配置源NAT规则',
      ruleName: '规则名称',
      action: '动作',
      virtualSource: '虚拟源地址'
    },
    destNat: {
      title: '目的地址转换',
      description: '配置目的NAT规则'
    },
    outNat: {
      title: '出站NAT',
      description: '配置出站NAT规则'
    },
    ipGroup: {
      title: '转换IP组',
      description: '管理转换IP组'
    },
    portGroup: {
      title: '转换端口组',
      description: '管理转换端口组'
    }
  },

  // 工控代理模块
  opcModule: {
    modbus: {
      title: 'Modbus协议',
      description: '配置Modbus工控协议代理'
    },
    opcua: {
      title: 'OPC UA协议',
      description: '配置OPC UA工控协议代理'
    },
    s7: {
      title: 'S7协议',
      description: '配置S7工控协议代理'
    }
  },

  // 规则管理模块
  rulesModule: {
    landingZone: {
      title: '落地区配置',
      description: '配置文件摆渡落地区',
      nameRequired: '请输入名称',
      pathRequired: '请输入路径',
      storageRequired: '请输入存储容量'
    },
    pathConf: {
      title: '路径配置',
      description: '配置文件传输路径',
      sourcePath: '源路径',
      targetPath: '目标路径',
      permission: '权限'
    },
    antivirus: {
      title: '病毒过滤',
      description: '配置病毒扫描规则'
    },
    keyFilter: {
      title: '关键字过滤',
      description: '配置内容关键字过滤'
    },
    suffixFilter: {
      title: '后缀过滤',
      description: '配置文件后缀过滤'
    },
    databaseShow: {
      title: '数据库同步',
      description: '配置数据库同步规则',
      connectionSuccess: '连接成功'
    },
    databasePolicy: {
      title: '数据库策略',
      description: '配置数据库同步策略'
    }
  },

  // 系统维护扩展
  maintenanceExt: {
    antivirus: {
      title: '病毒库更新',
      description: '更新病毒特征库',
      currentStatus: '当前状态',
      version: '版本',
      lastUpdate: '最后更新',
      virusCount: '病毒数量',
      updateSettings: '更新设置',
      autoUpdate: '自动更新',
      updateServer: '更新服务器',
      updateInterval: '更新间隔',
      updateNow: '立即更新',
      checkUpdate: '检查更新'
    },
    configImport: {
      title: '配置导入',
      description: '导入系统配置'
    },
    diagnosticTools: {
      title: '诊断工具',
      description: '网络诊断工具',
      ping: 'Ping',
      traceroute: '路由追踪',
      arp: 'ARP表',
      tcpdump: '抓包',
      tcping: 'TCPing'
    },
    license: {
      title: '许可证管理',
      description: '管理系统许可证',
      deviceCode: '设备码',
      uploadLicense: '上传许可证'
    },
    loadProfile: {
      title: '加载配置',
      description: '加载配置文件'
    },
    profileBackup: {
      title: '配置文件备份',
      description: '备份系统配置'
    },
    systemOnOff: {
      title: '系统开关',
      description: '系统启动和关闭',
      reboot: '重启系统',
      shutdown: '关闭系统'
    },
    systemUpdate: {
      title: '系统更新',
      description: '系统版本更新'
    }
  },

  // NAT Module Translations
  nat: {
    common: {
      any: '任意',
      clickToEnable: '点击启用',
      clickToDisable: '点击禁用',
      enable: '启用',
      disable: '禁用',
      enabled: '已启用',
      disabled: '已禁用',
      ruleName: '规则名称',
      ruleNamePlaceholder: '请输入规则名称',
      ruleNameRequired: '规则名称不能为空',
      protocol: '协议',
      protocolRequired: '请选择协议',
      sourceIp: '源IP地址',
      sourcePort: '源端口',
      destIp: '目的IP地址',
      destPort: '目的端口',
      inInterface: '入口接口',
      outInterface: '出口接口',
      action: '动作',
      actionRequired: '请选择动作',
      virtualIp: '虚拟地址',
      virtualPort: '虚拟端口',
      status: '状态',
      description: '描述'
    },
    sourceNat: {
      title: '源地址转换',
      description: '配置源NAT规则',
      addRule: '添加规则',
      editRule: '编辑规则',
      virtualSource: '虚拟源地址',
      virtualSourceRequired: 'SNAT动作需要填写虚拟源地址',
      deleteConfirm: '确定要删除该规则吗？'
    },
    destNat: {
      title: '目的地址转换',
      description: '配置目的NAT规则',
      addRule: '添加规则',
      editRule: '编辑规则',
      virtualDest: '虚拟目的地址',
      deleteConfirm: '确定要删除该规则吗？'
    },
    outNat: {
      title: '出站NAT',
      description: '配置出站NAT规则'
    },
    inSourceNat: {
      title: '入站源NAT',
      description: '配置入站源地址转换'
    },
    inDestNat: {
      title: '入站目的NAT',
      description: '配置入站目的地址转换'
    },
    outSourceNat: {
      title: '出站源NAT',
      description: '配置出站源地址转换'
    },
    outDestNat: {
      title: '出站目的NAT',
      description: '配置出站目的地址转换'
    },
    ipGroup: {
      title: 'IP地址组',
      description: '管理IP地址组',
      addGroup: '添加IP组',
      editGroup: '编辑IP组',
      groupName: '组名称',
      groupNamePlaceholder: '请输入组名称',
      groupNameRequired: '组名称不能为空',
      groupNameMaxLength: '组名称不能超过31个字符',
      groupNamePattern: '组名称只能包含字母、数字、下划线',
      ipAddress: 'IP地址',
      ipRequired: 'IP地址不能为空',
      ipPlaceholder: '输入IP地址后按回车添加',
      ipHint: '支持IPv4、IPv6、CIDR、IP范围、域名',
      deleteConfirm: '确定要删除该IP组吗？'
    },
    portGroup: {
      title: '端口组',
      description: '管理端口组',
      addGroup: '添加端口组',
      editGroup: '编辑端口组',
      groupName: '组名称',
      portRequired: '端口不能为空',
      portPlaceholder: '输入端口后按回车添加',
      portHint: '支持单个端口或端口范围，如 80 或 8080-8090'
    }
  },

  // Landing Zone Module
  landingZone: {
    title: '落地区配置',
    description: '配置文件摆渡落地区',
    add: '添加落地区',
    addTitle: '新增落地区',
    editTitle: '编辑落地区',
    deleteConfirm: '确定要删除该落地区吗？',
    zoneName: '区域名称',
    namePlaceholder: '请输入区域名称',
    nameRequired: '区域名称不能为空',
    path: '路径',
    pathPlaceholder: '请输入路径',
    pathRequired: '路径不能为空',
    maxStorage: '最大存储',
    storageRequired: '存储容量不能为空',
    storage: '存储使用',
    status: '状态',
    active: '已激活',
    inactive: '未激活'
  },

  // Path Configuration Module
  pathConf: {
    title: '路径配置',
    description: '配置文件传输路径',
    add: '添加路径',
    addTitle: '新增路径',
    editTitle: '编辑路径',
    deleteConfirm: '确定要删除该路径吗？',
    name: '路径名称',
    nameRequired: '路径名称不能为空',
    sourcePath: '源路径',
    sourcePathRequired: '源路径不能为空',
    targetPath: '目标路径',
    targetPathRequired: '目标路径不能为空',
    permission: '权限',
    permissionRequired: '请选择权限',
    enabled: '已启用',
    disabled: '已禁用'
  },

  // Database Sync Module
  database: {
    title: '数据库同步',
    description: '配置数据库同步规则',
    add: '添加数据库',
    addTitle: '新增数据库配置',
    editTitle: '编辑数据库配置',
    deleteConfirm: '确定要删除该数据库配置吗？',
    name: '数据库名称',
    namePlaceholder: '请输入数据库名称',
    nameRequired: '数据库名称不能为空',
    dbType: '数据库类型',
    typeRequired: '请选择数据库类型',
    host: '主机地址',
    hostPlaceholder: '请输入主机地址',
    hostRequired: '主机地址不能为空',
    port: '端口',
    portRequired: '端口不能为空',
    dbName: '数据库名',
    dbNameRequired: '数据库名不能为空',
    username: '用户名',
    usernamePlaceholder: '请输入用户名',
    usernameRequired: '用户名不能为空',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    passwordRequired: '密码不能为空',
    testConnection: '测试连接',
    connectionSuccess: '连接成功',
    connectionFailed: '连接失败',
    status: '状态',
    lastSync: '最后同步'
  },

  // Antivirus Module
  antivirus: {
    title: '病毒过滤',
    description: '配置病毒扫描规则',
    add: '添加规则',
    addTitle: '新增病毒过滤规则',
    editTitle: '编辑病毒过滤规则',
    deleteConfirm: '确定要删除该规则吗？',
    username: '用户名',
    usernamePlaceholder: '请输入用户名',
    usernameRequired: '用户名不能为空',
    scanSwitch: '扫描开关',
    on: '开启',
    off: '关闭',
    switch: '开关',
    scanCount: '扫描次数',
    virusCount: '病毒数量',
    handleMode: '处理方式',
    handleModeRequired: '请选择处理方式',
    handleModes: {
      allow: '允许',
      delete: '删除',
      quarantine: '隔离'
    }
  },

  // Key Filter Module
  keyFilter: {
    title: '关键字过滤',
    description: '配置内容关键字过滤',
    add: '添加规则',
    addTitle: '新增关键字过滤规则',
    editTitle: '编辑关键字过滤规则',
    deleteConfirm: '确定要删除该规则吗？',
    username: '用户名',
    usernamePlaceholder: '请输入用户名',
    usernameRequired: '用户名不能为空',
    filterMode: '过滤模式',
    accept: '允许',
    reject: '拒绝',
    keywords: '关键字',
    keywordPlaceholder: '请输入关键字',
    keywordsRequired: '关键字不能为空'
  },

  // Suffix Filter Module
  suffixFilter: {
    title: '后缀过滤',
    description: '配置文件后缀过滤',
    add: '添加规则',
    addTitle: '新增后缀过滤规则',
    editTitle: '编辑后缀过滤规则',
    deleteConfirm: '确定要删除该规则吗？',
    username: '用户名',
    suffix: '后缀',
    suffixPlaceholder: '如 .exe .dll',
    suffixRequired: '后缀不能为空',
    filterMode: '过滤模式',
    accept: '允许',
    reject: '拒绝'
  },

  // Diagnostic Tools Module
  diagnosticTools: {
    title: '诊断工具',
    description: '网络诊断工具',
    ping: 'Ping',
    traceroute: '路由追踪',
    arp: 'ARP表',
    tcpdump: '抓包工具',
    tcping: 'TCPing',
    networkInterface: '网络接口',
    targetHost: '目标主机',
    targetHostPlaceholder: '请输入目标主机或IP',
    targetPort: '目标端口',
    packetCount: '数据包数量',
    packetSize: '数据包大小',
    timeout: '超时时间',
    run: '执行',
    stop: '停止',
    running: '运行中...',
    result: '诊断结果',
    interface: '接口',
    ipRequired: '请输入IP地址',
    ipInvalid: 'IP地址格式不正确',
    notSameAsOld: '不能与原值相同'
  },

  // Key Management Module
  key: {
    title: '密钥管理',
    description: '管理代理密钥',
    add: '添加密钥',
    addTitle: '新增密钥',
    editTitle: '编辑密钥',
    deleteConfirm: '确定要删除该密钥吗？',
    keyName: '密钥名称',
    namePlaceholder: '请输入密钥名称',
    nameRequired: '密钥名称不能为空',
    keyType: '密钥类型',
    typeRequired: '请选择密钥类型',
    keyContent: '密钥内容',
    contentPlaceholder: '请输入密钥内容',
    contentRequired: '密钥内容不能为空',
    createTime: '创建时间'
  },

  // MAC Access Control Module
  mac: {
    title: 'MAC访问控制',
    description: '配置MAC地址访问控制',
    add: '添加规则',
    addTitle: '新增MAC规则',
    editTitle: '编辑MAC规则',
    deleteConfirm: '确定要删除该规则吗？',
    index: '序号',
    macAddress: 'MAC地址',
    macPlaceholder: '请输入MAC地址，如 00:11:22:33:44:55',
    macRequired: 'MAC地址不能为空',
    macFormatError: 'MAC地址格式不正确',
    searchPlaceholder: '搜索MAC地址',
    createTime: '创建时间'
  },

  // Database Policy Module
  databasePolicy: {
    title: '数据库策略',
    description: '配置数据库同步策略',
    add: '添加策略',
    addTitle: '新增数据库策略',
    editTitle: '编辑数据库策略',
    deleteConfirm: '确定要删除该策略吗？',
    policyName: '策略名称',
    policyNameRequired: '策略名称不能为空',
    sourceDb: '源数据库',
    sourceDbRequired: '请选择源数据库',
    targetDb: '目标数据库',
    targetDbRequired: '请选择目标数据库',
    syncMode: '同步模式',
    syncModeRequired: '请选择同步模式',
    fullSync: '全量同步',
    incrementalSync: '增量同步',
    syncInterval: '同步间隔',
    syncIntervalRequired: '同步间隔不能为空',
    enabled: '已启用',
    disabled: '已禁用'
  }
}

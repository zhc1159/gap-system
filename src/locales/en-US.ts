// ===========================================
// English (en-US) Locale
// ===========================================

export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    loading: 'Loading...',
    success: 'Success',
    failed: 'Failed',
    saveSuccess: 'Saved successfully',
    deleteSuccess: 'Deleted successfully',
    deleteConfirm: 'Are you sure to delete?',
    noData: 'No data',
    all: 'All',
    enabled: 'Enabled',
    disabled: 'Disabled',
    yes: 'Yes',
    no: 'No',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    index: 'No.',
    actions: 'Actions',
    vsLastPeriod: 'vs last period'
  },

  // Login
  login: {
    title: 'Welcome Administrator',
    subtitle: 'Management Console',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    certificate: 'Certificate',
    certificatePlaceholder: 'Select certificate file',
    fingerprint: 'Scan Fingerprint',
    fingerprintTip: 'Press fingerprint scanner...',
    otp: 'One-Time Password',
    otpPlaceholder: 'Enter OTP',
    pin: 'PIN Code',
    pinPlaceholder: 'Enter UKey PIN',
    privacy: 'I have read and agree to the Privacy Policy',
    privacyLink: 'View Privacy Policy',
    submit: 'Login',
    logging: 'Logging in...',
    productIntro: {
      title: 'Reliable Cross-Domain Security Exchange',
      feature1: 'Physical isolation security devices',
      feature2: '"2+1" system architecture',
      feature3: 'Active file and data collection',
      feature4: 'Business network external protection'
    },
    validation: {
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password',
      certRequired: 'Please upload certificate',
      otpRequired: 'Please enter OTP',
      pinRequired: 'Please enter PIN',
      privacyRequired: 'Please accept privacy policy first'
    },
    message: {
      success: 'Login successful',
      failed: 'Login failed',
      networkError: 'Network error, please try again'
    }
  },

  // Navbar
  navbar: {
    intranet: 'Intranet',
    extranet: 'Extranet',
    linkOk: 'Link OK',
    linkError: 'Link Error',
    linkChecking: 'Checking...',
    checkLink: 'Check Link',
    profile: 'Profile',
    settings: 'Settings',
    changePassword: 'Change Password',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    notifications: 'Notifications',
    noNotifications: 'No notifications'
  },

  // Menu
  menu: {
    search: {
      placeholder: 'Search menu',
      noResult: 'No matching menu found'
    },
    collapse: 'Collapse Sidebar',
    expand: 'Expand Sidebar',
    status: {
      title: 'Status Monitor',
      link: 'Link Detection',
      system: 'System Status',
      traffic: 'Traffic Statistics'
    },
    system: {
      title: 'System Management',
      config: 'System Config',
      interface: 'Interface Config',
      route: 'Route Config',
      time: 'System Time'
    },
    authority: {
      title: 'Authority Management',
      users: 'Admin Users',
      client: 'Client Management',
      security: 'Security Config'
    },
    security: {
      title: 'Security Policy',
      access: 'Access Control'
    },
    audit: {
      title: 'Audit Logs',
      attack: 'Anti-Attack Logs',
      web: 'Web Logs',
      session: 'Session Logs',
      operation: 'Operation Logs'
    },
    maintenance: {
      title: 'System Maintenance',
      backup: 'Config Backup',
      upgrade: 'System Upgrade',
      diagnose: 'Diagnostic Tools'
    }
  },

  // Layout
  layout: {
    base: {
      title: 'System Management',
      loading: 'Loading...',
      copyright: 'Copyright',
      version: 'Version',
      sidebar: {
        collapse: 'Collapse Sidebar',
        expand: 'Expand Sidebar'
      },
      footer: {
        description: 'Security Gap System'
      }
    }
  },

  // Users Management
  users: {
    title: 'Admin Users',
    account: 'Account',
    group: 'Group',
    pwdValidDays: 'Password Validity',
    status: 'Status',
    permission: 'Permission',
    cert: 'Certificate',
    action: 'Action',
    add: 'Add User',
    edit: 'Edit',
    delete: 'Delete',
    activate: 'Activate',
    deactivate: 'Deactivate',
    issueCert: 'Issue Certificate',
    downloadCert: 'Download Certificate',
    activated: 'Activated',
    deactivated: 'Deactivated',
    domainAccount: 'Domain Account',
    days: 'days',
    superAdmin: 'Super Admin',
    deputyAdmin: 'Deputy Admin',
    deleteConfirm: 'Are you sure to delete this admin?',
    saveSuccess: 'Saved successfully',
    deleteSuccess: 'Deleted successfully',
    form: {
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      authType: 'Permission Type',
      super: 'Super Admin',
      deputy: 'Deputy Admin',
      permissions: 'Permissions'
    }
  },

  // Status Monitor
  status: {
    link: {
      title: 'Link Detection',
      intranet: 'Intranet',
      extranet: 'Extranet',
      status: 'Link Status',
      latency: 'Latency',
      lastCheck: 'Last Check',
      checkNow: 'Check Now'
    },
    system: {
      title: 'System Status',
      cpu: 'CPU Usage',
      memory: 'Memory Usage',
      disk: 'Disk Usage',
      uptime: 'Uptime',
      hostname: 'Hostname',
      ip: 'IP Address'
    },
    traffic: {
      title: 'Traffic Statistics',
      inbound: 'Inbound Traffic',
      outbound: 'Outbound Traffic',
      total: 'Total Traffic',
      connections: 'Connections',
      timeRange: 'Time Range',
      lastHour: 'Last Hour',
      lastDay: 'Last 24 Hours',
      lastWeek: 'Last 7 Days'
    }
  },

  // System Management
  system: {
    interface: {
      title: 'Interface Config',
      name: 'Interface Name',
      ip: 'IP Address',
      mask: 'Subnet Mask',
      mac: 'MAC Address',
      status: 'Status',
      mtu: 'MTU',
      rxBytes: 'Received Bytes',
      txBytes: 'Sent Bytes'
    },
    route: {
      title: 'Route Config',
      destination: 'Destination',
      gateway: 'Gateway',
      interface: 'Interface',
      metric: 'Metric'
    },
    time: {
      title: 'System Time',
      currentTime: 'Current Time',
      timezone: 'Timezone',
      ntpServer: 'NTP Server',
      syncNow: 'Sync Now',
      manualSet: 'Manual Set'
    }
  },

  // Audit Logs
  audit: {
    attack: {
      title: 'Anti-Attack Logs',
      attackType: 'Attack Type',
      sourceIP: 'Source IP',
      targetIP: 'Target IP',
      attackTime: 'Attack Time',
      blocked: 'Blocked'
    },
    web: {
      title: 'Web Logs',
      url: 'Request URL',
      method: 'Method',
      statusCode: 'Status Code',
      responseTime: 'Response Time',
      clientIP: 'Client IP'
    },
    session: {
      title: 'Session Logs',
      user: 'User',
      loginTime: 'Login Time',
      logoutTime: 'Logout Time',
      duration: 'Duration',
      clientIP: 'Client IP',
      status: 'Status'
    },
    operation: {
      title: 'Operation Logs',
      operator: 'Operator',
      module: 'Module',
      action: 'Action',
      detail: 'Detail',
      time: 'Time',
      ip: 'IP'
    }
  },

  // Maintenance
  maintenance: {
    backup: {
      title: 'Config Backup',
      createBackup: 'Create Backup',
      restoreBackup: 'Restore Backup',
      downloadBackup: 'Download Backup',
      backupList: 'Backup List',
      backupTime: 'Backup Time',
      backupSize: 'Backup Size',
      backupBy: 'Backup By'
    },
    upgrade: {
      title: 'System Upgrade',
      currentVersion: 'Current Version',
      newVersion: 'New Version',
      uploadPackage: 'Upload Package',
      upgradeNow: 'Upgrade Now',
      upgradeHistory: 'Upgrade History'
    },
    diagnose: {
      title: 'Diagnostic Tools',
      ping: 'Ping Test',
      traceroute: 'Traceroute',
      portScan: 'Port Scan',
      dnsLookup: 'DNS Lookup',
      result: 'Result'
    }
  },

  // Dashboard
  dashboard: {
    resourceUsage: 'Resource Usage',
    networkTraffic: 'Network Traffic',
    attackDistribution: 'Attack Distribution',
    connectionStatus: 'Connection Status',
    linkStatus: 'Link Status',
    systemAlerts: 'System Alerts',
    viewAll: 'View All',
    lastHour: 'Last Hour',
    last6Hours: 'Last 6 Hours',
    last24Hours: 'Last 24 Hours',
    inbound: 'Inbound',
    outbound: 'Outbound',
    attackType: 'Attack Type',
    activeConnections: 'Active Connections',
    sqlInjection: 'SQL Injection',
    xss: 'XSS Attack',
    ddos: 'DDoS Attack',
    bruteForce: 'Brute Force',
    other: 'Other'
  },

  // Footer
  footer: {
    copyright: '© 2024 Security Gap System',
    version: 'Version'
  }
}

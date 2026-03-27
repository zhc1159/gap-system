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
    vsLastPeriod: 'vs last period',
    detail: 'Detail',
    time: 'Time',
    status: 'Status'
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
      address: 'Address',
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
      manualSet: 'Manual Set',
      sync: 'Sync',
      ntpEnabled: 'NTP Service',
      syncStatus: 'Sync Status',
      lastSync: 'Last Sync'
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
      blocked: 'Blocked',
      passed: 'Passed'
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
    },
    dbSync: {
      title: 'Database Sync Logs',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      direction: 'Direction',
      sourceDB: 'Source Database',
      destDB: 'Destination Database',
      dbType: 'Database Type',
      database: 'Database',
      operation: 'Operation',
      time: 'Time',
      region: 'Region',
      internal: 'Internal',
      external: 'External',
      description: 'Description',
      result: 'Result'
    },
    ferryLogin: {
      title: 'Ferry Login Logs',
      user: 'User',
      userPlaceholder: 'Enter username',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      description: 'Description',
      descPlaceholder: 'Enter description',
      internal: 'Internal',
      external: 'External'
    },
    ferryReceive: {
      title: 'Ferry Receive Logs',
      user: 'User',
      userPlaceholder: 'Enter username',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      internal: 'Internal',
      external: 'External'
    },
    ferrySend: {
      title: 'Ferry Send Logs',
      user: 'User',
      userPlaceholder: 'Enter username',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      internal: 'Internal',
      external: 'External'
    },
    fileSync: {
      title: 'File Sync Logs',
      user: 'User',
      userPlaceholder: 'Enter username',
      protocol: 'Protocol',
      protocolPlaceholder: 'Enter protocol',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      internal: 'Internal',
      external: 'External'
    },
    gapLog: {
      title: 'GAP System Logs',
      user: 'User',
      description: 'Description',
      descPlaceholder: 'Enter description',
      internal: 'Internal',
      external: 'External'
    },
    ifcfgStatus: {
      title: 'Interface Status Logs',
      internal: 'Internal',
      external: 'External',
      logContent: 'Log Content'
    },
    logConfig: {
      title: 'Log Configuration',
      logForwarding: 'Log Forwarding',
      switch: 'Switch',
      protocol: 'Protocol',
      forwardAddr: 'Forward Address',
      ipv4Placeholder: 'Enter IPv4 address',
      ipv4Hint: 'IPv4 address to receive logs',
      forwardPort: 'Forward Port',
      portPlaceholder: 'Enter port',
      portHint: 'Port to receive logs',
      subsystem: 'Subsystem',
      timePolicy: 'Time Policy',
      validDays: 'Valid Days',
      daysPlaceholder: 'Enter days',
      daysHint: 'Log retention days >= 180',
      logAlarm: 'Log Alarm',
      alarmThreshold: 'Alarm Threshold',
      thresholdHint: 'Alarm threshold (1-4096) MB',
      mailAddr: 'Mail Address',
      ipv4or6Placeholder: 'Enter IPv4 or IPv6 address',
      mailAddrHint: 'Mail server address',
      destPort: 'Destination Port',
      smtpPortPlaceholder: 'Enter SMTP port',
      smtpPortHint: 'SMTP service port',
      email: 'Email',
      emailPlaceholder: 'Enter email',
      emailHint: 'Email to receive alerts',
      logThreshold: 'Log Threshold',
      storageLimit: 'Storage Limit',
      storageHint: 'Range (1-100000)',
      keepPercent: 'Keep Percent',
      percentHint: 'Log keep percent (20-80)%'
    },
    outAtk: {
      title: 'Outbound Attack Logs',
      warningType: 'Warning Type',
      attackSource: 'Attack Source',
      attackDest: 'Attack Destination'
    },
    strategy: {
      title: 'Strategy Logs',
      user: 'User',
      userPlaceholder: 'Enter username',
      protocol: 'Protocol',
      protocolPlaceholder: 'Enter protocol',
      ip: 'IP Address',
      ipPlaceholder: 'Enter IP address',
      internal: 'Internal',
      external: 'External'
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
    },
    antiVirus: {
      title: 'Virus Database Update',
      uploadFile: 'Upload File',
      uploadPlaceholder: 'Please upload .cvd file',
      uploading: 'Uploading...',
      verifying: 'Verifying virus database...',
      engine: 'Antivirus Engine',
      fileList: 'Update File List',
      fileName: 'File Name',
      version: 'Version',
      updateTime: 'Update Time',
      autoUpdate: 'Auto Update',
      manualUpdate: 'Manual Update',
      manualUpdateConfirm: 'Are you sure to manually update the virus database?',
      updateDisabled: 'Recently updated, please wait...',
      uploadSuccess: 'Virus database updated successfully',
      uploadFailed: 'Virus database update failed'
    },
    configImport: {
      title: 'Configuration Import',
      downloadTemplate: 'Download Template',
      importIntranet: 'Import Intranet Rules',
      importExtranet: 'Import Extranet Rules',
      uploadTitle: 'Upload {type} Configuration Rules',
      uploadPlaceholder: 'Please upload .xlsx file',
      uploading: 'Importing rule file...',
      uploadSuccess: 'Import successful',
      uploadFailed: 'Import failed',
      internal: 'Intranet',
      external: 'Extranet'
    },
    diagTool: {
      title: 'Diagnostic Tools',
      ping: 'Ping Test',
      traceroute: 'Trace Route',
      arp: 'ARP Table',
      tcpdump: 'Packet Capture',
      tcping: 'TCP Port Test',
      networkInterface: 'Network Interface',
      ipAddress: 'IP Address/Domain',
      port: 'Port',
      protocol: 'Protocol',
      packetCount: 'Packet Count',
      timeout: 'Timeout',
      start: 'Start Test',
      stop: 'Stop',
      running: 'Diagnosing...',
      result: 'Diagnostic Result',
      internal: 'Internal',
      external: 'External'
    },
    license: {
      title: 'License Management',
      status: 'License Status',
      viewDeviceCode: 'View Device Code',
      deviceCode: 'Device Code',
      uploadArea: 'Drop license file here',
      selectFile: 'Click to select file',
      uploadSuccess: 'License uploaded successfully',
      uploadFailed: 'License upload failed',
      remainingTime: '{days} days remaining',
      expired: 'License expired',
      copySuccess: 'Copied successfully'
    },
    profile: {
      title: 'Profile Management',
      description: 'Description',
      fileName: 'Profile Name',
      date: 'Date',
      action: 'Action',
      addProfile: 'Add Profile',
      uploadProfile: 'Upload Profile',
      restore: 'Restore',
      delete: 'Delete',
      download: 'Download',
      current: 'Current Version',
      restoreConfirm: 'Are you sure to restore this profile?',
      deleteConfirm: 'Are you sure to delete this profile?',
      restoreSuccess: 'Restore successful',
      deleteSuccess: 'Delete successful',
      uploadPlaceholder: 'Please upload .tgz file'
    },
    powerControl: {
      title: 'System Power Control',
      reboot: 'Reboot System',
      shutdown: 'Shutdown System',
      rebootConfirm: 'Are you sure to reboot the system? This will interrupt all services.',
      shutdownConfirm: 'Are you sure to shutdown the system? This action cannot be undone.',
      rebootSuccess: 'System is rebooting...',
      shutdownSuccess: 'System is shutting down...',
      warning: 'Warning: Rebooting or shutting down the system will interrupt all ongoing operations. Please ensure all data has been saved.'
    },
    profileBackup: {
      title: 'Configuration Backup',
      autoBackup: 'Auto Backup',
      interval: 'Interval',
      minutes: 'minutes',
      ftpIp: 'FTP Server IP',
      ftpPort: 'FTP Port',
      ftpUser: 'FTP Username',
      ftpPassword: 'FTP Password',
      uploadPath: 'Upload Path',
      save: 'Save Configuration'
    },
    sysUpdate: {
      title: 'System Update',
      uploadPackage: 'Upload Update Package',
      rollbackInit: 'Rollback to Initial Version',
      currentVersion: 'Current Version',
      upgradeHistory: 'Upgrade History'
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

  // Transparent Rule
  transparentRule: {
    input: {
      title: 'Input Rules Management',
      ruleName: 'Rule Name',
      ruleNamePlaceholder: 'Letters, numbers, underscores',
      ruleNameRequired: 'Please enter rule name',
      protocol: 'Protocol',
      protocolRequired: 'Please select protocol',
      protocols: {
        any: 'Any',
        tcp: 'TCP',
        udp: 'UDP',
        icmp: 'ICMP',
        igmp: 'IGMP'
      },
      inInterface: 'In Interface',
      inInterfaceRequired: 'Please select in interface',
      sourceIpGroup: 'Source IP Group',
      sourcePortGroup: 'Source Port Group',
      destIpGroup: 'Dest IP Group',
      destPortGroup: 'Dest Port Group',
      timeGroup: 'Time Group',
      action: 'Action',
      actionRequired: 'Please select action',
      index: 'Index',
      sort: 'Sort',
      sortRules: 'Sort Rules',
      originalIndex: 'Original Index',
      targetIndex: 'Target Index',
      apply: 'Apply',
      applyConfirm: 'Are you sure to apply rule configuration?',
      applySuccess: 'Rules applied successfully',
      sortSuccess: 'Sorted successfully',
      enabled: 'Enabled',
      disabled: 'Disabled'
    }
  },

  // Footer
  footer: {
    copyright: '© 2024 Security Gap System',
    version: 'Version'
  },

  // Password (Change & Update)
  password: {
    change: {
      title: 'Change Password',
      subtitle: 'Please set your new password',
      expiredTitle: 'Password Expired',
      expiredMessage: 'Your password has expired. Please change it to continue',
      firstLoginTitle: 'First Time Login',
      firstLoginMessage: 'First time login detected. Please change your initial password',
      oldPassword: 'Current Password',
      oldPasswordPlaceholder: 'Enter current password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter new password',
      submit: 'Update',
      submitting: 'Updating...',
      rules: {
        title: 'Password Requirements',
        minLength: 'At least 8 characters',
        maxLength: 'Maximum 16 characters',
        hasLowercase: 'Contains lowercase letter (a-z)',
        hasUppercase: 'Contains uppercase letter (A-Z)',
        hasNumber: 'Contains number (0-9)',
        hasSpecial: 'Contains special character (!@#$%^&*)',
        noSpaces: 'No spaces allowed',
        notSameAsOld: 'Must be different from current password'
      },
      strength: {
        title: 'Password Strength',
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong',
        veryStrong: 'Very Strong'
      },
      validation: {
        oldPasswordRequired: 'Please enter current password',
        newPasswordRequired: 'Please enter new password',
        confirmPasswordRequired: 'Please confirm new password',
        passwordMismatch: 'Passwords do not match',
        invalidFormat: 'Password format is invalid',
        sameAsOld: 'New password cannot be the same as current password'
      },
      message: {
        success: 'Password changed successfully',
        failed: 'Failed to change password',
        oldPasswordIncorrect: 'Current password is incorrect',
        networkError: 'Network error, please try again later',
        redirectMessage: 'seconds until redirect...'
      },
      success: {
        title: 'Success',
        description: 'Your password has been changed. Please login with your new password',
        backToLogin: 'Back to Login'
      }
    },
    update: {
      title: 'Set Password',
      subtitle: 'Create your new password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Enter new password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter new password',
      submit: 'Update',
      submitting: 'Updating...',
      rules: {
        title: 'Password Requirements',
        minLength: 'At least 8 characters',
        maxLength: 'Maximum 16 characters',
        hasLowercase: 'Contains lowercase letter (a-z)',
        hasUppercase: 'Contains uppercase letter (A-Z)',
        hasNumber: 'Contains number (0-9)',
        hasSpecial: 'Contains special character (!@#$%^&*)',
        noSpaces: 'No spaces allowed'
      },
      strength: {
        title: 'Password Strength',
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong',
        veryStrong: 'Very Strong'
      },
      validation: {
        newPasswordRequired: 'Please enter new password',
        confirmPasswordRequired: 'Please confirm new password',
        passwordMismatch: 'Passwords do not match',
        invalidFormat: 'Password format is invalid'
      },
      message: {
        success: 'Password set successfully',
        failed: 'Failed to set password',
        networkError: 'Network error, please try again later'
      },
      success: {
        title: 'Success',
        description: 'Your password has been set successfully',
        backToProfile: 'Back to Profile'
      }
    }
  },

  // Client Login
  clientLogin: {
    title: 'User Login',
    subtitle: 'Welcome Back',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    fingerprint: 'Scan Fingerprint',
    fingerprintTip: 'Press fingerprint scanner...',
    otp: 'One-Time Password',
    otpPlaceholder: 'Enter OTP',
    privacy: 'Commitment: No user data collection',
    privacyDetail: 'Learn More',
    submit: 'Login',
    logging: 'Logging in...',
    validation: {
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password',
      otpRequired: 'Please enter OTP',
      privacyRequired: 'Please accept privacy commitment'
    },
    message: {
      success: 'Login successful, redirecting...',
      failed: 'Login failed, please try again',
      networkError: 'Network error, please try again later',
      fingerprintSuccess: 'Fingerprint captured successfully',
      fingerprintFailed: 'Fingerprint capture failed'
    },
    footer: {
      help: 'Need Help?',
      contact: 'Contact Admin'
    }
  },

  // Client Management
  clientManage: {
    title: 'Client Management',
    subtitle: 'Manage all client connections',
    addClient: 'Add Client',
    editClient: 'Edit Client',
    clientId: 'Client ID',
    clientName: 'Client Name',
    clientNamePlaceholder: 'Enter client name',
    ipAddress: 'IP Address',
    ipPlaceholder: 'Enter IP address',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    lastLogin: 'Last Login',
    createdAt: 'Created At',
    description: 'Description',
    descPlaceholder: 'Enter description',
    authMethod: 'Auth Method',
    initialPwd: 'Initial Password',
    initialPwdPlaceholder: 'Enter initial password',
    enable: 'Enable',
    disable: 'Disable',
    searchPlaceholder: 'Search by name/ID/IP',
    toggleConfirm: 'Are you sure to {action} client [{name}]?',
    deleteConfirm: 'Are you sure to delete client [{name}]?',
    validation: {
      clientNameRequired: 'Please enter client name',
      ipRequired: 'Please enter IP address',
      ipInvalid: 'Please enter a valid IP address',
      authMethodRequired: 'Please select auth method',
      initialPwdRequired: 'Please enter initial password'
    }
  }
}

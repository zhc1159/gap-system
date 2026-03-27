// ===========================================
// Type Definitions Entry
// ===========================================

// User & Auth Types
export interface IUserInfo {
  id: string
  username: string
  nickname?: string
  avatar?: string
  role: string
  permissions: string[]
  group?: string
  email?: string
  phone?: string
  lastLoginTime?: string
  isActive: boolean
}

export interface ILoginForm {
  username: string
  pwd: string
  cert_file?: File | null
  fingerCode1?: string
  one_time_pwd?: string
  pin_code?: string
  privacyAccepted: boolean
}

export interface ILoginResponse {
  code: number
  message: string
  data: {
    token: string
    userInfo: IUserInfo
    permissions: string[]
  }
}

export interface IAuthSwitch {
  user_cert: 'on' | 'off'
  finger_switch: boolean
  otp_switch: boolean
  ukey_switch: boolean
}

// Layout & Menu Types
export interface IUISetting {
  browserTitle: string
  favicon: string
  copyright: string
  logo: string
  systemName: string
}

export interface ILayoutState {
  isCollapse: boolean
  isMobile: boolean
  device: 'desktop' | 'mobile' | 'tablet'
  theme: 'light' | 'dark'
  size: 'default' | 'small' | 'large'
}

export interface ISystemConfig {
  version: string
  gapWhere: 'intranet' | 'extranet'
  linkState: 'OK' | 'ERROR'
}

export interface IMenuItem {
  id: string
  path: string
  name: string
  icon?: string
  title: string
  titleEn: string
  enabled: boolean
  sort: number
  children?: IMenuItem[]
  badge?: {
    value: number
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }
}

export interface IMenuConfigRaw {
  [role: string]: {
    model: [string, string, string, string]
    modelName: string
    modelNameEn: string
    column: {
      [subMenuName: string]: [
        [string, string, string, string],
        {
          [thirdMenuName: string]: [string, string]
        }?
      ]
    }
  }[]
}

// API Response Types
export interface IApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface IPaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface IRequestConfig {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
}

// Admin User Types
export interface IAdminUser {
  id: number
  username: string
  group: string
  pwdValidDays: number
  isActive: boolean
  authType: 'super' | 'deputy'
  certIssued: boolean
  isDomainUser: boolean
}

export interface IAdminUserForm {
  username: string
  pwd: string
  pwdAgain: string
  authType: 'super' | 'deputy'
  authList: string[]
}

// Menu Store Types
export interface IMenuState {
  menuList: IMenuItem[]
  activeMenu: string
  openMenus: string[]
  searchKeyword: string
  loading: boolean
}

// App State Types
export interface IAppState {
  loading: boolean
  language: 'zh-CN' | 'en-US'
  systemConfig: ISystemConfig
}

// ===========================================
// User & Auth Types
// ===========================================

/**
 * User roles enumeration
 */
export enum UserRole {
  SYSADM = 'sysadm',   // System Administrator - full access
  ADMIN = 'admin',     // Administrator - most features
  AUDITOR = 'auditor'  // Auditor - view only
}

/**
 * User information interface
 */
export interface IUserInfo {
  id: string
  username: string
  nickname?: string
  avatar?: string
  role: UserRole
  permissions: string[]
  group?: string
  email?: string
  phone?: string
  lastLoginTime?: string
  isActive: boolean
}

/**
 * Login form data
 */
export interface ILoginForm {
  username: string
  pwd: string
  cert_file?: File | null
  fingerCode1?: string
  one_time_pwd?: string
  pin_code?: string
  privacyAccepted: boolean
}

/**
 * Login response
 */
export interface ILoginResponse {
  code: number
  message: string
  data: {
    token: string
    userInfo: IUserInfo
    permissions: string[]
  }
}

/**
 * Authentication switch configuration
 */
export interface IAuthSwitch {
  user_cert: 'on' | 'off'
  finger_switch: boolean
  otp_switch: boolean
  ukey_switch: boolean
}

/**
 * Admin user for user management
 */
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

/**
 * Admin user form for add/edit
 */
export interface IAdminUserForm {
  username: string
  pwd: string
  pwdAgain: string
  authType: 'super' | 'deputy'
  authList: string[]
}

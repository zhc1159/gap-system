// ===========================================
// Auth API
// ===========================================

import type { ILoginForm, ILoginResponse, IUserInfo, IApiResponse, IAuthSwitch } from '@/types'

/**
 * Admin login
 */
export function loginApi(data: ILoginForm): Promise<ILoginResponse> {
  // Mock login for development
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: '1',
        username: data.username,
        nickname: data.username === 'admin' ? '管理员' : data.username,
        role: data.username === 'sysadm' ? 'sysadm' : data.username === 'auditor' ? 'auditor' : 'admin',
        permissions: ['*'],
        isActive: true
      },
      permissions: ['*']
    }
  })
}

/**
 * Admin logout
 */
export function logoutApi(): Promise<IApiResponse> {
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

/**
 * Get current user info
 */
export function getUserInfoApi(): Promise<IApiResponse<IUserInfo>> {
  const userStr = localStorage.getItem('gap_user')
  if (userStr) {
    return Promise.resolve({
      code: 0,
      message: 'Success',
      data: JSON.parse(userStr)
    })
  }
  return Promise.reject(new Error('Not logged in'))
}

/**
 * Refresh token
 */
export function refreshTokenApi(): Promise<IApiResponse<{ token: string }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { token: 'new_mock_token_' + Date.now() }
  })
}

/**
 * Verify OTP
 */
export function verifyOtpApi(otp: string): Promise<IApiResponse<{ valid: boolean }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { valid: otp.length === 6 }
  })
}

/**
 * Verify fingerprint
 */
export function verifyFingerprintApi(fingerprint: string): Promise<IApiResponse<{ valid: boolean }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { valid: !!fingerprint }
  })
}

/**
 * Verify UKey PIN
 */
export function verifyUkeyPinApi(pin: string): Promise<IApiResponse<{ valid: boolean }>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: { valid: pin.length >= 4 }
  })
}

/**
 * Get auth switch configuration
 */
export function getAuthSwitchApi(): Promise<IApiResponse<IAuthSwitch>> {
  return Promise.resolve({
    code: 0,
    message: 'Success',
    data: {
      user_cert: 'off',
      finger_switch: false,
      otp_switch: false,
      ukey_switch: false
    }
  })
}

/**
 * Change password
 */
export function changePasswordApi(data: {
  oldPwd: string
  newPwd: string
  confirmPwd: string
}): Promise<IApiResponse> {
  console.log('Change password:', data)
  return Promise.resolve({ code: 0, message: 'Success', data: null })
}

// ===========================================
// Axios Request Utility
// ===========================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import type { IRequestConfig } from '@/types'

// Loading instance type
interface ILoadingInstance {
  close: () => void
}

// Extend AxiosRequestConfig to include custom options
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig, IRequestConfig {
  loadingInstance?: ILoadingInstance
}

// Create axios instance
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// Request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const customConfig = config as ExtendedAxiosRequestConfig

    // Add authorization token
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }

    // Add loading animation
    if (customConfig.showLoading !== false) {
      (config as ExtendedAxiosRequestConfig).loadingInstance = ElLoading.service({
        lock: true,
        text: customConfig.loadingText || '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as ExtendedAxiosRequestConfig

    // Close loading
    if (config.loadingInstance) {
      config.loadingInstance.close()
    }

    const res = response.data

    // Handle blob response (file download)
    if (response.config.responseType === 'blob') {
      return response
    }

    // Check business status code
    if (res.code !== 0 && res.code !== 200) {
      // Show error message
      if (config.showError !== false) {
        ElMessage({
          message: res.message || '请求失败',
          type: 'error',
          duration: 5000
        })
      }

      // Handle 401 unauthorized
      if (res.code === 401) {
        handleUnauthorized()
      }

      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  (error) => {
    const config = error.config as ExtendedAxiosRequestConfig

    // Close loading
    if (config?.loadingInstance) {
      config.loadingInstance.close()
    }

    // Handle different error types
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          handleUnauthorized()
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.message || '网络错误')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

/**
 * Handle 401 unauthorized
 */
function handleUnauthorized() {
  const userStore = useUserStore()

  ElMessageBox.confirm(
    '登录状态已过期，请重新登录',
    '提示',
    {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    router.push('/login')
  }).catch(() => {
    // User cancelled
  })
}

/**
 * GET request
 */
export function get<T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<T> {
  return service.get(url, config)
}

/**
 * POST request
 */
export function post<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

/**
 * PUT request
 */
export function put<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

/**
 * DELETE request
 */
export function del<T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<T> {
  return service.delete(url, config)
}

/**
 * PATCH request
 */
export function patch<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> {
  return service.patch(url, data, config)
}

/**
 * Upload file
 */
export function upload<T = any>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  config?: ExtendedAxiosRequestConfig
): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)

  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

/**
 * Download file
 */
export function download(
  url: string,
  filename: string,
  config?: ExtendedAxiosRequestConfig
): Promise<void> {
  return service
    .get(url, {
      ...config,
      responseType: 'blob'
    })
    .then((response: AxiosResponse) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
}

export default service

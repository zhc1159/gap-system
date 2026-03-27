// ===========================================
// Layout & Menu Types
// ===========================================

import type { UserRole } from './user'

/**
 * UI Settings interface
 */
export interface IUISetting {
  browserTitle: string
  favicon: string
  copyright: string
  logo: string
  systemName: string
}

/**
 * Layout state interface
 */
export interface ILayoutState {
  isCollapse: boolean
  isMobile: boolean
  device: 'desktop' | 'mobile' | 'tablet'
  theme: 'light' | 'dark'
  size: 'default' | 'small' | 'large'
}

/**
 * System configuration interface
 */
export interface ISystemConfig {
  version: string
  gapWhere: 'intranet' | 'extranet'
  linkState: 'OK' | 'ERROR'
}

/**
 * Menu item interface
 */
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

/**
 * Role menu configuration
 */
export interface IRoleMenu {
  [role: string]: IMenuItem[]
}

/**
 * Menu configuration raw data from backend
 */
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

/**
 * App state interface
 */
export interface IAppState {
  loading: boolean
  sidebar: boolean
  device: 'desktop' | 'mobile'
  theme: 'dark' | 'light'
  size: 'default' | 'small' | 'large'
  language: 'zh-CN' | 'en-US'
}

/**
 * Route meta interface
 */
export interface IRouteMeta {
  title: string
  titleEn?: string
  icon?: string
  hidden?: boolean
  alwaysShow?: boolean
  noCache?: boolean
  affix?: boolean
  breadcrumb?: boolean
  activeMenu?: string
  roles?: UserRole[]
  permissions?: string[]
}

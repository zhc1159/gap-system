# GAP System 前端开发指南

> 本文档旨在帮助开发者（包括其他大模型）快速接手 GAP System 前端项目的开发工作。

---

## 一、项目概述

### 1.1 项目背景

GAP System 是一个安全隔离网闸系统的前端管理界面，采用 Vue 3 + TypeScript + Element Plus 技术栈开发。

### 1.2 核心需求

1. **界面设计**：科技风格，亮度适中，细节丰富
2. **国际化**：支持中英文切换，可扩展其他语言
3. **权限管理**：四种用户角色（deepnet/sysadm/admin/auditor）
4. **模块化**：清晰的代码结构，便于维护和扩展

---

## 二、技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4.21 | 前端框架（Composition API） |
| TypeScript | 5.4.3 | 类型安全 |
| Vite | 5.2.6 | 构建工具 |
| Element Plus | 2.6.1 | UI 组件库 |
| Pinia | 2.1.7 | 状态管理 |
| Vue Router | 4.3.0 | 路由管理 |
| Vue I18n | 9.10.2 | 国际化 |
| ECharts | 5.5.0 | 图表库 |
| SCSS | 1.72.0 | 样式预处理 |

---

## 三、项目结构

```
gap-system/
├── docs/                    # 文档目录
│   └── DEVELOPMENT.md       # 开发指南（本文件）
├── public/                  # 静态资源
├── src/
│   ├── api/                 # API 接口
│   │   ├── index.ts         # API 导出
│   │   ├── auth.ts          # 认证相关
│   │   └── menu.ts          # 菜单相关
│   ├── components/          # 公共组件
│   ├── layouts/             # 布局组件
│   │   └── BaseLayout.vue   # 基础布局
│   ├── locales/             # 国际化
│   │   ├── index.ts         # i18n 配置
│   │   ├── types.ts         # 语言类型定义
│   │   ├── registry.ts      # 语言注册器
│   │   ├── zh-CN.ts         # 简体中文
│   │   └── en-US.ts         # 英文
│   ├── router/              # 路由配置
│   │   ├── index.ts         # 路由实例
│   │   ├── routes.ts        # 路由定义
│   │   └── guards.ts        # 路由守卫
│   ├── stores/              # Pinia 状态管理
│   │   ├── index.ts         # Store 导出
│   │   ├── user.ts          # 用户状态
│   │   ├── menu.ts          # 菜单状态
│   │   ├── layout.ts        # 布局状态
│   │   └── app.ts           # 应用状态
│   ├── styles/              # 全局样式
│   │   ├── index.scss       # 样式入口
│   │   ├── variables.scss   # SCSS 变量
│   │   ├── animations.scss  # 动画定义
│   │   ├── reset.scss       # 样式重置
│   │   └── element-override.scss # Element Plus 覆盖
│   ├── types/               # TypeScript 类型
│   │   ├── index.ts         # 类型导出
│   │   ├── user.ts          # 用户类型
│   │   ├── layout.ts        # 布局类型
│   │   └── api.ts           # API 类型
│   ├── utils/               # 工具函数
│   │   ├── index.ts         # 工具导出
│   │   └── request.ts       # HTTP 请求封装
│   ├── views/               # 页面组件
│   │   ├── login/           # 登录模块
│   │   ├── dashboard/       # 控制台
│   │   ├── status/          # 状态监视
│   │   ├── system/          # 系统管理
│   │   ├── authority/       # 权限管理
│   │   ├── security/        # 安全策略
│   │   ├── audit/           # 审计日志
│   │   ├── maintenance/     # 系统维护
│   │   ├── transparent/     # 透明规则
│   │   └── error/           # 错误页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── .env                     # 环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目配置
```

---

## 四、用户角色与权限

### 4.1 角色定义

| 角色 | 代码 | 权限范围 |
|------|------|----------|
| 超级管理员 | `deepnet` | 所有菜单 + 系统级权限 |
| 系统管理员 | `sysadm` | 所有菜单权限 |
| 普通管理员 | `admin` | 大部分菜单（无系统级权限） |
| 审计员 | `auditor` | 仅状态监视、审计日志 |

### 4.2 权限控制实现

**菜单权限映射**（`src/stores/menu.ts`）：

```typescript
const roleMenuMap: Record<string, string[]> = {
  deepnet: ['*'],  // 全部权限
  sysadm: ['*'],   // 全部菜单
  admin: ['status', 'system', 'authority', 'security', 'audit', 'maintenance'],
  auditor: ['status', 'audit']
}
```

**使用权限判断**（`src/stores/user.ts`）：

```typescript
const userStore = useUserStore()

// 检查是否为超级管理员
if (userStore.isDeepnet()) {
  // 特殊系统权限
}

// 检查是否有特定权限
if (userStore.hasPermission('some-permission')) {
  // 执行操作
}
```

---

## 五、国际化开发指南

### 5.1 添加新的翻译文本

1. 在 `src/locales/zh-CN.ts` 中添加中文翻译：

```typescript
export default {
  // ...
  newModule: {
    title: '新模块标题',
    description: '模块描述'
  }
}
```

2. 在 `src/locales/en-US.ts` 中添加英文翻译：

```typescript
export default {
  // ...
  newModule: {
    title: 'New Module Title',
    description: 'Module Description'
  }
}
```

### 5.2 在组件中使用

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('newModule.title') }}</h1>
  <p>{{ t('newModule.description') }}</p>
</template>
```

### 5.3 添加新语言

1. 在 `src/locales/types.ts` 的 `LocaleCode` 类型中添加语言代码
2. 在 `SUPPORTED_LOCALES` 数组中添加语言配置
3. 创建新的语言文件（如 `ja-JP.ts`）
4. 在 `src/locales/index.ts` 中导入并注册新语言

---

## 六、样式开发规范

### 6.1 使用 SCSS 变量

```scss
@import '@/styles/variables.scss';

.my-component {
  background-color: $bg-card;
  color: $text-primary;
  border: 1px solid $border-color;
  border-radius: $radius-md;

  &:hover {
    box-shadow: $shadow-glow;
  }
}
```

### 6.2 主题色彩变量

```scss
// 主色
$primary-color: #00d4ff;
$primary-light: #5ce1ff;
$primary-dark: #00a8cc;

// 背景色（已调整亮度）
$bg-primary: #1e2a3a;
$bg-secondary: #283848;
$bg-card: #243447;

// 渐变色
$gradient-primary: linear-gradient(135deg, #00d4ff 0%, #6366f1 100%);
$gradient-ocean: linear-gradient(135deg, #00d4ff 0%, #0ea5e9 50%, #6366f1 100%);
```

### 6.3 动画效果

```scss
@import '@/styles/animations.scss';

// 使用预定义动画类
.my-element {
  &:hover {
    @extend .animate-pulse-glow;
  }
}

// 或直接使用动画
.animated-box {
  animation: float 6s ease-in-out infinite;
}
```

---

## 七、新增页面开发流程

### 7.1 创建页面组件

在 `src/views/` 对应模块目录下创建 Vue 组件：

```vue
<!-- src/views/maintenance/NewFeature.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)
const dataList = ref([])

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    // 加载数据
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ t('newFeature.title') }}</h2>
    </div>

    <div class="page-content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
</style>
```

### 7.2 添加路由配置

在 `src/router/routes.ts` 中添加路由：

```typescript
{
  path: 'new-feature',
  name: 'maintenance-new-feature',
  component: () => import('@/views/maintenance/NewFeature.vue'),
  meta: {
    title: '新功能',
    titleEn: 'New Feature',
    requiresAuth: true
  }
}
```

### 7.3 添加菜单配置

在 `src/stores/menu.ts` 的 `defaultMenus` 中添加：

```typescript
{
  id: 'maintenance-new-feature',
  path: '/maintenance/new-feature',
  name: 'maintenance-new-feature',
  icon: 'fa-star',
  title: '新功能',
  titleEn: 'New Feature',
  enabled: true,
  sort: 4
}
```

### 7.4 添加国际化文本

在语言文件中添加翻译：

```typescript
// zh-CN.ts
menu: {
  maintenance: {
    // ...
    newFeature: '新功能'
  }
},
newFeature: {
  title: '新功能',
  // ...
}

// en-US.ts
menu: {
  maintenance: {
    // ...
    newFeature: 'New Feature'
  }
},
newFeature: {
  title: 'New Feature',
  // ...
}
```

---

## 八、API 调用规范

### 8.1 定义 API 接口

在 `src/api/` 目录下创建模块：

```typescript
// src/api/newFeature.ts
import request from '@/utils/request'
import type { ApiResponse } from '@/types'

export interface NewFeatureItem {
  id: string
  name: string
  // ...
}

export function getNewFeatureList(): Promise<ApiResponse<NewFeatureItem[]>> {
  return request.get('/api/new-feature/list')
}

export function createNewFeature(data: Partial<NewFeatureItem>): Promise<ApiResponse<NewFeatureItem>> {
  return request.post('/api/new-feature/create', data)
}
```

### 8.2 在组件中使用

```typescript
import { getNewFeatureList, createNewFeature } from '@/api/newFeature'

const list = ref<NewFeatureItem[]>([])

async function fetchList() {
  try {
    const res = await getNewFeatureList()
    if (res.code === 0) {
      list.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch list:', error)
  }
}
```

---

## 九、开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check
```

---

## 十、测试账号

| 账号 | 密码 | 角色 | 可访问菜单 |
|------|------|------|-----------|
| deepnet | deepnet123 | 超级管理员 | 全部 |
| sysadm | sysadm123 | 系统管理员 | 全部 |
| admin | admin123 | 普通管理员 | 大部分 |
| auditor | auditor123 | 审计员 | 状态监视、审计日志 |

---

## 十一、常见问题

### Q1: 如何修改主题色？

修改 `src/styles/variables.scss` 中的 `$primary-color` 及相关变量。

### Q2: 如何添加新的权限？

1. 在 `src/stores/menu.ts` 的 `roleMenuMap` 中添加菜单 ID
2. 在路由的 `meta.roles` 中配置角色权限

### Q3: 如何切换语言？

```typescript
import { setI18nLanguage } from '@/locales'

setI18nLanguage('en-US')
```

### Q4: 页面样式不生效？

确保在 `scoped` 样式中使用 `$变量名`，并正确引入 `variables.scss`。

---

## 十二、更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2024-03-27 | 1.0.0 | 初始版本，完成基础框架搭建 |
| 2024-03-27 | 1.1.0 | 添加 deepnet 超级管理员角色 |
| 2024-03-27 | 1.2.0 | 优化主题风格，提升亮度 |
| 2024-03-27 | 1.3.0 | 重构国际化架构，支持多语言扩展 |

---

## 十三、联系方式

如有问题，请联系项目负责人或提交 Issue。

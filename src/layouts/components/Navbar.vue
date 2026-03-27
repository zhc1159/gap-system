<!-- Navbar.vue - Top Navigation Component -->

<template>
  <div class="navbar-container">
    <!-- Left section -->
    <div class="navbar-left">
      <!-- Collapse toggle -->
      <div class="collapse-toggle" @click="toggleCollapse">
        <el-icon :class="{ 'is-collapse': isCollapse }">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- Breadcrumb -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          <span v-if="item.redirect === 'noRedirect' || item === breadcrumbs[breadcrumbs.length - 1]">
            {{ locale === 'zh-CN' ? item.meta?.title : (item.meta?.titleEn || item.meta?.title) }}
          </span>
          <router-link v-else :to="item.path">
            {{ locale === 'zh-CN' ? item.meta?.title : (item.meta?.titleEn || item.meta?.title) }}
          </router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Center section - Time & Status -->
    <div class="navbar-center">
      <!-- System Time -->
      <div class="system-time">
        <el-icon><Clock /></el-icon>
        <span>{{ currentTime }}</span>
      </div>

      <!-- Link Status -->
      <div class="link-status" :class="{ 'status-ok': isLinkOk, 'status-error': !isLinkOk }">
        <el-icon :class="{ 'pulse-animation': !isLinkOk }">
          <Connection />
        </el-icon>
        <span>{{ isLinkOk ? t('navbar.linkOk') : t('navbar.linkError') }}</span>
      </div>

      <!-- Gap Position -->
      <div class="gap-position">
        <el-tag :type="gapWhere === 'intranet' ? 'primary' : 'success'" size="small">
          {{ gapWhere === 'intranet' ? t('navbar.intranet') : t('navbar.extranet') }}
        </el-tag>
      </div>
    </div>

    <!-- Right section -->
    <div class="navbar-right">
      <!-- Language Switch -->
      <el-dropdown @command="handleLanguageChange">
        <div class="nav-item language-switch">
          <el-icon><Promotion /></el-icon>
          <span>{{ locale === 'zh-CN' ? '中文' : 'EN' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ active: locale === 'zh-CN' }">
              中文
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :class="{ active: locale === 'en-US' }">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- Notifications -->
      <el-dropdown>
        <div class="nav-item notification-bell">
          <el-badge :value="notificationCount" :hidden="notificationCount === 0" :max="99">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="notification-dropdown">
            <div class="notification-header">
              <span>{{ t('navbar.notifications') }}</span>
            </div>
            <div class="notification-list">
              <div v-if="notifications.length === 0" class="no-notifications">
                {{ t('navbar.noNotifications') }}
              </div>
              <div v-for="item in notifications" :key="item.id" class="notification-item">
                <el-icon><Bell /></el-icon>
                <span>{{ item.message }}</span>
                <span class="notification-time">{{ item.time }}</span>
              </div>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- User Menu -->
      <el-dropdown @command="handleCommand">
        <div class="nav-item user-menu">
          <el-avatar :size="32" :src="avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
          <span class="username">{{ nickname || username }}</span>
          <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              {{ t('navbar.profile') }}
            </el-dropdown-item>
            <el-dropdown-item command="password">
              <el-icon><Lock /></el-icon>
              {{ t('navbar.changePassword') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              {{ t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Fold,
  Expand,
  Clock,
  Connection,
  Bell,
  UserFilled,
  User,
  Lock,
  SwitchButton,
  ArrowDown,
  Promotion
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useLayoutStore } from '@/stores/layout'
import { useAppStore } from '@/stores/app'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const appStore = useAppStore()

// State
const currentTime = ref('')
const notificationCount = ref(0)
const notifications = ref<any[]>([])
let timeInterval: ReturnType<typeof setInterval> | null = null

// Computed
const isCollapse = computed(() => layoutStore.isCollapse)
const isLinkOk = computed(() => appStore.isLinkOk)
const gapWhere = computed(() => appStore.gapWhere)
const username = computed(() => userStore.username)
const nickname = computed(() => userStore.nickname)
const avatar = computed(() => userStore.avatar)

// Breadcrumbs
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched
})

// Methods
function toggleCollapse() {
  layoutStore.toggleCollapse()
}

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function handleLanguageChange(lang: string) {
  locale.value = lang as any
  appStore.setLanguage(lang as 'zh-CN' | 'en-US')
  ElMessage.success(lang === 'zh-CN' ? '语言切换成功' : 'Language changed')
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'password':
      router.push('/password')
      break
    case 'logout':
      handleLogout()
      break
  }
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm(
      t('navbar.logoutConfirm'),
      t('common.confirm'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    await userStore.logout()
    ElMessage.success(t('login.message.success'))
  } catch {
    // User cancelled
  }
}

// Lifecycle
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 $spacing-md;
}

// Left section
.navbar-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .collapse-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: $radius-md;
    transition: all $transition-fast;

    &:hover {
      background: $bg-hover;
    }

    .el-icon {
      font-size: 18px;
      color: $text-secondary;
      transition: transform $transition-normal;

      &.is-collapse {
        transform: rotate(180deg);
      }
    }
  }

  .breadcrumb {
    :deep(.el-breadcrumb__inner) {
      color: $text-secondary;

      a {
        color: $text-secondary;
        transition: color $transition-fast;

        &:hover {
          color: $primary-color;
        }
      }
    }

    :deep(.el-breadcrumb__separator) {
      color: $text-muted;
    }
  }
}

// Center section
.navbar-center {
  display: flex;
  align-items: center;
  gap: $spacing-lg;

  .system-time,
  .link-status,
  .gap-position {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $text-secondary;
    font-size: $font-size-sm;

    .el-icon {
      font-size: 16px;
    }
  }

  .link-status {
    &.status-ok {
      color: $success-color;

      .el-icon {
        color: $success-color;
      }
    }

    &.status-error {
      color: $danger-color;

      .el-icon {
        color: $danger-color;
      }

      .pulse-animation {
        animation: blink 1s ease-in-out infinite;
      }
    }
  }
}

// Right section
.navbar-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .nav-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-sm;
    cursor: pointer;
    border-radius: $radius-md;
    transition: all $transition-fast;

    &:hover {
      background: $bg-hover;
    }

    .el-icon {
      font-size: 18px;
      color: $text-secondary;
    }

    span {
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }

  .language-switch {
    span {
      min-width: 30px;
    }
  }

  .notification-bell {
    :deep(.el-badge__content) {
      background: $danger-color;
    }
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .el-avatar {
      background: $gradient-primary;
    }

    .username {
      color: $text-primary;
      font-weight: 500;
    }

    .dropdown-arrow {
      font-size: 12px;
      color: $text-muted;
    }
  }
}

// Notification dropdown
.notification-dropdown {
  .notification-header {
    padding: $spacing-sm $spacing-md;
    border-bottom: 1px solid $border-color;
    font-weight: 600;
    color: $text-primary;
  }

  .notification-list {
    max-height: 300px;
    overflow-y: auto;

    .no-notifications {
      padding: $spacing-lg;
      text-align: center;
      color: $text-muted;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      border-bottom: 1px solid $border-color;
      transition: background $transition-fast;

      &:hover {
        background: $bg-hover;
      }

      .el-icon {
        color: $primary-color;
      }

      .notification-time {
        margin-left: auto;
        font-size: $font-size-xs;
        color: $text-muted;
      }
    }
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>

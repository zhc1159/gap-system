<!-- Sidebar.vue - Side Navigation Component -->

<template>
  <div class="sidebar-container">
    <!-- Logo Area -->
    <div class="sidebar-logo" :class="{ 'logo-collapse': isCollapse }">
      <router-link to="/" class="logo-link">
        <div class="logo-icon">
          <el-icon><Odometer /></el-icon>
        </div>
        <transition name="logo-text">
          <span v-if="!isCollapse" class="logo-text">{{ systemName }}</span>
        </transition>
      </router-link>
    </div>

    <!-- Search Box -->
    <div class="sidebar-search" v-if="!isCollapse">
      <el-input
        v-model="searchKeyword"
        :placeholder="t('menu.search.placeholder')"
        clearable
        size="small"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- Menu List -->
    <el-scrollbar class="sidebar-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="openMenus"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        :router="true"
        class="sidebar-menu"
        background-color="transparent"
        text-color="#cbd5e1"
        active-text-color="#00d4ff"
      >
        <template v-for="menu in filteredMenuList" :key="menu.id">
          <!-- Has children -->
          <el-sub-menu
            v-if="menu.children && menu.children.length > 0"
            :index="menu.id"
            class="menu-item-wrapper"
          >
            <template #title>
              <el-icon v-if="menu.icon">
                <component :is="getIconComponent(menu.icon)" />
              </el-icon>
              <span>{{ currentLocale === 'zh-CN' ? menu.title : menu.titleEn }}</span>
            </template>

            <!-- Second level menu -->
            <template v-for="subMenu in menu.children" :key="subMenu.id">
              <!-- Has third level -->
              <el-sub-menu
                v-if="subMenu.children && subMenu.children.length > 0"
                :index="subMenu.id"
                class="sub-menu-wrapper"
              >
                <template #title>
                  <el-icon v-if="subMenu.icon">
                    <component :is="getIconComponent(subMenu.icon)" />
                  </el-icon>
                  <span>{{ currentLocale === 'zh-CN' ? subMenu.title : subMenu.titleEn }}</span>
                </template>

                <!-- Third level menu -->
                <el-menu-item
                  v-for="thirdMenu in subMenu.children"
                  :key="thirdMenu.id"
                  :index="thirdMenu.path"
                  class="third-menu-item"
                >
                  <el-icon v-if="thirdMenu.icon">
                    <component :is="getIconComponent(thirdMenu.icon)" />
                  </el-icon>
                  <span>{{ currentLocale === 'zh-CN' ? thirdMenu.title : thirdMenu.titleEn }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- No third level -->
              <el-menu-item
                v-else
                :index="subMenu.path"
                class="sub-menu-item"
              >
                <el-icon v-if="subMenu.icon">
                  <component :is="getIconComponent(subMenu.icon)" />
                </el-icon>
                <span>{{ currentLocale === 'zh-CN' ? subMenu.title : subMenu.titleEn }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- No children -->
          <el-menu-item
            v-else
            :index="menu.path"
            class="menu-item-wrapper single-menu"
          >
            <el-icon v-if="menu.icon">
              <component :is="getIconComponent(menu.icon)" />
            </el-icon>
            <span>{{ currentLocale === 'zh-CN' ? menu.title : menu.titleEn }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- Collapse Toggle Button -->
    <div class="sidebar-toggle" @click="toggleCollapse">
      <el-icon :class="{ 'is-collapse': isCollapse }">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
      <span v-if="!isCollapse">{{ t('menu.collapse') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Fold,
  Expand,
  Odometer,
  Document,
  User,
  UserFilled,
  Link,
  Setting,
  Sort,
  VideoCamera,
  Grid,
  Refresh,
  Download,
  View,
  Tools,
  Clock,
  
  DataLine,
  TrendCharts,
  Monitor,
  Lock
} from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
import { useLayoutStore } from '@/stores/layout'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
const route = useRoute()
const menuStore = useMenuStore()
const layoutStore = useLayoutStore()
const appStore = useAppStore()

// Computed
const currentLocale = computed(() => appStore.language)
const searchKeyword = computed({
  get: () => menuStore.searchKeyword,
  set: (val) => { menuStore.searchKeyword = val }
})
const filteredMenuList = computed(() => menuStore.filteredMenuList)
const activeMenu = computed(() => menuStore.activeMenu)
const openMenus = computed(() => menuStore.openMenus)
const isCollapse = computed(() => layoutStore.isCollapse)
const systemName = computed(() => '安全隔离网闸')

// Icon mapping
const iconMap: Record<string, Component> = {
  'fa-book': Document,
  'fa-users': UserFilled,
  'fa-user-plus': User,
  'fa-object-group': Grid,
  'fa-link': Link,
  'fa-shield': Lock,
  'fa-random': Sort,
  'fa-video-camera': VideoCamera,
  'fa-cubes': Grid,
  'fa-retweet': Refresh,
  'fa-copy': Document,
  'fa-download': Download,
  'fa-eye': View,
  'fa-cogs': Setting,
  'fa-wrench': Tools,
  'fa-cog': Setting,
  'fa-clock': Clock,
  'fa-ban': Lock,
  'fa-database': DataLine,
  'fa-exchange': Refresh,
  'fa-cloud-upload': Download,
  'fa-bar-chart': TrendCharts,
  'fa-heartbeat': Odometer,
  'fa-sliders': Setting,
  'fa-monitor': Monitor
}

// Get icon component
function getIconComponent(iconName: string): Component {
  return iconMap[iconName] || Document
}

// Toggle collapse
function toggleCollapse() {
  layoutStore.toggleCollapse()
}

// Lifecycle
onMounted(async () => {
  await menuStore.loadMenu()
  menuStore.setActiveMenu(route.path)
})
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-darker;
}

// Logo area
.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $spacing-md;
  border-bottom: 1px solid $border-color;
  transition: all $transition-normal;

  &.logo-collapse {
    padding: 0;

    .logo-link {
      justify-content: center;
    }
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: $spacing-sm;

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        font-size: 28px;
        color: $primary-color;
      }
    }

    .logo-text {
      font-size: $font-size-lg;
      font-weight: 700;
      color: $text-primary;
      background: $gradient-primary;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
    }
  }
}

// Search box
.sidebar-search {
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;

  :deep(.el-input) {
    .el-input__wrapper {
      background: $bg-card;
      border: 1px solid $border-color;
      border-radius: $radius-md;
      box-shadow: none;

      &:hover {
        border-color: $primary-color;
      }

      &.is-focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
      }
    }

    .el-input__inner {
      color: $text-primary;

      &::placeholder {
        color: $text-muted;
      }
    }

    .el-input__prefix {
      color: $text-muted;
    }
  }
}

// Menu scroll area
.sidebar-menu-wrapper {
  flex: 1;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 3px;

    &:hover {
      background: $border-light;
    }
  }
}

// Menu styles
.sidebar-menu {
  border: none;

  // First level menu
  .menu-item-wrapper {
    &.single-menu {
      .el-menu-item {
        height: 50px;
        line-height: 50px;

        &:hover {
          background: rgba(0, 212, 255, 0.1) !important;
        }

        &.is-active {
          background: $gradient-primary !important;
          color: white !important;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: $primary-color;
            box-shadow: 0 0 10px $primary-color;
          }
        }
      }
    }

    :deep(.el-sub-menu__title) {
      height: 50px;
      line-height: 50px;

      &:hover {
        background: rgba(0, 212, 255, 0.1) !important;
      }
    }

    &.is-active > .el-sub-menu__title {
      color: $primary-color !important;
    }
  }

  // Second level menu
  .sub-menu-wrapper {
    :deep(.el-sub-menu__title) {
      height: 45px;
      line-height: 45px;
      padding-left: 50px !important;

      &:hover {
        background: rgba(0, 212, 255, 0.1) !important;
      }
    }
  }

  .sub-menu-item {
    height: 45px;
    line-height: 45px;
    padding-left: 50px !important;

    &:hover {
      background: rgba(0, 212, 255, 0.1) !important;
    }

    &.is-active {
      background: rgba(0, 212, 255, 0.2) !important;
      color: $primary-color !important;
    }
  }

  // Third level menu
  .third-menu-item {
    height: 40px;
    line-height: 40px;
    padding-left: 70px !important;

    &:hover {
      background: rgba(0, 212, 255, 0.1) !important;
    }

    &.is-active {
      background: rgba(0, 212, 255, 0.2) !important;
      color: $primary-color !important;
    }
  }
}

// Collapse toggle button
.sidebar-toggle {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  border-top: 1px solid $border-color;
  cursor: pointer;
  transition: all $transition-fast;
  color: $text-secondary;
  font-size: $font-size-sm;

  &:hover {
    background: $bg-hover;
    color: $primary-color;
  }

  .el-icon {
    font-size: 16px;
    transition: transform $transition-normal;

    &.is-collapse {
      transform: rotate(180deg);
    }
  }
}
</style>

<!-- ===========================================
     BaseLayout.vue - Main Layout Component
     =========================================== -->

<template>
  <el-container class="base-layout">
    <!-- Sidebar -->
    <el-aside
      class="layout-aside"
      :width="sidebarWidth"
      :class="{ 'aside-collapsed': isCollapse }"
    >
      <Sidebar />
    </el-aside>

    <el-container class="layout-main-container">
      <!-- Header / Navbar -->
      <el-header class="layout-header" height="60px">
        <Navbar />
      </el-header>

      <!-- Main Content -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <!-- Footer -->
      <el-footer class="layout-footer" height="40px">
        <div class="footer-content">
          <span>{{ t('footer.copyright') }}</span>
          <span class="divider">|</span>
          <span>{{ t('footer.version') }}: {{ version }}</span>
        </div>
      </el-footer>
    </el-container>

    <!-- Back to top -->
    <el-backtop :bottom="60" :right="40" target=".layout-main">
      <div class="backtop-button">
        <el-icon><ArrowUp /></el-icon>
      </div>
    </el-backtop>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUp } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { useAppStore } from '@/stores/app'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const { t } = useI18n()
const layoutStore = useLayoutStore()
const appStore = useAppStore()

// Computed
const isCollapse = computed(() => layoutStore.isCollapse)
const sidebarWidth = computed(() => layoutStore.sidebarWidth)
const version = computed(() => appStore.version)
const cachedViews = computed(() => [])

// Handle window resize
function handleResize() {
  layoutStore.handleResize()
}

// Lifecycle
onMounted(() => {
  // Load system config
  appStore.loadSystemConfig()
  // Listen for window resize
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.base-layout {
  height: 100vh;
  background: $bg-primary;
  overflow: hidden;

  // Sidebar
  .layout-aside {
    background: $bg-darker;
    border-right: 1px solid $border-color;
    transition: width $transition-normal;
    overflow: hidden;

    &.aside-collapsed {
      width: 64px !important;
    }
  }

  // Main container
  .layout-main-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  // Header
  .layout-header {
    background: $gradient-header;
    border-bottom: 1px solid $border-color;
    padding: 0;
    display: flex;
    align-items: center;
    height: 60px;
    z-index: 1000;
  }

  // Main content
  .layout-main {
    background: $bg-primary;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    flex: 1;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: $border-color;
      border-radius: 4px;

      &:hover {
        background: $border-light;
      }
    }
  }

  // Footer
  .layout-footer {
    background: $bg-darker;
    border-top: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: center;

    .footer-content {
      color: $text-muted;
      font-size: $font-size-xs;

      .divider {
        margin: 0 $spacing-md;
        color: $border-color;
      }
    }
  }

  // Back to top
  .backtop-button {
    width: 40px;
    height: 40px;
    background: $gradient-primary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    box-shadow: $shadow-glow;
    transition: all $transition-fast;

    &:hover {
      transform: scale(1.1);
      box-shadow: $shadow-glow-strong;
    }
  }
}

// Page transition animation
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

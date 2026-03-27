<!-- ===========================================
     LoadingOverlay - Loading Overlay Component
     =========================================== -->

<template>
  <transition name="fade">
    <div v-if="visible" class="loading-overlay" :class="{ 'is-fullscreen': fullscreen }">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  text?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '',
  fullscreen: false
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: $z-index-modal;

  &.is-fullscreen {
    position: fixed;
    z-index: $z-index-modal + 100;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin 1.5s linear infinite;

  &:nth-child(1) {
    border-top-color: $primary-color;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    border-right-color: $secondary-color;
    animation-delay: 0.2s;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }

  &:nth-child(3) {
    border-bottom-color: $primary-light;
    animation-delay: 0.4s;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: $text-primary;
  font-size: $font-size-base;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

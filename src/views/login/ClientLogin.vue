<!-- ===========================================
     ClientLogin.vue - Client User Login Page
     =========================================== -->

<template>
  <div class="client-login-container">
    <!-- Background Effects -->
    <div class="background-effects">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="particle-layer"></div>
    </div>

    <!-- Language Switcher -->
    <div class="language-switcher">
      <span
        :class="{ active: currentLanguage === 'zh-CN' }"
        @click="switchLanguage('zh-CN')"
      >中文</span>
      <span class="divider">/</span>
      <span
        :class="{ active: currentLanguage === 'en-US' }"
        @click="switchLanguage('en-US')"
      >EN</span>
    </div>

    <!-- Login Card -->
    <div class="client-login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="header-icon">
          <el-icon :size="40"><UserFilled /></el-icon>
        </div>
        <h1 class="login-title">{{ t('clientLogin.title') }}</h1>
        <p class="login-subtitle">{{ t('clientLogin.subtitle') }}</p>
      </div>

      <!-- Login Form -->
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <!-- Username -->
        <el-form-item prop="username" class="form-item">
          <el-input
            v-model="loginForm.username"
            :placeholder="t('clientLogin.usernamePlaceholder')"
            class="client-input"
            size="large"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Password -->
        <el-form-item prop="pwd" class="form-item">
          <el-input
            v-model="loginForm.pwd"
            type="password"
            :placeholder="t('clientLogin.passwordPlaceholder')"
            class="client-input"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Fingerprint (conditional) -->
        <el-form-item v-if="authConfig.finger_switch" class="form-item">
          <el-button
            class="fingerprint-button"
            :class="{ 'is-loading': fingerprintLoading }"
            :loading="fingerprintLoading"
            @click="handleFingerprint"
          >
            <el-icon><Unlock /></el-icon>
            {{ fingerprintLoading ? t('clientLogin.fingerprintTip') : t('clientLogin.fingerprint') }}
          </el-button>
        </el-form-item>

        <!-- OTP (conditional) -->
        <el-form-item v-if="authConfig.otp_switch" prop="one_time_pwd" class="form-item">
          <el-input
            v-model="loginForm.one_time_pwd"
            :placeholder="t('clientLogin.otpPlaceholder')"
            class="client-input"
            size="large"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Privacy Agreement -->
        <el-form-item prop="privacyAccepted" class="form-item">
          <el-checkbox v-model="loginForm.privacyAccepted" class="privacy-checkbox">
            {{ t('clientLogin.privacy') }}
            <el-link type="primary" class="privacy-link" @click.stop="showPrivacyDialog = true">
              {{ t('clientLogin.privacyDetail') }}
            </el-link>
          </el-checkbox>
        </el-form-item>

        <!-- Login Button -->
        <el-form-item class="form-item">
          <el-button
            type="primary"
            class="client-login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? t('clientLogin.logging') : t('clientLogin.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Footer Links -->
    <div class="login-footer">
      {{ t('clientLogin.footer.help') }}
      <a class="footer-link" @click="contactAdmin">
        {{ t('clientLogin.footer.contact') }}
      </a>
    </div>

    <!-- Privacy Dialog -->
    <PrivacyDialog v-model="showPrivacyDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Unlock, Key, UserFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import PrivacyDialog from './components/PrivacyDialog.vue'

// ===========================================
// Interfaces
// ===========================================
interface IClientLoginForm {
  username: string
  pwd: string
  fingerCode1?: string
  one_time_pwd?: string
  privacyAccepted: boolean
}

interface IClientAuthConfig {
  finger_switch: boolean
  otp_switch: boolean
}

// ===========================================
// Composables
// ===========================================
const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// ===========================================
// Refs
// ===========================================
const formRef = ref<FormInstance>()
const loading = ref(false)
const fingerprintLoading = ref(false)
const showPrivacyDialog = ref(false)

// ===========================================
// Reactive Data
// ===========================================
const loginForm = reactive<IClientLoginForm>({
  username: '',
  pwd: '',
  fingerCode1: '',
  one_time_pwd: '',
  privacyAccepted: false
})

const authConfig = reactive<IClientAuthConfig>({
  finger_switch: false,
  otp_switch: false
})

// ===========================================
// Computed
// ===========================================
const currentLanguage = computed(() => appStore.language)

const loginRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('clientLogin.validation.usernameRequired'), trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: t('clientLogin.validation.passwordRequired'), trigger: 'blur' }
  ],
  one_time_pwd: authConfig.otp_switch
    ? [{ required: true, message: t('clientLogin.validation.otpRequired'), trigger: 'blur' }]
    : [],
  privacyAccepted: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error(t('clientLogin.validation.privacyRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}))

// ===========================================
// Methods
// ===========================================
function switchLanguage(lang: 'zh-CN' | 'en-US') {
  appStore.setLanguage(lang)
  locale.value = lang
}

async function handleFingerprint() {
  fingerprintLoading.value = true
  try {
    // Simulate fingerprint capture - replace with actual device API
    await new Promise(resolve => setTimeout(resolve, 2000))
    loginForm.fingerCode1 = 'fingerprint_data_' + Date.now()
    ElMessage.success(t('clientLogin.message.fingerprintSuccess'))
  } catch {
    ElMessage.error(t('clientLogin.message.fingerprintFailed'))
  } finally {
    fingerprintLoading.value = false
  }
}

async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate login success
      const mockToken = 'client_token_' + Date.now()
      sessionStorage.setItem('clientToken', mockToken)

      ElMessage.success(t('clientLogin.message.success'))

      // Redirect
      const redirect = route.query.redirect as string
      router.push(redirect || '/client/home')
    } catch (error: any) {
      ElMessage.error(error.message || t('clientLogin.message.failed'))
    } finally {
      loading.value = false
    }
  })
}

function contactAdmin() {
  ElMessage.info(t('clientLogin.footer.contact'))
}

async function fetchAuthConfig() {
  try {
    // Mock API call - replace with actual API
    // const res = await getClientAuthConfigApi()
    // Object.assign(authConfig, res.data)

    // Temporary mock data
    authConfig.finger_switch = true
    authConfig.otp_switch = true
  } catch (error) {
    console.error('Failed to fetch auth config:', error)
  }
}

// ===========================================
// Lifecycle
// ===========================================
onMounted(() => {
  fetchAuthConfig()
})
</script>

<style scoped lang="scss">
.client-login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0f0a1e;
}

// Background Effects
.background-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .gradient-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;

    &.circle-1 {
      width: 600px;
      height: 600px;
      background: #6366f1;
      top: -200px;
      left: -200px;
      animation: float 20s ease-in-out infinite;
    }

    &.circle-2 {
      width: 500px;
      height: 500px;
      background: #8b5cf6;
      bottom: -150px;
      right: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }
  }

  .particle-layer {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(2px 2px at 20px 30px, rgba(139, 92, 246, 0.4), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(99, 102, 241, 0.3), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(168, 85, 247, 0.5), transparent),
      radial-gradient(2px 2px at 130px 80px, rgba(139, 92, 246, 0.4), transparent),
      radial-gradient(1px 1px at 160px 120px, rgba(99, 102, 241, 0.5), transparent);
    background-repeat: repeat;
    background-size: 200px 150px;
    animation: particle-float 30s linear infinite;
    opacity: 0.6;
  }
}

// Language Switcher
.language-switcher {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
  text-align: center;
  color: rgba(196, 181, 253, 0.8);
  font-size: 14px;

  span {
    cursor: pointer;
    transition: color 0.3s;

    &:hover,
    &.active {
      color: #6366f1;
    }
  }

  .divider {
    margin: 0 8px;
    cursor: default;
    color: rgba(139, 92, 246, 0.3);
  }
}

// Login Card
.client-login-card {
  width: 440px;
  max-width: 90vw;
  padding: 48px 40px;
  background: rgba(26, 19, 51, 0.85);
  border-radius: 24px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
  position: relative;
  z-index: 1;
  animation: card-fade-in 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    border-radius: 0 0 3px 3px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 40px;
    background: radial-gradient(ellipse, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
    filter: blur(10px);
    pointer-events: none;
  }
}

// Login Header
.login-header {
  text-align: center;
  margin-bottom: 36px;

  .header-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      opacity: 0.3;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  .login-title {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .login-subtitle {
    color: rgba(196, 181, 253, 0.8);
    font-size: 14px;
    font-weight: 400;
  }
}

// Form
.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;

    &.is-error {
      :deep(.el-input__wrapper) {
        border-color: #ef4444;
      }
    }
  }

  :deep(.el-form-item__error) {
    color: #ef4444;
    padding-top: 4px;
  }
}

// Form Items Animation
.form-item {
  animation: item-fade-in 0.4s ease-out;
  animation-fill-mode: both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }
}

// Input
.client-input {
  :deep(.el-input__wrapper) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    box-shadow: none;
    height: 48px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: rgba(99, 102, 241, 0.6);
      background: rgba(0, 0, 0, 0.4);
    }

    &.is-focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 0 30px rgba(139, 92, 246, 0.25);
    }
  }

  :deep(.el-input__inner) {
    color: $text-primary;
    font-size: 15px;

    &::placeholder {
      color: rgba(139, 92, 247, 0.6);
    }
  }

  :deep(.el-input__prefix) {
    color: rgba(196, 181, 253, 0.8);
    font-size: 18px;
  }
}

// Fingerprint Button
.fingerprint-button {
  width: 100%;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px dashed #6366f1;
  border-radius: 12px;
  color: rgba(196, 181, 253, 0.8);
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-style: solid;
    color: #6366f1;
  }

  &.is-loading {
    background: rgba(99, 102, 241, 0.15);
    border-style: solid;
  }
}

// Privacy Checkbox
.privacy-checkbox {
  width: 100%;
  color: rgba(139, 92, 247, 0.6);
  font-size: 13px;
  line-height: 1.5;

  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: rgba(196, 181, 253, 0.8);
  }

  :deep(.el-checkbox__inner) {
    background-color: rgba(99, 102, 241, 0.2);
    border-color: rgba(139, 92, 246, 0.2);

    &:hover {
      border-color: #6366f1;
    }

    &.is-checked {
      background-color: #6366f1;
      border-color: #6366f1;
    }
  }

  .privacy-link {
    font-size: 13px;
    margin-left: 4px;
    vertical-align: baseline;
  }
}

// Login Button
.client-login-button {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 3px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transform: rotate(45deg);
    animation: button-shine 3s ease-in-out infinite;
  }
}

// Footer
.login-footer {
  margin-top: 24px;
  text-align: center;
  color: rgba(139, 92, 247, 0.6);
  font-size: 13px;
  z-index: 1;

  .footer-link {
    color: rgba(196, 181, 253, 0.8);
    text-decoration: none;
    margin-left: 4px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #6366f1;
    }
  }
}

// Animations
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes card-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-150px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes button-shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  50%, 100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes item-fade-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .client-login-card {
    width: 90vw;
    padding: 36px 28px;
  }

  .language-switcher {
    top: 16px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .client-login-card {
    width: 95vw;
    padding: 32px 24px;
    border-radius: 20px;
  }

  .client-login-button {
    height: 48px;
    font-size: 15px;
    letter-spacing: 2px;
  }
}
</style>

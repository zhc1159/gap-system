<!-- ===========================================
     LoginIndex.vue - Admin Login Page
     =========================================== -->

<template>
  <div class="login-container">
    <!-- Background Effects -->
    <div class="background-effects">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Left Section - Login Form -->
    <div class="login-left">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <h1 class="login-title">{{ t('login.title') }}</h1>
          <p class="login-subtitle">{{ t('login.subtitle') }}</p>
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
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :placeholder="t('login.usernamePlaceholder')"
              class="login-input"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Password -->
          <el-form-item prop="pwd">
            <el-input
              v-model="loginForm.pwd"
              type="password"
              :placeholder="t('login.passwordPlaceholder')"
              class="login-input"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Certificate Upload (conditional) -->
          <el-form-item v-if="authSwitch.user_cert === 'on'" prop="cert_file">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleCertChange"
              accept=".p12,.pfx,.crt"
              class="cert-upload"
            >
              <el-input
                :model-value="loginForm.cert_file?.name || ''"
                :placeholder="t('login.certificatePlaceholder')"
                class="login-input"
                size="large"
                readonly
              >
                <template #prefix>
                  <el-icon><Document /></el-icon>
                </template>
              </el-input>
            </el-upload>
          </el-form-item>

          <!-- Fingerprint (conditional) -->
          <el-form-item v-if="authSwitch.finger_switch">
            <el-button
              class="fingerprint-btn"
              :loading="fingerprintLoading"
              @click="handleFingerprint"
            >
              <el-icon><Key /></el-icon>
              {{ fingerprintLoading ? t('login.fingerprintTip') : t('login.fingerprint') }}
            </el-button>
          </el-form-item>

          <!-- OTP (conditional) -->
          <el-form-item v-if="authSwitch.otp_switch" prop="one_time_pwd">
            <el-input
              v-model="loginForm.one_time_pwd"
              :placeholder="t('login.otpPlaceholder')"
              class="login-input"
              size="large"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- UKey PIN (conditional) -->
          <el-form-item v-if="authSwitch.ukey_switch" prop="pin_code">
            <el-input
              v-model="loginForm.pin_code"
              type="password"
              :placeholder="t('login.pinPlaceholder')"
              class="login-input"
              size="large"
            >
              <template #prefix>
                <el-icon><Unlock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Privacy Agreement -->
          <el-form-item prop="privacyAccepted">
            <el-checkbox v-model="loginForm.privacyAccepted" class="privacy-checkbox">
              {{ t('login.privacy') }}
              <el-link type="primary" @click.stop="showPrivacyDialog = true">
                {{ t('login.privacyLink') }}
              </el-link>
            </el-checkbox>
          </el-form-item>

          <!-- Login Button -->
          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? t('login.logging') : t('login.submit') }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- Language Switch -->
        <div class="language-switch">
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
      </div>
    </div>

    <!-- Right Section - Product Introduction -->
    <div class="login-right">
      <div class="product-intro">
        <h2 class="product-title">{{ t('login.productIntro.title') }}</h2>
        <ul class="product-features">
          <li class="feature-item">
            <el-icon class="feature-icon"><Monitor /></el-icon>
            {{ t('login.productIntro.feature1') }}
          </li>
          <li class="feature-item">
            <el-icon class="feature-icon"><Connection /></el-icon>
            {{ t('login.productIntro.feature2') }}
          </li>
          <li class="feature-item">
            <el-icon class="feature-icon"><Upload /></el-icon>
            {{ t('login.productIntro.feature3') }}
          </li>
          <li class="feature-item">
            <el-icon class="feature-icon"><Lock /></el-icon>
            {{ t('login.productIntro.feature4') }}
          </li>
        </ul>

        <!-- Product Image -->
        <div class="product-image">
          <div class="tech-circle">
            <div class="inner-circle"></div>
            <div class="orbit orbit-1"></div>
            <div class="orbit orbit-2"></div>
            <div class="orbit orbit-3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Dialog -->
    <PrivacyDialog v-model="showPrivacyDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, UploadFile, FormRules } from 'element-plus'
import {
  User,
  Lock,
  Document,
  Key,
  Unlock,
  Monitor,
  Connection,
  Upload
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { getAuthSwitchApi } from '@/api/auth'
import PrivacyDialog from './components/PrivacyDialog.vue'
import type { ILoginForm, IAuthSwitch } from '@/types'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

// Refs
const formRef = ref<FormInstance>()
const loading = ref(false)
const fingerprintLoading = ref(false)
const showPrivacyDialog = ref(false)

// Form data
const loginForm = reactive<ILoginForm>({
  username: '',
  pwd: '',
  cert_file: null,
  fingerCode1: '',
  one_time_pwd: '',
  pin_code: '',
  privacyAccepted: false
})

// Auth switch configuration
const authSwitch = reactive<IAuthSwitch>({
  user_cert: 'off',
  finger_switch: false,
  otp_switch: false,
  ukey_switch: false
})

// Current language
const currentLanguage = computed(() => appStore.language)

// Form validation rules
const loginRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('login.validation.usernameRequired'), trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' }
  ],
  cert_file: authSwitch.user_cert === 'on'
    ? [{ required: true, message: t('login.validation.certRequired'), trigger: 'change' }]
    : [],
  one_time_pwd: authSwitch.otp_switch
    ? [{ required: true, message: t('login.validation.otpRequired'), trigger: 'blur' }]
    : [],
  pin_code: authSwitch.ukey_switch
    ? [{ required: true, message: t('login.validation.pinRequired'), trigger: 'blur' }]
    : [],
  privacyAccepted: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error(t('login.validation.privacyRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}))

// Certificate file change handler
function handleCertChange(file: UploadFile) {
  loginForm.cert_file = file.raw || null
}

// Fingerprint handler
async function handleFingerprint() {
  fingerprintLoading.value = true
  try {
    // Simulate fingerprint capture
    await new Promise(resolve => setTimeout(resolve, 2000))
    loginForm.fingerCode1 = 'fingerprint_data_' + Date.now()
    ElMessage.success('Fingerprint captured successfully')
  } catch {
    ElMessage.error('Fingerprint capture failed')
  } finally {
    fingerprintLoading.value = false
  }
}

// Login handler
async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.login(loginForm)
      ElMessage.success(t('login.message.success'))

      // Redirect
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    } catch (error: any) {
      ElMessage.error(error.message || t('login.message.failed'))
    } finally {
      loading.value = false
    }
  })
}

// Language switch
function switchLanguage(lang: 'zh-CN' | 'en-US') {
  appStore.setLanguage(lang)
  locale.value = lang
}

// Load auth switch config
async function loadAuthSwitch() {
  try {
    const res = await getAuthSwitchApi()
    Object.assign(authSwitch, res.data)
  } catch {
    // Use defaults
  }
}

// Lifecycle
onMounted(() => {
  loadAuthSwitch()
})
</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: $bg-darker;
}

// Background effects
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
      background: $primary-color;
      top: -200px;
      left: -200px;
      animation: float 20s ease-in-out infinite;
    }

    &.circle-2 {
      width: 500px;
      height: 500px;
      background: $secondary-color;
      bottom: -150px;
      right: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

// Left section - Login form
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
  min-width: 450px;
}

// Login card
.login-card {
  width: 420px;
  padding: 48px 40px;
  background: $bg-card;
  border-radius: 24px;
  border: 1px solid $border-color;
  backdrop-filter: blur(20px);
  box-shadow: $shadow-glow;
  position: relative;
  animation: card-enter 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: $gradient-primary;
    border-radius: 24px 24px 0 0;
  }
}

// Login header
.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-title {
    font-size: 28px;
    font-weight: 700;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .login-subtitle {
    color: $text-secondary;
    font-size: 14px;
  }
}

// Login form
.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

// Login input
.login-input {
  :deep(.el-input__wrapper) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid $border-color;
    border-radius: 12px;
    box-shadow: none;
    height: 48px;
    transition: all 0.3s ease;

    &:hover {
      border-color: $border-focus;
    }

    &.is-focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }
  }

  :deep(.el-input__inner) {
    color: $text-primary;
    font-size: 15px;

    &::placeholder {
      color: $text-muted;
    }
  }

  :deep(.el-input__prefix) {
    color: $text-secondary;
  }
}

// Certificate upload
.cert-upload {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;
  }
}

// Fingerprint button
.fingerprint-btn {
  width: 100%;
  height: 48px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px dashed $primary-color;
  border-radius: 12px;
  color: $primary-color;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-style: solid;
  }
}

// Privacy checkbox
.privacy-checkbox {
  color: $text-secondary;

  :deep(.el-checkbox__label) {
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
}

// Login button
.login-button {
  width: 100%;
  height: 48px;
  background: $gradient-primary;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: btn-shine 3s ease-in-out infinite;
  }
}

// Language switch
.language-switch {
  text-align: center;
  margin-top: 24px;
  color: $text-muted;
  font-size: 14px;

  span {
    cursor: pointer;
    transition: color 0.3s;

    &:hover,
    &.active {
      color: $primary-color;
    }
  }

  .divider {
    margin: 0 8px;
    cursor: default;
    color: $border-color;
  }
}

// Right section - Product introduction
.login-right {
  width: 45%;
  min-width: 500px;
  background: linear-gradient(135deg, $bg-secondary 0%, $bg-darker 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
}

// Product intro
.product-intro {
  text-align: center;
  position: relative;
  z-index: 1;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 40px;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-features {
  list-style: none;
  padding: 0;
  margin: 0 0 60px 0;

  .feature-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    margin-bottom: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: $text-primary;
    font-size: 15px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(0, 212, 255, 0.3);
      transform: translateX(5px);
    }

    .feature-icon {
      font-size: 20px;
      color: $primary-color;
    }
  }
}

// Tech circle animation
.product-image {
  display: flex;
  justify-content: center;
}

.tech-circle {
  width: 200px;
  height: 200px;
  position: relative;
  animation: float 6s ease-in-out infinite;

  .inner-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: $gradient-primary;
    border-radius: 50%;
    box-shadow: $shadow-glow-strong;
  }

  .orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);

    &.orbit-1 {
      width: 100px;
      height: 100px;
      animation: rotate 10s linear infinite;
    }

    &.orbit-2 {
      width: 150px;
      height: 150px;
      animation: rotate 15s linear infinite reverse;
    }

    &.orbit-3 {
      width: 200px;
      height: 200px;
      animation: rotate 20s linear infinite;
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

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes btn-shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  50%, 100% {
    transform: translateX(100%) rotate(45deg);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>

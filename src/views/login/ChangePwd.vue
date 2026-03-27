<!-- ===========================================
     ChangePwd.vue - Change Password Page
     For first login or password expiration
     =========================================== -->

<template>
  <div class="change-pwd-container">
    <!-- Background Effects -->
    <div class="background-effects">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Password Card -->
    <div class="password-card">
      <!-- Success State -->
      <div v-if="submitSuccess" class="success-result">
        <el-result icon="success" :title="t('password.change.success.title')">
          <template #sub-title>
            <p>{{ t('password.change.success.description') }}</p>
          </template>
          <template #extra>
            <el-button class="back-button" type="primary" @click="handleBackToLogin">
              {{ t('password.change.success.backToLogin') }}
            </el-button>
            <p class="redirect-info">
              {{ redirectCountdown }} {{ t('password.change.message.redirectMessage') }}
            </p>
          </template>
        </el-result>
      </div>

      <!-- Form State -->
      <template v-else>
        <!-- Header -->
        <div class="password-header">
          <div class="header-icon">
            <el-icon><Lock /></el-icon>
          </div>
          <h1 class="password-title">{{ titleText }}</h1>
          <p class="password-subtitle">{{ t('password.change.subtitle') }}</p>
        </div>

        <!-- Alert for expired/temporary password -->
        <el-alert
          v-if="expireStatus.isExpired || expireStatus.isTemporary"
          :title="alertTitle"
          type="warning"
          :closable="false"
          show-icon
          class="password-alert"
        />

        <!-- Password Form -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          class="password-form"
          @submit.prevent="handleSubmit"
        >
          <!-- Old Password -->
          <el-form-item prop="oldPwd">
            <el-input
              v-model="formData.oldPwd"
              type="password"
              :placeholder="t('password.change.oldPasswordPlaceholder')"
              class="password-input"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Unlock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- New Password -->
          <el-form-item prop="newPwd">
            <el-input
              v-model="formData.newPwd"
              type="password"
              :placeholder="t('password.change.newPasswordPlaceholder')"
              class="password-input"
              size="large"
              show-password
              @input="handlePasswordInput"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Password Strength -->
          <div v-if="formData.newPwd" class="password-strength" :class="strengthClass">
            <div class="strength-header">
              <span class="strength-label">{{ t('password.change.strength.title') }}</span>
              <span class="strength-tag">{{ strengthLabel }}</span>
            </div>
            <el-progress
              :percentage="strengthScore"
              :stroke-width="6"
              :show-text="false"
              :color="strengthColor"
              class="strength-progress"
            />
          </div>

          <!-- Confirm Password -->
          <el-form-item prop="newPwd2">
            <el-input
              v-model="formData.newPwd2"
              type="password"
              :placeholder="t('password.change.confirmPasswordPlaceholder')"
              class="password-input"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Password Rules -->
          <div class="password-rules">
            <div class="rules-title">
              <el-icon><InfoFilled /></el-icon>
              {{ t('password.change.rules.title') }}
            </div>
            <div
              v-for="(rule, key) in passwordRulesList"
              :key="key"
              class="rule-item"
              :class="getRuleStatus(key)"
            >
              <el-icon class="rule-icon">
                <component :is="getRuleIcon(key)" />
              </el-icon>
              <span>{{ rule }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <el-form-item>
            <el-button
              type="primary"
              class="submit-button"
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              {{ loading ? t('password.change.submitting') : t('password.change.submit') }}
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, Unlock, InfoFilled, Check, Close } from '@element-plus/icons-vue'

// ===========================================
// Interfaces
// ===========================================
interface IChangePwdForm {
  oldPwd: string
  newPwd: string
  newPwd2: string
}

interface IPasswordExpireStatus {
  isExpired: boolean
  isTemporary: boolean
  expireDate?: string
  daysUntilExpiry?: number
}

interface IPasswordValidation {
  minLength: boolean
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
  noSpaces: boolean
  notSameAsOld: boolean
}

type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'

// ===========================================
// Composables
// ===========================================
const { t } = useI18n()
const router = useRouter()

// ===========================================
// Refs
// ===========================================
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitSuccess = ref(false)
const redirectCountdown = ref(5)
let countdownTimer: number | null = null

// ===========================================
// Reactive Data
// ===========================================
const formData = reactive<IChangePwdForm>({
  oldPwd: '',
  newPwd: '',
  newPwd2: ''
})

const expireStatus = reactive<IPasswordExpireStatus>({
  isExpired: false,
  isTemporary: false,
  expireDate: undefined,
  daysUntilExpiry: undefined
})

const validation = reactive<IPasswordValidation>({
  minLength: false,
  hasLowercase: false,
  hasUppercase: false,
  hasNumber: false,
  hasSpecial: false,
  noSpaces: true,
  notSameAsOld: true
})

// ===========================================
// Password Rules List
// ===========================================
const passwordRulesList = computed(() => ({
  minLength: t('password.change.rules.minLength'),
  hasLowercase: t('password.change.rules.hasLowercase'),
  hasUppercase: t('password.change.rules.hasUppercase'),
  hasNumber: t('password.change.rules.hasNumber'),
  hasSpecial: t('password.change.rules.hasSpecial'),
  noSpaces: t('password.change.rules.noSpaces'),
  notSameAsOld: t('password.change.rules.notSameAsOld')
}))

// ===========================================
// Password Strength Calculation
// ===========================================
const strengthScore = computed(() => {
  if (!formData.newPwd) return 0
  return calculateStrength(formData.newPwd)
})

function calculateStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15
  const types = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ].filter(Boolean).length
  if (types >= 3) score += 15
  return Math.min(100, score)
}

function getStrengthInfo(score: number): { level: PasswordStrengthLevel; label: string; color: string } {
  const levels: Array<{ level: PasswordStrengthLevel; min: number; max: number }> = [
    { level: 'weak', min: 0, max: 25 },
    { level: 'fair', min: 26, max: 50 },
    { level: 'good', min: 51, max: 75 },
    { level: 'strong', min: 76, max: 90 },
    { level: 'very-strong', min: 91, max: 100 }
  ]
  const levelInfo = levels.find(l => score >= l.min && score <= l.max) || levels[0]
  const labels: Record<PasswordStrengthLevel, string> = {
    weak: t('password.change.strength.weak'),
    fair: t('password.change.strength.fair'),
    good: t('password.change.strength.good'),
    strong: t('password.change.strength.strong'),
    'very-strong': t('password.change.strength.veryStrong')
  }
  const colors: Record<PasswordStrengthLevel, string> = {
    weak: '#ef4444',
    fair: '#f59e0b',
    good: '#10b981',
    strong: '#06b6d4',
    'very-strong': '#8b5cf6'
  }
  return { level: levelInfo.level, label: labels[levelInfo.level], color: colors[levelInfo.level] }
}

const strengthInfo = computed(() => getStrengthInfo(strengthScore.value))
const strengthClass = computed(() => `is-${strengthInfo.value.level}`)
const strengthLabel = computed(() => strengthInfo.value.label)
const strengthColor = computed(() => strengthInfo.value.color)

// ===========================================
// Title Text
// ===========================================
const titleText = computed(() => {
  if (expireStatus.isExpired) return t('password.change.expiredTitle')
  if (expireStatus.isTemporary) return t('password.change.firstLoginTitle')
  return t('password.change.title')
})

const alertTitle = computed(() => {
  if (expireStatus.isExpired) return t('password.change.expiredMessage')
  if (expireStatus.isTemporary) return t('password.change.firstLoginMessage')
  return ''
})

// ===========================================
// Form Validation Rules
// ===========================================
const formRules = computed<FormRules>(() => ({
  oldPwd: [
    { required: true, message: t('password.change.validation.oldPasswordRequired'), trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: t('password.change.validation.newPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === formData.oldPwd) {
          callback(new Error(t('password.change.validation.sameAsOld')))
        } else if (value.length < 8 || value.length > 16) {
          callback(new Error(t('password.change.validation.invalidFormat')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  newPwd2: [
    { required: true, message: t('password.change.validation.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== formData.newPwd) {
          callback(new Error(t('password.change.validation.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

// ===========================================
// Form Valid Check
// ===========================================
const isFormValid = computed(() => {
  return (
    formData.oldPwd &&
    formData.newPwd &&
    formData.newPwd2 &&
    formData.newPwd === formData.newPwd2 &&
    Object.values(validation).every(v => v)
  )
})

// ===========================================
// Methods
// ===========================================
function handlePasswordInput() {
  updateValidation()
}

function updateValidation() {
  const pwd = formData.newPwd
  validation.minLength = pwd.length >= 8 && pwd.length <= 16
  validation.hasLowercase = /[a-z]/.test(pwd)
  validation.hasUppercase = /[A-Z]/.test(pwd)
  validation.hasNumber = /[0-9]/.test(pwd)
  validation.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  validation.noSpaces = !/\s/.test(pwd)
  validation.notSameAsOld = pwd !== formData.oldPwd
}

function getRuleStatus(key: keyof IPasswordValidation) {
  if (!formData.newPwd) return ''
  return validation[key] ? 'is-valid' : 'is-invalid'
}

function getRuleIcon(key: keyof IPasswordValidation) {
  if (!formData.newPwd) return InfoFilled
  return validation[key] ? Check : Close
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success
      submitSuccess.value = true
      ElMessage.success(t('password.change.message.success'))
      startCountdown()
    } catch (error: any) {
      if (error.message?.includes('incorrect')) {
        ElMessage.error(t('password.change.message.oldPasswordIncorrect'))
      } else {
        ElMessage.error(error.message || t('password.change.message.failed'))
      }
    } finally {
      loading.value = false
    }
  })
}

function startCountdown() {
  redirectCountdown.value = 5
  countdownTimer = window.setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      handleBackToLogin()
    }
  }, 1000)
}

function handleBackToLogin() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  router.push('/login')
}

// ===========================================
// Lifecycle
// ===========================================
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped lang="scss">
.change-pwd-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
      background: #f97316;
      top: -200px;
      left: -200px;
      animation: float 20s ease-in-out infinite;
    }

    &.circle-2 {
      width: 500px;
      height: 500px;
      background: #ea580c;
      bottom: -150px;
      right: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

// Password Card
.password-card {
  width: 460px;
  max-width: 90vw;
  padding: 48px 44px;
  background: $bg-card;
  border-radius: 24px;
  border: 1px solid rgba(249, 115, 22, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.15);
  position: relative;
  z-index: 1;
  animation: card-enter 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border-radius: 0 0 3px 3px;
  }
}

// Header
.password-header {
  text-align: center;
  margin-bottom: 36px;

  .header-icon {
    width: 72px;
    height: 72px;
    margin: 0 auto 20px;
    background: rgba(249, 115, 22, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f97316;
    font-size: 32px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(249, 115, 22, 0.3);
      animation: pulse-ring 2s ease-in-out infinite;
    }
  }

  .password-title {
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .password-subtitle {
    font-size: 14px;
    color: $text-secondary;
  }
}

// Alert
.password-alert {
  margin-bottom: 28px;

  :deep(.el-alert) {
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.3);
    border-radius: 12px;

    .el-alert__title {
      color: $text-primary;
      font-weight: 600;
    }
  }
}

// Form
.password-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
}

// Input
.password-input {
  :deep(.el-input__wrapper) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(249, 115, 22, 0.2);
    border-radius: 12px;
    box-shadow: none;
    height: 48px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(249, 115, 22, 0.5);
    }

    &.is-focus {
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
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

// Strength Indicator
.password-strength {
  margin-top: -12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;

  .strength-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .strength-label {
      font-size: 13px;
      color: $text-muted;
    }

    .strength-tag {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }

  .strength-progress {
    :deep(.el-progress-bar__outer) {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }

    :deep(.el-progress-bar__inner) {
      border-radius: 6px;
      transition: all 0.3s ease;
    }
  }

  &.is-weak .strength-tag {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  &.is-fair .strength-tag {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }

  &.is-good .strength-tag {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }

  &.is-strong .strength-tag {
    background: rgba(6, 182, 212, 0.2);
    color: #06b6d4;
  }

  &.is-very-strong .strength-tag {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
  }
}

// Rules
.password-rules {
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-bottom: 28px;

  .rules-title {
    font-size: 13px;
    color: $text-muted;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rule-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 8px;
    transition: all 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    .rule-icon {
      font-size: 14px;
      color: $text-muted;
      transition: color 0.3s ease;
    }

    &.is-valid {
      color: #10b981;

      .rule-icon {
        color: #10b981;
      }
    }

    &.is-invalid {
      color: #ef4444;

      .rule-icon {
        color: #ef4444;
      }
    }
  }
}

// Submit Button
.submit-button {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: button-shine 3s ease-in-out infinite;
  }
}

// Success Result
.success-result {
  text-align: center;

  :deep(.el-result__icon) {
    margin-bottom: 20px;

    svg {
      width: 80px;
      height: 80px;
    }
  }

  :deep(.el-result__title) {
    color: $text-primary;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  :deep(.el-result__subtitle) {
    color: $text-secondary;
    font-size: 14px;
    line-height: 1.6;
  }

  .redirect-info {
    margin-top: 24px;
    font-size: 13px;
    color: $text-muted;
  }

  .back-button {
    margin-top: 20px;
    height: 48px;
    padding: 0 32px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: white;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
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
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
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

// Responsive
@media (max-width: 768px) {
  .password-card {
    width: 90vw;
    padding: 36px 28px;
  }

  .password-header {
    .header-icon {
      width: 60px;
      height: 60px;
      font-size: 28px;
    }

    .password-title {
      font-size: 22px;
    }
  }
}

@media (max-width: 480px) {
  .password-card {
    width: 95vw;
    padding: 32px 24px;
    border-radius: 20px;
  }

  .submit-button {
    height: 48px;
    font-size: 15px;
    letter-spacing: 1px;
  }
}
</style>

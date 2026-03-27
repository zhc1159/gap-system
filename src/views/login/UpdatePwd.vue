<!-- ===========================================
     UpdatePwd.vue - Update Password Page
     For user profile password update
     =========================================== -->

<template>
  <div class="update-pwd-container">
    <!-- Background Effects -->
    <div class="background-effects">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
    </div>

    <!-- Back Button -->
    <div class="back-header">
      <el-page-header @back="handleBack">
        <template #title>
          {{ t('common.back') }}
        </template>
      </el-page-header>
    </div>

    <!-- Password Card -->
    <div class="password-card">
      <!-- Success State -->
      <div v-if="submitSuccess" class="success-result">
        <el-result icon="success" :title="t('password.update.success.title')">
          <template #sub-title>
            <p>{{ t('password.update.success.description') }}</p>
          </template>
          <template #extra>
            <el-button class="back-button" type="primary" @click="handleBackToProfile">
              {{ t('password.update.success.backToProfile') }}
            </el-button>
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
          <h1 class="password-title">{{ t('password.update.title') }}</h1>
          <p class="password-subtitle">{{ t('password.update.subtitle') }}</p>
        </div>

        <!-- Password Form -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          class="password-form"
          @submit.prevent="handleSubmit"
        >
          <!-- New Password -->
          <el-form-item prop="newpwd">
            <el-input
              v-model="formData.newpwd"
              type="password"
              :placeholder="t('password.update.newPasswordPlaceholder')"
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
          <div v-if="formData.newpwd" class="password-strength" :class="strengthClass">
            <div class="strength-header">
              <span class="strength-label">{{ t('password.update.strength.title') }}</span>
              <span class="strength-tag">{{ strengthLabel }}</span>
            </div>
            <el-progress
              :percentage="strengthScore"
              :stroke-width="5"
              :show-text="false"
              :color="strengthColor"
              class="strength-progress"
            />
          </div>

          <!-- Confirm Password -->
          <el-form-item prop="newpwd2">
            <el-input
              v-model="formData.newpwd2"
              type="password"
              :placeholder="t('password.update.confirmPasswordPlaceholder')"
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
              {{ t('password.update.rules.title') }}
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
              {{ loading ? t('password.update.submitting') : t('password.update.submit') }}
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, InfoFilled, Check, Close } from '@element-plus/icons-vue'

// ===========================================
// Interfaces
// ===========================================
interface IUpdatePwdForm {
  newpwd: string
  newpwd2: string
}

interface IPasswordValidation {
  minLength: boolean
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
  noSpaces: boolean
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

// ===========================================
// Reactive Data
// ===========================================
const formData = reactive<IUpdatePwdForm>({
  newpwd: '',
  newpwd2: ''
})

const validation = reactive<IPasswordValidation>({
  minLength: false,
  hasLowercase: false,
  hasUppercase: false,
  hasNumber: false,
  hasSpecial: false,
  noSpaces: true
})

// ===========================================
// Password Rules List
// ===========================================
const passwordRulesList = computed(() => ({
  minLength: t('password.update.rules.minLength'),
  hasLowercase: t('password.update.rules.hasLowercase'),
  hasUppercase: t('password.update.rules.hasUppercase'),
  hasNumber: t('password.update.rules.hasNumber'),
  hasSpecial: t('password.update.rules.hasSpecial'),
  noSpaces: t('password.update.rules.noSpaces')
}))

// ===========================================
// Password Strength Calculation
// ===========================================
const strengthScore = computed(() => {
  if (!formData.newpwd) return 0
  return calculateStrength(formData.newpwd)
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
    weak: t('password.update.strength.weak'),
    fair: t('password.update.strength.fair'),
    good: t('password.update.strength.good'),
    strong: t('password.update.strength.strong'),
    'very-strong': t('password.update.strength.veryStrong')
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
// Form Validation Rules
// ===========================================
const formRules = computed<FormRules>(() => ({
  newpwd: [
    { required: true, message: t('password.update.validation.newPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value.length < 8 || value.length > 16) {
          callback(new Error(t('password.update.validation.invalidFormat')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  newpwd2: [
    { required: true, message: t('password.update.validation.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== formData.newpwd) {
          callback(new Error(t('password.update.validation.passwordMismatch')))
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
    formData.newpwd &&
    formData.newpwd2 &&
    formData.newpwd === formData.newpwd2 &&
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
  const pwd = formData.newpwd
  validation.minLength = pwd.length >= 8 && pwd.length <= 16
  validation.hasLowercase = /[a-z]/.test(pwd)
  validation.hasUppercase = /[A-Z]/.test(pwd)
  validation.hasNumber = /[0-9]/.test(pwd)
  validation.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  validation.noSpaces = !/\s/.test(pwd)
}

function getRuleStatus(key: keyof IPasswordValidation) {
  if (!formData.newpwd) return ''
  return validation[key] ? 'is-valid' : 'is-invalid'
}

function getRuleIcon(key: keyof IPasswordValidation) {
  if (!formData.newpwd) return InfoFilled
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
      ElMessage.success(t('password.update.message.success'))
    } catch (error: any) {
      ElMessage.error(error.message || t('password.update.message.failed'))
    } finally {
      loading.value = false
    }
  })
}

function handleBack() {
  router.back()
}

function handleBackToProfile() {
  router.push('/profile')
}
</script>

<style scoped lang="scss">
.update-pwd-container {
  width: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  background: $bg-darker;
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
    opacity: 0.2;

    &.circle-1 {
      width: 500px;
      height: 500px;
      background: #06b6d4;
      top: -150px;
      right: -100px;
      animation: float 20s ease-in-out infinite;
    }

    &.circle-2 {
      width: 400px;
      height: 400px;
      background: #0891b2;
      bottom: -100px;
      left: -100px;
      animation: float 25s ease-in-out infinite reverse;
    }
  }
}

// Back Header
.back-header {
  width: 100%;
  max-width: 600px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;

  :deep(.el-page-header) {
    .el-page-header__left {
      color: $text-secondary;

      &:hover {
        color: #06b6d4;
      }
    }

    .el-page-header__title {
      color: $text-primary;
      font-size: 14px;
    }
  }
}

// Password Card
.password-card {
  width: 420px;
  max-width: 90vw;
  padding: 44px 40px;
  background: $bg-card;
  border-radius: 24px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
  position: relative;
  z-index: 1;
  animation: card-enter 0.5s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 3px;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    border-radius: 0 0 3px 3px;
  }
}

// Header
.password-header {
  text-align: center;
  margin-bottom: 32px;

  .header-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: rgba(6, 182, 212, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #06b6d4;
    font-size: 28px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 2px solid rgba(6, 182, 212, 0.3);
      animation: pulse-ring 2s ease-in-out infinite;
    }
  }

  .password-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }

  .password-subtitle {
    font-size: 13px;
    color: $text-secondary;
  }
}

// Form
.password-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

// Input
.password-input {
  :deep(.el-input__wrapper) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 12px;
    box-shadow: none;
    height: 48px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(6, 182, 212, 0.5);
    }

    &.is-focus {
      border-color: #06b6d4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
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
  margin-top: -8px;
  margin-bottom: 20px;
  padding: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;

  .strength-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .strength-label {
      font-size: 12px;
      color: $text-muted;
    }

    .strength-tag {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 10px;
    }
  }

  .strength-progress {
    :deep(.el-progress-bar__outer) {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      height: 5px !important;
    }

    :deep(.el-progress-bar__inner) {
      border-radius: 5px;
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
  padding: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-bottom: 24px;

  .rules-title {
    font-size: 12px;
    color: $text-muted;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rule-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: 6px;
    transition: all 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    .rule-icon {
      font-size: 13px;
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
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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
    box-shadow: 0 8px 20px rgba(6, 182, 212, 0.4);
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
    margin-bottom: 16px;

    svg {
      width: 72px;
      height: 72px;
    }
  }

  :deep(.el-result__title) {
    color: $text-primary;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  :deep(.el-result__subtitle) {
    color: $text-secondary;
    font-size: 13px;
  }

  .back-button {
    margin-top: 20px;
    height: 46px;
    padding: 0 28px;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(6, 182, 212, 0.4);
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
    transform: translateY(20px) scale(0.98);
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
    transform: scale(1.08);
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
  .update-pwd-container {
    padding: 24px 16px;
  }

  .password-card {
    width: 90vw;
    padding: 36px 32px;
  }

  .password-header {
    .header-icon {
      width: 56px;
      height: 56px;
      font-size: 24px;
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

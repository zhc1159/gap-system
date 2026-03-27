<!-- ===========================================
     AdDomain.vue - AD域配置
     =========================================== -->

<template>
  <div class="page-container ad-domain-page">
    <PageHeader
      :title="t('adDomain.title')"
      titleEn="AD Domain Configuration"
      :icon="Link"
    />

    <div class="config-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="domain-form"
      >
        <div class="form-section">
          <div class="section-title">{{ t('adDomain.ldapServer') }}</div>
          <el-form-item prop="ldap_ip">
            <el-input
              v-model="formData.ldap_ip"
              :placeholder="t('adDomain.ldapServerPlaceholder')"
              size="large"
            >
              <template #prefix>
                <el-icon><Monitor /></el-icon>
              </template>
            </el-input>
            <p class="hint-text">{{ t('adDomain.ipHint') }}</p>
          </el-form-item>
        </div>

        <div class="form-section">
          <div class="section-title">{{ t('adDomain.domain') }}</div>
          <el-form-item prop="domain">
            <el-input
              v-model="formData.domain"
              :placeholder="t('adDomain.domainPlaceholder')"
              size="large"
            >
              <template #prefix>
                <el-icon><Globe /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="form-section">
          <div class="section-title">{{ t('adDomain.bindDN') }}</div>
          <el-form-item prop="bindDN">
            <el-input
              v-model="formData.bindDN"
              :placeholder="t('adDomain.bindDNPlaceholder')"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="form-section">
          <div class="section-title">{{ t('adDomain.bindDNPassword') }}</div>
          <el-form-item prop="bindDNPassword">
            <el-input
              v-model="formData.bindDNPassword"
              type="password"
              :placeholder="t('adDomain.bindDNPasswordPlaceholder')"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="form-section">
          <div class="section-title">{{ t('adDomain.baseDN') }}</div>
          <el-form-item prop="baseDN">
            <el-input
              v-model="formData.baseDN"
              :placeholder="t('adDomain.baseDNPlaceholder')"
              size="large"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button
            type="primary"
            :loading="loading"
            class="save-btn"
            @click="handleSave"
          >
            <el-icon v-if="!loading"><Check /></el-icon>
            {{ loading ? t('adDomain.saving') : t('adDomain.save') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Link, Monitor, User, Lock, Search, Check } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const loading = ref(false)

interface AdDomainConfig {
  ldap_ip: string
  domain: string
  bindDN: string
  bindDNPassword: string
  baseDN: string
}

const formData = reactive<AdDomainConfig>({
  ldap_ip: '',
  domain: '',
  bindDN: '',
  bindDNPassword: '',
  baseDN: ''
})

const formRules = reactive<FormRules>({
  ldap_ip: [
    { required: true, message: t('adDomain.required'), trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: t('adDomain.ipFormat'), trigger: 'blur' }
  ],
  domain: [{ required: true, message: t('adDomain.required'), trigger: 'blur' }],
  bindDN: [{ required: true, message: t('adDomain.required'), trigger: 'blur' }],
  bindDNPassword: [{ required: true, message: t('adDomain.required'), trigger: 'blur' }],
  baseDN: [{ required: true, message: t('adDomain.required'), trigger: 'blur' }]
})

const handleSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('adDomain.saveSuccess'))
  } catch {
    ElMessage.error(t('adDomain.saveFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Load existing config if any
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.ad-domain-page {
  .config-card {
    max-width: 800px;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    padding: $spacing-xl;
  }

  .domain-form {
    .form-section {
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-lg;
      border-bottom: 1px solid $border-dark;

      &:last-of-type {
        border-bottom: none;
        margin-bottom: $spacing-md;
      }

      .section-title {
        font-size: $font-size-base;
        color: $primary-color;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
          content: '';
          width: 4px;
          height: 14px;
          background: $gradient-primary;
          border-radius: 2px;
        }
      }
    }

    :deep(.el-form-item) {
      margin-bottom: $spacing-sm;

      .el-form-item__label {
        color: $text-secondary;
        font-weight: 500;
      }
    }

    :deep(.el-input__wrapper) {
      background: $bg-darker;
      border: 1px solid $border-color;
      box-shadow: none;
      border-radius: $radius-md;
      transition: all $transition-normal;

      &:hover {
        border-color: $primary-dark;
      }

      &.is-focus {
        border-color: $primary-color;
        box-shadow: $shadow-glow;
      }
    }

    :deep(.el-input__inner) {
      color: $text-primary;

      &::placeholder {
        color: $text-placeholder;
      }
    }

    :deep(.el-input__prefix) {
      color: $primary-color;
    }

    .hint-text {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-top: $spacing-xs;
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    margin-top: $spacing-xl;

    .save-btn {
      min-width: 140px;
      height: 44px;
      background: $gradient-primary;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-lg;
      font-weight: 600;
      letter-spacing: 2px;
      transition: all $transition-normal;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-glow-strong;
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>

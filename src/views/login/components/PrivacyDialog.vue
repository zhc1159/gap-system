<!-- ===========================================
     PrivacyDialog.vue - Privacy Policy Dialog
     =========================================== -->

<template>
  <el-dialog
    v-model="visible"
    :title="t('login.privacyLink')"
    width="600px"
    class="privacy-dialog"
    :close-on-click-modal="false"
  >
    <div class="privacy-content">
      <h3>{{ currentLanguage === 'zh-CN' ? '隐私承诺' : 'Privacy Policy' }}</h3>
      <p>
        {{ currentLanguage === 'zh-CN'
          ? '我们致力于保护您的隐私，并确保您个人信息的安全。本隐私政策说明了我们如何收集、使用和保护您的数据。'
          : 'We are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and protect your data.'
        }}
      </p>
      <h4>{{ currentLanguage === 'zh-CN' ? '1. 信息收集' : '1. Information Collection' }}</h4>
      <p>
        {{ currentLanguage === 'zh-CN'
          ? '我们仅收集身份验证和服务提供所需的必要信息。'
          : 'We collect only the necessary information for authentication and service provision.'
        }}
      </p>
      <h4>{{ currentLanguage === 'zh-CN' ? '2. 数据安全' : '2. Data Security' }}</h4>
      <p>
        {{ currentLanguage === 'zh-CN'
          ? '您的数据经过加密并安全存储。我们实施行业标准的安全措施来保护您的信息。'
          : 'Your data is encrypted and stored securely. We implement industry-standard security measures to protect your information.'
        }}
      </p>
      <h4>{{ currentLanguage === 'zh-CN' ? '3. 数据使用' : '3. Data Usage' }}</h4>
      <p>
        {{ currentLanguage === 'zh-CN'
          ? '收集的信息仅用于身份验证、安全验证和服务改进目的。'
          : 'Collected information is used solely for authentication, security verification, and service improvement purposes.'
        }}
      </p>
      <h4>{{ currentLanguage === 'zh-CN' ? '4. 数据保留' : '4. Data Retention' }}</h4>
      <p>
        {{ currentLanguage === 'zh-CN'
          ? '我们将在完成信息收集目的所需的时间内保留您的信息，除非法律要求或允许的更长期限。'
          : 'We will retain your information for as long as necessary to fulfill the purpose for which it was collected, unless a longer retention period is required or permitted by law.'
        }}
      </p>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleAccept">
        {{ currentLanguage === 'zh-CN' ? '我同意' : 'I Agree' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()
const appStore = useAppStore()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentLanguage = computed(() => appStore.language)

function handleAccept() {
  visible.value = false
}
</script>

<style scoped lang="scss">
.privacy-dialog {
  :deep(.el-dialog) {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-xl;
  }

  :deep(.el-dialog__header) {
    border-bottom: 1px solid $border-color;
    padding: $spacing-lg;

    .el-dialog__title {
      color: $text-primary;
      font-weight: 600;
    }
  }

  :deep(.el-dialog__body) {
    padding: $spacing-lg;
    color: $text-secondary;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid $border-color;
    padding: $spacing-lg;
  }
}

.privacy-content {
  h3,
  h4 {
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  h3 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  h4 {
    margin-top: $spacing-md;
  }

  p {
    margin-bottom: $spacing-sm;
    line-height: 1.6;
  }
}
</style>

<!-- ===========================================
     ProfileBackup.vue - Configuration Backup Settings
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('maintenance.profileBackup.title')"
      titleEn="Profile Backup Config"
      :icon="Setting"
    />

    <el-card class="tech-card">
      <template #header>
        <div class="card-header">
          <el-icon class="tech-icon"><Setting /></el-icon>
          <span>{{ t('maintenance.profileBackup.title') }}</span>
        </div>
      </template>

      <el-form
        :model="config"
        :rules="rules"
        label-width="180px"
        class="config-form"
        ref="formRef"
      >
        <el-form-item :label="t('maintenance.profileBackup.autoBackup')">
          <el-switch
            v-model="config.autoBackup"
            :active-text="t('common.enabled')"
            :inactive-text="t('common.disabled')"
          />
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.interval')"
          prop="interval"
        >
          <el-input-number
            v-model="config.interval"
            :min="5"
            :max="600"
            :step="5"
          />
          <span class="unit">{{ t('maintenance.profileBackup.minutes') }}</span>
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.ftpIp')"
          prop="ftpIp"
        >
          <el-input
            v-model="config.ftpIp"
            placeholder="192.168.1.100"
          />
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.ftpPort')"
          prop="ftpPort"
        >
          <el-input-number
            v-model="config.ftpPort"
            :min="1"
            :max="65535"
          />
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.ftpUser')"
          prop="ftpUser"
        >
          <el-input v-model="config.ftpUser" />
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.ftpPassword')"
          prop="ftpPassword"
        >
          <el-input
            v-model="config.ftpPassword"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #append>
              <el-button @click="showPassword = !showPassword">
                <el-icon>
                  <View v-if="!showPassword" />
                  <Hide v-else />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item
          :label="t('maintenance.profileBackup.uploadPath')"
          prop="uploadPath"
        >
          <el-input
            v-model="config.uploadPath"
            placeholder="/backup"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="tech-button"
            :loading="saving"
            @click="handleSave"
          >
            <el-icon><Check /></el-icon>
            {{ t('maintenance.profileBackup.save') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Setting, Check, View, Hide } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Interfaces
interface BackupConfig {
  autoBackup: boolean
  interval: number
  ftpIp: string
  ftpPort: number
  ftpUser: string
  ftpPassword: string
  uploadPath: string
}

// State
const formRef = ref<FormInstance>()
const showPassword = ref(false)
const saving = ref(false)

const config = reactive<BackupConfig>({
  autoBackup: false,
  interval: 30,
  ftpIp: '',
  ftpPort: 21,
  ftpUser: '',
  ftpPassword: '',
  uploadPath: '/backup'
})

// Form rules
const rules: FormRules = {
  interval: [
    { required: true, message: 'Required', trigger: 'blur' },
    { type: 'number', min: 5, max: 600, message: 'Range: 5-600', trigger: 'blur' }
  ],
  ftpIp: [
    { required: true, message: 'Required', trigger: 'blur' },
    {
      pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: 'Invalid IP',
      trigger: 'blur'
    }
  ],
  ftpPort: [
    { required: true, message: 'Required', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: 'Range: 1-65535', trigger: 'blur' }
  ],
  ftpUser: [
    { required: true, message: 'Required', trigger: 'blur' }
  ],
  ftpPassword: [
    { required: true, message: 'Required', trigger: 'blur' }
  ],
  uploadPath: [
    { required: true, message: 'Required', trigger: 'blur' }
  ]
}

// Methods
function fetchConfig() {
  // Simulate fetching config
  Object.assign(config, {
    autoBackup: true,
    interval: 30,
    ftpIp: '192.168.1.100',
    ftpPort: 21,
    ftpUser: 'backup_user',
    ftpPassword: '********',
    uploadPath: '/backup/gap_system'
  })
}

async function handleSave() {
  try {
    await formRef.value?.validate()
    saving.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('common.saveSuccess'))
  } catch (error) {
    // Validation failed
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchConfig()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.tech-card {
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: $font-size-lg;
  font-weight: 600;
}

.tech-icon {
  color: $primary-color;
  font-size: $font-size-xl;
  margin-right: $spacing-sm;
}

.config-form {
  max-width: 600px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.unit {
  margin-left: $spacing-sm;
  color: $text-muted;
}

.tech-button {
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(0, 212, 255, 0.5);

  &:hover {
    box-shadow: $shadow-glow;
  }
}
</style>

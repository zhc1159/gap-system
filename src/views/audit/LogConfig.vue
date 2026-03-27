<!-- ===========================================
     LogConfig.vue - Log Configuration View
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('audit.logConfig.title')"
      titleEn="Log Configuration"
      :icon="Setting"
    />

    <el-card class="config-card" shadow="hover">
      <el-row :gutter="20">
        <!-- Log Forwarding Config -->
        <el-col :span="6">
          <div class="config-section">
            <h3 class="section-title">
              <el-icon><Promotion /></el-icon>
              {{ t('audit.logConfig.logForwarding') }}
            </h3>

            <el-form :model="syslogForm" label-width="100px" class="config-form">
              <el-form-item :label="t('audit.logConfig.switch')">
                <el-switch
                  v-model="syslogForm.switch"
                  active-text="ON"
                  inactive-text="OFF"
                />
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.protocol')">
                <el-radio-group v-model="syslogForm.protocol">
                  <el-radio value="TCP">TCP</el-radio>
                  <el-radio value="UDP">UDP</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.forwardAddr')">
                <el-input v-model="syslogForm.address" :placeholder="t('audit.logConfig.ipv4Placeholder')" />
                <span class="hint-text">{{ t('audit.logConfig.ipv4Hint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.forwardPort')">
                <el-input v-model.number="syslogForm.port" type="number" :placeholder="t('audit.logConfig.portPlaceholder')" />
                <span class="hint-text">{{ t('audit.logConfig.portHint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.subsystem')">
                <el-select v-model="syslogForm.facility" :placeholder="t('common.all')">
                  <el-option v-for="item in facilityOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <!-- Time Policy Config -->
        <el-col :span="6">
          <div class="config-section">
            <h3 class="section-title">
              <el-icon><Timer /></el-icon>
              {{ t('audit.logConfig.timePolicy') }}
            </h3>

            <el-form :model="crondForm" label-width="100px" class="config-form">
              <el-form-item :label="t('audit.logConfig.switch')">
                <el-switch
                  v-model="crondForm.switch"
                  active-text="ON"
                  inactive-text="OFF"
                />
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.validDays')">
                <el-input v-model.number="crondForm.maxDays" type="number" :placeholder="t('audit.logConfig.daysPlaceholder')" />
                <span class="hint-text text-red">{{ t('audit.logConfig.daysHint') }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <!-- Log Alarm Config -->
        <el-col :span="6">
          <div class="config-section">
            <h3 class="section-title">
              <el-icon><Bell /></el-icon>
              {{ t('audit.logConfig.logAlarm') }}
            </h3>

            <el-form :model="alarmForm" label-width="100px" class="config-form">
              <el-form-item :label="t('audit.logConfig.switch')">
                <el-switch
                  v-model="alarmForm.switch"
                  active-text="ON"
                  inactive-text="OFF"
                />
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.alarmThreshold')">
                <el-input v-model.number="alarmForm.warning" type="number" placeholder="1-4096" />
                <span class="hint-text text-red">{{ t('audit.logConfig.thresholdHint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.mailAddr')">
                <el-input v-model="alarmForm.address" :placeholder="t('audit.logConfig.ipv4or6Placeholder')" />
                <span class="hint-text">{{ t('audit.logConfig.mailAddrHint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.destPort')">
                <el-input v-model.number="alarmForm.port" type="number" :placeholder="t('audit.logConfig.smtpPortPlaceholder')" />
                <span class="hint-text">{{ t('audit.logConfig.smtpPortHint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.email')">
                <el-input v-model="alarmForm.mail" :placeholder="t('audit.logConfig.emailPlaceholder')" />
                <span class="hint-text">{{ t('audit.logConfig.emailHint') }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <!-- Log Threshold Config -->
        <el-col :span="6">
          <div class="config-section">
            <h3 class="section-title">
              <el-icon><DataLine /></el-icon>
              {{ t('audit.logConfig.logThreshold') }}
            </h3>

            <el-form :model="thresholdForm" label-width="100px" class="config-form">
              <el-form-item :label="t('audit.logConfig.storageLimit')">
                <el-input v-model.number="thresholdForm.max" type="number" placeholder="1-100000" />
                <span class="hint-text">{{ t('audit.logConfig.storageHint') }}</span>
              </el-form-item>

              <el-form-item :label="t('audit.logConfig.keepPercent')">
                <el-input v-model.number="thresholdForm.percent" type="number" placeholder="20-80" />
                <span class="hint-text">{{ t('audit.logConfig.percentHint') }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

      <!-- Save Button -->
      <div class="save-section">
        <el-button type="primary" size="large" @click="handleSave" :loading="saving">
          <el-icon><Check /></el-icon>
          {{ t('common.save') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Setting, Promotion, Timer, Bell, DataLine, Check } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Log forwarding form
const syslogForm = reactive({
  switch: false,
  protocol: 'TCP',
  address: '',
  port: 514,
  facility: 0
})

// Time policy form
const crondForm = reactive({
  switch: false,
  maxDays: 180
})

// Log alarm form
const alarmForm = reactive({
  switch: false,
  warning: 1024,
  address: '',
  port: 25,
  mail: ''
})

// Log threshold form
const thresholdForm = reactive({
  max: 10000,
  percent: 50
})

const saving = ref(false)

// Facility options
const facilityOptions = [
  { label: 'local0', value: 0 },
  { label: 'local1', value: 1 },
  { label: 'local2', value: 2 },
  { label: 'local3', value: 3 },
  { label: 'local4', value: 4 },
  { label: 'local5', value: 5 },
  { label: 'local6', value: 6 },
  { label: 'local7', value: 7 },
  { label: 'user', value: 8 }
]

// Fetch config
function fetchConfig() {
  // Mock data loading
  console.log('Loading log configuration...')
}

// Save config
async function handleSave() {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success(t('common.saveSuccess'))
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(() => { fetchConfig() })
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.config-card {
  background: $bg-card;
  border: 1px solid $border-color;
}

.config-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  height: 100%;

  .section-title {
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
    color: $primary-color;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon {
      font-size: 20px;
    }
  }

  .config-form {
    :deep(.el-form-item) {
      margin-bottom: 18px;

      .el-form-item__label {
        color: $text-secondary;
      }
    }

    :deep(.el-input__wrapper) {
      background: $bg-primary;
      border: 1px solid $border-color;
      box-shadow: none;

      &:hover {
        border-color: $primary-color;
      }
    }

    :deep(.el-radio__label) {
      color: $text-primary;
    }

    :deep(.el-select) {
      width: 100%;
    }

    .hint-text {
      display: block;
      margin-top: 5px;
      font-size: 12px;
      color: $text-secondary;
    }

    .text-red {
      color: #f56c6c;
    }
  }
}

.save-section {
  margin-top: 30px;
  text-align: center;
  padding-bottom: 20px;

  .el-button {
    min-width: 200px;
    background: $gradient-primary;
    border: none;
    font-size: 16px;
    height: 48px;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>

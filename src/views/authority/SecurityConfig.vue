<!-- ===========================================
     SecurityConfig.vue - Security Configuration
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('menu.authority.security')"
      titleEn="Security Config"
      :icon="Lock"
    />

    <div class="config-grid">
      <!-- Authentication Methods -->
      <div class="config-card">
        <div class="card-header">
          <el-icon><Key /></el-icon>
          <span>认证方式配置</span>
        </div>
        <div class="card-body">
          <el-form label-width="140px">
            <el-form-item label="用户名密码">
              <el-switch v-model="authConfig.password" />
              <span class="form-hint">基础认证方式，始终可用</span>
            </el-form-item>
            <el-form-item label="数字证书">
              <el-switch v-model="authConfig.certificate" />
              <span class="form-hint">使用客户端证书进行认证</span>
            </el-form-item>
            <el-form-item label="动态口令(OTP)">
              <el-switch v-model="authConfig.otp" />
              <span class="form-hint">基于时间的一次性密码</span>
            </el-form-item>
            <el-form-item label="指纹识别">
              <el-switch v-model="authConfig.fingerprint" />
              <span class="form-hint">需要指纹采集设备</span>
            </el-form-item>
            <el-form-item label="UKey认证">
              <el-switch v-model="authConfig.ukey" />
              <span class="form-hint">USB Key硬件认证</span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Password Policy -->
      <div class="config-card">
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <span>密码策略</span>
        </div>
        <div class="card-body">
          <el-form label-width="140px">
            <el-form-item label="最小长度">
              <el-input-number v-model="passwordPolicy.minLength" :min="6" :max="32" />
            </el-form-item>
            <el-form-item label="密码有效期">
              <el-select v-model="passwordPolicy.validDays" style="width: 200px">
                <el-option label="30天" :value="30" />
                <el-option label="60天" :value="60" />
                <el-option label="90天" :value="90" />
                <el-option label="永不过期" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="历史密码检查">
              <el-input-number v-model="passwordPolicy.historyCount" :min="0" :max="10" />
              <span class="form-hint">禁止重复使用最近N次密码</span>
            </el-form-item>
            <el-form-item label="复杂度要求">
              <el-checkbox-group v-model="passwordPolicy.requirements">
                <el-checkbox label="uppercase">大写字母</el-checkbox>
                <el-checkbox label="lowercase">小写字母</el-checkbox>
                <el-checkbox label="number">数字</el-checkbox>
                <el-checkbox label="special">特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Session Settings -->
      <div class="config-card">
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>会话设置</span>
        </div>
        <div class="card-body">
          <el-form label-width="140px">
            <el-form-item label="会话超时">
              <el-select v-model="sessionConfig.timeout" style="width: 200px">
                <el-option label="15分钟" :value="15" />
                <el-option label="30分钟" :value="30" />
                <el-option label="1小时" :value="60" />
                <el-option label="2小时" :value="120" />
                <el-option label="4小时" :value="240" />
              </el-select>
            </el-form-item>
            <el-form-item label="最大并发会话">
              <el-input-number v-model="sessionConfig.maxSessions" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="强制单点登录">
              <el-switch v-model="sessionConfig.singleSession" />
              <span class="form-hint">同一账号只能在一个地方登录</span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Login Security -->
      <div class="config-card">
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>登录安全</span>
        </div>
        <div class="card-body">
          <el-form label-width="140px">
            <el-form-item label="失败锁定阈值">
              <el-input-number v-model="loginSecurity.maxAttempts" :min="3" :max="10" />
              <span class="form-hint">连续N次失败后锁定账户</span>
            </el-form-item>
            <el-form-item label="锁定时长">
              <el-select v-model="loginSecurity.lockDuration" style="width: 200px">
                <el-option label="5分钟" :value="5" />
                <el-option label="15分钟" :value="15" />
                <el-option label="30分钟" :value="30" />
                <el-option label="1小时" :value="60" />
              </el-select>
            </el-form-item>
            <el-form-item label="验证码">
              <el-switch v-model="loginSecurity.captcha" />
              <span class="form-hint">登录时显示图形验证码</span>
            </el-form-item>
            <el-form-item label="IP白名单">
              <el-switch v-model="loginSecurity.ipWhitelist" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="action-bar">
      <el-button type="primary" size="large" @click="handleSave">
        <el-icon><Check /></el-icon>
        {{ t('common.save') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Lock, Key, Clock, Warning, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

// Auth config
const authConfig = reactive({
  password: true,
  certificate: false,
  otp: false,
  fingerprint: false,
  ukey: false
})

// Password policy
const passwordPolicy = reactive({
  minLength: 8,
  validDays: 30,
  historyCount: 5,
  requirements: ['lowercase', 'number']
})

// Session config
const sessionConfig = reactive({
  timeout: 30,
  maxSessions: 3,
  singleSession: false
})

// Login security
const loginSecurity = reactive({
  maxAttempts: 5,
  lockDuration: 15,
  captcha: true,
  ipWhitelist: false
})

// Handle save
function handleSave() {
  ElMessage.success(t('common.saveSuccess'))
}

// Load config
onMounted(() => {
  // Load config from API
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
}

.config-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;

  .card-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    font-weight: 600;
    color: $text-primary;

    .el-icon { color: $primary-color; }
  }

  .card-body {
    padding: $spacing-lg;

    :deep(.el-form-item) {
      margin-bottom: $spacing-md;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(.el-form-item__label) {
      color: $text-secondary;
    }

    .form-hint {
      display: block;
      font-size: $font-size-xs;
      color: $text-muted;
      margin-top: 4px;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: center;
  padding: $spacing-xl;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
}
</style>

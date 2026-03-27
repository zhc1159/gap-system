<!-- ===========================================
     OtpConfig.vue - OTP一次性口令配置
     =========================================== -->

<template>
  <div class="page-container otp-page">
    <PageHeader
      :title="t('otp.title')"
      titleEn="OTP Management"
      :icon="Key"
    >
      <template #action>
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          {{ t('otp.add') }}
        </el-button>
      </template>
    </PageHeader>

    <div class="data-card">
      <el-table :data="otpList" v-loading="loading" class="tech-table">
        <el-table-column prop="name" :label="t('otp.username')" />

        <el-table-column :label="t('otp.userType')">
          <template #default="{ row }">
            <span :class="['type-tag', row.userId === -2 ? 'client' : 'admin']">
              {{ row.userId === -2 ? t('otp.client') : t('otp.admin') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="t('otp.qrcode')" width="100" align="center">
          <template #default="{ row }">
            <el-icon class="qrcode-btn" @click="showQrcode(row)">
              <Grid />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column prop="codeLength" :label="t('otp.codeLength')" width="120" />

        <el-table-column :label="t('otp.action')" width="200">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="handleDelete(row)">
              {{ t('otp.delete') }}
            </el-button>
            <el-button size="small" type="info" @click="handleEdit(row)">
              {{ t('otp.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- QR Code Dialog -->
    <el-dialog
      v-model="qrcodeVisible"
      :title="t('otp.qrcode')"
      width="400px"
      class="tech-dialog qrcode-dialog"
    >
      <div class="qrcode-content">
        <img :src="currentQrcode" alt="QR Code" class="qrcode-image" />
        <p class="qrcode-hint">{{ t('otp.scanHint') }}</p>
      </div>
    </el-dialog>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? t('otp.add') : t('otp.edit')"
      width="450px"
      class="tech-dialog"
    >
      <el-form :model="dialogForm" label-position="top">
        <el-form-item :label="t('otp.username')" required>
          <el-input v-model="dialogForm.name" :placeholder="t('otp.usernamePlaceholder')" />
        </el-form-item>

        <el-form-item :label="t('otp.codeLength')" required>
          <el-radio-group v-model="dialogForm.codeLength">
            <el-radio :value="6">6 {{ t('otp.digits') }}</el-radio>
            <el-radio :value="8">8 {{ t('otp.digits') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Key, Plus, Grid } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

interface OtpConfig {
  id: number
  userId: number
  name: string
  codeLength: 6 | 8
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const qrcodeVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentQrcode = ref('')

const otpList = ref<OtpConfig[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogForm = reactive({
  name: '',
  codeLength: 6 as 6 | 8
})

const fetchList = async () => {
  loading.value = true
  try {
    // Mock data
    otpList.value = [
      { id: 1, userId: 1, name: 'admin', codeLength: 6 },
      { id: 2, userId: -2, name: 'user1', codeLength: 8 }
    ]
    pagination.total = 2
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const openAddDialog = () => {
  dialogType.value = 'add'
  dialogForm.name = ''
  dialogForm.codeLength = 6
  dialogVisible.value = true
}

const handleEdit = (row: OtpConfig) => {
  dialogType.value = 'edit'
  dialogForm.name = row.name
  dialogForm.codeLength = row.codeLength
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('otp.saveSuccess'))
    dialogVisible.value = false
    await fetchList()
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (_row: OtpConfig) => {
  try {
    await ElMessageBox.confirm(t('otp.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('otp.deleteSuccess'))
    await fetchList()
  } catch {
    // User cancelled
  }
}

const showQrcode = async (row: OtpConfig) => {
  // Mock QR code URL
  currentQrcode.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=OTP:${row.name}`
  qrcodeVisible.value = true
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.otp-page {
  .type-tag {
    padding: 4px 12px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: 500;

    &.admin {
      background: rgba($primary-color, 0.2);
      color: $primary-color;
    }

    &.client {
      background: rgba($secondary-color, 0.2);
      color: $secondary-light;
    }
  }

  .qrcode-btn {
    font-size: 24px;
    color: $primary-color;
    cursor: pointer;
    transition: all $transition-normal;

    &:hover {
      transform: scale(1.1);
      color: $primary-light;
    }
  }

  .pagination {
    padding: $spacing-md;
    display: flex;
    justify-content: center;
  }

  .qrcode-dialog {
    .qrcode-content {
      text-align: center;

      .qrcode-image {
        max-width: 200px;
        border-radius: $radius-md;
      }

      .qrcode-hint {
        margin-top: $spacing-md;
        color: $text-muted;
        font-size: $font-size-sm;
      }
    }
  }
}
</style>

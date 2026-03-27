<!-- UsersIndex.vue - Admin Users Management -->

<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><UserFilled /></el-icon>
        {{ t('users.title') }}
      </h2>
      <div class="page-actions">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          {{ t('users.add') }}
        </el-button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card-container">
      <el-table :data="users" v-loading="loading" class="users-table">
        <el-table-column prop="username" :label="t('users.account')" width="150" />
        <el-table-column prop="group" :label="t('users.group')" width="120" />
        <el-table-column :label="t('users.pwdValidDays')" width="150">
          <template #default="{ row }">
            <span :class="['pwd-valid', { domain: row.isDomainUser }]">
              {{ row.isDomainUser ? t('users.domainAccount') : `${row.pwdValidDays}${t('users.days')}` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('users.status')" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
              {{ row.isActive ? t('users.activated') : t('users.deactivated') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('users.permission')" width="140">
          <template #default="{ row }">
            {{ row.authType === 'super' ? t('users.superAdmin') : t('users.deputyAdmin') }}
          </template>
        </el-table-column>
        <el-table-column v-if="certSwitch" :label="t('users.cert')" width="140">
          <template #default="{ row }">
            <el-button
              v-if="row.certIssued"
              size="small"
              type="success"
              @click="downloadCertificate(row.username)"
            >
              {{ t('users.downloadCert') }}
            </el-button>
            <el-button
              v-else
              size="small"
              type="primary"
              @click="issueCertificate(row.username)"
            >
              {{ t('users.issueCert') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="t('users.action')" width="280">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                v-if="!row.isActive"
                size="small"
                type="primary"
                @click="toggleActive(row)"
              >
                {{ t('users.activate') }}
              </el-button>
              <el-button
                v-else
                size="small"
                @click="toggleActive(row)"
              >
                {{ t('users.deactivate') }}
              </el-button>
              <el-button
                v-if="row.username !== currentUser"
                size="small"
                type="danger"
                @click="handleDelete(row)"
              >
                {{ t('users.delete') }}
              </el-button>
              <el-button size="small" type="info" @click="openEditDialog(row)">
                {{ t('users.edit') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next, jumper"
          @current-change="fetchUsers"
        />
      </div>
    </div>

    <!-- User Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? t('users.add') : t('users.edit')"
      width="500px"
      class="user-dialog"
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item :label="t('users.form.username')" prop="username">
          <el-input v-model="userForm.username" :disabled="dialogType === 'edit'" />
        </el-form-item>

        <el-form-item :label="t('users.form.password')" prop="pwd">
          <el-input v-model="userForm.pwd" type="password" show-password />
        </el-form-item>

        <el-form-item :label="t('users.form.confirmPassword')" prop="pwdAgain">
          <el-input v-model="userForm.pwdAgain" type="password" show-password />
        </el-form-item>

        <el-form-item :label="t('users.form.authType')" prop="authType">
          <el-select v-model="userForm.authType" style="width: 100%">
            <el-option label="超级管理员" value="super" />
            <el-option label="普通管理员" value="deputy" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { UserFilled, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import {
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleUserActive,
  issueUserCert,
  downloadUserCert,
  getCertSwitch
} from '@/api/users'
import type { IAdminUser, IAdminUserForm } from '@/types'

const { t } = useI18n()
const userStore = useUserStore()

// State
const loading = ref(false)
const submitting = ref(false)
const users = ref<IAdminUser[]>([])
const certSwitch = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const userForm = reactive<IAdminUserForm>({
  username: '',
  pwd: '',
  pwdAgain: '',
  authType: 'deputy',
  authList: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// Computed
const currentUser = computed(() => userStore.username)

// Form validation rules
const formRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('login.validation.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: '3-20 characters', trigger: 'blur' }
  ],
  pwd: dialogType.value === 'add'
    ? [
        { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
        { min: 6, max: 32, message: '6-32 characters', trigger: 'blur' }
      ]
    : [],
  pwdAgain: [
    {
      validator: (_rule, value, callback) => {
        if (userForm.pwd && value !== userForm.pwd) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  authType: [
    { required: true, message: 'Required', trigger: 'change' }
  ]
}))

// Fetch users
async function fetchUsers() {
  loading.value = true
  try {
    const res = await getAdminUsers({ page: pagination.page, pageSize: pagination.pageSize })
    users.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

// Open add dialog
function openAddDialog() {
  dialogType.value = 'add'
  Object.assign(userForm, {
    username: '',
    pwd: '',
    pwdAgain: '',
    authType: 'deputy',
    authList: []
  })
  dialogVisible.value = true
}

// Open edit dialog
function openEditDialog(user: IAdminUser) {
  dialogType.value = 'edit'
  Object.assign(userForm, {
    username: user.username,
    pwd: '',
    pwdAgain: '',
    authType: user.authType,
    authList: []
  })
  dialogVisible.value = true
}

// Handle submit
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (dialogType.value === 'add') {
        await addAdminUser(userForm)
      } else {
        await updateAdminUser(userForm)
      }
      ElMessage.success(t('users.saveSuccess'))
      dialogVisible.value = false
      await fetchUsers()
    } finally {
      submitting.value = false
    }
  })
}

// Handle delete
async function handleDelete(user: IAdminUser) {
  try {
    await ElMessageBox.confirm(t('users.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    await deleteAdminUser(user.id)
    ElMessage.success(t('users.deleteSuccess'))
    await fetchUsers()
  } catch {
    // Cancelled
  }
}

// Toggle active
async function toggleActive(user: IAdminUser) {
  await toggleUserActive(user.id, !user.isActive)
  await fetchUsers()
}

// Issue certificate
async function issueCertificate(username: string) {
  await issueUserCert(username)
  ElMessage.success(t('users.saveSuccess'))
  await fetchUsers()
}

// Download certificate
async function downloadCertificate(username: string) {
  try {
    const blob = await downloadUserCert(username)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${username}.pfx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch {
    ElMessage.error('Download failed')
  }
}

// Lifecycle
onMounted(async () => {
  await fetchUsers()

  // Get cert switch
  try {
    const certRes = await getCertSwitch()
    certSwitch.value = certRes.data.enabled
  } catch {
    // Ignore
  }
})
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;

  .page-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-primary;

    .el-icon {
      color: $primary-color;
    }
  }
}

.card-container {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.users-table {
  .pwd-valid {
    color: $text-secondary;

    &.domain {
      color: $primary-color;
    }
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    display: inline-block;

    &.active {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    &.inactive {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .action-btns {
    display: flex;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }
}

.pagination-wrapper {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}

// Dialog styles
.user-dialog {
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
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid $border-color;
    padding: $spacing-lg;
  }

  :deep(.el-form-item__label) {
    color: $text-secondary;
  }
}
</style>

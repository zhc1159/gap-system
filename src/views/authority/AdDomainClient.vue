<!-- ===========================================
     AdDomainClient.vue - AD域客户端配置
     =========================================== -->

<template>
  <div class="page-container ad-domain-client-page">
    <PageHeader
      :title="t('adDomainClient.title')"
      titleEn="Domain Users (Client Assignment)"
      :icon="UserFilled"
    >
      <template #action>
        <el-button type="primary" class="sync-btn" :loading="loading" @click="handleSync">
          <el-icon><Refresh /></el-icon>
          {{ t('adDomainClient.syncUsers') }}
        </el-button>
      </template>
    </PageHeader>

    <div class="data-card">
      <el-table :data="users" v-loading="loading" class="tech-table">
        <el-table-column prop="username" :label="t('adDomainClient.account')" width="200" />

        <el-table-column :label="t('adDomainClient.status')" width="140">
          <template #default="{ row }">
            <span :class="['status-tag', row.status]">
              {{ row.status === 'assigned' ? t('adDomainClient.assigned') : t('adDomainClient.notAssigned') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="t('adDomainClient.clientPermission')">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'not_assigned'"
              type="primary"
              size="small"
              class="action-btn assign"
              @click="openAssignDialog(row)"
            >
              {{ t('adDomainClient.assignClient') }}
            </el-button>
            <el-button
              v-else-if="row.userType === 'client'"
              type="success"
              size="small"
              class="action-btn edit"
              @click="handleEditClient(row)"
            >
              {{ t('adDomainClient.editClient') }}
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

    <!-- Assign Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="t('adDomainClient.assignTitle')"
      width="500px"
      class="tech-dialog"
    >
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-position="top">
        <el-form-item :label="t('adDomainClient.username')" prop="username">
          <el-input v-model="dialogForm.username" disabled />
        </el-form-item>

        <el-form-item :label="t('adDomainClient.password')" prop="pwd">
          <el-input v-model="dialogForm.pwd" type="password" show-password />
        </el-form-item>

        <el-form-item :label="t('adDomainClient.confirmPassword')" prop="pwd_again">
          <el-input v-model="dialogForm.pwd_again" type="password" show-password />
        </el-form-item>

        <el-form-item :label="t('adDomainClient.ip')" prop="user_ip">
          <el-input v-model="dialogForm.user_ip" placeholder="192.168.1.100" />
        </el-form-item>

        <el-form-item :label="t('adDomainClient.mac')" prop="user_mac">
          <el-input v-model="dialogForm.user_mac" placeholder="00:1A:2B:3C:4D:5E" />
        </el-form-item>

        <el-form-item :label="t('adDomainClient.group')" prop="groupId">
          <el-select v-model="dialogForm.groupId" :placeholder="t('adDomainClient.group')" style="width: 100%">
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('adDomainClient.level')" prop="level">
          <el-radio-group v-model="dialogForm.level">
            <el-radio :value="0">{{ t('adDomainClient.topSecret') }}</el-radio>
            <el-radio :value="1">{{ t('adDomainClient.confidential') }}</el-radio>
            <el-radio :value="2">{{ t('adDomainClient.secret') }}</el-radio>
            <el-radio :value="3">{{ t('adDomainClient.unclassified') }}</el-radio>
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UserFilled, Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()
const router = useRouter()

interface DomainUser {
  username: string
  status: 'assigned' | 'not_assigned'
  userType: 'client' | 'user' | ''
}

interface UserGroup {
  id: number
  name: string
}

interface AssignForm {
  username: string
  pwd: string
  pwd_again: string
  user_ip: string
  user_mac: string
  groupId: number | null
  level: 0 | 1 | 2 | 3
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()

const users = ref<DomainUser[]>([])
const groups = ref<UserGroup[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogForm = reactive<AssignForm>({
  username: '',
  pwd: '',
  pwd_again: '',
  user_ip: '',
  user_mac: '',
  groupId: null,
  level: 3
})

const dialogRules = reactive<FormRules>({
  pwd: [{ required: true, message: t('adDomainClient.passwordRequired'), trigger: 'blur' }],
  pwd_again: [{ required: true, message: t('adDomainClient.confirmPasswordRequired'), trigger: 'blur' }],
  user_ip: [{ required: true, message: t('adDomainClient.ipRequired'), trigger: 'blur' }],
  groupId: [{ required: true, message: t('adDomainClient.groupRequired'), trigger: 'change' }]
})

const handleSync = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('adDomainClient.syncSuccess'))
    await fetchUsers()
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    // Mock data
    users.value = [
      { username: 'domainuser1', status: 'not_assigned', userType: '' },
      { username: 'domainuser2', status: 'assigned', userType: 'client' },
      { username: 'domainuser3', status: 'not_assigned', userType: '' }
    ]
    pagination.total = 3
    groups.value = [
      { id: 1, name: 'Group A' },
      { id: 2, name: 'Group B' }
    ]
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchUsers()
}

const openAssignDialog = (user: DomainUser) => {
  Object.assign(dialogForm, {
    username: user.username,
    pwd: '',
    pwd_again: '',
    user_ip: '',
    user_mac: '',
    groupId: null,
    level: 3
  })
  dialogVisible.value = true
}

const handleEditClient = (user: DomainUser) => {
  router.push({ name: 'AuthorityClient', query: { username: user.username } })
}

const handleSubmit = async () => {
  const valid = await dialogFormRef.value?.validate()
  if (!valid) return

  if (dialogForm.pwd !== dialogForm.pwd_again) {
    ElMessage.error(t('adDomainClient.passwordMismatch'))
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('adDomainClient.assignSuccess'))
    dialogVisible.value = false
    await fetchUsers()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.ad-domain-client-page {
  .sync-btn {
    background: $gradient-primary;
    border: none;
    border-radius: $radius-md;

    &:hover {
      box-shadow: $shadow-glow;
    }
  }

  .status-tag {
    padding: 4px 12px;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: 500;

    &.assigned {
      background: $gradient-success;
      color: #fff;
    }

    &.not-assigned {
      background: $gradient-info;
      color: #fff;
    }
  }

  .action-btn {
    border: none;
    border-radius: $radius-sm;

    &.assign {
      background: $gradient-info;
    }

    &.edit {
      background: $gradient-success;
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  .pagination {
    padding: $spacing-md;
    display: flex;
    justify-content: center;
  }
}
</style>

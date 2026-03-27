<!-- ===========================================
     AdDomainUsers.vue - AD域用户管理
     =========================================== -->

<template>
  <div class="page-container ad-domain-users-page">
    <PageHeader
      :title="t('adDomainUsers.title')"
      titleEn="Domain Users (Admin Assignment)"
      :icon="User"
    >
      <template #action>
        <el-button type="primary" class="sync-btn" :loading="loading" @click="handleSync">
          <el-icon><Refresh /></el-icon>
          {{ t('adDomainUsers.syncUsers') }}
        </el-button>
      </template>
    </PageHeader>

    <div class="data-card">
      <el-table :data="users" v-loading="loading" class="tech-table">
        <el-table-column prop="username" :label="t('adDomainUsers.account')" width="200" />

        <el-table-column :label="t('adDomainUsers.status')" width="140">
          <template #default="{ row }">
            <span :class="['status-tag', row.status]">
              {{ row.status === 'assigned' ? t('adDomainUsers.assigned') : t('adDomainUsers.notAssigned') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="t('adDomainUsers.adminPermission')">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'not_assigned'"
              type="primary"
              size="small"
              class="action-btn assign"
              @click="handleAssignAdmin(row)"
            >
              {{ t('adDomainUsers.assignAdmin') }}
            </el-button>
            <el-button
              v-else-if="row.userType === 'user'"
              type="success"
              size="small"
              class="action-btn edit"
              @click="handleEditAdmin(row)"
            >
              {{ t('adDomainUsers.editAdmin') }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()
const router = useRouter()

interface DomainAdminUser {
  username: string
  status: 'assigned' | 'not_assigned'
  userType: 'user' | 'client' | ''
}

const loading = ref(false)
const users = ref<DomainAdminUser[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const handleSync = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('adDomainUsers.syncSuccess'))
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
      { username: 'admin_user1', status: 'assigned', userType: 'user' },
      { username: 'admin_user2', status: 'not_assigned', userType: '' },
      { username: 'admin_user3', status: 'assigned', userType: 'user' }
    ]
    pagination.total = 3
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchUsers()
}

const handleAssignAdmin = async (_user: DomainAdminUser) => {
  try {
    await ElMessageBox.confirm(
      t('adDomainUsers.confirmAssign'),
      t('common.confirm'),
      { type: 'warning' }
    )

    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('adDomainUsers.assignSuccess'))
    await fetchUsers()
  } catch {
    // User cancelled
  } finally {
    loading.value = false
  }
}

const handleEditAdmin = (user: DomainAdminUser) => {
  router.push({ name: 'AuthorityUsers', query: { username: user.username } })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.ad-domain-users-page {
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

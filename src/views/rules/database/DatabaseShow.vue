<!-- ===========================================
     DatabaseShow.vue - Database Display
     =========================================== -->

<template>
  <div class="page-container database-show">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="data-flow"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Coin /></el-icon>
        <h2 class="title">{{ t('database.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('database.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="databaseList" stripe class="tech-table">
        <el-table-column prop="name" :label="t('database.dbName')" min-width="150">
          <template #default="{ row }">
            <div class="db-name">
              <el-icon class="db-icon"><Coin /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('database.dbType')" width="120">
          <template #default="{ row }">
            <el-tag :type="getDbTagType(row.type)" effect="dark">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('database.host')" min-width="150">
          <template #default="{ row }">
            <span class="connection-info">{{ row.host }}:{{ row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('database.status')" width="120">
          <template #default="{ row }">
            <div class="status-wrapper" :class="row.status.toLowerCase()">
              <span class="status-dot"></span>
              {{ t(`database.status.${row.status.toLowerCase()}`) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="280" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="warning" size="small" link @click="handleTest(row)">
              <el-icon><Connection /></el-icon>
              {{ t('database.testConnection') }}
            </el-button>
            <el-popconfirm :title="t('database.deleteConfirm')" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small" link>
                  <el-icon><Delete /></el-icon>
                  {{ t('common.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('database.editTitle') : t('database.addTitle')"
      width="550px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('database.dbName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('database.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('database.dbType')" prop="type">
          <el-select v-model="formData.type" class="w-full">
            <el-option label="Oracle" value="Oracle" />
            <el-option label="MySQL" value="MySQL" />
            <el-option label="PostgreSQL" value="PostgreSQL" />
            <el-option label="Dameng" value="Dameng" />
            <el-option label="Sybase" value="Sybase" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('database.host')" prop="host">
          <el-input v-model="formData.host" :placeholder="t('database.hostPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('database.port')" prop="port">
          <el-input-number v-model="formData.port" :min="1" :max="65535" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('database.username')" prop="username">
          <el-input v-model="formData.username" :placeholder="t('database.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('database.password')" prop="password">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Coin, Plus, Edit, Delete, Connection } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type DatabaseType = 'Oracle' | 'MySQL' | 'PostgreSQL' | 'Dameng' | 'Sybase'
type DatabaseStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN'

interface Database {
  id: string
  name: string
  type: DatabaseType
  host: string
  port: number
  username: string
  status: DatabaseStatus
  createTime: string
}

interface DatabaseFormData {
  id?: string
  name: string
  type: DatabaseType
  host: string
  port: number
  username: string
  password: string
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

const databaseList = ref<Database[]>([
  { id: '1', name: 'Primary-Oracle', type: 'Oracle', host: '192.168.1.100', port: 1521, username: 'admin', status: 'ONLINE', createTime: '2024-01-10 09:00:00' },
  { id: '2', name: 'Secondary-MySQL', type: 'MySQL', host: '192.168.1.101', port: 3306, username: 'root', status: 'ONLINE', createTime: '2024-01-12 14:30:00' },
  { id: '3', name: 'Backup-Dameng', type: 'Dameng', host: '192.168.1.102', port: 5236, username: 'sysdba', status: 'OFFLINE', createTime: '2024-01-15 11:00:00' }
])

const formData = reactive<DatabaseFormData>({
  id: undefined,
  name: '',
  type: 'MySQL',
  host: '',
  port: 3306,
  username: '',
  password: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: t('database.nameRequired'), trigger: 'blur' }],
  type: [{ required: true, message: t('database.typeRequired'), trigger: 'change' }],
  host: [{ required: true, message: t('database.hostRequired'), trigger: 'blur' }],
  port: [{ required: true, message: t('database.portRequired'), trigger: 'blur' }]
}

// Methods
const getDbTagType = (type: DatabaseType): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const types: Record<DatabaseType, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    Oracle: 'danger',
    MySQL: 'primary',
    PostgreSQL: 'success',
    Dameng: 'warning',
    Sybase: 'info'
  }
  return types[type]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: undefined,
    name: '',
    type: 'MySQL',
    host: '',
    port: 3306,
    username: '',
    password: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Database) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    host: row.host,
    port: row.port,
    username: row.username,
    password: ''
  })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  void id
  const index = databaseList.value.findIndex(item => item.id === id)
  if (index > -1) {
    databaseList.value.splice(index, 1)
    total.value--
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleTest = async (_row: Database) => {
  // Simulate connection test
  ElMessage.success(t('database.connectionSuccess'))
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const db = databaseList.value.find(item => item.id === formData.id)
      if (db) {
        db.name = formData.name
        db.type = formData.type
        db.host = formData.host
        db.port = formData.port
        db.username = formData.username
      }
      ElMessage.success(t('common.success'))
    } else {
      const newDb: Database = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        host: formData.host,
        port: formData.port,
        username: formData.username,
        status: 'UNKNOWN',
        createTime: new Date().toLocaleString()
      }
      databaseList.value.push(newDb)
      total.value++
      ElMessage.success(t('common.success'))
    }
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  // Fetch initial data
})
</script>

<style scoped lang="scss">
.database-show {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .data-flow {
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, rgba(138, 43, 226, 0.05) 0%, transparent 40%);
    }
  }

  .page-header {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    .title-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 28px;
        color: $primary-color;
      }

      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .action-card,
  .table-card {
    background: $bg-card;
    border: 1px solid $border-color;
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
  }

  .tech-table {
    .db-name {
      display: flex;
      align-items: center;
      gap: 8px;

      .db-icon {
        color: $primary-color;
      }
    }

    .connection-info {
      font-family: 'Courier New', monospace;
      color: $primary-color;
      background: rgba(0, 212, 255, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .status-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #909399;
      }

      &.online .status-dot {
        background: #67c23a;
        animation: statusPulse 2s ease-in-out infinite;
      }

      &.offline .status-dot {
        background: #f56c6c;
      }
    }

    @keyframes statusPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    :deep(th) {
      background: rgba(0, 212, 255, 0.1) !important;
      color: $primary-color !important;
    }

    :deep(td) {
      background: transparent;
      color: $text-primary;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.w-full {
  width: 100%;
}
</style>

<!-- ===========================================
     Key.vue - Agent Key Management
     =========================================== -->

<template>
  <div class="page-container key-management">
    <!-- Tech Background -->
    <div class="tech-bg">
      <div class="circuit-lines"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="title-wrapper">
        <el-icon class="title-icon"><Key /></el-icon>
        <h2 class="title">{{ t('key.title') }}</h2>
      </div>
    </div>

    <!-- Action Bar -->
    <el-card class="action-card" shadow="hover">
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('key.add') }}
      </el-button>
    </el-card>

    <!-- Data Table -->
    <el-card class="table-card" shadow="hover" v-loading="loading">
      <el-table :data="keyList" stripe class="tech-table">
        <el-table-column prop="name" :label="t('key.keyName')" min-width="150">
          <template #default="{ row }">
            <div class="key-name">
              <el-icon class="key-icon"><Key /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('key.keyType')" width="120">
          <template #default="{ row }">
            <el-tag :type="getKeyTypeTagType(row.type)" effect="dark">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('key.createTime')" width="180" />
        <el-table-column :label="t('common.actions')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-popconfirm :title="t('key.deleteConfirm')" @confirm="handleDelete(row.id)">
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
      :title="isEdit ? t('key.editTitle') : t('key.addTitle')"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item :label="t('key.keyName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('key.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('key.keyType')" prop="type">
          <el-select v-model="formData.type" class="w-full">
            <el-option label="RSA" value="RSA" />
            <el-option label="DSA" value="DSA" />
            <el-option label="ECDSA" value="ECDSA" />
            <el-option label="ED25519" value="ED25519" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('key.keyContent')" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            :placeholder="t('key.contentPlaceholder')"
          />
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
import { Key, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Types
type KeyType = 'RSA' | 'DSA' | 'ECDSA' | 'ED25519'

interface KeyItem {
  id: string
  name: string
  type: KeyType
  content: string
  createTime: string
}

interface KeyFormData {
  id?: string
  name: string
  type: KeyType
  content: string
}

// State
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

const keyList = ref<KeyItem[]>([
  { id: '1', name: 'server-key-01', type: 'RSA', content: '-----BEGIN RSA PRIVATE KEY-----', createTime: '2024-01-10 09:00:00' },
  { id: '2', name: 'client-key-01', type: 'ECDSA', content: '-----BEGIN EC PRIVATE KEY-----', createTime: '2024-01-12 14:30:00' }
])

const formData = reactive<KeyFormData>({
  id: undefined,
  name: '',
  type: 'RSA',
  content: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: t('key.nameRequired'), trigger: 'blur' }],
  type: [{ required: true, message: t('key.typeRequired'), trigger: 'change' }],
  content: [{ required: true, message: t('key.contentRequired'), trigger: 'blur' }]
}

// Methods
const getKeyTypeTagType = (type: KeyType): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const types: Record<KeyType, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    RSA: 'primary',
    DSA: 'success',
    ECDSA: 'warning',
    ED25519: 'info'
  }
  return types[type]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { id: undefined, name: '', type: 'RSA', content: '' })
  dialogVisible.value = true
}

const handleEdit = (row: KeyItem) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    content: row.content
  })
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  const index = keyList.value.findIndex(item => item.id === id)
  if (index > -1) {
    keyList.value.splice(index, 1)
    total.value--
    ElMessage.success(t('common.deleteSuccess'))
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      const key = keyList.value.find(item => item.id === formData.id)
      if (key) {
        key.name = formData.name
        key.type = formData.type
        key.content = formData.content
      }
      ElMessage.success(t('common.success'))
    } else {
      const newKey: KeyItem = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        content: formData.content,
        createTime: new Date().toLocaleString()
      }
      keyList.value.push(newKey)
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
.key-management {
  .tech-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .circuit-lines {
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
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
        animation: pulse 2s ease-in-out infinite;
      }

      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
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
    .key-name {
      display: flex;
      align-items: center;
      gap: 8px;

      .key-icon {
        color: $primary-color;
      }
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

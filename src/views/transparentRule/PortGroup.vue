<!-- Port Group Management - Port Management -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('transparentRule.portGroup.title') }}
      </h2>
      <p class="page-description">{{ t('transparentRule.portGroup.description') }}</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('transparentRule.portGroup.addGroup') }}
      </el-button>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        class="tech-table"
      >
        <el-table-column prop="name" :label="t('transparentRule.portGroup.groupName')" min-width="200">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="portRange" :label="t('transparentRule.portGroup.portRange')" min-width="500">
          <template #default="{ row }">
            <el-tooltip v-if="row.portRange && row.portRange.length > 80" :content="row.portRange" placement="top">
              <span class="port-text">{{ truncateText(row.portRange, 80) }}</span>
            </el-tooltip>
            <span v-else class="port-text">{{ row.portRange || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('common.actions')" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- Form Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('transparentRule.portGroup.groupName')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="t('transparentRule.portGroup.groupNamePlaceholder')"
            maxlength="31"
            show-word-limit
            @input="handleNameInput"
          />
        </el-form-item>

        <el-form-item :label="t('transparentRule.portGroup.ports')" prop="portRange">
          <el-input
            v-model="formData.portRange"
            type="textarea"
            :rows="3"
            :placeholder="t('transparentRule.portGroup.portsPlaceholder')"
            maxlength="512"
            show-word-limit
            @input="handlePortInput"
          />

          <div class="port-preview" v-if="formData.portRange">
            <div class="preview-title">{{ t('transparentRule.portGroup.preview') }}:</div>
            <div class="preview-content">
              <el-tag
                v-for="(port, index) in parsedPorts"
                :key="index"
                :type="port.valid ? 'success' : 'danger'"
                size="small"
                class="port-tag"
              >
                {{ formatPort(port) }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit" :disabled="!hasValidPorts">
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
import { Connection, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface PortGroup {
  id: number
  name: string
  portRange: string
  createdAt?: string
  updatedAt?: string
}

interface PortGroupFormData {
  id?: number
  name: string
  portRange: string
}

interface ParsedPort {
  type: 'single' | 'range'
  value: number | [number, number]
  valid: boolean
  error?: string
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<PortGroup[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// Form Data
const formData = reactive<PortGroupFormData>({
  name: '',
  portRange: ''
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('transparentRule.portGroup.addGroup')
    : t('transparentRule.portGroup.editGroup')
})

const parsedPorts = computed<ParsedPort[]>(() => {
  if (!formData.portRange) return []

  const parts = formData.portRange.split(',').filter(p => p.trim())
  return parts.map(part => {
    const trimmed = part.trim()

    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))

      if (isNaN(start) || isNaN(end)) {
        return { type: 'range', value: [start, end], valid: false, error: 'Invalid range' }
      }

      if (start < 1 || start > 65535 || end < 1 || end > 65535) {
        return { type: 'range', value: [start, end], valid: false, error: 'Port out of range' }
      }

      if (start >= end) {
        return { type: 'range', value: [start, end], valid: false, error: 'Start must be less than end' }
      }

      return { type: 'range', value: [start, end], valid: true }
    }

    const port = parseInt(trimmed)

    if (isNaN(port)) {
      return { type: 'single', value: port, valid: false, error: 'Invalid port' }
    }

    if (port < 1 || port > 65535) {
      return { type: 'single', value: port, valid: false, error: 'Port out of range' }
    }

    return { type: 'single', value: port, valid: true }
  })
})

const hasValidPorts = computed(() =>
  parsedPorts.value.length > 0 && parsedPorts.value.some(p => p.valid)
)

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('transparentRule.portGroup.groupNameRequired'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('transparentRule.portGroup.groupNamePattern'), trigger: 'blur' },
    { max: 31, message: t('transparentRule.portGroup.groupNameMax'), trigger: 'blur' }
  ],
  portRange: [
    { required: true, message: t('transparentRule.portGroup.portsRequired'), trigger: 'blur' },
    { max: 512, message: t('transparentRule.portGroup.portsMax'), trigger: 'blur' }
  ]
}))

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'web_ports', portRange: '80,443,8080-8089' },
      { id: 2, name: 'db_ports', portRange: '3306,1433,5432,27017' },
      { id: 3, name: 'ssh_ports', portRange: '22,2222' }
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.id = undefined
  formData.name = ''
  formData.portRange = ''
  dialogVisible.value = true
}

const handleEdit = (row: PortGroup) => {
  dialogMode.value = 'edit'
  formData.id = row.id
  formData.name = row.name
  formData.portRange = row.portRange
  dialogVisible.value = true
}

const handleDelete = async (row: PortGroup) => {
  try {
    await ElMessageBox.confirm(
      t('transparentRule.portGroup.deleteConfirm', { name: row.name }),
      t('common.confirm'),
      { type: 'warning' }
    )
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch {
    // cancelled
  }
}

const handleNameInput = (value: string) => {
  formData.name = value.replace(/[^a-zA-Z0-9_]/g, '')
}

const handlePortInput = (value: string) => {
  formData.portRange = value.replace(/[^0-9,\-]/g, '')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  if (!hasValidPorts.value) {
    ElMessage.error(t('transparentRule.portGroup.noValidPorts'))
    return
  }

  const invalidPorts = parsedPorts.value.filter(p => !p.valid)
  if (invalidPorts.length > 0) {
    const warnings = invalidPorts.map(p => formatPort(p)).join(', ')
    await ElMessageBox.alert(
      t('transparentRule.portGroup.invalidPortsWarning', { ports: warnings }),
      t('common.confirm'),
      { type: 'warning' }
    )
  }

  try {
    await formRef.value.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
    dialogVisible.value = false
    fetchData()
  } catch {
    // validation failed
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.name = ''
  formData.portRange = ''
}

const formatPort = (port: ParsedPort): string => {
  if (port.type === 'range') {
    const [start, end] = port.value as [number, number]
    return `${start}-${end}`
  }
  return String(port.value)
}

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
.page-container {
  padding: $spacing-lg;
}

.page-header {
  margin-bottom: $spacing-lg;

  .page-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: $spacing-xs;

    .el-icon { color: $primary-color; }
  }

  .page-description {
    color: $text-secondary;
    font-size: $font-size-base;
  }
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: $spacing-md;
}

.table-container {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
}

.tech-table {
  :deep(.el-table__row) {
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important;
      transform: translateX(2px);
    }
  }
}

.name-text {
  font-weight: 600;
  color: $text-primary;
}

.port-text {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: $font-size-sm;
  color: $primary-color;
}

.pagination-wrapper {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}

.port-preview {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  background: rgba($bg-darker, 0.5);

  .preview-title {
    font-size: 13px;
    color: $text-muted;
    margin-bottom: 8px;
  }

  .preview-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .port-tag {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 12px;

      &.el-tag--success {
        background: rgba($success-color, 0.2);
        border-color: rgba($success-color, 0.5);
        color: $success-color;
      }

      &.el-tag--danger {
        background: rgba($danger-color, 0.2);
        border-color: rgba($danger-color, 0.5);
        color: $danger-color;
      }
    }
  }
}
</style>

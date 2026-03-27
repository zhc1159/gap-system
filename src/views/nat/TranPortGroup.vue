<!-- Port Group Management - 端口组管理 -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Grid /></el-icon>
        {{ t('nat.portGroup.title') }}
      </h2>
      <p class="page-description">{{ t('nat.portGroup.description') }}</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('common.add') }}
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
        <!-- Group Name -->
        <el-table-column prop="name" :label="t('nat.portGroup.groupName')" width="200">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- Port -->
        <el-table-column prop="port_range" :label="t('nat.portGroup.port')" min-width="500">
          <template #default="{ row }">
            <el-tooltip :content="row.port_range" placement="top" :disabled="row.port_range.length <= 50">
              <span class="port-text">{{ truncateText(row.port_range, 50) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="t('common.actions')" fixed="right" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row.name)">
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
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- Group Name -->
        <el-form-item :label="t('nat.portGroup.groupName')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="t('nat.portGroup.groupNamePlaceholder')"
            :disabled="dialogMode === 'edit'"
            maxlength="31"
            clearable
          />
        </el-form-item>

        <!-- Port Range -->
        <el-form-item :label="t('nat.portGroup.port')" prop="port_range">
          <el-input
            v-model="formData.port_range"
            :placeholder="t('nat.portGroup.portPlaceholder')"
            maxlength="512"
            @input="handlePortInput"
            clearable
            type="textarea"
            :rows="3"
          />
          <div class="help-text">
            {{ t('nat.portGroup.portHelp') }}
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Grid, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface PortGroup {
  id?: number
  name: string
  port_range: string
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
const formData = ref<PortGroup>({
  name: '',
  port_range: ''
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.portGroup.addGroup')
    : t('nat.portGroup.editGroup')
})

const validatePortRange = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error(t('nat.portGroup.portRequired')))
    return
  }

  const parts = value.split(',')

  for (const part of parts) {
    // Single port
    if (/^\d+$/.test(part)) {
      const port = parseInt(part)
      if (port < 1 || port > 65535) {
        callback(new Error(t('nat.portGroup.portRangeInvalid')))
        return
      }
    }
    // Port range
    else if (/^\d+-\d+$/.test(part)) {
      const [start, end] = part.split('-').map(Number)
      if (start >= end) {
        callback(new Error(t('nat.portGroup.portRangeOrder')))
        return
      }
      if (start < 1 || end > 65535) {
        callback(new Error(t('nat.portGroup.portRangeInvalid')))
        return
      }
    } else {
      callback(new Error(t('nat.portGroup.portFormatInvalid')))
      return
    }
  }

  callback()
}

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('nat.portGroup.groupNameRequired'), trigger: 'blur' },
    { max: 31, message: t('nat.portGroup.groupNameMaxLength'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('nat.portGroup.groupNamePattern'), trigger: 'blur' }
  ],
  port_range: [{ required: true, validator: validatePortRange, trigger: 'blur' }]
}))

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'web_ports', port_range: '80,443,8080-8088' },
      { id: 2, name: 'ssh_ports', port_range: '22' },
      { id: 3, name: 'db_ports', port_range: '3306,1433,5432,27017' }
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '......'
}

const handlePortInput = () => {
  formData.value.port_range = formData.value.port_range.replace(/[^0-9\-,]/g, '')
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { name: '', port_range: '' }
  dialogVisible.value = true
}

const handleEdit = (row: PortGroup) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(t('nat.portGroup.deleteConfirm', { name }), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(dialogMode.value === 'add' ? t('common.addSuccess') : t('common.editSuccess'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {} finally {
    submitting.value = false
  }
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
.page-container { padding: $spacing-lg; }

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
  .page-description { color: $text-secondary; font-size: $font-size-base; }
}

.action-bar { display: flex; justify-content: flex-end; margin-bottom: $spacing-md; }

.table-container { background: $bg-card; border: 1px solid $border-color; border-radius: $radius-lg; overflow: hidden; }

.tech-table :deep(.el-table__row) {
  transition: all 0.3s ease;
  &:hover { background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important; }
}

.rule-name { font-weight: 600; color: $primary-color; }
.port-text { color: $text-primary; word-break: break-all; }

.pagination-wrapper { margin-top: $spacing-lg; display: flex; justify-content: flex-end; }

.help-text {
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: 1.5;
  margin-top: $spacing-xs;
}
</style>

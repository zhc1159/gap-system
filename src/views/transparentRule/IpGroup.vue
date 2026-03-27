<!-- IP Group Management - IP Management -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Location /></el-icon>
        {{ t('transparentRule.ipGroup.title') }}
      </h2>
      <p class="page-description">{{ t('transparentRule.ipGroup.description') }}</p>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('transparentRule.ipGroup.addGroup') }}
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
        <el-table-column prop="name" :label="t('transparentRule.ipGroup.groupName')" min-width="200">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="ipRange" :label="t('transparentRule.ipGroup.ipRange')" min-width="500">
          <template #default="{ row }">
            <el-tooltip v-if="row.ipRange && row.ipRange.length > 80" :content="row.ipRange" placement="top">
              <span class="ip-text">{{ truncateText(row.ipRange, 80) }}</span>
            </el-tooltip>
            <span v-else class="ip-text">{{ row.ipRange || '-' }}</span>
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
        <el-form-item :label="t('transparentRule.ipGroup.groupName')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="t('transparentRule.ipGroup.groupNamePlaceholder')"
            maxlength="31"
            show-word-limit
            @input="handleNameInput"
          />
        </el-form-item>

        <el-form-item :label="t('transparentRule.ipGroup.ipAddresses')" prop="ipRange">
          <!-- IP Tags Display -->
          <div class="ip-tags-container">
            <el-tag
              v-for="(ip, index) in ipTags"
              :key="index"
              closable
              :type="ip.valid ? 'success' : 'danger'"
              @close="handleRemoveIp(index)"
              class="ip-tag"
            >
              {{ ip.value }}
              <el-icon v-if="!ip.valid" class="invalid-icon"><Warning /></el-icon>
            </el-tag>
          </div>

          <!-- IP Input -->
          <div class="ip-input-wrapper">
            <el-input
              v-model="currentIp"
              :placeholder="t('transparentRule.ipGroup.ipInputPlaceholder')"
              @keyup.enter="handleAddIp"
              class="ip-input"
            >
              <template #append>
                <el-button :icon="Plus" @click="handleAddIp" :disabled="!currentIp" />
              </template>
            </el-input>
          </div>

          <div class="ip-hint">
            {{ t('transparentRule.ipGroup.ipHint') }}
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit" :disabled="!hasValidIps">
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
import { Location, Plus, Edit, Delete, Warning } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface IpTag {
  value: string
  type: 'ip' | 'domain' | 'cidr' | 'range'
  valid: boolean
}

interface IpGroup {
  id: number
  name: string
  ipRange: string
}

interface IpGroupFormData {
  id?: number
  name: string
  ipRange: string
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<IpGroup[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const currentIp = ref('')
const ipTags = ref<IpTag[]>([])

// Form Data
const formData = reactive<IpGroupFormData>({
  id: undefined,
  name: '',
  ipRange: ''
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('transparentRule.ipGroup.addGroup')
    : t('transparentRule.ipGroup.editGroup')
})

const hasValidIps = computed(() =>
  ipTags.value.length > 0 && ipTags.value.some(tag => tag.valid)
)

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('transparentRule.ipGroup.groupNameRequired'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('transparentRule.ipGroup.groupNamePattern'), trigger: 'blur' },
    { max: 31, message: t('transparentRule.ipGroup.groupNameMax'), trigger: 'blur' }
  ],
  ipRange: [
    { required: true, message: t('transparentRule.ipGroup.ipRangeRequired'), trigger: 'blur' }
  ]
}))

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'internal_servers', ipRange: '192.168.1.1-192.168.1.255,10.0.0.0/24' },
      { id: 2, name: 'external_clients', ipRange: '172.16.0.1,172.16.0.2,172.16.0.3' },
      { id: 3, name: 'dmz_zone', ipRange: '192.168.100.0/24' }
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
  formData.ipRange = ''
  ipTags.value = []
  currentIp.value = ''
  dialogVisible.value = true
}

const handleEdit = (row: IpGroup) => {
  dialogMode.value = 'edit'
  formData.id = row.id
  formData.name = row.name

  if (row.ipRange) {
    const ips = row.ipRange.split(',').filter(ip => ip.trim())
    ipTags.value = ips.map(ip => ({
      value: ip.trim(),
      type: getIpType(ip.trim()),
      valid: validateIpFormat(ip.trim())
    }))
  } else {
    ipTags.value = []
  }

  dialogVisible.value = true
}

const handleDelete = async (row: IpGroup) => {
  try {
    await ElMessageBox.confirm(
      t('transparentRule.ipGroup.deleteConfirm', { name: row.name }),
      t('common.confirm'),
      { type: 'warning' }
    )
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch {
    // cancelled
  }
}

const handleAddIp = () => {
  if (!currentIp.value) return

  const ip = currentIp.value.trim()
  const type = getIpType(ip)
  const valid = validateIpFormat(ip)

  if (ipTags.value.some(tag => tag.value === ip)) {
    ElMessage.warning(t('transparentRule.ipGroup.duplicateIp'))
    return
  }

  ipTags.value.push({ value: ip, type, valid })

  if (!valid) {
    ElMessage.warning(t('transparentRule.ipGroup.invalidIpFormat'))
  }

  currentIp.value = ''
}

const handleRemoveIp = (index: number) => {
  ipTags.value.splice(index, 1)
}

const handleNameInput = (value: string) => {
  formData.name = value.replace(/[^a-zA-Z0-9_]/g, '')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  if (!hasValidIps.value) {
    ElMessage.error(t('transparentRule.ipGroup.noValidIp'))
    return
  }

  try {
    await formRef.value.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))

    formData.ipRange = ipTags.value
      .filter(tag => tag.valid)
      .map(tag => tag.value)
      .join(',')

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
  ipTags.value = []
  currentIp.value = ''
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

const getIpType = (ip: string): 'ip' | 'domain' | 'cidr' | 'range' => {
  if (ip.includes('/')) return 'cidr'
  if (ip.includes('-')) return 'range'
  if (/^[a-zA-Z]/.test(ip)) return 'domain'
  return 'ip'
}

const validateIpFormat = (ip: string): boolean => {
  const ipv4Regex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  const cidrRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)\/\d{1,2}$/
  const rangeRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)-((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || cidrRegex.test(ip) || rangeRegex.test(ip) || domainRegex.test(ip)
}

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

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

.ip-text {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: $font-size-sm;
  color: $primary-color;
}

.pagination-wrapper {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}

.ip-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 10px;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  background: rgba($bg-darker, 0.5);
  margin-bottom: 10px;

  .ip-tag {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;

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

    .invalid-icon {
      margin-left: 4px;
      vertical-align: middle;
    }
  }
}

.ip-input-wrapper {
  display: flex;
  gap: 10px;

  .ip-input {
    flex: 1;
  }
}

.ip-hint {
  margin-top: 8px;
  font-size: 12px;
  color: $text-muted;
  line-height: 1.5;
}
</style>

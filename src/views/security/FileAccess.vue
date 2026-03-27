<!-- File Access Control - File Access Control -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><FolderOpened /></el-icon>
        {{ t('menu.security.fileAccess') }}
      </h2>
      <p class="page-description">{{ t('securityPolicy.fileAccess.description') }}</p>
    </div>

    <!-- Direction Tabs -->
    <div class="direction-tabs">
      <el-radio-group v-model="direction" @change="handleDirectionChange">
        <el-radio-button value="in">
          <el-icon><Download /></el-icon>
          {{ t('securityPolicy.common.direction.in') }}
        </el-radio-button>
        <el-radio-button value="out">
          <el-icon><Upload /></el-icon>
          {{ t('securityPolicy.common.direction.out') }}
        </el-radio-button>
      </el-radio-group>
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
        <!-- Status Toggle -->
        <el-table-column :label="t('common.status')" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip :content="row.enable ? t('securityPolicy.common.status.running') : t('securityPolicy.common.status.stopped')" placement="top">
              <div class="status-button" :class="{ active: row.enable }" @click="handleToggle(row)">
                <span class="status-indicator" :class="{ active: row.enable }"></span>
                <el-icon v-if="row.enable" class="icon-stop"><VideoPause /></el-icon>
                <el-icon v-else class="icon-play"><VideoPlay /></el-icon>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Name -->
        <el-table-column prop="name" :label="t('securityPolicy.common.table.name')" min-width="120" />

        <!-- Protocol -->
        <el-table-column prop="protocol" :label="t('securityPolicy.common.table.protocol')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getProtocolTagType(row.protocol)" size="small">{{ row.protocol }}</el-tag>
          </template>
        </el-table-column>

        <!-- Source -->
        <el-table-column prop="source" :label="t('securityPolicy.common.table.source')" min-width="120">
          <template #default="{ row }">
            <el-tooltip :content="row.source" placement="top">
              <span class="cell-text">{{ row.source }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Destination -->
        <el-table-column prop="destination" :label="t('securityPolicy.common.table.destination')" min-width="120">
          <template #default="{ row }">
            <el-tooltip :content="row.destination" placement="top">
              <span class="cell-text">{{ row.destination }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Destination Port -->
        <el-table-column prop="destinationPort" :label="t('securityPolicy.common.table.destinationPort')" min-width="100">
          <template #default="{ row }">
            <span class="port-text">{{ row.destinationPort }}</span>
          </template>
        </el-table-column>

        <!-- In Device Port -->
        <el-table-column prop="inDevicePort" :label="t('securityPolicy.common.table.inDevicePort')" min-width="100">
          <template #default="{ row }">
            <span class="port-text">{{ row.inDevicePort }}</span>
          </template>
        </el-table-column>

        <!-- Actions -->
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
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item :label="t('securityPolicy.common.form.modeName')" prop="modeName">
          <el-input v-model="formData.modeName" :placeholder="t('securityPolicy.common.validation.modeNameRequired')" maxlength="8" />
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.protocol')" prop="protocol">
          <el-select v-model="formData.protocol" :placeholder="t('securityPolicy.common.validation.protocolRequired')" style="width: 100%">
            <el-option v-for="item in protocolOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.source')" prop="source">
          <el-select v-model="formData.source" :placeholder="t('securityPolicy.common.validation.sourceRequired')" style="width: 100%">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.destination')" prop="destination">
          <el-select v-model="formData.destination" :placeholder="t('securityPolicy.common.validation.destinationRequired')" style="width: 100%">
            <el-option v-for="item in destinationOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.destinationPort')" prop="destinationPort">
          <el-input v-model="formData.destinationPort" :placeholder="t('securityPolicy.common.validation.destinationPortRequired')" />
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.inInterface')" prop="inInterface">
          <el-select v-model="formData.inInterface" :placeholder="t('securityPolicy.common.validation.inInterfaceRequired')" style="width: 100%">
            <el-option v-for="item in interfaceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.inDevice')" prop="inDevice">
          <el-input v-model="formData.inDevice" :placeholder="t('securityPolicy.common.validation.inDeviceRequired')" />
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.inDevicePort')" prop="inDevicePort">
          <el-input v-model="formData.inDevicePort" :placeholder="t('securityPolicy.common.validation.inDevicePortRequired')" />
        </el-form-item>

        <el-form-item :label="t('securityPolicy.common.form.timeGroup')">
          <el-select v-model="formData.timeGroup" :placeholder="t('securityPolicy.common.form.timeGroupPlaceholder')" style="width: 100%" clearable>
            <el-option v-for="item in timeGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { FolderOpened, Plus, Edit, Delete, Download, Upload, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// State
const loading = ref(false)
const submitting = ref(false)
const direction = ref<'in' | 'out'>('in')
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// Form Data
const formData = ref({
  id: '',
  modeName: '',
  protocol: '',
  source: '',
  destination: '',
  destinationPort: '',
  inInterface: '',
  inDevice: '',
  inDevicePort: '',
  timeGroup: ''
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('securityPolicy.common.form.title') + ' - ' + t('common.add')
    : t('securityPolicy.common.form.title') + ' - ' + t('common.edit')
})

const formRules = computed<FormRules>(() => ({
  modeName: [{ required: true, message: t('securityPolicy.common.validation.modeNameRequired'), trigger: 'blur' }],
  protocol: [{ required: true, message: t('securityPolicy.common.validation.protocolRequired'), trigger: 'change' }],
  source: [{ required: true, message: t('securityPolicy.common.validation.sourceRequired'), trigger: 'change' }],
  destination: [{ required: true, message: t('securityPolicy.common.validation.destinationRequired'), trigger: 'change' }],
  destinationPort: [{ required: true, message: t('securityPolicy.common.validation.destinationPortRequired'), trigger: 'blur' }],
  inInterface: [{ required: true, message: t('securityPolicy.common.validation.inInterfaceRequired'), trigger: 'change' }],
  inDevice: [{ required: true, message: t('securityPolicy.common.validation.inDeviceRequired'), trigger: 'blur' }],
  inDevicePort: [{ required: true, message: t('securityPolicy.common.validation.inDevicePortRequired'), trigger: 'blur' }]
}))

// Options
const protocolOptions = ref([
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'WebProxy', label: 'WebProxy' },
  { value: 'MCASTDATA', label: 'MCASTDATA' }
])

const sourceOptions = ref([
  { value: 'group1', label: 'Object Group 1' },
  { value: 'group2', label: 'Object Group 2' }
])

const destinationOptions = ref([
  { value: 'group1', label: 'Object Group 1' },
  { value: 'group2', label: 'Object Group 2' }
])

const interfaceOptions = ref([
  { value: 'eth0', label: 'eth0 (192.168.1.1)' },
  { value: 'eth1', label: 'eth1 (10.0.0.1)' }
])

const timeGroupOptions = ref([
  { value: 'workday', label: 'Workday' },
  { value: 'weekend', label: 'Weekend' }
])

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: '1', name: 'File-Rule-1', protocol: 'TCP', source: 'group1', destination: 'group2', destinationPort: 21, inDevicePort: 2100, enable: true, inInterface: 'eth0', inDevice: '192.168.1.1', timeGroup: '' },
      { id: '2', name: 'File-Rule-2', protocol: 'UDP', source: 'group2', destination: 'group1', destinationPort: 22, inDevicePort: 2200, enable: false, inInterface: 'eth1', inDevice: '10.0.0.1', timeGroup: 'workday' }
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

const handleDirectionChange = () => { currentPage.value = 1; fetchData() }
const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = { id: '', modeName: '', protocol: '', source: '', destination: '', destinationPort: '', inInterface: '', inDevice: '', inDevicePort: '', timeGroup: '' }
  dialogVisible.value = true
}
const handleEdit = (row: any) => {
  dialogMode.value = 'edit'
  formData.value = { ...row, modeName: row.name, destinationPort: String(row.destinationPort), inDevicePort: String(row.inDevicePort) }
  dialogVisible.value = true
}
const handleDelete = async (_row: any) => {
  try {
    await ElMessageBox.confirm(t('securityPolicy.common.messages.confirmDelete'), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}
const handleToggle = async (_row: any) => {
  ElMessage.success(t('securityPolicy.common.messages.toggleSuccess'))
  fetchData()
}
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(t('common.success'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {
  } finally {
    submitting.value = false
  }
}
const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }
const getProtocolTagType = (protocol: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = { TCP: 'primary', UDP: 'success', WebProxy: 'info', MCASTDATA: 'warning' }
  return map[protocol]
}

onMounted(() => { fetchData() })
</script>

<style scoped lang="scss">
.page-container { padding: $spacing-lg; }
.page-header { margin-bottom: $spacing-lg;
  .page-title { display: flex; align-items: center; gap: $spacing-sm; font-size: $font-size-3xl; font-weight: 700; color: $text-primary; margin-bottom: $spacing-xs;
    .el-icon { color: $primary-color; } }
  .page-description { color: $text-secondary; font-size: $font-size-base; } }
.direction-tabs { display: flex; justify-content: center; margin-bottom: $spacing-lg; }
.action-bar { display: flex; justify-content: flex-end; margin-bottom: $spacing-md; }
.table-container { background: $bg-card; border: 1px solid $border-color; border-radius: $radius-lg; overflow: hidden; }
.tech-table { :deep(.el-table__row) { transition: all 0.3s ease;
    &:hover { background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important; transform: translateX(2px); } } }
.status-button { display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; padding: 5px 10px; border-radius: 15px; transition: all 0.3s ease;
  &:hover { background-color: rgba($primary-color, 0.1); }
  .status-indicator { width: 8px; height: 8px; border-radius: 50%; background-color: $warning-color; transition: all 0.3s ease;
    &.active { background-color: $success-color; box-shadow: 0 0 10px rgba($success-color, 0.5); animation: pulse 2s infinite; } } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.2); } }
.cell-text { font-size: $font-size-sm; color: $text-secondary; }
.port-text { font-family: 'Consolas', 'Monaco', monospace; font-weight: 600; color: $primary-color; }
.pagination-wrapper { margin-top: $spacing-lg; display: flex; justify-content: flex-end; }
</style>

<!-- Out NAT - 后置机NAT -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('nat.outNat.title') }}
      </h2>
      <p class="page-description">{{ t('nat.outNat.description') }}</p>
    </div>

    <!-- Direction Tabs -->
    <div class="direction-tabs">
      <el-radio-group v-model="activeTab" @change="handleTabChange">
        <el-radio-button value="destNat">
          {{ t('nat.outNat.destNat') }}
        </el-radio-button>
        <el-radio-button value="sourceNat">
          {{ t('nat.outNat.sourceNat') }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        {{ t('common.add') }}
      </el-button>
      <el-button @click="fetchData">
        <el-icon><Refresh /></el-icon>
        {{ t('common.refresh') }}
      </el-button>
    </div>

    <!-- Dest NAT Table -->
    <div v-show="activeTab === 'destNat'" class="table-container">
      <el-table
        :data="destNatData"
        v-loading="loading"
        stripe
        class="tech-table"
      >
        <el-table-column prop="name" :label="t('nat.outNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="srcAddress" :label="t('nat.outNat.srcAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.srcAddress || t('nat.common.any') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="srcPort" :label="t('nat.outNat.srcPort')" width="100">
          <template #default="{ row }">
            <span>{{ row.srcPort || t('nat.common.any') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="destVirtualAddress" :label="t('nat.outNat.destVirtualAddress')" min-width="130">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.destVirtualAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="destAddress" :label="t('nat.outNat.destAddress')" min-width="120">
          <template #default="{ row }">
            <span class="cyber-link">{{ row.destAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEditDestNat(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDeleteDestNat(row.id)">
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Source NAT Table -->
    <div v-show="activeTab === 'sourceNat'" class="table-container">
      <el-table
        :data="sourceNatData"
        v-loading="loading"
        stripe
        class="tech-table"
      >
        <el-table-column prop="name" :label="t('nat.outNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="srcAddress" :label="t('nat.outNat.srcAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.srcAddress || t('nat.common.any') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="destAddress" :label="t('nat.outNat.destAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.destAddress || t('nat.common.any') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" :label="t('nat.outNat.action')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.action === 'SNAT' ? 'success' : 'warning'" size="small">
              {{ row.action }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="virtualSrcAddress" :label="t('nat.outNat.virtualSrcAddress')" min-width="120">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.virtualSrcAddress || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEditSourceNat(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDeleteSourceNat(row.id)">
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

    <!-- Dest NAT Dialog -->
    <el-dialog
      v-model="destNatDialogVisible"
      :title="destNatDialogTitle"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="destNatFormRef" :model="destNatFormData" :rules="destNatFormRules" label-width="140px">
        <el-form-item :label="t('nat.outNat.ruleName')" prop="name">
          <el-input v-model="destNatFormData.name" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.srcAddress')" prop="srcAddress">
          <el-input v-model="destNatFormData.srcAddress" :placeholder="t('nat.common.any')" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.srcPort')" prop="srcPort">
          <el-input v-model="destNatFormData.srcPort" :placeholder="t('nat.common.any')" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destVirtualAddress')" prop="destVirtualAddress">
          <el-input v-model="destNatFormData.destVirtualAddress" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destVirtualPort')" prop="destVirtualPort">
          <el-input v-model="destNatFormData.destVirtualPort" :placeholder="t('nat.common.any')" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destAddress')" prop="destAddress">
          <el-input v-model="destNatFormData.destAddress" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destPort')" prop="destPort">
          <el-input v-model="destNatFormData.destPort" :placeholder="t('nat.common.any')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="destNatDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleDestNatSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- Source NAT Dialog -->
    <el-dialog
      v-model="sourceNatDialogVisible"
      :title="sourceNatDialogTitle"
      width="600px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="sourceNatFormRef" :model="sourceNatFormData" :rules="sourceNatFormRules" label-width="140px">
        <el-form-item :label="t('nat.outNat.ruleName')" prop="name">
          <el-input v-model="sourceNatFormData.name" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.srcAddress')" prop="srcAddress">
          <el-input v-model="sourceNatFormData.srcAddress" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.srcPort')" prop="srcPort">
          <el-input v-model="sourceNatFormData.srcPort" :placeholder="t('nat.common.any')" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destAddress')" prop="destAddress">
          <el-input v-model="sourceNatFormData.destAddress" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.destPort')" prop="destPort">
          <el-input v-model="sourceNatFormData.destPort" :placeholder="t('nat.common.any')" />
        </el-form-item>
        <el-form-item :label="t('nat.outNat.action')" prop="action">
          <el-select v-model="sourceNatFormData.action" @change="handleActionChange" style="width: 100%">
            <el-option label="SNAT" value="SNAT" />
            <el-option label="MASQUERADE" value="MASQUERADE" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="sourceNatFormData.action === 'SNAT'" :label="t('nat.outNat.virtualSrcAddress')" prop="virtualSrcAddress">
          <el-input v-model="sourceNatFormData.virtualSrcAddress" />
        </el-form-item>
        <el-form-item v-if="sourceNatFormData.action === 'SNAT'" :label="t('nat.outNat.virtualSrcPort')" prop="virtualSrcPort">
          <el-input v-model="sourceNatFormData.virtualSrcPort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sourceNatDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSourceNatSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Connection, Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface DestNatRule {
  id: number
  name: string
  srcAddress: string
  srcPort: string
  destVirtualAddress: string
  destVirtualPort: string
  destAddress: string
  destPort: string
}

interface SourceNatRule {
  id: number
  name: string
  srcAddress: string
  srcPort: string
  destAddress: string
  destPort: string
  action: 'SNAT' | 'MASQUERADE'
  virtualSrcAddress: string
  virtualSrcPort: string
}

// State
const loading = ref(false)
const submitting = ref(false)
const activeTab = ref<'destNat' | 'sourceNat'>('destNat')
const destNatData = ref<DestNatRule[]>([])
const sourceNatData = ref<SourceNatRule[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Dest NAT Dialog
const destNatDialogVisible = ref(false)
const destNatDialogMode = ref<'add' | 'edit'>('add')
const destNatFormRef = ref<FormInstance>()
const destNatFormData = ref<DestNatRule>({
  id: 0,
  name: '',
  srcAddress: '',
  srcPort: '',
  destVirtualAddress: '',
  destVirtualPort: '',
  destAddress: '',
  destPort: ''
})

// Source NAT Dialog
const sourceNatDialogVisible = ref(false)
const sourceNatDialogMode = ref<'add' | 'edit'>('add')
const sourceNatFormRef = ref<FormInstance>()
const sourceNatFormData = ref<SourceNatRule>({
  id: 0,
  name: '',
  srcAddress: '',
  srcPort: '',
  destAddress: '',
  destPort: '',
  action: 'SNAT',
  virtualSrcAddress: '',
  virtualSrcPort: ''
})

// Computed
const destNatDialogTitle = computed(() => destNatDialogMode.value === 'add' ? t('nat.outNat.addDestNat') : t('nat.outNat.editDestNat'))
const sourceNatDialogTitle = computed(() => sourceNatDialogMode.value === 'add' ? t('nat.outNat.addSourceNat') : t('nat.outNat.editSourceNat'))

const destNatFormRules = computed<FormRules>(() => ({
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  destVirtualAddress: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  destAddress: [{ required: true, message: t('common.required'), trigger: 'blur' }]
}))

const sourceNatFormRules = computed<FormRules>(() => ({
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  srcAddress: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  destAddress: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  action: [{ required: true, message: t('common.required'), trigger: 'change' }]
}))

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    destNatData.value = [
      { id: 1, name: 'outDNAT-1', srcAddress: '', srcPort: '', destVirtualAddress: '10.0.0.1', destVirtualPort: '8080', destAddress: '192.168.1.100', destPort: '80' },
      { id: 2, name: 'outDNAT-2', srcAddress: '192.168.0.0/16', srcPort: '', destVirtualAddress: '10.0.0.2', destVirtualPort: '443', destAddress: '192.168.1.101', destPort: '443' }
    ]
    sourceNatData.value = [
      { id: 1, name: 'outSNAT-1', srcAddress: '192.168.1.0/24', srcPort: '', destAddress: '10.0.0.1', destPort: '80', action: 'SNAT', virtualSrcAddress: '192.168.1.100', virtualSrcPort: '' },
      { id: 2, name: 'outSNAT-2', srcAddress: '172.16.0.0/16', srcPort: '', destAddress: '10.0.0.2', destPort: '443', action: 'MASQUERADE', virtualSrcAddress: '', virtualSrcPort: '' }
    ]
    total.value = activeTab.value === 'destNat' ? destNatData.value.length : sourceNatData.value.length
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  currentPage.value = 1
  fetchData()
}

const handleAdd = () => {
  if (activeTab.value === 'destNat') {
    destNatDialogMode.value = 'add'
    destNatFormData.value = { id: 0, name: '', srcAddress: '', srcPort: '', destVirtualAddress: '', destVirtualPort: '', destAddress: '', destPort: '' }
    destNatDialogVisible.value = true
  } else {
    sourceNatDialogMode.value = 'add'
    sourceNatFormData.value = { id: 0, name: '', srcAddress: '', srcPort: '', destAddress: '', destPort: '', action: 'SNAT', virtualSrcAddress: '', virtualSrcPort: '' }
    sourceNatDialogVisible.value = true
  }
}

const handleEditDestNat = (row: DestNatRule) => {
  destNatDialogMode.value = 'edit'
  destNatFormData.value = { ...row }
  destNatDialogVisible.value = true
}

const handleEditSourceNat = (row: SourceNatRule) => {
  sourceNatDialogMode.value = 'edit'
  sourceNatFormData.value = { ...row }
  sourceNatDialogVisible.value = true
}

const handleDeleteDestNat = async (_id: number) => {
  try {
    await ElMessageBox.confirm(t('nat.outNat.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}

const handleDeleteSourceNat = async (_id: number) => {
  try {
    await ElMessageBox.confirm(t('nat.outNat.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {}
}

const handleActionChange = (value: 'SNAT' | 'MASQUERADE') => {
  if (value === 'MASQUERADE') {
    sourceNatFormData.value.virtualSrcAddress = ''
    sourceNatFormData.value.virtualSrcPort = ''
  }
}

const handleDestNatSubmit = async () => {
  try {
    await destNatFormRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(destNatDialogMode.value === 'add' ? t('common.addSuccess') : t('common.updateSuccess'))
    destNatDialogVisible.value = false
    fetchData()
  } catch (e) {} finally {
    submitting.value = false
  }
}

const handleSourceNatSubmit = async () => {
  try {
    await sourceNatFormRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(sourceNatDialogMode.value === 'add' ? t('common.addSuccess') : t('common.updateSuccess'))
    sourceNatDialogVisible.value = false
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

.direction-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-lg;
}

.action-bar { display: flex; justify-content: flex-end; gap: $spacing-sm; margin-bottom: $spacing-md; }

.table-container { background: $bg-card; border: 1px solid $border-color; border-radius: $radius-lg; overflow: hidden; }

.tech-table :deep(.el-table__row) {
  transition: all 0.3s ease;
  &:hover { background: linear-gradient(to right, rgba($primary-color, 0.05), rgba($primary-color, 0.1)) !important; }
}

.rule-name { font-weight: 600; color: $primary-color; }
.highlight-text { color: $primary-color; font-weight: 500; }
.cyber-link { color: $success-color; font-weight: 500; }

.pagination-wrapper { margin-top: $spacing-lg; display: flex; justify-content: flex-end; }
</style>

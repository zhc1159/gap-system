<!-- Outbound Source NAT - 后置机源NAT -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('nat.outSourceNat.title') }}
      </h2>
      <p class="page-description">{{ t('nat.outSourceNat.description') }}</p>
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

    <!-- Data Table -->
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        class="tech-table"
      >
        <!-- Rule Name -->
        <el-table-column prop="name" :label="t('nat.outSourceNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- Source Address -->
        <el-table-column prop="srcAddress" :label="t('nat.outSourceNat.srcAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.srcAddress || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Source Port -->
        <el-table-column prop="srcPort" :label="t('nat.outSourceNat.srcPort')" width="100">
          <template #default="{ row }">
            <span>{{ row.srcPort || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Address -->
        <el-table-column prop="destAddress" :label="t('nat.outSourceNat.destAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.destAddress || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Port -->
        <el-table-column prop="destPort" :label="t('nat.outSourceNat.destPort')" width="100">
          <template #default="{ row }">
            <span>{{ row.destPort || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column prop="action" :label="t('nat.outSourceNat.action')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.action === 'SNAT' ? 'success' : 'warning'" size="small">
              {{ row.action }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Virtual Source Address -->
        <el-table-column prop="virtualSrcAddress" :label="t('nat.outSourceNat.virtualSrcAddress')" min-width="120">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.virtualSrcAddress || '-' }}</span>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="t('common.actions')" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row.id)">
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
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
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
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
        <!-- Rule Name -->
        <el-form-item :label="t('nat.outSourceNat.ruleName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('nat.outSourceNat.ruleNamePlaceholder')" />
        </el-form-item>

        <!-- Source Address -->
        <el-form-item :label="t('nat.outSourceNat.srcAddress')" prop="srcAddress">
          <el-input v-model="formData.srcAddress" />
        </el-form-item>

        <!-- Source Port -->
        <el-form-item :label="t('nat.outSourceNat.srcPort')" prop="srcPort">
          <el-input v-model="formData.srcPort" :placeholder="t('nat.common.any')" />
        </el-form-item>

        <!-- Destination Address -->
        <el-form-item :label="t('nat.outSourceNat.destAddress')" prop="destAddress">
          <el-input v-model="formData.destAddress" />
        </el-form-item>

        <!-- Destination Port -->
        <el-form-item :label="t('nat.outSourceNat.destPort')" prop="destPort">
          <el-input v-model="formData.destPort" :placeholder="t('nat.common.any')" />
        </el-form-item>

        <!-- Action -->
        <el-form-item :label="t('nat.outSourceNat.action')" prop="action">
          <el-select v-model="formData.action" @change="handleActionChange" style="width: 100%">
            <el-option label="SNAT" value="SNAT" />
            <el-option label="MASQUERADE" value="MASQUERADE" />
          </el-select>
        </el-form-item>

        <!-- Virtual Source Address (SNAT only) -->
        <el-form-item v-if="formData.action === 'SNAT'" :label="t('nat.outSourceNat.virtualSrcAddress')" prop="virtualSrcAddress">
          <el-input v-model="formData.virtualSrcAddress" />
        </el-form-item>

        <!-- Virtual Source Port (SNAT only) -->
        <el-form-item v-if="formData.action === 'SNAT'" :label="t('nat.outSourceNat.virtualSrcPort')" prop="virtualSrcPort">
          <el-input v-model="formData.virtualSrcPort" />
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
import { Connection, Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface OutSourceNatRule {
  id: number
  name: string
  srcAddress: string
  srcPort: string
  destAddress: string
  destPort: string
  action: 'SNAT' | 'MASQUERADE'
  virtualSrcAddress: string
  virtualSrcPort: string
  enabled: boolean
}

interface OutSourceNatFormData {
  id?: number
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
const tableData = ref<OutSourceNatRule[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

// Form Data
const formData = ref<OutSourceNatFormData>({
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
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.outSourceNat.addRule')
    : t('nat.outSourceNat.editRule')
})

const formRules = computed<FormRules>(() => ({
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
    tableData.value = [
      { id: 1, name: 'outSNAT-1', srcAddress: '192.168.1.0/24', srcPort: '', destAddress: '10.0.0.1', destPort: '8080', action: 'SNAT', virtualSrcAddress: '192.168.1.100', virtualSrcPort: '', enabled: true },
      { id: 2, name: 'outSNAT-2', srcAddress: '172.16.0.0/16', srcPort: '', destAddress: '10.0.0.2', destPort: '443', action: 'MASQUERADE', virtualSrcAddress: '', virtualSrcPort: '', enabled: true }
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  editingId.value = null
  formData.value = {
    name: '',
    srcAddress: '',
    srcPort: '',
    destAddress: '',
    destPort: '',
    action: 'SNAT',
    virtualSrcAddress: '',
    virtualSrcPort: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row: OutSourceNatRule) => {
  dialogMode.value = 'edit'
  editingId.value = row.id
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (_id: number) => {
  try {
    await ElMessageBox.confirm(t('nat.outSourceNat.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {
    // cancelled
  }
}

const handleActionChange = (value: 'SNAT' | 'MASQUERADE') => {
  if (value === 'MASQUERADE') {
    formData.value.virtualSrcAddress = ''
    formData.value.virtualSrcPort = ''
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(dialogMode.value === 'add' ? t('common.addSuccess') : t('common.updateSuccess'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    // validation failed
  } finally {
    submitting.value = false
  }
}

const handlePageChange = () => { fetchData() }
const handleSizeChange = () => { fetchData() }

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
  gap: $spacing-sm;
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
    }
  }
}

.rule-name {
  font-weight: 600;
  color: $primary-color;
}

.highlight-text {
  color: $primary-color;
  font-weight: 500;
}

.pagination-wrapper {
  padding: $spacing-md;
  display: flex;
  justify-content: flex-end;
}
</style>

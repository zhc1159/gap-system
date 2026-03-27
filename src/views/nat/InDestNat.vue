<!-- Inbound Destination NAT (Simplified) - 前置机目的NAT（简化版） -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('nat.inDestNat.title') }}
      </h2>
      <p class="page-description">{{ t('nat.inDestNat.description') }}</p>
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
        <!-- Rule Name -->
        <el-table-column prop="name" :label="t('nat.inDestNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- Protocol -->
        <el-table-column prop="proto" :label="t('nat.inDestNat.protocol')" width="80">
          <template #default="{ row }">
            <el-tag :type="getProtocolTagType(row.proto)" size="small">
              {{ row.proto || t('nat.common.any') }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Source Address -->
        <el-table-column prop="ip_group_src" :label="t('nat.inDestNat.sourceAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.ip_group_src || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Source Port -->
        <el-table-column prop="src_port" :label="t('nat.inDestNat.sourcePort')" width="100">
          <template #default="{ row }">
            <span>{{ row.src_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Virtual Address -->
        <el-table-column prop="ip_group_dst" :label="t('nat.inDestNat.destVirtualAddress')" min-width="130">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.ip_group_dst || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Virtual Port -->
        <el-table-column prop="dst_port" :label="t('nat.inDestNat.destVirtualPort')" width="120">
          <template #default="{ row }">
            <span>{{ row.dst_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- To Destination Address -->
        <el-table-column prop="to_dest_addr" :label="t('nat.inDestNat.toDestAddress')" min-width="120">
          <template #default="{ row }">
            <span class="cyber-link">{{ row.to_dest_addr || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- To Destination Port -->
        <el-table-column prop="to_dest_port" :label="t('nat.inDestNat.toDestPort')" width="110">
          <template #default="{ row }">
            <span>{{ row.to_dest_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column :label="t('common.actions')" fixed="right" width="150">
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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <!-- Rule Name -->
        <el-form-item :label="t('nat.inDestNat.ruleName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('nat.inDestNat.ruleNamePlaceholder')" :disabled="dialogMode === 'edit'" maxlength="31" />
        </el-form-item>

        <!-- Protocol -->
        <el-form-item :label="t('nat.inDestNat.protocol')" prop="proto">
          <el-radio-group v-model="formData.proto">
            <el-radio label="">{{ t('nat.common.any') }}</el-radio>
            <el-radio label="tcp">TCP</el-radio>
            <el-radio label="udp">UDP</el-radio>
            <el-radio label="icmp">ICMP</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- In Interface -->
        <el-form-item :label="t('nat.inDestNat.inInterface')" prop="eth_in">
          <el-select v-model="formData.eth_in" :placeholder="t('nat.inDestNat.selectInterface')" style="width: 100%">
            <el-option v-for="item in interfaceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- Source Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.inDestNat.sourceAddress')" prop="ip_group_src">
              <el-input v-model="formData.ip_group_src" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.inDestNat.sourcePort')" prop="src_port">
              <el-input v-model="formData.src_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Destination Virtual Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.inDestNat.destVirtualAddress')" prop="ip_group_dst">
              <el-input v-model="formData.ip_group_dst" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.inDestNat.destVirtualPort')" prop="dst_port">
              <el-input v-model="formData.dst_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- To Destination Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.inDestNat.toDestAddress')" prop="to_dest_addr">
              <el-input v-model="formData.to_dest_addr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('nat.inDestNat.toDestPort')" prop="to_dest_port">
              <el-input v-model="formData.to_dest_port" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { Connection, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface InDestNatRule {
  id?: number
  name: string
  proto: '' | 'tcp' | 'udp' | 'icmp'
  eth_in: string
  ip_group_src: string
  src_port: string
  ip_group_dst: string
  dst_port: string
  to_dest_addr: string
  to_dest_port: string
  priority: number
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<InDestNatRule[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// Form Data
const formData = ref<InDestNatRule>({
  name: '',
  proto: '',
  eth_in: '',
  ip_group_src: '',
  src_port: '',
  ip_group_dst: '',
  dst_port: '',
  to_dest_addr: '',
  to_dest_port: '',
  priority: 1
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.inDestNat.addRule')
    : t('nat.inDestNat.editRule')
})

const showPortFields = computed(() => ['tcp', 'udp'].includes(formData.value.proto))

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('nat.inDestNat.ruleNameRequired'), trigger: 'blur' },
    { max: 31, message: t('nat.inDestNat.ruleNameMaxLength'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('nat.inDestNat.ruleNamePattern'), trigger: 'blur' }
  ],
  to_dest_addr: [{ required: true, message: t('nat.inDestNat.toDestRequired'), trigger: 'blur' }]
}))

// Options
const interfaceOptions = ref([
  { value: 'eth0', label: 'eth0 (192.168.1.1)' },
  { value: 'eth1', label: 'eth1 (10.0.0.1)' }
])

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'inDNAT-1', proto: 'tcp', eth_in: 'eth0', ip_group_src: '', src_port: '', ip_group_dst: '10.0.0.1', dst_port: '8080', to_dest_addr: '192.168.1.100', to_dest_port: '80', priority: 1 },
      { id: 2, name: 'inDNAT-2', proto: 'udp', eth_in: 'eth1', ip_group_src: '192.168.0.0/16', src_port: '', ip_group_dst: '10.0.0.2', dst_port: '443', to_dest_addr: '192.168.1.101', to_dest_port: '443', priority: 2 }
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = {
    name: '',
    proto: '',
    eth_in: '',
    ip_group_src: '',
    src_port: '',
    ip_group_dst: '',
    dst_port: '',
    to_dest_addr: '',
    to_dest_port: '',
    priority: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row: InDestNatRule) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(t('nat.inDestNat.deleteConfirm', { name }), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {
    // cancelled
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(dialogMode.value === 'add' ? t('common.addSuccess') : t('common.editSuccess'))
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    // validation failed
  } finally {
    submitting.value = false
  }
}

const handlePageChange = (page: number) => { currentPage.value = page; fetchData() }
const handleSizeChange = (size: number) => { pageSize.value = size; fetchData() }

const getProtocolTagType = (protocol: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = { tcp: 'success', udp: 'warning', icmp: 'danger' }
  return map[protocol] || 'info'
}

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
.highlight-text { color: $primary-color; font-weight: 500; }
.cyber-link { color: $success-color; font-weight: 500; }

.pagination-wrapper { margin-top: $spacing-lg; display: flex; justify-content: flex-end; }
</style>

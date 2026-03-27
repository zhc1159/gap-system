<!-- Inbound Source NAT (Simplified) - 前置机源NAT（简化版） -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('nat.inSourceNat.title') }}
      </h2>
      <p class="page-description">{{ t('nat.inSourceNat.description') }}</p>
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
        <el-table-column prop="name" :label="t('nat.inSourceNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- Source Address -->
        <el-table-column prop="ip_group_src" :label="t('nat.inSourceNat.sourceAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.ip_group_src || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Source Port -->
        <el-table-column prop="src_port" :label="t('nat.inSourceNat.sourcePort')" width="100">
          <template #default="{ row }">
            <span>{{ row.src_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Address -->
        <el-table-column prop="ip_group_dst" :label="t('nat.inSourceNat.destAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.ip_group_dst || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Port -->
        <el-table-column prop="dst_port" :label="t('nat.inSourceNat.destPort')" width="100">
          <template #default="{ row }">
            <span>{{ row.dst_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Virtual Source Address -->
        <el-table-column prop="to_source_addr" :label="t('nat.inSourceNat.virtualSourceAddr')" min-width="120">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.to_source_addr || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Virtual Source Port -->
        <el-table-column prop="to_source_port" :label="t('nat.inSourceNat.virtualSourcePort')" width="110">
          <template #default="{ row }">
            <span>{{ row.to_source_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Protocol -->
        <el-table-column prop="proto" :label="t('nat.inSourceNat.protocol')" width="80">
          <template #default="{ row }">
            <el-tag :type="getProtocolTagType(row.proto)" size="small">
              {{ row.proto || t('nat.common.any') }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column prop="action" :label="t('nat.inSourceNat.action')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.action === 'SNAT' ? 'success' : 'warning'" size="small">
              {{ row.action === 'SNAT' ? t('nat.inSourceNat.snat') : t('nat.inSourceNat.masquerade') }}
            </el-tag>
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
        <el-form-item :label="t('nat.inSourceNat.ruleName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('nat.inSourceNat.ruleNamePlaceholder')" :disabled="dialogMode === 'edit'" maxlength="31" />
        </el-form-item>

        <!-- Protocol -->
        <el-form-item :label="t('nat.inSourceNat.protocol')" prop="proto">
          <el-radio-group v-model="formData.proto">
            <el-radio label="">{{ t('nat.common.any') }}</el-radio>
            <el-radio label="tcp">TCP</el-radio>
            <el-radio label="udp">UDP</el-radio>
            <el-radio label="icmp">ICMP</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Out Interface -->
        <el-form-item :label="t('nat.inSourceNat.outInterface')" prop="eth_out">
          <el-select v-model="formData.eth_out" :placeholder="t('nat.inSourceNat.selectInterface')" style="width: 100%">
            <el-option v-for="item in interfaceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- Source Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.inSourceNat.sourceAddress')" prop="ip_group_src">
              <el-input v-model="formData.ip_group_src" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.inSourceNat.sourcePort')" prop="src_port">
              <el-input v-model="formData.src_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Destination Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.inSourceNat.destAddress')" prop="ip_group_dst">
              <el-input v-model="formData.ip_group_dst" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.inSourceNat.destPort')" prop="dst_port">
              <el-input v-model="formData.dst_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Action -->
        <el-form-item :label="t('nat.inSourceNat.action')" prop="action">
          <el-radio-group v-model="formData.action" @change="handleActionChange">
            <el-radio label="SNAT">{{ t('nat.inSourceNat.snat') }}</el-radio>
            <el-radio label="MASQUERADE">{{ t('nat.inSourceNat.masquerade') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Virtual Source Address & Port (SNAT only) -->
        <el-row :gutter="20" v-show="formData.action === 'SNAT'">
          <el-col :span="12">
            <el-form-item :label="t('nat.inSourceNat.virtualSourceAddr')" prop="to_source_addr">
              <el-input v-model="formData.to_source_addr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('nat.inSourceNat.virtualSourcePort')" prop="to_source_port">
              <el-input v-model="formData.to_source_port" />
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
interface InSourceNatRule {
  id?: number
  name: string
  proto: '' | 'tcp' | 'udp' | 'icmp'
  eth_out: string
  ip_group_src: string
  src_port: string
  ip_group_dst: string
  dst_port: string
  to_source_addr: string
  to_source_port: string
  action: 'SNAT' | 'MASQUERADE'
  priority: number
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<InSourceNatRule[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// Form Data
const formData = ref<InSourceNatRule>({
  name: '',
  proto: '',
  eth_out: '',
  ip_group_src: '',
  src_port: '',
  ip_group_dst: '',
  dst_port: '',
  to_source_addr: '',
  to_source_port: '',
  action: 'SNAT',
  priority: 1
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.inSourceNat.addRule')
    : t('nat.inSourceNat.editRule')
})

const showPortFields = computed(() => ['tcp', 'udp'].includes(formData.value.proto))

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('nat.inSourceNat.ruleNameRequired'), trigger: 'blur' },
    { max: 31, message: t('nat.inSourceNat.ruleNameMaxLength'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('nat.inSourceNat.ruleNamePattern'), trigger: 'blur' }
  ],
  action: [{ required: true, message: t('nat.inSourceNat.actionRequired'), trigger: 'change' }],
  to_source_addr: [
    {
      validator: (rule, value, callback) => {
        if (formData.value.action === 'SNAT' && !value) {
          callback(new Error(t('nat.inSourceNat.virtualSourceRequired')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
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
      { id: 1, name: 'inSNAT-1', proto: 'tcp', eth_out: 'eth0', ip_group_src: '192.168.1.0/24', src_port: '', ip_group_dst: '10.0.0.0/8', dst_port: '80', to_source_addr: '192.168.1.100', to_source_port: '', action: 'SNAT', priority: 1 },
      { id: 2, name: 'inSNAT-2', proto: 'udp', eth_out: 'eth1', ip_group_src: '172.16.0.0/16', src_port: '53', ip_group_dst: '', dst_port: '', to_source_addr: '', to_source_port: '', action: 'MASQUERADE', priority: 2 }
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
    eth_out: '',
    ip_group_src: '',
    src_port: '',
    ip_group_dst: '',
    dst_port: '',
    to_source_addr: '',
    to_source_port: '',
    action: 'SNAT',
    priority: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row: InSourceNatRule) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(t('nat.inSourceNat.deleteConfirm', { name }), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {
    // cancelled
  }
}

const handleActionChange = () => {
  if (formData.value.action === 'MASQUERADE') {
    formData.value.to_source_addr = ''
    formData.value.to_source_port = ''
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
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}
</style>

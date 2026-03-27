<!-- Source NAT (Complete Version) - 前置机源NAT（完整版） -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Connection /></el-icon>
        {{ t('nat.sourceNat.title') }}
      </h2>
      <p class="page-description">{{ t('nat.sourceNat.description') }}</p>
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

    <!-- Stats Cards -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon total">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ tableData.length }}</div>
            <div class="stat-label">{{ t('nat.sourceNat.totalRules') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon enabled">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ enabledCount }}</div>
            <div class="stat-label">{{ t('nat.sourceNat.enabledRules') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon disabled">
            <el-icon><CircleClose /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ tableData.length - enabledCount }}</div>
            <div class="stat-label">{{ t('nat.sourceNat.disabledRules') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon interfaces">
            <el-icon><Grid /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ interfaceOptions.length }}</div>
            <div class="stat-label">{{ t('nat.sourceNat.interfaces') }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

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
            <el-tooltip :content="row.enabled === '1' ? t('nat.common.clickToDisable') : t('nat.common.clickToEnable')" placement="top">
              <div class="status-button" :class="{ active: row.enabled === '1' }" @click="handleToggleStatus(row)">
                <span class="status-indicator" :class="{ active: row.enabled === '1' }"></span>
                <el-icon v-if="row.enabled === '1'" class="icon-stop"><VideoPause /></el-icon>
                <el-icon v-else class="icon-play"><VideoPlay /></el-icon>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- Rule Name -->
        <el-table-column prop="name" :label="t('nat.sourceNat.ruleName')" min-width="120">
          <template #default="{ row }">
            <span class="rule-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- Source Address -->
        <el-table-column prop="ip_group_src" :label="t('nat.sourceNat.sourceAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.ip_group_src || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Source Port -->
        <el-table-column prop="src_port" :label="t('nat.sourceNat.sourcePort')" width="100">
          <template #default="{ row }">
            <span>{{ row.src_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Address -->
        <el-table-column prop="ip_group_dst" :label="t('nat.sourceNat.destAddress')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.ip_group_dst || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Destination Port -->
        <el-table-column prop="dst_port" :label="t('nat.sourceNat.destPort')" width="100">
          <template #default="{ row }">
            <span>{{ row.dst_port || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Virtual Source Address -->
        <el-table-column prop="to_source_addr" :label="t('nat.sourceNat.virtualSourceAddr')" min-width="120">
          <template #default="{ row }">
            <span class="highlight-text">{{ row.to_source_addr || t('nat.common.any') }}</span>
          </template>
        </el-table-column>

        <!-- Protocol -->
        <el-table-column prop="proto" :label="t('nat.sourceNat.protocol')" width="80">
          <template #default="{ row }">
            <el-tag :type="getProtocolTagType(row.proto)" size="small">
              {{ row.proto || t('nat.common.any') }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column prop="action" :label="t('nat.sourceNat.action')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.action === 'SNAT' ? 'success' : 'warning'" size="small">
              {{ row.action === 'SNAT' ? t('nat.sourceNat.snat') : t('nat.sourceNat.masquerade') }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Direction -->
        <el-table-column prop="where" :label="t('nat.sourceNat.direction')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.where === 'in' ? 'success' : 'warning'" size="small">
              {{ row.where === 'in' ? t('nat.sourceNat.inToOut') : t('nat.sourceNat.outToIn') }}
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
      width="700px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <!-- Rule Name -->
        <el-form-item :label="t('nat.sourceNat.ruleName')" prop="name">
          <el-input v-model="formData.name" :placeholder="t('nat.sourceNat.ruleNamePlaceholder')" :disabled="dialogMode === 'edit'" maxlength="31" />
        </el-form-item>

        <!-- Protocol -->
        <el-form-item :label="t('nat.sourceNat.protocol')" prop="proto">
          <el-radio-group v-model="formData.proto">
            <el-radio label="">{{ t('nat.common.any') }}</el-radio>
            <el-radio label="tcp">TCP</el-radio>
            <el-radio label="udp">UDP</el-radio>
            <el-radio label="icmp">ICMP</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Out Interface -->
        <el-form-item :label="t('nat.sourceNat.outInterface')" prop="eth_out">
          <el-select v-model="formData.eth_out" :placeholder="t('nat.sourceNat.selectInterface')" style="width: 100%">
            <el-option v-for="item in interfaceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- Source Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.sourceNat.sourceAddress')" prop="ip_group_src">
              <el-input v-model="formData.ip_group_src" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.sourceNat.sourcePort')" prop="src_port">
              <el-input v-model="formData.src_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Destination Address & Port -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('nat.sourceNat.destAddress')" prop="ip_group_dst">
              <el-input v-model="formData.ip_group_dst" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="showPortFields">
            <el-form-item :label="t('nat.sourceNat.destPort')" prop="dst_port">
              <el-input v-model="formData.dst_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Action -->
        <el-form-item :label="t('nat.sourceNat.action')" prop="action">
          <el-radio-group v-model="formData.action" @change="handleActionChange">
            <el-radio label="SNAT">{{ t('nat.sourceNat.snat') }}</el-radio>
            <el-radio label="MASQUERADE">{{ t('nat.sourceNat.masquerade') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- Virtual Source Address & Port (SNAT only) -->
        <el-row :gutter="20" v-show="formData.action === 'SNAT'">
          <el-col :span="12">
            <el-form-item :label="t('nat.sourceNat.virtualSourceAddr')" prop="to_source_addr">
              <el-input v-model="formData.to_source_addr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('nat.sourceNat.virtualSourcePort')" prop="to_source_port">
              <el-input v-model="formData.to_source_port" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Direction -->
        <el-form-item :label="t('nat.sourceNat.direction')" prop="where">
          <el-select v-model="formData.where" :placeholder="t('nat.sourceNat.selectDirection')" :disabled="dialogMode === 'edit'" style="width: 100%">
            <el-option value="in" :label="t('nat.sourceNat.inToOut')" />
            <el-option value="out" :label="t('nat.sourceNat.outToIn')" />
          </el-select>
        </el-form-item>

        <!-- Enabled Status -->
        <el-form-item :label="t('nat.sourceNat.enabledStatus')" prop="enabled">
          <el-switch
            v-model="formData.enabled"
            active-value="1"
            inactive-value="0"
            :active-text="t('nat.common.enabled')"
            :inactive-text="t('nat.common.disabled')"
          />
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
import { Connection, Plus, Edit, Delete, Refresh, VideoPlay, VideoPause, Document, CircleCheck, CircleClose, Grid } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

// Interfaces
interface SourceNatRule {
  id?: number
  name: string
  enabled: '1' | '0'
  proto: '' | 'tcp' | 'udp' | 'icmp'
  eth_out: string
  ip_group_src: string
  src_port: string
  ip_group_dst: string
  dst_port: string
  to_source_addr: string
  to_source_port: string
  action: 'SNAT' | 'MASQUERADE'
  where: 'in' | 'out'
  priority: number
}

// State
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<SourceNatRule[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

// Form Data
const formData = ref<SourceNatRule>({
  name: '',
  enabled: '1',
  proto: '',
  eth_out: '',
  ip_group_src: '',
  src_port: '',
  ip_group_dst: '',
  dst_port: '',
  to_source_addr: '',
  to_source_port: '',
  action: 'SNAT',
  where: 'in',
  priority: 1
})

// Computed
const dialogTitle = computed(() => {
  return dialogMode.value === 'add'
    ? t('nat.sourceNat.addRule')
    : t('nat.sourceNat.editRule')
})

const enabledCount = computed(() => tableData.value.filter(r => r.enabled === '1').length)

const showPortFields = computed(() => ['tcp', 'udp'].includes(formData.value.proto))

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('nat.sourceNat.ruleNameRequired'), trigger: 'blur' },
    { max: 31, message: t('nat.sourceNat.ruleNameMaxLength'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('nat.sourceNat.ruleNamePattern'), trigger: 'blur' }
  ],
  action: [{ required: true, message: t('nat.sourceNat.actionRequired'), trigger: 'change' }],
  where: [{ required: true, message: t('nat.sourceNat.directionRequired'), trigger: 'change' }],
  to_source_addr: [
    {
      validator: (rule, value, callback) => {
        if (formData.value.action === 'SNAT' && !value) {
          callback(new Error(t('nat.sourceNat.virtualSourceRequired')))
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
  { value: 'eth1', label: 'eth1 (10.0.0.1)' },
  { value: 'eth2', label: 'eth2 (172.16.0.1)' }
])

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      { id: 1, name: 'SNAT-Rule-1', enabled: '1', proto: 'tcp', eth_out: 'eth0', ip_group_src: '192.168.1.0/24', src_port: '', ip_group_dst: '10.0.0.0/8', dst_port: '80', to_source_addr: '192.168.1.100', to_source_port: '', action: 'SNAT', where: 'in', priority: 1 },
      { id: 2, name: 'SNAT-Rule-2', enabled: '0', proto: 'udp', eth_out: 'eth1', ip_group_src: '172.16.0.0/16', src_port: '53', ip_group_dst: '0.0.0.0/0', dst_port: '', to_source_addr: '', to_source_port: '', action: 'MASQUERADE', where: 'out', priority: 2 }
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
    enabled: '1',
    proto: '',
    eth_out: '',
    ip_group_src: '',
    src_port: '',
    ip_group_dst: '',
    dst_port: '',
    to_source_addr: '',
    to_source_port: '',
    action: 'SNAT',
    where: 'in',
    priority: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row: SourceNatRule) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row: SourceNatRule) => {
  try {
    await ElMessageBox.confirm(t('nat.sourceNat.deleteConfirm', { name: row.name }), t('common.confirm'), { type: 'warning' })
    ElMessage.success(t('common.deleteSuccess'))
    fetchData()
  } catch (e) {
    // cancelled
  }
}

const handleToggleStatus = async (row: SourceNatRule) => {
  const action = row.enabled === '1' ? t('nat.common.disable') : t('nat.common.enable')
  try {
    await ElMessageBox.confirm(t('nat.sourceNat.statusConfirm', { action, name: row.name }), t('common.confirm'), { type: 'warning' })
    row.enabled = row.enabled === '1' ? '0' : '1'
    ElMessage.success(t('common.success'))
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
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.stat-cards {
  margin-bottom: $spacing-lg;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-right: $spacing-md;

    &.total {
      background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($primary-color, 0.2));
      color: $primary-color;
    }

    &.enabled {
      background: linear-gradient(135deg, rgba($success-color, 0.1), rgba($success-color, 0.2));
      color: $success-color;
    }

    &.disabled {
      background: linear-gradient(135deg, rgba($warning-color, 0.1), rgba($warning-color, 0.2));
      color: $warning-color;
    }

    &.interfaces {
      background: linear-gradient(135deg, rgba($info-color, 0.1), rgba($info-color, 0.2));
      color: $info-color;
    }
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: $text-primary;
      line-height: 1;
      margin-bottom: $spacing-xs;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
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

.status-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover { background-color: rgba($primary-color, 0.1); }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $warning-color;
    transition: all 0.3s ease;

    &.active {
      background-color: $success-color;
      box-shadow: 0 0 10px rgba($success-color, 0.5);
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
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

<!-- ===========================================
     InputRules.vue - Input Rules Management
     =========================================== -->

<template>
  <div class="page-container">
    <PageHeader
      :title="t('transparentRule.input.title')"
      titleEn="Input Rules"
      :icon="Filter"
    >
      <template #extra>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          {{ t('common.add') }}
        </el-button>
        <el-button type="success" @click="handleApply" :loading="applying">
          <el-icon><Check /></el-icon>
          {{ t('transparentRule.input.apply') }}
        </el-button>
        <el-button @click="sortDialogVisible = true">
          <el-icon><Sort /></el-icon>
          {{ t('transparentRule.input.sort') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Table -->
    <CommonTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="pagination.page"
      :limit="pagination.limit"
      @page-change="handlePageChange"
    >
      <template #status="{ row }">
        <el-switch
          v-model="row.enabled"
          :active-value="1"
          :inactive-value="0"
          @change="handleToggleStatus(row)"
        />
      </template>
      <template #action="{ row }">
        <el-tag :type="getActionTagType(row.action)" size="small" effect="dark">
          {{ row.action }}
        </el-tag>
      </template>
      <template #proto="{ row }">
        <el-tag type="info" size="small">{{ row.proto }}</el-tag>
      </template>
      <template #timeGroup="{ row }">
        {{ row.timeGroup || t('common.all') }}
      </template>
      <template #ipGroupSrc="{ row }">
        <el-tooltip v-if="row.ipGroupSrc && row.ipGroupSrc.length > 15" :content="row.ipGroupSrc" placement="top">
          <span>{{ row.ipGroupSrc.substring(0, 15) }}</span>
        </el-tooltip>
        <span v-else>{{ row.ipGroupSrc || t('common.all') }}</span>
      </template>
      <template #srcPort="{ row }">
        {{ row.srcPort || t('common.all') }}
      </template>
      <template #ipGroupDst="{ row }">
        <el-tooltip v-if="row.ipGroupDst && row.ipGroupDst.length > 15" :content="row.ipGroupDst" placement="top">
          <span>{{ row.ipGroupDst.substring(0, 15) }}</span>
        </el-tooltip>
        <span v-else>{{ row.ipGroupDst || t('common.all') }}</span>
      </template>
      <template #dstPort="{ row }">
        {{ row.dstPort || t('common.all') }}
      </template>
      <template #inInterface="{ row }">
        {{ row.inInterface }}
      </template>
      <template #actions="{ row }">
        <el-button type="primary" text size="small" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </el-button>
        <el-button type="danger" text size="small" @click="handleDelete(row)">
          {{ t('common.delete') }}
        </el-button>
      </template>
    </CommonTable>

    <!-- add/edit dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="140px">
        <el-form-item :label="t('transparentRule.input.ruleName')" prop="name">
          <el-input v-model="form.name" :placeholder="t('transparentRule.input.ruleNamePlaceholder')" maxlength="31" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.protocol')" prop="proto">
          <el-radio-group v-model="form.proto">
            <el-radio label="ANY">{{ t('transparentRule.input.protocols.any') }}</el-radio>
            <el-radio label="TCP">TCP</el-radio>
            <el-radio label="UDP">UDP</el-radio>
            <el-radio label="ICMP">ICMP</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.inInterface')" prop="inInterface">
          <el-select v-model="form.inInterface" style="width: 100%">
            <el-option v-for="item in interfaces" :key="item.name" :label="item.displayName" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.sourceIpGroup')" prop="ipGroupSrc">
          <el-select v-model="form.ipGroupSrc" style="width: 100%" clearable>
            <el-option :label="t('common.all')" value="" />
            <el-option v-for="item in ipGroups" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="['TCP', 'UDP'].includes(form.proto)" :label="t('transparentRule.input.sourcePortGroup')" prop="srcPort">
          <el-select v-model="form.srcPort" style="width: 100%" clearable>
            <el-option :label="t('common.all')" value="" />
            <el-option v-for="item in portGroups" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.destIpGroup')" prop="ipGroupDst">
          <el-select v-model="form.ipGroupDst" style="width: 100%" clearable>
            <el-option :label="t('common.all')" value="" />
            <el-option v-for="item in ipGroups" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="['TCP', 'UDP'].includes(form.proto)" :label="t('transparentRule.input.destPortGroup')" prop="dstPort">
          <el-select v-model="form.dstPort" style="width: 100%" clearable>
            <el-option :label="t('common.all')" value="" />
            <el-option v-for="item in portGroups" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.timeGroup')" prop="timeGroup">
          <el-select v-model="form.timeGroup" style="width: 100%" clearable>
            <el-option :label="t('common.all')" value="" />
            <el-option v-for="item in timeGroups" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.action')" prop="action">
          <el-select v-model="form.action" style="width: 100%">
            <el-option label="ACCEPT" value="ACCEPT" />
            <el-option label="REJECT" value="REJECT" />
            <el-option label="DROP" value="DROP" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Sort Dialog -->
    <el-dialog v-model="sortDialogVisible" :title="t('transparentRule.input.sortRules')" width="400px">
      <el-form :model="sortForm" label-width="120px">
        <el-form-item :label="t('transparentRule.input.originalIndex')">
          <el-input-number v-model="sortForm.originalIndex" :min="1" :max="99" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('transparentRule.input.targetIndex')">
          <el-input-number v-model="sortForm.targetIndex" :min="1" :max="99" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sortDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSort" :loading="sorting">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Filter, Plus, Check, Sort } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { TableColumn } from '@/components/CommonTable.vue'

const { t } = useI18n()

// Pagination
const pagination = reactive({ page: 1, limit: 10 })

// Table data
const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

// Dialog
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  proto: 'ANY',
  inInterface: '',
  ipGroupSrc: '',
  srcPort: '',
  ipGroupDst: '',
  dstPort: '',
  timeGroup: '',
  action: 'ACCEPT'
})

// Groups data
const ipGroups = ref<any[]>([])
const portGroups = ref<any[]>([])
const timeGroups = ref<any[]>([])
const interfaces = ref<any[]>([])

// Sort dialog
const sortDialogVisible = ref(false)
const sorting = ref(false)
const sortForm = reactive({ originalIndex: 1, targetIndex: 1 })

// Apply
const applying = ref(false)

// Computed
const dialogTitle = computed(() => isEdit.value ? t('common.edit') : t('common.add'))

// Form rules
const formRules: FormRules = {
  name: [{ required: true, message: t('transparentRule.input.ruleNameRequired'), trigger: 'blur' }],
  proto: [{ required: true, message: t('transparentRule.input.protocolRequired'), trigger: 'change' }],
  inInterface: [{ required: true, message: t('transparentRule.input.inInterfaceRequired'), trigger: 'change' }],
  action: [{ required: true, message: t('transparentRule.input.actionRequired'), trigger: 'change' }]
}

// Table columns
const columns: TableColumn[] = [
  { prop: 'sort', label: t('transparentRule.input.index'), width: 70, align: 'center' },
  { prop: 'name', label: t('transparentRule.input.ruleName'), minWidth: 150 },
  { prop: 'status', label: t('common.status'), width: 100 },
  { prop: 'action', label: t('transparentRule.input.action'), width: 100, align: 'center' },
  { prop: 'proto', label: t('transparentRule.input.protocol'), width: 80, align: 'center' },
  { prop: 'inInterface', label: t('transparentRule.input.inInterface'), width: 100 },
  { prop: 'ipGroupSrc', label: t('transparentRule.input.sourceIpGroup'), minWidth: 120 },
  { prop: 'srcPort', label: t('transparentRule.input.sourcePortGroup'), width: 100 },
  { prop: 'ipGroupDst', label: t('transparentRule.input.destIpGroup'), minWidth: 120 },
  { prop: 'dstPort', label: t('transparentRule.input.destPortGroup'), width: 100 },
  { prop: 'timeGroup', label: t('transparentRule.input.timeGroup'), width: 100 },
  { prop: 'actions', label: t('common.actions'), width: 150, fixed: 'right' }
]

// Generate mock data
function generateMockData(): any[] {
  const actions = ['ACCEPT', 'REJECT', 'DROP']
  const protocols = ['TCP', 'UDP', 'ICMP', 'ANY']
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    sort: i + 1,
    name: `rule_${String(i + 1).padStart(2, '0')}`,
    enabled: Math.random() > 0.3 ? 1 : 0,
    action: actions[Math.floor(Math.random() * actions.length)],
    proto: protocols[Math.floor(Math.random() * protocols.length)],
    inInterface: `eth${Math.floor(i / 5)}`,
    ipGroupSrc: Math.random() > 0.3 ? `ip_group_${Math.floor(Math.random() * 5) + 1}` : '',
    srcPort: Math.random() > 0.5 ? `port_group_${Math.floor(Math.random() * 3) + 1}` : '',
    ipGroupDst: Math.random() > 0.3 ? `ip_group_${Math.floor(Math.random() * 5) + 1}` : '',
    dstPort: Math.random() > 0.5 ? `port_group_${Math.floor(Math.random() * 3) + 1}` : '',
    timeGroup: Math.random() > 0.5 ? `time_group_${Math.floor(Math.random() * 3) + 1}` : ''
  }))
}

// Generate groups mock data
function generateGroupsMock(): void {
  ipGroups.value = Array.from({ length: 5 }, (_, i) => ({
    name: `ip_group_${i + 1}`,
    displayName: `IP组 ${i + 1}`
  }))
  portGroups.value = Array.from({ length: 3 }, (_, i) => ({
    name: `port_group_${i + 1}`,
    displayName: `端口组 ${i + 1}`
  }))
  timeGroups.value = Array.from({ length: 3 }, (_, i) => ({
    name: `time_group_${i + 1}`,
    displayName: `时间组 ${i + 1}`
  }))
  interfaces.value = Array.from({ length: 3 }, (_, i) => ({
    name: `eth${i}`,
    displayName: `接口 eth${i}`
  }))
}

// Fetch data
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateMockData()
    total.value = tableData.value.length
    loading.value = false
  }, 400)
}

// Reset form
function resetFormState() {
  Object.assign(form, {
    name: '',
    proto: 'ANY',
    inInterface: '',
    ipGroupSrc: '',
    srcPort: '',
    ipGroupDst: '',
    dstPort: '',
    timeGroup: '',
    action: 'ACCEPT'
  })
}

// Handlers
function handlePageChange(page: number, limit: number) {
  pagination.page = page
  pagination.limit = limit
  fetchData()
}

function handleAdd() {
  resetFormState()
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: any) {
  void row
  Object.assign(form, {
    name: row.name,
    proto: row.proto,
    inInterface: row.inInterface,
    ipGroupSrc: row.ipGroupSrc,
    srcPort: row.srcPort,
    ipGroupDst: row.ipGroupDst,
    dstPort: row.dstPort,
    timeGroup: row.timeGroup,
    action: row.action
  })
  isEdit.value = true
  dialogVisible.value = true
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
  tableData.value = tableData.value.filter(i => i.id !== row.id)
  ElMessage.success(t('common.deleteSuccess'))
}

function handleToggleStatus(row: any) {
  ElMessage.success(row.enabled ? t('transparentRule.input.enabled') : t('transparentRule.input.disabled'))
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    if (isEdit.value) {
      const idx = tableData.value.findIndex(i => i.name === form.name)
      if (idx > -1) {
        tableData.value[idx] = { ...tableData.value[idx], ...form }
      }
    } else {
      tableData.value.push({
        ...form,
        id: Date.now(),
        sort: tableData.value.length + 1,
        enabled: 1
      })
    }
    ElMessage.success(t('common.saveSuccess'))
    dialogVisible.value = false
  } finally {
    submitting.value = false
  }
}

async function handleApply() {
  await ElMessageBox.confirm(t('transparentRule.input.applyConfirm'), t('common.confirm'), { type: 'info' })
  applying.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  applying.value = false
  ElMessage.success(t('transparentRule.input.applySuccess'))
}

async function handleSort() {
  sorting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  const original = sortForm.originalIndex - 1
  const target = sortForm.targetIndex - 1
  if (original >= 0 && original < tableData.value.length && target >= 0 && target < tableData.value.length) {
    const item = tableData.value.splice(original, 1)[0]
    tableData.value.splice(target, 0, item)
    tableData.value.forEach((item, idx) => {
      item.sort = idx + 1
    })
    ElMessage.success(t('transparentRule.input.sortSuccess'))
  }
  sortDialogVisible.value = false
  sorting.value = false
}

function getActionTagType(action: string): 'success' | 'warning' | 'danger' | 'info' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'ACCEPT': 'success',
    'REJECT': 'warning',
    'DROP': 'danger'
  }
  return types[action] || 'info'
}

// Lifecycle
onMounted(() => {
  generateGroupsMock()
  fetchData()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.action-bar {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}
</style>
